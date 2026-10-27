<?php

declare(strict_types=1);

namespace RankRise\Api\Services;

use RankRise\Api\Lib\Env;

require_once __DIR__ . '/AiService.php';
require_once __DIR__ . '/AiConfig.php';
require_once __DIR__ . '/WorkflowConfig.php';
require_once __DIR__ . '/KnowledgeSearchService.php';
require_once __DIR__ . '/PromptBuilder.php';
require_once __DIR__ . '/DecisionEngine.php';
require_once __DIR__ . '/FaqMatchService.php';
require_once __DIR__ . '/LocalAnswerEngine.php';
require_once __DIR__ . '/WebsiteKnowledgeIndex.php';

/**
 * Chat pipeline — website knowledge first; OpenAI optional only if strict mode is off.
 *
 * Flow:
 *   Visitor → LocalAnswerEngine (Website Index → KB → FAQ → Business)
 *          → Answer (including low-confidence contact CTA)
 *          → OpenAI only when websiteKnowledge.strict = false
 */
final class AiWorkflow
{
    /** @var array<string, mixed> */
    private array $config;

    private KnowledgeSearchService $knowledgeSearch;
    private PromptBuilder $promptBuilder;
    private DecisionEngine $decisionEngine;
    private AiService $aiService;
    private ?FaqMatchService $faqMatch;
    private LocalAnswerEngine $localEngine;

    /**
     * @param array{
     *   config?: array<string, mixed>,
     *   kbDataDir?: string,
     *   aiService?: AiService,
     *   knowledgeSearch?: KnowledgeSearchService,
     *   faqMatch?: FaqMatchService
     * } $options
     */
    public function __construct(array $options = [])
    {
        $this->config = $options['config'] ?? WorkflowConfig::load();

        /** @var array<string, mixed> $ks */
        $ks = is_array($this->config['knowledgeSearch'] ?? null) ? $this->config['knowledgeSearch'] : [];
        /** @var array<string, mixed> $prompt */
        $prompt = is_array($this->config['prompt'] ?? null) ? $this->config['prompt'] : [];
        /** @var array<string, mixed> $decision */
        $decision = is_array($this->config['decision'] ?? null) ? $this->config['decision'] : [];
        /** @var array<string, mixed> $localCfg */
        $localCfg = is_array($this->config['localAnswer'] ?? null) ? $this->config['localAnswer'] : [];

        $kbFromEnv = Env::get('KB_DATA_DIR');
        $kbDataDir = $options['kbDataDir']
            ?? (($kbFromEnv !== null && $kbFromEnv !== '') ? $kbFromEnv : self::defaultKbDataDir());

        /** @var list<string> $collections */
        $collections = [];
        if (isset($ks['collections']) && is_array($ks['collections'])) {
            foreach ($ks['collections'] as $c) {
                if (is_string($c)) {
                    $collections[] = $c;
                }
            }
        }
        if ($collections === []) {
            $collections = [
                'company_info', 'contact', 'services', 'pricing', 'courses',
                'portfolio', 'policies', 'office_hours', 'documents', 'faqs', 'blogs',
            ];
        }

        $this->knowledgeSearch = $options['knowledgeSearch'] ?? new KnowledgeSearchService([
            'dataDir' => $kbDataDir,
            'collections' => $collections,
            'maxResults' => (int) ($ks['maxResults'] ?? 5),
            'minScore' => (int) ($ks['minScore'] ?? 1),
        ]);

        $this->promptBuilder = new PromptBuilder($prompt);
        $this->decisionEngine = new DecisionEngine(
            $decision,
            (string) ($prompt['handoverToken'] ?? '[HANDOVER]')
        );
        $this->aiService = $options['aiService'] ?? new AiService();

        /** @var array<string, mixed> $faqCfg */
        $faqCfg = is_array($this->config['faq'] ?? null) ? $this->config['faq'] : [];
        $faqEnabled = ($faqCfg['enabled'] ?? true) !== false;
        $faqMatch = null;
        if ($faqEnabled) {
            try {
                $faqMatch = $options['faqMatch'] ?? new FaqMatchService(
                    null,
                    (int) ($faqCfg['minScore'] ?? 3)
                );
            } catch (\Throwable) {
                $faqMatch = null;
            }
        }
        $this->faqMatch = $faqMatch;

        $this->localEngine = new LocalAnswerEngine([
            'knowledgeSearch' => $this->knowledgeSearch,
            'faqMatch' => $this->faqMatch,
            'knowledgeMinScore' => (int) ($localCfg['knowledgeMinScore'] ?? $ks['answerMinScore'] ?? 4),
            'businessMinScore' => (int) ($localCfg['businessMinScore'] ?? 3),
            'faqMinScore' => (int) ($faqCfg['minScore'] ?? 3),
            'faqEnabled' => $faqEnabled,
        ]);
    }

    public static function defaultKbDataDir(): string
    {
        return dirname(__DIR__) . '/storage/knowledge';
    }

    /**
     * OpenAI is optional. Disabled when key missing or ai.enabled === false.
     */
    public function isOpenAiAvailable(): bool
    {
        /** @var array<string, mixed> $aiCfg */
        $aiCfg = is_array($this->config['ai'] ?? null) ? $this->config['ai'] : [];
        if (($aiCfg['enabled'] ?? true) === false) {
            return false;
        }
        $cfg = get_ai_config();
        return ($cfg['apiKey'] ?? null) !== null && $cfg['apiKey'] !== '';
    }

    /**
     * Contact block loaded from knowledge JSON (never invents new numbers).
     */
    public function contactBlockFromKnowledge(): string
    {
        try {
            $hit = $this->knowledgeSearch->findBestAnswer('official contact phone email office address', 2, ['contact', 'company_info']);
            if ($hit !== null && $hit['answer'] !== '') {
                return $hit['answer'];
            }
        } catch (\Throwable) {
            // fall through
        }
        return (string) (
            (is_array($this->config['decision'] ?? null) ? ($this->config['decision']['handoverMessage'] ?? '') : '')
        );
    }

    public static function isContactRelevant(string $userMessage): bool
    {
        $normalized = strtolower(trim($userMessage));
        $keywords = [
            'contact', 'phone', 'email', 'office', 'location', 'meeting', 'sales',
            'support', 'quote', 'proposal', 'pricing', 'consultation', 'call',
            'demo', 'partnership', 'information', 'info', 'details', 'inquire',
            'inquiry', 'enquiry', 'team', 'talk', 'reach', 'speak', 'address',
        ];
        foreach ($keywords as $kw) {
            if (str_contains($normalized, $kw)) {
                return true;
            }
        }
        return false;
    }

    public function ensureContactDetailsIfRelevant(string $userMessage, string $replyMessage): string
    {
        if (!self::isContactRelevant($userMessage)) {
            return $replyMessage;
        }

        if (
            str_contains($replyMessage, 'sam@RankRiseUSA.com') ||
            str_contains($replyMessage, '+1 (202) 888-2806') ||
            str_contains($replyMessage, '+91 75650 31848')
        ) {
            return $replyMessage;
        }

        $contactBlock = $this->contactBlockFromKnowledge();
        if (trim($contactBlock) === '') {
            return $replyMessage;
        }

        return rtrim($replyMessage) . "\n\nFor more information you can contact us using the details below:\n\n" . $contactBlock;
    }

    /**
     * @param array{
     *   visitorId?: string|null,
     *   message: string,
     *   history?: list<array{author: string, content: string}>,
     *   promptHint?: string|null
     * } $input
     * @return array<string, mixed>
     */
    public function processVisitorMessage(array $input): array
    {
        $t0 = hrtime(true);
        $visitorId = $input['visitorId'] ?? null;
        $history = $input['history'] ?? [];
        $promptHint = $input['promptHint'] ?? null;
        $text = trim((string) ($input['message'] ?? ''));

        /** @var array<string, mixed> $decisionCfg */
        $decisionCfg = is_array($this->config['decision'] ?? null) ? $this->config['decision'] : [];
        /** @var array<string, mixed> $aiCfg */
        $aiCfg = is_array($this->config['ai'] ?? null) ? $this->config['ai'] : [];

        if ($text === '') {
            return [
                'type' => 'handover',
                'reason' => 'empty_message',
                'message' => (string) ($decisionCfg['errorMessage'] ?? ''),
                'visitorId' => $visitorId,
                'knowledge' => ['matches' => []],
                'source' => 'none',
            ];
        }

        // Explicit human / escalation requests still short-circuit.
        $preDecision = $this->decisionEngine->beforeAi($text);
        if ($preDecision !== null) {
            $msg = $this->ensureContactDetailsIfRelevant($text, (string) ($preDecision['message'] ?? ''));
            $preDecision['message'] = $msg;
            return array_merge($preDecision, [
                'visitorId' => $visitorId,
                'knowledge' => ['matches' => []],
                'source' => 'handover_rule',
                'timing_ms' => self::elapsedMs($t0),
            ]);
        }

        // LOCAL FIRST: Website Index → Knowledge → FAQ → Business Data.
        // Always website-sourced; low confidence returns contact CTA (no invention).
        $local = $this->localEngine->resolve($text);
        $matches = is_array($local['matches'] ?? null) ? $local['matches'] : [];

        $localAnswer = trim((string) ($local['answer'] ?? ''));
        $isLow = !empty($local['_low_confidence']) || ($local['source'] ?? '') === 'website_low_confidence';

        if ($localAnswer !== '') {
            $answer = $isLow
                ? $localAnswer
                : $this->ensureContactDetailsIfRelevant($text, $localAnswer);
            return [
                'type' => 'reply',
                'message' => $answer,
                'visitorId' => $visitorId,
                'knowledge' => ['matches' => $matches],
                'source' => (string) ($local['source'] ?? 'local'),
                'local' => [
                    'score' => $local['score'] ?? 0,
                    'confidence' => $local['confidence'] ?? 0,
                    'meta' => $local['meta'] ?? [],
                    'cached' => (bool) ($local['cached'] ?? false),
                    'low_confidence' => $isLow,
                ],
                'openai' => ['used' => false, 'available' => $this->isOpenAiAvailable()],
                'timing_ms' => self::elapsedMs($t0),
            ];
        }

        /** @var array<string, mixed> $wk */
        $wk = is_array($this->config['websiteKnowledge'] ?? null) ? $this->config['websiteKnowledge'] : [];
        $websiteOnly = ($wk['strict'] ?? true) !== false;

        // Strict website mode: never invent via OpenAI.
        if ($websiteOnly) {
            $fallback = (new WebsiteKnowledgeIndex())->lowConfidenceMessage();
            return [
                'type' => 'reply',
                'message' => $fallback,
                'visitorId' => $visitorId,
                'knowledge' => ['matches' => $matches],
                'source' => 'website_low_confidence',
                'openai' => ['used' => false, 'available' => $this->isOpenAiAvailable(), 'skipped' => 'website_only'],
                'timing_ms' => self::elapsedMs($t0),
            ];
        }

        // OpenAI optional fallback only when websiteKnowledge.strict is false.
        $snippets = [];
        if ($this->isOpenAiAvailable()) {
            try {
                $search = $this->knowledgeSearch->search($text);
                $snippets = $search['snippets'];
                $matches = $search['matches'];
            } catch (\Throwable) {
                // continue without knowledge context
            }

            $built = $this->promptBuilder->build([
                'visitorMessage' => $text,
                'knowledgeSnippets' => $snippets,
                'history' => is_array($history) ? $history : [],
                'promptHint' => is_string($promptHint) ? $promptHint : null,
            ]);

            $aiResult = $this->aiService->generateReply([
                'messages' => $built['messages'],
                'systemPrompt' => $built['systemPrompt'],
                'temperature' => $aiCfg['temperature'] ?? 0.4,
                'maxTokens' => isset($aiCfg['maxTokens']) ? (int) $aiCfg['maxTokens'] : 500,
            ]);

            $decision = $this->decisionEngine->afterAi($aiResult);

            if (($decision['type'] ?? '') === 'reply') {
                $finalMessage = $this->ensureContactDetailsIfRelevant($text, (string) ($decision['message'] ?? ''));
                return [
                    'type' => 'reply',
                    'message' => $finalMessage,
                    'visitorId' => $visitorId,
                    'knowledge' => ['matches' => $matches],
                    'source' => 'openai',
                    'openai' => [
                        'used' => true,
                        'available' => true,
                        'model' => $aiResult['data']['model'] ?? null,
                        'usage' => $aiResult['data']['usage'] ?? null,
                    ],
                    'timing_ms' => self::elapsedMs($t0),
                ];
            }

            // OpenAI failed / uncertain → try soft local again then handover
            if ($this->faqMatch !== null) {
                try {
                    $softFaq = $this->faqMatch->matchSoft($text);
                } catch (\Throwable) {
                    $softFaq = null;
                }
                if ($softFaq !== null) {
                    $faqAnswer = $this->ensureContactDetailsIfRelevant($text, $softFaq['answer']);
                    return [
                        'type' => 'reply',
                        'message' => $faqAnswer,
                        'visitorId' => $visitorId,
                        'knowledge' => ['matches' => $matches],
                        'source' => 'faq_fallback',
                        'faq' => [
                            'id' => $softFaq['id'],
                            'category' => $softFaq['category'],
                            'score' => $softFaq['score'],
                        ],
                        'openai' => [
                            'used' => true,
                            'available' => true,
                            'error' => $aiResult['error'] ?? ['reason' => $decision['reason'] ?? 'ai_failed'],
                        ],
                        'timing_ms' => self::elapsedMs($t0),
                    ];
                }
            }

            $handoverMsg = $this->ensureContactDetailsIfRelevant(
                $text,
                (string) ($decision['message'] ?? $decisionCfg['handoverMessage'] ?? '')
            );

            return [
                'type' => 'handover',
                'reason' => (string) ($decision['reason'] ?? 'ai_unavailable'),
                'message' => $handoverMsg,
                'visitorId' => $visitorId,
                'knowledge' => ['matches' => $matches],
                'source' => 'handover',
                'openai' => [
                    'used' => true,
                    'available' => true,
                    'error' => $aiResult['error'] ?? null,
                ],
                'timing_ms' => self::elapsedMs($t0),
            ];
        }

        // No local answer + OpenAI not available → human handover (site still works).
        $handoverMsg = $this->ensureContactDetailsIfRelevant(
            $text,
            (string) ($decisionCfg['handoverMessage'] ?? '')
        );

        return [
            'type' => 'handover',
            'reason' => 'no_local_answer_openai_unavailable',
            'message' => $handoverMsg !== ''
                ? $handoverMsg
                : (string) ($decisionCfg['errorMessage'] ?? 'Please contact our team for help.'),
            'visitorId' => $visitorId,
            'knowledge' => ['matches' => $matches],
            'source' => 'handover',
            'openai' => ['used' => false, 'available' => false],
            'timing_ms' => self::elapsedMs($t0),
        ];
    }

    private static function elapsedMs(int $t0): float
    {
        return round((hrtime(true) - $t0) / 1_000_000, 2);
    }
}

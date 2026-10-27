<?php

declare(strict_types=1);

namespace RankRise\Api\Services;

require_once __DIR__ . '/TextMatch.php';
require_once __DIR__ . '/KnowledgeSearchService.php';
require_once __DIR__ . '/FaqMatchService.php';
require_once __DIR__ . '/WebsiteKnowledgeIndex.php';
require_once __DIR__ . '/WebsiteKnowledgeBuilder.php';

/**
 * Local-first answer cascade (no OpenAI required):
 *   Website Knowledge Index → Knowledge Base → FAQ → Business Data → soft FAQ
 *
 * Responses use only website-sourced data. Low confidence → contact CTA (no invention).
 */
final class LocalAnswerEngine
{
    private KnowledgeSearchService $knowledge;
    private ?FaqMatchService $faq;
    private WebsiteKnowledgeIndex $websiteIndex;
    private int $knowledgeMinScore;
    private int $businessMinScore;
    private int $faqMinScore;
    private bool $faqEnabled;
    private bool $websiteIndexEnabled;

    /** @var array<string, array<string, mixed>> */
    private static array $answerCache = [];

    private static int $cacheLimit = 200;

    private static int $cacheBuiltAt = 0;

    /**
     * @param array{
     *   knowledgeSearch?: KnowledgeSearchService,
     *   faqMatch?: FaqMatchService|null,
     *   websiteIndex?: WebsiteKnowledgeIndex|null,
     *   knowledgeMinScore?: int,
     *   businessMinScore?: int,
     *   faqMinScore?: int,
     *   faqEnabled?: bool,
     *   websiteIndexEnabled?: bool
     * } $options
     */
    public function __construct(array $options = [])
    {
        $this->knowledge = $options['knowledgeSearch']
            ?? throw new \InvalidArgumentException('knowledgeSearch required');
        $this->faq = $options['faqMatch'] ?? null;
        $this->websiteIndex = $options['websiteIndex'] ?? new WebsiteKnowledgeIndex();
        $this->knowledgeMinScore = max(1, (int) ($options['knowledgeMinScore'] ?? 4));
        $this->businessMinScore = max(1, (int) ($options['businessMinScore'] ?? 3));
        $this->faqMinScore = max(1, (int) ($options['faqMinScore'] ?? 3));
        $this->faqEnabled = ($options['faqEnabled'] ?? true) !== false;
        $this->websiteIndexEnabled = ($options['websiteIndexEnabled'] ?? true) !== false;
    }

    /**
     * @return array{
     *   answer: string,
     *   source: string,
     *   score: int,
     *   confidence: float,
     *   meta: array<string, mixed>,
     *   matches: list<array{collection: string, id: string, score: int}>,
     *   cached: bool
     * }
     */
    public function resolve(string $visitorMessage): array
    {
        if (self::$cacheBuiltAt > 0 && (time() - self::$cacheBuiltAt) > 8) {
            self::$answerCache = [];
            self::$cacheBuiltAt = time();
        }

        $cacheKey = TextMatch::normalize($visitorMessage);
        if ($cacheKey !== '' && isset(self::$answerCache[$cacheKey])) {
            $hit = self::$answerCache[$cacheKey];
            $hit['cached'] = true;
            return $hit;
        }

        $normalized = TextMatch::normalize($visitorMessage);
        $expanded = TextMatch::expand($normalized);
        $intents = TextMatch::detectIntents($expanded);

        if ($this->websiteIndexEnabled && !$this->websiteIndex->exists()) {
            try {
                (new WebsiteKnowledgeBuilder())->rebuild();
            } catch (\Throwable) {
                // continue without index
            }
        }

        // 1) Unified website knowledge index
        if ($this->websiteIndexEnabled) {
            try {
                $hits = $this->websiteIndex->search($visitorMessage, 8);
                $composed = $this->websiteIndex->composeAnswer($hits);
            } catch (\Throwable) {
                $composed = null;
                $hits = [];
            }
            if ($composed !== null) {
                $hit = is_array($composed['hit'] ?? null) ? $composed['hit'] : [];
                $result = [
                    'answer' => $composed['answer'],
                    'source' => 'website_index',
                    'score' => (int) $composed['score'],
                    'confidence' => $composed['confidence'] === 'high' ? 0.85 : 0.5,
                    'meta' => [
                        'tier' => $composed['confidence'],
                        'id' => $hit['id'] ?? null,
                        'title' => $hit['title'] ?? null,
                        'url' => $hit['url'] ?? null,
                        'section' => $hit['section'] ?? null,
                        'doc_source' => $hit['source'] ?? null,
                        'intents' => $intents,
                    ],
                    'matches' => array_map(
                        static fn (array $h): array => [
                            'collection' => (string) ($h['section'] ?? 'website'),
                            'id' => (string) ($h['id'] ?? ''),
                            'score' => (int) ($h['score'] ?? 0),
                        ],
                        array_slice($hits, 0, 5)
                    ),
                    'cached' => false,
                ];
                $this->remember($cacheKey, $result);
                return $result;
            }
        }

        $prefer = [];
        foreach ($intents as $intent) {
            foreach (TextMatch::INTENT_COLLECTIONS[$intent] ?? [] as $col) {
                if (!in_array($col, $prefer, true)) {
                    $prefer[] = $col;
                }
            }
        }

        $matches = [];

        // 2) Knowledge Base
        try {
            $kb = $this->knowledge->findBestAnswer(
                $visitorMessage,
                $this->knowledgeMinScore,
                $prefer !== [] ? $prefer : null
            );
        } catch (\Throwable) {
            $kb = null;
        }

        if ($kb !== null) {
            $result = [
                'answer' => $kb['answer'],
                'source' => 'knowledge',
                'score' => $kb['score'],
                'confidence' => $kb['confidence'],
                'meta' => [
                    'collection' => $kb['collection'],
                    'id' => $kb['id'],
                    'title' => $kb['title'],
                    'intents' => $intents,
                ],
                'matches' => [[
                    'collection' => $kb['collection'],
                    'id' => $kb['id'],
                    'score' => $kb['score'],
                ]],
                'cached' => false,
            ];
            $this->remember($cacheKey, $result);
            return $result;
        }

        // 3) FAQ
        if ($this->faqEnabled && $this->faq !== null) {
            try {
                $faq = $this->faq->match($visitorMessage, $this->faqMinScore);
            } catch (\Throwable) {
                $faq = null;
            }
            if ($faq !== null) {
                $result = [
                    'answer' => $faq['answer'],
                    'source' => 'faq',
                    'score' => $faq['score'],
                    'confidence' => $faq['confidence'],
                    'meta' => [
                        'id' => $faq['id'],
                        'category' => $faq['category'],
                        'question' => $faq['question'],
                        'intents' => $intents,
                    ],
                    'matches' => $matches,
                    'cached' => false,
                ];
                $this->remember($cacheKey, $result);
                return $result;
            }
        }

        // 4) Business data (intent collections)
        if ($prefer !== []) {
            try {
                $biz = $this->knowledge->findBestAnswer(
                    $visitorMessage,
                    $this->businessMinScore,
                    $prefer
                );
            } catch (\Throwable) {
                $biz = null;
            }
            if ($biz !== null) {
                $result = [
                    'answer' => $biz['answer'],
                    'source' => 'business_data',
                    'score' => $biz['score'],
                    'confidence' => $biz['confidence'],
                    'meta' => [
                        'collection' => $biz['collection'],
                        'id' => $biz['id'],
                        'title' => $biz['title'],
                        'intents' => $intents,
                    ],
                    'matches' => [[
                        'collection' => $biz['collection'],
                        'id' => $biz['id'],
                        'score' => $biz['score'],
                    ]],
                    'cached' => false,
                ];
                $this->remember($cacheKey, $result);
                return $result;
            }
        }

        // 5) Soft FAQ
        if ($this->faqEnabled && $this->faq !== null) {
            try {
                $soft = $this->faq->matchSoft($visitorMessage);
            } catch (\Throwable) {
                $soft = null;
            }
            if ($soft !== null) {
                $result = [
                    'answer' => $soft['answer'],
                    'source' => 'faq_soft',
                    'score' => $soft['score'],
                    'confidence' => $soft['confidence'],
                    'meta' => [
                        'id' => $soft['id'],
                        'category' => $soft['category'],
                        'intents' => $intents,
                    ],
                    'matches' => $matches,
                    'cached' => false,
                ];
                $this->remember($cacheKey, $result);
                return $result;
            }
        }

        // Low confidence — never invent
        $result = [
            'answer' => $this->websiteIndex->lowConfidenceMessage(),
            'source' => 'website_low_confidence',
            'score' => 0,
            'confidence' => 0.0,
            'meta' => ['tier' => 'low', 'intents' => $intents],
            'matches' => [],
            'cached' => false,
            '_low_confidence' => true,
        ];
        $this->remember($cacheKey, $result);
        return $result;
    }

    /**
     * @param array<string, mixed> $result
     */
    private function remember(string $key, array $result): void
    {
        if ($key === '') {
            return;
        }
        if (count(self::$answerCache) >= self::$cacheLimit) {
            self::$answerCache = array_slice(self::$answerCache, (int) (self::$cacheLimit / 4), null, true);
        }
        self::$answerCache[$key] = $result;
        if (self::$cacheBuiltAt === 0) {
            self::$cacheBuiltAt = time();
        }
    }

    public static function clearCache(): void
    {
        self::$answerCache = [];
        self::$cacheBuiltAt = 0;
    }
}

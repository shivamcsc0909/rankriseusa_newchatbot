<?php

declare(strict_types=1);

namespace RankRise\Api\Services;

require_once __DIR__ . '/FaqStore.php';

/**
 * FAQ first-response matcher.
 *
 * Normalizes the visitor message (lowercase, punctuation stripped, spaces
 * collapsed), expands basic synonyms, then scores every enabled FAQ by
 * keyword / phrase / partial matching. Highest-confidence match wins;
 * below the minimum score the caller falls through to the AI workflow.
 */
final class FaqMatchService
{
    /** Score awarded per matching signal. */
    private const SCORE_EXACT_MESSAGE = 10;
    private const SCORE_PHRASE = 4;
    private const SCORE_WHOLE_WORD = 3;
    private const SCORE_PARTIAL = 1;

    /** Minimum keyword length considered for partial (substring) matching. */
    private const PARTIAL_MIN_LEN = 4;

    /**
     * Basic synonym / intent expansion: message tokens gain these aliases so
     * FAQ keywords match related phrasings without listing every variant.
     *
     * @var array<string, list<string>>
     */
    private const SYNONYMS = [
        'cost' => ['price', 'pricing'],
        'costs' => ['price', 'pricing'],
        'charge' => ['price', 'pricing'],
        'charges' => ['price', 'pricing'],
        'rates' => ['price', 'pricing'],
        'prices' => ['price', 'pricing'],
        'fee' => ['price', 'pricing'],
        'fees' => ['price', 'pricing'],
        'quotation' => ['quote'],
        'estimate' => ['quote'],
        'packages' => ['package'],
        'plans' => ['package'],
        'plan' => ['package'],
        'offer' => ['services'],
        'offers' => ['services'],
        'offering' => ['services'],
        'provides' => ['provide'],
        'providing' => ['provide'],
        'service' => ['services'],
        'websites' => ['website', 'web'],
        'site' => ['website'],
        'apps' => ['app'],
        'application' => ['app'],
        'applications' => ['app'],
        'develop' => ['development'],
        'developing' => ['development'],
        'marketing' => ['digital marketing'],
        'advertise' => ['digital marketing'],
        'advertising' => ['digital marketing'],
        'promotion' => ['digital marketing'],
        'ranking' => ['seo'],
        'rank' => ['seo'],
        'mail' => ['email'],
        'call' => ['phone'],
        'number' => ['phone'],
        'mobile' => ['phone'],
        'reach' => ['contact'],
        'located' => ['location', 'address'],
        'where' => ['location'],
        'timings' => ['timing', 'office hours'],
        'hours' => ['office hours'],
        'schedule' => ['timing'],
        'work' => ['projects'],
        'works' => ['projects'],
        'jobs' => ['job'],
        'vacancy' => ['job', 'hiring'],
        'vacancies' => ['job', 'hiring'],
        'recruitment' => ['hiring'],
        'careers' => ['career'],
        'learn' => ['course', 'training'],
        'learning' => ['course', 'training'],
        'courses' => ['course'],
        'intern' => ['internship'],
        'greetings' => ['hello'],
        'hii' => ['hi'],
        'hiii' => ['hi'],
        'helo' => ['hello'],
        'hallo' => ['hello'],
        'assist' => ['help', 'support'],
        'assistance' => ['help', 'support'],
        'issue' => ['help', 'support'],
        'problem' => ['help', 'support'],
    ];

    private FaqStore $store;
    private int $minScore;

    public function __construct(?FaqStore $store = null, int $minScore = 3)
    {
        $this->store = $store ?? new FaqStore();
        $this->minScore = max(1, $minScore);
    }

    /**
     * Lowercase, strip punctuation, collapse whitespace.
     */
    public static function normalize(string $text): string
    {
        $lower = strtolower(trim($text));
        $stripped = preg_replace('/[^a-z0-9\s]+/', ' ', $lower) ?? '';
        $collapsed = preg_replace('/\s+/', ' ', $stripped) ?? '';
        return trim($collapsed);
    }

    /**
     * Highest-confidence FAQ for the message, or null when nothing clears
     * the minimum score (caller then continues with the AI workflow).
     *
     * @return array{
     *   id: string,
     *   category: string,
     *   question: string,
     *   answer: string,
     *   score: int,
     *   confidence: float
     * }|null
     */
    public function match(string $visitorMessage, ?int $minScoreOverride = null): ?array
    {
        $normalized = self::normalize($visitorMessage);
        if ($normalized === '') {
            return null;
        }

        $expanded = $this->expandSynonyms($normalized);
        $threshold = max(1, $minScoreOverride ?? $this->minScore);

        $best = null;
        $bestScore = 0;
        $bestPriority = PHP_INT_MIN;

        foreach ($this->store->listEnabled() as $faq) {
            $answer = trim((string) ($faq['answer'] ?? ''));
            $keywords = is_array($faq['keywords'] ?? null) ? $faq['keywords'] : [];
            if ($answer === '' || $keywords === []) {
                continue;
            }

            $score = $this->scoreFaq($normalized, $expanded, $keywords);
            // Also reward overlap with the FAQ question text itself so natural
            // phrasings like "What services do you offer?" still match.
            $question = self::normalize((string) ($faq['question'] ?? ''));
            if ($question !== '') {
                $qTokens = array_filter(explode(' ', $question), static fn (string $t): bool => strlen($t) >= 4);
                foreach ($qTokens as $qt) {
                    if (preg_match('/\b' . preg_quote($qt, '/') . '\b/', $expanded) === 1) {
                        $score += self::SCORE_PARTIAL;
                    }
                }
            }

            if ($score < $threshold) {
                continue;
            }

            $priority = (int) ($faq['priority'] ?? 0);
            if ($score > $bestScore || ($score === $bestScore && $priority > $bestPriority)) {
                $best = $faq;
                $bestScore = $score;
                $bestPriority = $priority;
            }
        }

        if ($best === null) {
            return null;
        }

        return [
            'id' => (string) ($best['id'] ?? ''),
            'category' => (string) ($best['category'] ?? 'general'),
            'question' => (string) ($best['question'] ?? ''),
            'answer' => (string) ($best['answer'] ?? ''),
            'score' => $bestScore,
            'confidence' => round(min(1.0, $bestScore / self::SCORE_EXACT_MESSAGE), 2),
        ];
    }

    /**
     * Lower-confidence FAQ match used when OpenAI fails so FAQ answers
     * still return instead of a hard handover.
     *
     * @return array{
     *   id: string,
     *   category: string,
     *   question: string,
     *   answer: string,
     *   score: int,
     *   confidence: float
     * }|null
     */
    public function matchSoft(string $visitorMessage): ?array
    {
        return $this->match($visitorMessage, 2);
    }

    /**
     * Append synonym aliases for each token so keyword checks run against
     * the enriched text ("cost" also matches FAQs keyed on "price").
     */
    private function expandSynonyms(string $normalized): string
    {
        $tokens = explode(' ', $normalized);
        $aliases = [];
        foreach ($tokens as $token) {
            foreach (self::SYNONYMS[$token] ?? [] as $alias) {
                $aliases[$alias] = true;
            }
            // Light English plural/stem folding so "prices" hits "price".
            if (strlen($token) > 4 && str_ends_with($token, 's') && !str_ends_with($token, 'ss')) {
                $stem = substr($token, 0, -1);
                if ($stem !== '') {
                    $aliases[$stem] = true;
                    foreach (self::SYNONYMS[$stem] ?? [] as $alias) {
                        $aliases[$alias] = true;
                    }
                }
            }
            if (strlen($token) > 5 && str_ends_with($token, 'es')) {
                $stem = substr($token, 0, -2);
                if ($stem !== '') {
                    $aliases[$stem] = true;
                }
            }
        }
        if ($aliases === []) {
            return $normalized;
        }
        return $normalized . ' ' . implode(' ', array_keys($aliases));
    }

    /**
     * @param list<mixed> $keywords
     */
    private function scoreFaq(string $normalized, string $expanded, array $keywords): int
    {
        $score = 0;

        foreach ($keywords as $raw) {
            if (!is_string($raw)) {
                continue;
            }
            $keyword = self::normalize($raw);
            if ($keyword === '') {
                continue;
            }

            // Whole message equals the keyword ("hi", "pricing").
            if ($normalized === $keyword) {
                $score += self::SCORE_EXACT_MESSAGE;
                continue;
            }

            $isPhrase = str_contains($keyword, ' ');
            $pattern = '/\b' . preg_quote($keyword, '/') . '\b/';

            if (preg_match($pattern, $expanded) === 1) {
                $score += $isPhrase ? self::SCORE_PHRASE : self::SCORE_WHOLE_WORD;
                continue;
            }

            // Partial (substring) match for longer keywords only, so short
            // ones like "app" don't fire inside unrelated words.
            if (strlen($keyword) >= self::PARTIAL_MIN_LEN && str_contains($expanded, $keyword)) {
                $score += self::SCORE_PARTIAL;
            }
        }

        return $score;
    }
}

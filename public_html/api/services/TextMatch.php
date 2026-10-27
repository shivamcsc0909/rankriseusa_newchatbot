<?php

declare(strict_types=1);

namespace RankRise\Api\Services;

/**
 * Shared text matching utilities for local chatbot answers.
 * Supports normalize, synonyms, plural/stem folding, fuzzy, and intent detection.
 */
final class TextMatch
{
    /**
     * @var array<string, list<string>>
     */
    public const SYNONYMS = [
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
        'packages' => ['package', 'pricing'],
        'plans' => ['package', 'pricing'],
        'plan' => ['package'],
        'offer' => ['services'],
        'offers' => ['services'],
        'offering' => ['services'],
        'service' => ['services'],
        'websites' => ['website', 'web'],
        'site' => ['website'],
        'apps' => ['app'],
        'application' => ['app'],
        'applications' => ['app'],
        'develop' => ['development'],
        'developing' => ['development'],
        'marketing' => ['digital marketing'],
        'advertise' => ['ads', 'ppc'],
        'advertising' => ['ads', 'ppc'],
        'ranking' => ['seo'],
        'rank' => ['seo'],
        'mail' => ['email'],
        'number' => ['phone'],
        'mobile' => ['phone', 'app'],
        'reach' => ['contact'],
        'located' => ['location', 'address', 'office'],
        'where' => ['location', 'office'],
        'timings' => ['hours', 'office hours'],
        'hours' => ['office hours', 'business hours'],
        'schedule' => ['hours', 'meeting'],
        'courses' => ['course', 'training'],
        'learn' => ['course', 'training'],
        'learning' => ['course', 'training'],
        'class' => ['course'],
        'classes' => ['course'],
        'training' => ['course'],
        'portfolio' => ['projects', 'work'],
        'projects' => ['portfolio', 'work'],
        'works' => ['portfolio', 'projects'],
        'clients' => ['portfolio'],
        'case' => ['portfolio'],
        'policy' => ['policies'],
        'refund' => ['policies', 'refund policy'],
        'privacy' => ['policies', 'privacy policy'],
        'terms' => ['policies', 'terms'],
        'cookies' => ['policies'],
        'blog' => ['blogs', 'articles'],
        'blogs' => ['articles'],
        'article' => ['blog'],
        'articles' => ['blog'],
        'office' => ['location', 'address'],
        'hq' => ['office', 'headquarters'],
        'headquarters' => ['office'],
        'assist' => ['help', 'support'],
        'assistance' => ['help', 'support'],
        'hii' => ['hi'],
        'helo' => ['hello'],
        'hallo' => ['hello'],
    ];

    /**
     * Intent keywords → business collection bias.
     *
     * @var array<string, list<string>>
     */
    public const INTENT_COLLECTIONS = [
        'pricing' => ['pricing', 'services'],
        'services' => ['services', 'pricing'],
        'courses' => ['courses'],
        'portfolio' => ['portfolio', 'documents'],
        'policies' => ['policies'],
        'contact' => ['contact', 'company_info', 'office_hours'],
        'office' => ['office_hours', 'contact', 'company_info'],
        'company' => ['company_info', 'contact'],
        'blog' => ['blogs', 'documents'],
        'faq' => ['faqs'],
    ];

    public static function normalize(string $text): string
    {
        $lower = strtolower(trim($text));
        $stripped = preg_replace('/[^a-z0-9\s]+/', ' ', $lower) ?? '';
        $collapsed = preg_replace('/\s+/', ' ', $stripped) ?? '';
        return trim($collapsed);
    }

    /**
     * @return list<string>
     */
    public static function tokens(string $normalized, int $minLen = 2): array
    {
        if ($normalized === '') {
            return [];
        }
        $parts = explode(' ', $normalized);
        $out = [];
        foreach ($parts as $t) {
            if (strlen($t) >= $minLen) {
                $out[] = $t;
            }
        }
        return $out;
    }

    /**
     * Expand synonyms + plural/stem folding into an enriched haystack string.
     */
    public static function expand(string $normalized): string
    {
        $tokens = self::tokens($normalized, 1);
        $aliases = [];
        foreach ($tokens as $token) {
            foreach (self::SYNONYMS[$token] ?? [] as $alias) {
                $aliases[$alias] = true;
            }
            foreach (self::stems($token) as $stem) {
                $aliases[$stem] = true;
                foreach (self::SYNONYMS[$stem] ?? [] as $alias) {
                    $aliases[$alias] = true;
                }
            }
        }
        if ($aliases === []) {
            return $normalized;
        }
        return $normalized . ' ' . implode(' ', array_keys($aliases));
    }

    /**
     * @return list<string>
     */
    public static function stems(string $token): array
    {
        $out = [];
        $len = strlen($token);
        if ($len > 4 && str_ends_with($token, 's') && !str_ends_with($token, 'ss')) {
            $out[] = substr($token, 0, -1);
        }
        if ($len > 5 && str_ends_with($token, 'es')) {
            $out[] = substr($token, 0, -2);
        }
        if ($len > 6 && str_ends_with($token, 'ing')) {
            $out[] = substr($token, 0, -3);
        }
        if ($len > 5 && str_ends_with($token, 'ed')) {
            $out[] = substr($token, 0, -2);
        }
        return $out;
    }

    /**
     * Fuzzy similarity 0..1 using levenshtein (fast for short tokens).
     */
    public static function fuzzyRatio(string $a, string $b): float
    {
        if ($a === '' || $b === '') {
            return 0.0;
        }
        if ($a === $b) {
            return 1.0;
        }
        $max = max(strlen($a), strlen($b));
        if ($max > 40) {
            // Skip expensive fuzzy on long strings; substring check only.
            return str_contains($a, $b) || str_contains($b, $a) ? 0.7 : 0.0;
        }
        $dist = levenshtein($a, $b);
        return max(0.0, 1.0 - ($dist / $max));
    }

    /**
     * Detect primary business intent from visitor message.
     *
     * @return list<string> intent keys ordered by strength
     */
    public static function detectIntents(string $normalizedExpanded): array
    {
        $checks = [
            'pricing' => ['price', 'pricing', 'cost', 'quote', 'package', 'fee', 'budget', 'how much', 'charges'],
            'services' => ['service', 'services', 'seo', 'marketing', 'development', 'branding', 'what do you do', 'offer'],
            'courses' => ['course', 'courses', 'training', 'learn', 'class', 'internship'],
            'portfolio' => ['portfolio', 'projects', 'case study', 'clients', 'work samples', 'showcase'],
            'policies' => ['policy', 'policies', 'privacy', 'refund', 'terms', 'disclaimer', 'cookies'],
            'contact' => ['contact', 'phone', 'email', 'whatsapp', 'reach', 'call', 'get in touch'],
            'office' => ['office', 'address', 'location', 'hours', 'timing', 'business hours', 'open'],
            'company' => ['about', 'company', 'who are you', 'rankrise', 'agency'],
            'blog' => ['blog', 'blogs', 'article', 'articles', 'post'],
            'faq' => ['faq', 'frequently'],
        ];

        $hits = [];
        foreach ($checks as $intent => $needles) {
            $score = 0;
            foreach ($needles as $n) {
                if (str_contains($normalizedExpanded, $n)) {
                    $score += str_contains($n, ' ') ? 2 : 1;
                }
            }
            if ($score > 0) {
                $hits[$intent] = $score;
            }
        }
        arsort($hits);
        return array_keys($hits);
    }

    /**
     * Score query against a bag of keywords / phrases.
     *
     * @param list<string> $keywords
     */
    public static function scoreKeywords(string $normalized, string $expanded, array $keywords): int
    {
        $score = 0;
        foreach ($keywords as $raw) {
            $keyword = self::normalize((string) $raw);
            if ($keyword === '') {
                continue;
            }
            if ($normalized === $keyword) {
                $score += 10;
                continue;
            }
            $isPhrase = str_contains($keyword, ' ');
            $pattern = '/\b' . preg_quote($keyword, '/') . '\b/';
            if (preg_match($pattern, $expanded) === 1) {
                $score += $isPhrase ? 4 : 3;
                continue;
            }
            if (strlen($keyword) >= 4 && str_contains($expanded, $keyword)) {
                $score += 1;
                continue;
            }
            // Fuzzy token match for typos (e.g. "pricng" ≈ "pricing")
            if (!$isPhrase && strlen($keyword) >= 5) {
                foreach (self::tokens($expanded, 4) as $tok) {
                    if (self::fuzzyRatio($tok, $keyword) >= 0.82) {
                        $score += 2;
                        break;
                    }
                }
            }
        }
        return $score;
    }

    /**
     * Score query tokens against free-form haystack text.
     */
    public static function scoreHaystack(string $expanded, string $haystackLower): int
    {
        $score = 0;
        $tokens = array_unique(self::tokens($expanded, 3));
        foreach ($tokens as $term) {
            if (str_contains($haystackLower, $term)) {
                $score += 2;
                continue;
            }
            // Fuzzy against haystack words for misspellings
            if (strlen($term) >= 5) {
                $words = preg_split('/\s+/', $haystackLower) ?: [];
                foreach ($words as $w) {
                    if (strlen($w) < 4) {
                        continue;
                    }
                    if (self::fuzzyRatio($term, $w) >= 0.84) {
                        $score += 1;
                        break;
                    }
                }
            }
        }
        return $score;
    }
}

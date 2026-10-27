<?php

declare(strict_types=1);

namespace RankRise\Api\Services;

require_once __DIR__ . '/TextMatch.php';

/**
 * Local searchable website knowledge index (JSON on disk).
 * Built once by WebsiteKnowledgeBuilder; searched in-process without crawling.
 */
final class WebsiteKnowledgeIndex
{
    private string $indexPath;

    /** @var array{built_at?: string, docs?: list<array<string, mixed>>}|null */
    private static ?array $memory = null;

    private static int $memoryMtime = -1;

    public function __construct(?string $dataDir = null)
    {
        $dir = $dataDir ?? (dirname(__DIR__) . '/storage/knowledge');
        if (!is_dir($dir)) {
            @mkdir($dir, 0755, true);
        }
        $this->indexPath = rtrim($dir, '/\\') . '/website_index.json';
    }

    public function indexPath(): string
    {
        return $this->indexPath;
    }

    public function exists(): bool
    {
        return is_file($this->indexPath) && filesize($this->indexPath) > 10;
    }

    /**
     * @return array{built_at: string, doc_count: int, docs: list<array<string, mixed>>}
     */
    public function load(): array
    {
        $mtime = is_file($this->indexPath) ? (int) @filemtime($this->indexPath) : 0;
        if (self::$memory !== null && self::$memoryMtime === $mtime) {
            return self::$memory + ['doc_count' => count(self::$memory['docs'] ?? [])];
        }

        if (!$this->exists()) {
            $empty = ['built_at' => '', 'docs' => [], 'doc_count' => 0];
            self::$memory = $empty;
            self::$memoryMtime = $mtime;
            return $empty;
        }

        $raw = file_get_contents($this->indexPath);
        if ($raw === false || trim($raw) === '') {
            return ['built_at' => '', 'docs' => [], 'doc_count' => 0];
        }
        try {
            /** @var mixed $parsed */
            $parsed = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            return ['built_at' => '', 'docs' => [], 'doc_count' => 0];
        }
        if (!is_array($parsed)) {
            return ['built_at' => '', 'docs' => [], 'doc_count' => 0];
        }
        $docs = [];
        foreach (($parsed['docs'] ?? []) as $row) {
            if (is_array($row)) {
                $docs[] = $row;
            }
        }
        $out = [
            'built_at' => (string) ($parsed['built_at'] ?? ''),
            'docs' => $docs,
            'doc_count' => count($docs),
            'sources' => is_array($parsed['sources'] ?? null) ? $parsed['sources'] : [],
        ];
        self::$memory = $out;
        self::$memoryMtime = $mtime;
        return $out;
    }

    public static function clearMemory(): void
    {
        self::$memory = null;
        self::$memoryMtime = -1;
    }

    /**
     * Ranked search over the index.
     *
     * @return list<array{
     *   id: string,
     *   title: string,
     *   content: string,
     *   url: string,
     *   section: string,
     *   source: string,
     *   score: int,
     *   confidence: float
     * }>
     */
    public function search(string $query, int $limit = 8): array
    {
        $index = $this->load();
        $docs = $index['docs'];
        if ($docs === []) {
            return [];
        }

        $normalized = TextMatch::normalize($query);
        if ($normalized === '') {
            return [];
        }
        $expanded = TextMatch::expand($normalized);
        $stop = [
            'a' => true, 'an' => true, 'the' => true, 'is' => true, 'are' => true, 'was' => true,
            'were' => true, 'be' => true, 'been' => true, 'do' => true, 'does' => true, 'did' => true,
            'to' => true, 'of' => true, 'in' => true, 'on' => true, 'for' => true, 'and' => true,
            'or' => true, 'your' => true, 'you' => true, 'we' => true, 'our' => true, 'my' => true,
            'me' => true, 'i' => true, 'what' => true, 'which' => true, 'who' => true, 'how' => true,
            'when' => true, 'where' => true, 'why' => true, 'can' => true, 'could' => true,
            'would' => true, 'should' => true, 'please' => true, 'tell' => true, 'show' => true,
            'about' => true, 'with' => true, 'from' => true, 'this' => true, 'that' => true,
            'have' => true, 'has' => true, 'any' => true, 'also' => true, 'just' => true,
            'need' => true, 'want' => true, 'get' => true, 'give' => true, 'more' => true,
        ];
        $tokens = preg_split('/\s+/', $expanded) ?: [];
        $tokens = array_values(array_filter(
            $tokens,
            static fn ($t) => is_string($t) && strlen($t) >= 3 && !isset($stop[$t])
        ));
        if ($tokens === []) {
            return [];
        }

        $scored = [];
        foreach ($docs as $doc) {
            if (($doc['is_active'] ?? true) === false) {
                continue;
            }
            $score = $this->scoreDoc($doc, $normalized, $expanded, $tokens);
            if ($score < 4) {
                continue;
            }
            $scored[] = [
                'id' => (string) ($doc['id'] ?? ''),
                'title' => (string) ($doc['title'] ?? ''),
                'content' => (string) ($doc['content'] ?? ''),
                'url' => (string) ($doc['url'] ?? ''),
                'section' => (string) ($doc['section'] ?? ''),
                'source' => (string) ($doc['source'] ?? 'website'),
                'score' => $score,
                'confidence' => min(1.0, $score / 18.0),
            ];
        }

        usort($scored, static fn (array $a, array $b): int => $b['score'] <=> $a['score']);
        return array_slice($scored, 0, max(1, $limit));
    }

    /**
     * @param array<string, mixed> $doc
     * @param list<string> $tokens
     */
    private function scoreDoc(array $doc, string $normalized, string $expanded, array $tokens): int
    {
        $title = TextMatch::normalize((string) ($doc['title'] ?? ''));
        $body = TextMatch::normalize((string) ($doc['content'] ?? ''));
        $hay = trim($title . ' ' . $body);
        $kwRaw = $doc['keywords'] ?? [];
        $keywords = [];
        if (is_array($kwRaw)) {
            foreach ($kwRaw as $k) {
                if (is_string($k) && $k !== '') {
                    $keywords[] = TextMatch::normalize($k);
                }
            }
        }

        $score = 0;
        $strongHits = 0;

        foreach ($keywords as $kw) {
            if ($kw === '' || strlen($kw) < 3) {
                continue;
            }
            if ($normalized === $kw || preg_match('/\b' . preg_quote($kw, '/') . '\b/', $normalized)) {
                $score += 8;
                $strongHits++;
            } elseif (str_contains($expanded, $kw) || str_contains($normalized, $kw)) {
                $score += 5;
                $strongHits++;
            }
        }

        foreach ($tokens as $tok) {
            if (preg_match('/\b' . preg_quote($tok, '/') . '\b/', $title)) {
                $score += 4;
                $strongHits++;
            } elseif (preg_match('/\b' . preg_quote($tok, '/') . '\b/', $hay)) {
                $score += 3;
                $strongHits++;
            } elseif (strlen($tok) >= 5) {
                foreach (preg_split('/\s+/', $title) ?: [] as $tw) {
                    if (is_string($tw) && $tw !== '' && TextMatch::fuzzyRatio($tok, $tw) >= 0.86) {
                        $score += 2;
                        $strongHits++;
                        break;
                    }
                }
            }
        }

        // Reject weak incidental overlaps (must have at least one strong hit).
        if ($strongHits < 1) {
            return 0;
        }

        $section = (string) ($doc['section'] ?? '');
        $intentMap = [
            'services' => ['service', 'seo', 'smo', 'ppc', 'web', 'app', 'branding'],
            'pricing' => ['price', 'pricing', 'cost', 'package', 'plan', 'fee'],
            'contact' => ['contact', 'phone', 'email', 'call', 'address'],
            'courses' => ['course', 'training', 'internship'],
            'portfolio' => ['portfolio', 'project'],
            'blog' => ['blog', 'article', 'insight'],
            'policies' => ['privacy', 'terms', 'refund', 'policy', 'cookie'],
            'about' => ['company', 'rankrise'],
            'faq' => [],
        ];
        foreach ($intentMap[$section] ?? [] as $signal) {
            if (str_contains($expanded, $signal) || str_contains($normalized, $signal)) {
                $score += 2;
            }
        }

        return $score;
    }

    public function lowConfidenceMessage(): string
    {
        return "I couldn't find that information on our website.\n\n"
            . "For more details, please contact our team:\n"
            . "• Phone: +1 (202) 888-2806\n"
            . "• Email: sam@RankRiseUSA.com\n"
            . "• Contact page: /contact";
    }

    /**
     * Build a natural reply from ranked hits (website data only).
     *
     * @param list<array<string, mixed>> $hits
     * @return array{answer: string, confidence: string, score: int, hit: ?array<string, mixed>}|null
     */
    public function composeAnswer(array $hits): ?array
    {
        if ($hits === []) {
            return null;
        }
        $best = $hits[0];
        $score = (int) ($best['score'] ?? 0);
        $conf = (float) ($best['confidence'] ?? 0);

        if ($score >= 10 || $conf >= 0.55) {
            $body = trim((string) ($best['content'] ?? ''));
            $url = trim((string) ($best['url'] ?? ''));
            $title = trim((string) ($best['title'] ?? ''));
            $answer = $body;
            if ($url !== '' && !str_contains(strtolower($body), strtolower($url))) {
                $answer .= "\n\nYou can also visit {$url}" . ($title !== '' ? " ({$title})" : '') . ' for more details.';
            }
            return ['answer' => $answer, 'confidence' => 'high', 'score' => $score, 'hit' => $best];
        }

        if ($score >= 6 || $conf >= 0.35) {
            $snippet = trim((string) ($best['content'] ?? ''));
            if (strlen($snippet) > 280) {
                $snippet = rtrim(substr($snippet, 0, 277)) . '…';
            }
            $url = trim((string) ($best['url'] ?? ''));
            $title = trim((string) ($best['title'] ?? 'our website'));
            $answer = $snippet;
            if ($url !== '') {
                $answer .= "\n\nFor complete details, see {$title}: {$url}";
            }
            return ['answer' => $answer, 'confidence' => 'medium', 'score' => $score, 'hit' => $best];
        }

        return null;
    }
}

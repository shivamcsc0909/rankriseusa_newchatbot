<?php

declare(strict_types=1);

namespace RankRise\Api\Services;

require_once __DIR__ . '/TextMatch.php';

/**
 * Knowledge search over JSON collections with keyword / synonym / fuzzy scoring.
 * Can return snippets for OpenAI context OR a direct local answer.
 */
final class KnowledgeSearchService
{
    private string $dataDir;

    /** @var list<string> */
    private array $collections;

    private int $maxResults;
    private int $minScore;

    /** @var array<string, list<array<string, mixed>>>|null */
    private ?array $cache = null;

    private int $cacheMtime = -1;

    /**
     * @param array{
     *   dataDir: string,
     *   collections?: list<string>,
     *   maxResults?: int,
     *   minScore?: int
     * } $options
     */
    public function __construct(array $options)
    {
        $this->dataDir = $options['dataDir'];
        $this->collections = $options['collections'] ?? [];
        $this->maxResults = $options['maxResults'] ?? 5;
        $this->minScore = $options['minScore'] ?? 1;
        $this->ensureSeededCollections();
    }

    /**
     * @return array{
     *   snippets: list<string>,
     *   matches: list<array{collection: string, id: string, score: int}>
     * }
     */
    public function search(string $query, ?array $preferCollections = null): array
    {
        $scored = $this->scoreAll($query, $preferCollections);
        $top = array_slice($scored, 0, $this->maxResults);

        $snippets = [];
        $matches = [];
        foreach ($top as $item) {
            $snippets[] = self::formatSnippet($item['collection'], $item['record']);
            $matches[] = [
                'collection' => $item['collection'],
                'id' => (string) ($item['record']['id'] ?? ''),
                'score' => $item['score'],
            ];
        }

        return [
            'snippets' => $snippets,
            'matches' => $matches,
        ];
    }

    /**
     * Best direct answer from knowledge JSON (no OpenAI).
     *
     * @param list<string>|null $preferCollections
     * @return array{
     *   answer: string,
     *   collection: string,
     *   id: string,
     *   title: string,
     *   score: int,
     *   confidence: float
     * }|null
     */
    public function findBestAnswer(string $query, int $minScore = 4, ?array $preferCollections = null): ?array
    {
        $scored = $this->scoreAll($query, $preferCollections);
        if ($scored === []) {
            return null;
        }

        $best = $scored[0];
        if ($best['score'] < $minScore) {
            return null;
        }

        $answer = self::extractAnswer($best['record']);
        if ($answer === '') {
            return null;
        }

        return [
            'answer' => $answer,
            'collection' => $best['collection'],
            'id' => (string) ($best['record']['id'] ?? ''),
            'title' => (string) ($best['record']['title'] ?? $best['record']['question'] ?? ''),
            'score' => $best['score'],
            'confidence' => round(min(1.0, $best['score'] / 12), 2),
        ];
    }

    /**
     * @param list<string>|null $preferCollections
     * @return list<array{collection: string, record: array<string, mixed>, score: int}>
     */
    private function scoreAll(string $query, ?array $preferCollections = null): array
    {
        $normalized = TextMatch::normalize($query);
        $expanded = TextMatch::expand($normalized);
        if ($normalized === '') {
            return [];
        }

        $collections = $this->collections;
        if ($preferCollections !== null && $preferCollections !== []) {
            // Prefer listed collections first, then fall through to remaining.
            $ordered = [];
            foreach ($preferCollections as $c) {
                if (in_array($c, $collections, true) && !in_array($c, $ordered, true)) {
                    $ordered[] = $c;
                }
            }
            foreach ($collections as $c) {
                if (!in_array($c, $ordered, true)) {
                    $ordered[] = $c;
                }
            }
            $collections = $ordered;
        }

        /** @var list<array{collection: string, record: array<string, mixed>, score: int}> $scored */
        $scored = [];
        $all = $this->loadAll();

        foreach ($collections as $collection) {
            foreach ($all[$collection] ?? [] as $record) {
                if (($record['is_active'] ?? true) === false) {
                    continue;
                }

                $score = $this->scoreRecord($normalized, $expanded, $record);

                // Bias preferred collections slightly so intent-targeted hits win ties.
                if ($preferCollections !== null && in_array($collection, $preferCollections, true) && $score > 0) {
                    $score += 1;
                }

                if ($score >= $this->minScore) {
                    $scored[] = [
                        'collection' => $collection,
                        'record' => $record,
                        'score' => $score,
                    ];
                }
            }
        }

        usort($scored, static fn (array $a, array $b): int => $b['score'] <=> $a['score']);
        return $scored;
    }

    /**
     * @param array<string, mixed> $record
     */
    private function scoreRecord(string $normalized, string $expanded, array $record): int
    {
        $score = 0;

        $keywords = [];
        if (isset($record['keywords']) && is_array($record['keywords'])) {
            foreach ($record['keywords'] as $k) {
                if (is_string($k)) {
                    $keywords[] = $k;
                }
            }
        }
        if (isset($record['tags']) && is_array($record['tags'])) {
            foreach ($record['tags'] as $t) {
                if (is_string($t)) {
                    $keywords[] = $t;
                }
            }
        }
        if (isset($record['synonyms']) && is_array($record['synonyms'])) {
            foreach ($record['synonyms'] as $s) {
                if (is_string($s)) {
                    $keywords[] = $s;
                }
            }
        }

        if ($keywords !== []) {
            $score += TextMatch::scoreKeywords($normalized, $expanded, $keywords);
        }

        $haystack = strtolower(self::recordText($record));
        $score += TextMatch::scoreHaystack($expanded, $haystack);

        // Title / question exact-ish bonuses
        foreach (['title', 'question', 'name'] as $field) {
            $val = TextMatch::normalize((string) ($record[$field] ?? ''));
            if ($val === '') {
                continue;
            }
            if ($normalized === $val) {
                $score += 8;
            } elseif (str_contains($expanded, $val) || str_contains($val, $normalized)) {
                $score += 3;
            }
        }

        return $score;
    }

    /**
     * @return array<string, list<array<string, mixed>>>
     */
    private function loadAll(): array
    {
        // Invalidate when any collection file changes (admin edits on another/same worker).
        $mtime = 0;
        foreach ($this->collections as $collection) {
            $path = rtrim($this->dataDir, '/\\') . '/' . $collection . '.json';
            if (is_file($path)) {
                $mtime = max($mtime, (int) @filemtime($path));
            }
        }
        if ($this->cache !== null && $this->cacheMtime === $mtime) {
            return $this->cache;
        }
        $out = [];
        foreach ($this->collections as $collection) {
            $out[$collection] = $this->loadCollection($collection);
        }
        $this->cache = $out;
        $this->cacheMtime = $mtime;
        return $out;
    }

    public function clearCache(): void
    {
        $this->cache = null;
        $this->cacheMtime = -1;
    }

    /**
     * Seed missing collection files from config/knowledge/{name}.default.json
     * and merge any default records whose ids are not yet present.
     */
    private function ensureSeededCollections(): void
    {
        $defaultsDir = dirname(__DIR__) . '/config/knowledge';
        if (!is_dir($defaultsDir)) {
            return;
        }
        if (!is_dir($this->dataDir)) {
            @mkdir($this->dataDir, 0755, true);
        }

        $seedNames = [
            'company_info', 'contact', 'services', 'pricing', 'courses',
            'portfolio', 'policies', 'office_hours', 'documents', 'faqs', 'blogs',
        ];

        foreach ($seedNames as $name) {
            $target = rtrim($this->dataDir, '/\\') . '/' . $name . '.json';
            $source = $defaultsDir . '/' . $name . '.default.json';
            if (!is_file($source)) {
                continue;
            }
            if (!is_file($target)) {
                @copy($source, $target);
                continue;
            }
            $this->mergeMissingRecords($target, $source);
        }

        foreach ($seedNames as $name) {
            $exists = is_file(rtrim($this->dataDir, '/\\') . '/' . $name . '.json')
                || is_file($defaultsDir . '/' . $name . '.default.json');
            if ($exists && !in_array($name, $this->collections, true)) {
                $this->collections[] = $name;
            }
        }
    }

    private function mergeMissingRecords(string $target, string $source): void
    {
        try {
            $existingRaw = file_get_contents($target);
            $defaultRaw = file_get_contents($source);
            if ($existingRaw === false || $defaultRaw === false) {
                return;
            }
            $existing = json_decode($existingRaw, true);
            $defaults = json_decode($defaultRaw, true);
            if (!is_array($existing) || !is_array($defaults)) {
                return;
            }

            $ids = [];
            foreach ($existing as $row) {
                if (is_array($row) && isset($row['id'])) {
                    $ids[(string) $row['id']] = true;
                }
            }

            $added = false;
            foreach ($defaults as $row) {
                if (!is_array($row) || !isset($row['id'])) {
                    continue;
                }
                $id = (string) $row['id'];
                if (isset($ids[$id])) {
                    continue;
                }
                $existing[] = $row;
                $ids[$id] = true;
                $added = true;
            }

            if (!$added) {
                return;
            }

            $json = json_encode(array_values($existing), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
            if ($json !== false && is_writable($target)) {
                file_put_contents($target, $json . "\n", LOCK_EX);
            }
        } catch (\Throwable) {
            // Non-fatal — defaults remain readable via loadCollection fallback.
        }
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function loadCollection(string $collection): array
    {
        $path = rtrim($this->dataDir, '/\\') . '/' . $collection . '.json';
        if (!is_file($path) || !is_readable($path)) {
            // Fall back to default seed file without copying (read-only hosts).
            $fallback = dirname(__DIR__) . '/config/knowledge/' . $collection . '.default.json';
            if (!is_file($fallback) || !is_readable($fallback)) {
                return [];
            }
            $path = $fallback;
        }

        $raw = file_get_contents($path);
        if ($raw === false) {
            return [];
        }

        try {
            /** @var mixed $parsed */
            $parsed = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            return [];
        }

        if (!is_array($parsed)) {
            return [];
        }

        $isList = array_keys($parsed) === range(0, count($parsed) - 1);
        if (!$isList) {
            return [];
        }

        /** @var list<array<string, mixed>> $records */
        $records = [];
        foreach ($parsed as $row) {
            if (is_array($row)) {
                $records[] = $row;
            }
        }

        return $records;
    }

    /**
     * @param array<string, mixed> $record
     */
    public static function extractAnswer(array $record): string
    {
        foreach (['answer', 'content', 'description', 'value'] as $field) {
            if (!empty($record[$field]) && is_string($record[$field])) {
                $text = trim($record[$field]);
                if ($text !== '') {
                    // Prefixed title when useful
                    $title = trim((string) ($record['title'] ?? $record['question'] ?? $record['name'] ?? ''));
                    if ($title !== '' && $field !== 'answer' && !str_starts_with($text, $title)) {
                        return $title . "\n\n" . $text;
                    }
                    return $text;
                }
            }
        }

        // Structured pricing record
        if (isset($record['price']) || isset($record['features'])) {
            return self::formatSnippet('pricing', $record);
        }

        return '';
    }

    /**
     * @return list<string>
     */
    public static function tokenize(string $text): array
    {
        return TextMatch::tokens(TextMatch::normalize($text), 3);
    }

    /**
     * @param array<string, mixed> $record
     */
    public static function recordText(array $record): string
    {
        $parts = [];
        foreach ($record as $value) {
            if (is_string($value)) {
                $parts[] = $value;
            } elseif (is_array($value)) {
                $strings = [];
                foreach ($value as $v) {
                    if (is_string($v)) {
                        $strings[] = $v;
                    }
                }
                if ($strings !== []) {
                    $parts[] = implode(' ', $strings);
                }
            }
        }
        return implode(' ', $parts);
    }

    /**
     * @param array<string, mixed> $record
     */
    public static function formatSnippet(string $collection, array $record): string
    {
        $lines = ['[' . $collection . ']'];

        if (!empty($record['title']) && is_string($record['title'])) {
            $lines[] = 'Title: ' . $record['title'];
        }
        if (!empty($record['question']) && is_string($record['question'])) {
            $lines[] = 'Q: ' . $record['question'];
        }
        if (!empty($record['answer']) && is_string($record['answer'])) {
            $lines[] = 'A: ' . $record['answer'];
        }
        if (!empty($record['content']) && is_string($record['content'])) {
            $lines[] = $record['content'];
        }
        if (!empty($record['name']) && is_string($record['name'])) {
            $lines[] = 'Name: ' . $record['name'];
        }
        if (!empty($record['description']) && is_string($record['description'])) {
            $lines[] = $record['description'];
        }
        if (array_key_exists('price', $record) && $record['price'] !== null) {
            $currency = is_string($record['currency'] ?? null) ? $record['currency'] : '';
            $period = is_string($record['billing_period'] ?? null) ? $record['billing_period'] : 'one_time';
            $lines[] = 'Price: ' . $record['price'] . ' ' . $currency . ' (' . $period . ')';
        }
        if (isset($record['monthlyPrice'])) {
            $lines[] = 'Monthly: $' . $record['monthlyPrice'];
        }
        if (isset($record['features']) && is_array($record['features']) && $record['features'] !== []) {
            $feat = [];
            foreach ($record['features'] as $f) {
                if (is_string($f)) {
                    $feat[] = $f;
                }
            }
            if ($feat !== []) {
                $lines[] = 'Features: ' . implode(', ', $feat);
            }
        }
        if (!empty($record['key'])) {
            $label = is_string($record['label'] ?? null) && $record['label'] !== ''
                ? $record['label']
                : (string) $record['key'];
            $value = isset($record['value']) ? (string) $record['value'] : '';
            $lines[] = $label . ': ' . $value;
        }

        return implode("\n", $lines);
    }
}

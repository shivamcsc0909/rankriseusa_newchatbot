<?php

declare(strict_types=1);

namespace RankRise\Api\Services;

use RankRise\Api\Lib\Env;

/**
 * FAQ JSON store — same storage architecture as ConversationStore /
 * NotificationStore (JSON file, atomic write, corrupt backup).
 *
 * File: storage/chat/faqs.json (CHAT_DATA_DIR override respected).
 * Seeded once from config/faqs.default.json when the store file is missing.
 */
final class FaqStore
{
    private string $filePath;

    /** @var list<array<string, mixed>> */
    private array $records;

    public function __construct(?string $dataDir = null)
    {
        $fromEnv = Env::get('CHAT_DATA_DIR');
        $dir = $dataDir
            ?? (($fromEnv !== null && $fromEnv !== '') ? $fromEnv : null)
            ?? (dirname(__DIR__) . '/storage/chat');

        if (!is_dir($dir)) {
            if (!@mkdir($dir, 0755, true) && !is_dir($dir)) {
                throw new \RuntimeException('FAQ storage directory could not be created.');
            }
        }
        if (!is_writable($dir)) {
            throw new \RuntimeException('FAQ storage directory is not writable.');
        }

        $this->filePath = rtrim($dir, '/\\') . '/faqs.json';

        if (!is_file($this->filePath)) {
            $this->records = $this->seedDefaults();
            $this->persist();
        } else {
            $this->records = $this->load();
            // Non-destructive: merge newly added default keywords into existing FAQs
            // so production stores pick up matcher improvements without wiping answers.
            if ($this->mergeDefaultKeywords()) {
                $this->persist();
            }
        }
    }

    public static function defaultsPath(): string
    {
        return dirname(__DIR__) . '/config/faqs.default.json';
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function seedDefaults(): array
    {
        $path = self::defaultsPath();
        if (!is_file($path) || !is_readable($path)) {
            return [];
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

        $out = [];
        foreach ($parsed as $row) {
            if (is_array($row)) {
                $out[] = $this->sanitizeRecord($row, true);
            }
        }
        return $out;
    }

    /**
     * Merge missing keywords from faqs.default.json into matching FAQ ids.
     * Does not overwrite answers/questions already customized in production.
     */
    private function mergeDefaultKeywords(): bool
    {
        $defaults = $this->seedDefaults();
        if ($defaults === []) {
            return false;
        }

        $byId = [];
        foreach ($defaults as $row) {
            $id = (string) ($row['id'] ?? '');
            if ($id !== '') {
                $byId[$id] = $row;
            }
        }

        $changed = false;
        foreach ($this->records as $i => $faq) {
            $id = (string) ($faq['id'] ?? '');
            if ($id === '' || !isset($byId[$id])) {
                continue;
            }
            $defaultKw = is_array($byId[$id]['keywords'] ?? null) ? $byId[$id]['keywords'] : [];
            $currentKw = is_array($faq['keywords'] ?? null) ? $faq['keywords'] : [];
            $set = [];
            foreach ($currentKw as $k) {
                if (is_string($k) && trim($k) !== '') {
                    $set[strtolower(trim($k))] = trim($k);
                }
            }
            $added = false;
            foreach ($defaultKw as $k) {
                if (!is_string($k) || trim($k) === '') {
                    continue;
                }
                $key = strtolower(trim($k));
                if (!isset($set[$key])) {
                    $set[$key] = trim($k);
                    $added = true;
                }
            }
            if ($added) {
                $this->records[$i]['keywords'] = array_values($set);
                $this->records[$i]['updated_at'] = gmdate('c');
                $changed = true;
            }
        }

        return $changed;
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function load(): array
    {
        $raw = file_get_contents($this->filePath);
        if ($raw === false || trim($raw) === '') {
            return [];
        }
        try {
            /** @var mixed $parsed */
            $parsed = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            @copy($this->filePath, $this->filePath . '.corrupt.' . date('YmdHis'));
            return [];
        }
        if (!is_array($parsed)) {
            @copy($this->filePath, $this->filePath . '.corrupt.' . date('YmdHis'));
            return [];
        }
        $out = [];
        foreach ($parsed as $row) {
            if (is_array($row)) {
                $out[] = $row;
            }
        }
        return $out;
    }

    private function persist(): void
    {
        $tmp = $this->filePath . '.tmp';
        $json = json_encode($this->records, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        if ($json === false) {
            throw new \RuntimeException('FAQs could not be encoded.');
        }
        if (file_put_contents($tmp, $json, LOCK_EX) === false) {
            throw new \RuntimeException('FAQs temp write failed.');
        }
        if (!@rename($tmp, $this->filePath)) {
            @unlink($tmp);
            throw new \RuntimeException('FAQs atomic rename failed.');
        }
    }

    /**
     * Normalize an incoming record; assigns id / timestamps when missing.
     *
     * @param array<string, mixed> $row
     * @return array<string, mixed>
     */
    private function sanitizeRecord(array $row, bool $fresh = false): array
    {
        $keywords = [];
        if (isset($row['keywords']) && is_array($row['keywords'])) {
            foreach ($row['keywords'] as $k) {
                if (is_string($k) && trim($k) !== '') {
                    $keywords[] = trim($k);
                }
            }
        }

        $synonyms = [];
        if (isset($row['synonyms']) && is_array($row['synonyms'])) {
            foreach ($row['synonyms'] as $k) {
                if (is_string($k) && trim($k) !== '') {
                    $synonyms[] = trim($k);
                }
            }
        }

        // Synonyms are merged into keywords so the matcher (keyword-based) picks them up.
        if ($synonyms !== []) {
            $merged = [];
            foreach (array_merge($keywords, $synonyms) as $k) {
                $merged[strtolower($k)] = $k;
            }
            $keywords = array_values($merged);
        }

        $now = gmdate('c');

        return [
            'id' => (isset($row['id']) && is_string($row['id']) && $row['id'] !== '') ? $row['id'] : rankrise_uuid(),
            'category' => is_string($row['category'] ?? null) ? trim((string) $row['category']) : 'general',
            'question' => is_string($row['question'] ?? null) ? trim((string) $row['question']) : '',
            'answer' => is_string($row['answer'] ?? null) ? trim((string) $row['answer']) : '',
            'keywords' => $keywords,
            'synonyms' => $synonyms,
            'enabled' => ($row['enabled'] ?? true) !== false,
            'priority' => is_numeric($row['priority'] ?? null) ? (int) $row['priority'] : 0,
            'created_at' => ($fresh || !is_string($row['created_at'] ?? null)) ? $now : $row['created_at'],
            'updated_at' => $now,
        ];
    }

    /**
     * Active FAQs for matching (enabled only).
     *
     * @return list<array<string, mixed>>
     */
    public function listEnabled(): array
    {
        $this->records = $this->load();
        return array_values(array_filter(
            $this->records,
            static fn (array $r): bool => ($r['enabled'] ?? true) !== false
        ));
    }

    /**
     * Admin listing with optional filters.
     *
     * @param array{search?: ?string, category?: ?string, enabled?: ?string, limit?: int} $filters
     * @return list<array<string, mixed>>
     */
    public function listAll(array $filters = []): array
    {
        $this->records = $this->load();
        $out = $this->records;

        $category = $filters['category'] ?? null;
        if (is_string($category) && $category !== '') {
            $out = array_filter(
                $out,
                static fn (array $r): bool => strcasecmp((string) ($r['category'] ?? ''), $category) === 0
            );
        }

        $enabled = $filters['enabled'] ?? null;
        if ($enabled === '1' || $enabled === 'true') {
            $out = array_filter($out, static fn (array $r): bool => ($r['enabled'] ?? true) !== false);
        } elseif ($enabled === '0' || $enabled === 'false') {
            $out = array_filter($out, static fn (array $r): bool => ($r['enabled'] ?? true) === false);
        }

        $search = $filters['search'] ?? null;
        if (is_string($search) && trim($search) !== '') {
            $needle = strtolower(trim($search));
            $out = array_filter($out, static function (array $r) use ($needle): bool {
                $haystack = strtolower(
                    (string) ($r['question'] ?? '') . ' '
                    . (string) ($r['answer'] ?? '') . ' '
                    . (string) ($r['category'] ?? '') . ' '
                    . implode(' ', is_array($r['keywords'] ?? null) ? $r['keywords'] : [])
                );
                return str_contains($haystack, $needle);
            });
        }

        $out = array_values($out);
        usort($out, static function (array $a, array $b): int {
            $p = ((int) ($b['priority'] ?? 0)) <=> ((int) ($a['priority'] ?? 0));
            if ($p !== 0) {
                return $p;
            }
            return strcmp((string) ($a['category'] ?? ''), (string) ($b['category'] ?? ''));
        });

        $limit = (int) ($filters['limit'] ?? 500);
        return array_slice($out, 0, max(1, $limit));
    }

    /**
     * @return array<string, mixed>|null
     */
    public function find(string $id): ?array
    {
        foreach ($this->records as $r) {
            if (($r['id'] ?? null) === $id) {
                return $r;
            }
        }
        return null;
    }

    /**
     * @param array<string, mixed> $row
     * @return array<string, mixed>
     */
    public function create(array $row): array
    {
        unset($row['id']);
        $record = $this->sanitizeRecord($row, true);
        $this->records[] = $record;
        $this->persist();
        require_once __DIR__ . '/WebsiteKnowledgeBuilder.php';
        WebsiteKnowledgeBuilder::rebuildSafe();
        return $record;
    }

    /**
     * Partial update; only provided fields change.
     *
     * @param array<string, mixed> $fields
     * @return array<string, mixed>|null
     */
    public function update(string $id, array $fields): ?array
    {
        foreach ($this->records as $i => $r) {
            if (($r['id'] ?? null) !== $id) {
                continue;
            }

            if (array_key_exists('question', $fields) && is_string($fields['question'])) {
                $r['question'] = trim($fields['question']);
            }
            if (array_key_exists('answer', $fields) && is_string($fields['answer'])) {
                $r['answer'] = trim($fields['answer']);
            }
            if (array_key_exists('category', $fields) && is_string($fields['category'])) {
                $r['category'] = trim($fields['category']);
            }
            if (array_key_exists('keywords', $fields) && is_array($fields['keywords'])) {
                $keywords = [];
                foreach ($fields['keywords'] as $k) {
                    if (is_string($k) && trim($k) !== '') {
                        $keywords[] = trim($k);
                    }
                }
                $r['keywords'] = $keywords;
            }
            if (array_key_exists('synonyms', $fields) && is_array($fields['synonyms'])) {
                $synonyms = [];
                foreach ($fields['synonyms'] as $k) {
                    if (is_string($k) && trim($k) !== '') {
                        $synonyms[] = trim($k);
                    }
                }
                $r['synonyms'] = $synonyms;
                // Keep keywords unioned with synonyms for matcher.
                $merged = [];
                foreach (array_merge(is_array($r['keywords'] ?? null) ? $r['keywords'] : [], $synonyms) as $k) {
                    if (is_string($k) && $k !== '') {
                        $merged[strtolower($k)] = $k;
                    }
                }
                $r['keywords'] = array_values($merged);
            }
            if (array_key_exists('enabled', $fields)) {
                $r['enabled'] = $fields['enabled'] !== false && $fields['enabled'] !== 'false' && $fields['enabled'] !== 0;
            }
            if (array_key_exists('priority', $fields) && is_numeric($fields['priority'])) {
                $r['priority'] = (int) $fields['priority'];
            }
            $r['updated_at'] = gmdate('c');

            $this->records[$i] = $r;
            $this->persist();
            require_once __DIR__ . '/WebsiteKnowledgeBuilder.php';
            WebsiteKnowledgeBuilder::rebuildSafe();
            return $r;
        }
        return null;
    }

    public function delete(string $id): bool
    {
        foreach ($this->records as $i => $r) {
            if (($r['id'] ?? null) === $id) {
                array_splice($this->records, $i, 1);
                $this->persist();
                require_once __DIR__ . '/WebsiteKnowledgeBuilder.php';
                WebsiteKnowledgeBuilder::rebuildSafe();
                return true;
            }
        }
        return false;
    }
}

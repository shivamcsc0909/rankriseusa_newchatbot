<?php

declare(strict_types=1);

namespace RankRise\Api\Services;

use RankRise\Api\Lib\Env;

/**
 * CRUD over storage/knowledge/{collection}.json arrays.
 */
final class KnowledgeStore
{
    private string $dataDir;

    /** @var list<string> */
    private array $defaultCollections = [
        'documents',
        'faqs',
        'pricing',
        'policies',
        'company_info',
        'contact',
        'services',
        'courses',
        'portfolio',
        'office_hours',
        'blogs',
    ];

    public function __construct(?string $dataDir = null)
    {
        $fromEnv = Env::get('KB_DATA_DIR');
        $this->dataDir = $dataDir
            ?? (($fromEnv !== null && $fromEnv !== '') ? $fromEnv : null)
            ?? (dirname(__DIR__) . '/storage/knowledge');

        if (!is_dir($this->dataDir)) {
            if (!@mkdir($this->dataDir, 0755, true) && !is_dir($this->dataDir)) {
                throw new \RuntimeException('Knowledge directory could not be created.');
            }
        }
    }

    public function dataDir(): string
    {
        return $this->dataDir;
    }

    /**
     * @return list<string>
     */
    public function collections(): array
    {
        $found = $this->defaultCollections;
        foreach (glob($this->dataDir . '/*.json') ?: [] as $file) {
            $name = basename($file, '.json');
            if ($name !== '' && !in_array($name, $found, true)) {
                $found[] = $name;
            }
        }
        sort($found);
        return $found;
    }

    /**
     * @return list<string>
     */
    public function filesPresent(): array
    {
        $out = [];
        foreach (glob($this->dataDir . '/*.json') ?: [] as $file) {
            $out[] = basename($file, '.json');
        }
        sort($out);
        return $out;
    }

    public function countAll(): int
    {
        $n = 0;
        foreach ($this->collections() as $c) {
            $n += count($this->loadCollection($c));
        }
        return $n;
    }

    /**
     * @return list<array<string, mixed>>
     */
    public function list(?string $collection = null, ?string $search = null): array
    {
        $collections = ($collection !== null && $collection !== '' && $collection !== 'all')
            ? [$this->sanitizeCollection($collection)]
            : $this->collections();

        $out = [];
        $needle = $search !== null ? strtolower(trim($search)) : '';

        foreach ($collections as $col) {
            foreach ($this->loadCollection($col) as $row) {
                $row['collection'] = $col;
                if ($needle !== '') {
                    $hay = strtolower(
                        (string) ($row['title'] ?? '') . ' ' .
                        (string) ($row['content'] ?? '') . ' ' .
                        (string) ($row['category'] ?? '')
                    );
                    if (!str_contains($hay, $needle)) {
                        continue;
                    }
                }
                $out[] = $row;
            }
        }

        return $out;
    }

    /**
     * @param array<string, mixed> $input
     * @return array<string, mixed>
     */
    public function create(array $input): array
    {
        $collection = $this->sanitizeCollection((string) ($input['collection'] ?? 'documents'));
        $records = $this->loadCollection($collection);
        $record = $this->normalize($input, true);
        $records[] = $record;
        $this->saveCollection($collection, $records);
        $record['collection'] = $collection;
        return $record;
    }

    /**
     * @param array<string, mixed> $input
     * @return array<string, mixed>|null
     */
    public function update(string $id, array $input): ?array
    {
        $collectionHint = isset($input['collection']) ? $this->sanitizeCollection((string) $input['collection']) : null;
        $collections = $collectionHint ? [$collectionHint] : $this->collections();

        foreach ($collections as $collection) {
            $records = $this->loadCollection($collection);
            foreach ($records as $i => $row) {
                if ((string) ($row['id'] ?? '') !== $id) {
                    continue;
                }
                $merged = array_merge($row, $input);
                $merged['id'] = $id;
                $records[$i] = $this->normalize($merged, false);
                $this->saveCollection($collection, $records);
                $out = $records[$i];
                $out['collection'] = $collection;
                return $out;
            }
        }

        return null;
    }

    public function delete(string $id, ?string $collection = null): bool
    {
        $collections = ($collection !== null && $collection !== '')
            ? [$this->sanitizeCollection($collection)]
            : $this->collections();

        foreach ($collections as $col) {
            $records = $this->loadCollection($col);
            $next = [];
            $found = false;
            foreach ($records as $row) {
                if ((string) ($row['id'] ?? '') === $id) {
                    $found = true;
                    continue;
                }
                $next[] = $row;
            }
            if ($found) {
                $this->saveCollection($col, $next);
                return true;
            }
        }
        return false;
    }

    /**
     * @return list<array<string, mixed>>
     */
    public function export(string $collection): array
    {
        return $this->loadCollection($this->sanitizeCollection($collection));
    }

    /**
     * @param list<mixed> $items
     * @return array{imported: int, total: int}
     */
    public function import(string $collection, array $items, bool $replace = false): array
    {
        $col = $this->sanitizeCollection($collection);
        $records = $replace ? [] : $this->loadCollection($col);
        $imported = 0;
        foreach ($items as $row) {
            if (!is_array($row)) {
                continue;
            }
            $records[] = $this->normalize($row, true);
            $imported++;
        }
        $this->saveCollection($col, $records);
        return ['imported' => $imported, 'total' => count($records)];
    }

    private function sanitizeCollection(string $name): string
    {
        $clean = strtolower(preg_replace('/[^a-z0-9_\-]/i', '', $name) ?? '');
        if ($clean === '') {
            throw new \InvalidArgumentException('Invalid collection name.');
        }
        return $clean;
    }

    /**
     * @param array<string, mixed> $input
     * @return array<string, mixed>
     */
    private function normalize(array $input, bool $fresh): array
    {
        $tags = [];
        if (isset($input['tags']) && is_array($input['tags'])) {
            foreach ($input['tags'] as $t) {
                if (is_string($t) && trim($t) !== '') {
                    $tags[] = trim($t);
                }
            }
        }

        $id = (isset($input['id']) && is_string($input['id']) && $input['id'] !== '')
            ? $input['id']
            : rankrise_uuid();

        return [
            'id' => $id,
            'title' => trim((string) ($input['title'] ?? '')),
            'content' => trim((string) ($input['content'] ?? '')),
            'category' => trim((string) ($input['category'] ?? '')),
            'tags' => $tags,
            'is_active' => ($input['is_active'] ?? true) !== false,
            'updated_at' => gmdate('c'),
            'created_at' => $fresh
                ? gmdate('c')
                : (is_string($input['created_at'] ?? null) ? $input['created_at'] : gmdate('c')),
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function loadCollection(string $collection): array
    {
        $path = $this->dataDir . '/' . $collection . '.json';
        if (!is_file($path)) {
            return [];
        }
        $raw = file_get_contents($path);
        if ($raw === false || trim($raw) === '') {
            return [];
        }
        try {
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
                $out[] = $row;
            }
        }
        return $out;
    }

    /**
     * @param list<array<string, mixed>> $records
     */
    private function saveCollection(string $collection, array $records): void
    {
        $path = $this->dataDir . '/' . $collection . '.json';
        $json = json_encode(array_values($records), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        if ($json === false) {
            throw new \RuntimeException('Knowledge encode failed.');
        }
        $tmp = $path . '.tmp';
        if (file_put_contents($tmp, $json, LOCK_EX) === false) {
            throw new \RuntimeException('Knowledge write failed.');
        }
        if (!@rename($tmp, $path)) {
            @unlink($tmp);
            throw new \RuntimeException('Knowledge rename failed.');
        }
        require_once __DIR__ . '/WebsiteKnowledgeBuilder.php';
        WebsiteKnowledgeBuilder::rebuildSafe();
    }
}

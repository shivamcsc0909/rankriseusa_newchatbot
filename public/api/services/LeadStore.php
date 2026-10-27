<?php

declare(strict_types=1);

namespace RankRise\Api\Services;

/**
 * Contact / form lead inbox (JSON file store).
 */
final class LeadStore
{
    private string $filePath;

    public function __construct(?string $dataDir = null)
    {
        $dir = $dataDir ?? (dirname(__DIR__) . '/storage/leads');
        if (!is_dir($dir)) {
            if (!@mkdir($dir, 0755, true) && !is_dir($dir)) {
                throw new \RuntimeException('Leads directory could not be created.');
            }
        }
        if (!is_writable($dir)) {
            throw new \RuntimeException('Leads directory is not writable.');
        }
        $this->filePath = rtrim($dir, '/\\') . '/leads.json';
        if (!is_file($this->filePath)) {
            $this->persist([]);
        }
    }

    public function count(): int
    {
        return count($this->load());
    }

    public function countToday(): int
    {
        $today = gmdate('Y-m-d');
        $n = 0;
        foreach ($this->load() as $row) {
            $created = (string) ($row['created_at'] ?? '');
            if (str_starts_with($created, $today)) {
                $n++;
            }
        }
        return $n;
    }

    public function countNew(): int
    {
        $n = 0;
        foreach ($this->load() as $row) {
            if (($row['status'] ?? 'new') === 'new') {
                $n++;
            }
        }
        return $n;
    }

    /**
     * @return list<array{day: string, leads: int}>
     */
    public function seriesLastDays(int $days = 7): array
    {
        $map = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $day = gmdate('Y-m-d', time() - ($i * 86400));
            $map[$day] = 0;
        }
        foreach ($this->load() as $row) {
            $day = substr((string) ($row['created_at'] ?? ''), 0, 10);
            if (isset($map[$day])) {
                $map[$day]++;
            }
        }
        $out = [];
        foreach ($map as $day => $count) {
            $out[] = ['day' => $day, 'leads' => $count];
        }
        return $out;
    }

    /**
     * @param array{source?: string, search?: string, status?: string, limit?: int} $filters
     * @return list<array<string, mixed>>
     */
    public function list(array $filters = []): array
    {
        $source = trim((string) ($filters['source'] ?? ''));
        $status = trim((string) ($filters['status'] ?? ''));
        $search = strtolower(trim((string) ($filters['search'] ?? '')));
        $limit = max(1, (int) ($filters['limit'] ?? 500));

        $out = [];
        foreach ($this->load() as $row) {
            if ($source !== '' && strcasecmp((string) ($row['source'] ?? ''), $source) !== 0) {
                continue;
            }
            if ($status !== '' && ($row['status'] ?? '') !== $status) {
                continue;
            }
            if ($search !== '') {
                $hay = strtolower(
                    (string) ($row['name'] ?? '') . ' ' .
                    (string) ($row['email'] ?? '') . ' ' .
                    (string) ($row['phone'] ?? '') . ' ' .
                    (string) ($row['message'] ?? '') . ' ' .
                    (string) ($row['company'] ?? '')
                );
                if (!str_contains($hay, $search)) {
                    continue;
                }
            }
            $out[] = $row;
        }

        usort($out, static fn (array $a, array $b): int => strcmp((string) ($b['created_at'] ?? ''), (string) ($a['created_at'] ?? '')));
        return array_slice($out, 0, $limit);
    }

    /**
     * @param array<string, mixed> $input
     * @return array<string, mixed>
     */
    public function create(array $input): array
    {
        $fields = [];
        if (isset($input['fields']) && is_array($input['fields'])) {
            foreach ($input['fields'] as $k => $v) {
                if (is_string($k) && (is_string($v) || is_numeric($v))) {
                    $fields[$k] = (string) $v;
                }
            }
        }

        $record = [
            'id' => rankrise_uuid(),
            'source' => trim((string) ($input['source'] ?? 'unknown')),
            'name' => trim((string) ($input['name'] ?? $fields['name'] ?? '')),
            'email' => trim((string) ($input['email'] ?? $fields['email'] ?? '')),
            'phone' => trim((string) ($input['phone'] ?? $fields['phone'] ?? '')),
            'company' => trim((string) ($input['company'] ?? $fields['company'] ?? '')),
            'message' => trim((string) ($input['message'] ?? $fields['message'] ?? $fields['Message'] ?? '')),
            'status' => 'new',
            'fields' => $fields,
            'created_at' => gmdate('c'),
        ];

        $all = $this->load();
        array_unshift($all, $record);
        // Cap store size to keep file manageable on shared hosting.
        if (count($all) > 5000) {
            $all = array_slice($all, 0, 5000);
        }
        $this->persist($all);
        return $record;
    }

    /**
     * @return array<string, mixed>|null
     */
    public function updateStatus(string $id, string $status): ?array
    {
        $allowed = ['new', 'read', 'archived'];
        if (!in_array($status, $allowed, true)) {
            throw new \InvalidArgumentException('Invalid status.');
        }
        $all = $this->load();
        foreach ($all as $i => $row) {
            if (($row['id'] ?? '') === $id) {
                $all[$i]['status'] = $status;
                $all[$i]['updated_at'] = gmdate('c');
                $this->persist($all);
                return $all[$i];
            }
        }
        return null;
    }

    public function delete(string $id): bool
    {
        $all = $this->load();
        $next = [];
        $found = false;
        foreach ($all as $row) {
            if (($row['id'] ?? '') === $id) {
                $found = true;
                continue;
            }
            $next[] = $row;
        }
        if ($found) {
            $this->persist($next);
        }
        return $found;
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function load(): array
    {
        $raw = @file_get_contents($this->filePath);
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
     * @param list<array<string, mixed>> $rows
     */
    private function persist(array $rows): void
    {
        $json = json_encode(array_values($rows), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        if ($json === false) {
            throw new \RuntimeException('Leads encode failed.');
        }
        $tmp = $this->filePath . '.tmp';
        if (file_put_contents($tmp, $json, LOCK_EX) === false) {
            throw new \RuntimeException('Leads write failed.');
        }
        if (!@rename($tmp, $this->filePath)) {
            @unlink($tmp);
            throw new \RuntimeException('Leads rename failed.');
        }
    }
}

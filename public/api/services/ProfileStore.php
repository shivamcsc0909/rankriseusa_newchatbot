<?php

declare(strict_types=1);

namespace RankRise\Api\Services;

use RankRise\Api\Lib\Env;

/**
 * User Profile JSON Store.
 * File: storage/community/profiles.json
 */
final class ProfileStore
{
    private string $filePath;
    private string $lockPath;

    /** @var list<array<string, mixed>> */
    private array $records;

    public function __construct(?string $dataDir = null)
    {
        $fromEnv = Env::get('COMMUNITY_DATA_DIR');
        $dir = $dataDir
            ?? (($fromEnv !== null && $fromEnv !== '') ? $fromEnv : null)
            ?? (dirname(__DIR__) . '/storage/community');

        if (!is_dir($dir)) {
            if (!@mkdir($dir, 0755, true) && !is_dir($dir)) {
                throw new \RuntimeException('Community storage directory could not be created.');
            }
        }
        if (!is_writable($dir)) {
            throw new \RuntimeException('Community storage directory is not writable.');
        }

        $this->filePath = rtrim($dir, '/\\') . '/profiles.json';
        $this->lockPath = $this->filePath . '.lock';

        $this->records = $this->withLock(fn (): array => $this->loadUnlocked());
    }

    /**
     * @template T
     * @param callable(): T $fn
     * @return T
     */
    private function withLock(callable $fn): mixed
    {
        $lock = @fopen($this->lockPath, 'c+');
        if ($lock === false) {
            throw new \RuntimeException('Profile storage lock could not be opened.');
        }
        try {
            if (!flock($lock, LOCK_EX)) {
                throw new \RuntimeException('Profile storage lock could not be acquired.');
            }
            return $fn();
        } finally {
            flock($lock, LOCK_UN);
            fclose($lock);
        }
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function loadUnlocked(): array
    {
        if (!is_file($this->filePath)) {
            return [];
        }
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

    private function persistUnlocked(): void
    {
        $tmp = $this->filePath . '.tmp';
        $json = json_encode($this->records, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        if ($json === false) {
            throw new \RuntimeException('Profiles could not be encoded.');
        }
        if (file_put_contents($tmp, $json, LOCK_EX) === false) {
            throw new \RuntimeException('Profiles temp write failed.');
        }
        if (!@rename($tmp, $this->filePath)) {
            @unlink($tmp);
            throw new \RuntimeException('Profiles atomic rename failed.');
        }
    }

    private function sanitizeRecord(array $row): array
    {
        $now = gmdate('c');
        return [
            'id' => (isset($row['id']) && is_string($row['id']) && $row['id'] !== '') ? $row['id'] : rankrise_uuid(),
            'name' => trim((string) ($row['name'] ?? '')),
            'email' => strtolower(trim((string) ($row['email'] ?? ''))),
            'company' => is_string($row['company'] ?? null) ? trim((string) $row['company']) : '',
            'website' => is_string($row['website'] ?? null) ? trim((string) $row['website']) : '',
            'industry' => is_string($row['industry'] ?? null) ? trim((string) $row['industry']) : '',
            'country' => is_string($row['country'] ?? null) ? trim((string) $row['country']) : '',
            'phone' => is_string($row['phone'] ?? null) ? trim((string) $row['phone']) : '',
            'profile_image' => is_string($row['profile_image'] ?? null) ? trim((string) $row['profile_image']) : '',
            'bio' => is_string($row['bio'] ?? null) ? trim((string) $row['bio']) : '',
            'status' => in_array($row['status'] ?? null, ['pending', 'approved', 'rejected'], true) ? $row['status'] : 'approved',
            'created_at' => is_string($row['created_at'] ?? null) ? $row['created_at'] : $now,
            'updated_at' => $now,
        ];
    }

    public function findByEmail(string $email): ?array
    {
        $targetEmail = strtolower(trim($email));
        foreach ($this->records as $r) {
            if (strtolower((string) ($r['email'] ?? '')) === $targetEmail) {
                return $r;
            }
        }
        return null;
    }

    public function findById(string $id): ?array
    {
        foreach ($this->records as $r) {
            if (($r['id'] ?? null) === $id) {
                return $r;
            }
        }
        return null;
    }

    public function save(array $data): array
    {
        return $this->withLock(function () use ($data): array {
            $this->records = $this->loadUnlocked();
            $email = strtolower(trim((string) ($data['email'] ?? '')));

            $existingIndex = -1;
            foreach ($this->records as $i => $r) {
                if (strtolower((string) ($r['email'] ?? '')) === $email) {
                    $existingIndex = $i;
                    break;
                }
            }

            if ($existingIndex >= 0) {
                $record = array_merge($this->records[$existingIndex], $data);
                $record = $this->sanitizeRecord($record);
                $this->records[$existingIndex] = $record;
            } else {
                $record = $this->sanitizeRecord($data);
                $this->records[] = $record;
            }

            $this->persistUnlocked();
            return $record;
        });
    }

    public function listAll(?string $status = null): array
    {
        $out = $this->records;
        if ($status !== null && $status !== '') {
            $out = array_filter($out, static fn (array $r): bool => ($r['status'] ?? 'approved') === $status);
        }
        return array_values($out);
    }

    public function updateStatus(string $id, string $status): ?array
    {
        if (!in_array($status, ['pending', 'approved', 'rejected'], true)) {
            return null;
        }

        return $this->withLock(function () use ($id, $status): ?array {
            $this->records = $this->loadUnlocked();
            foreach ($this->records as $i => $r) {
                if (($r['id'] ?? null) === $id) {
                    $this->records[$i]['status'] = $status;
                    $this->records[$i]['updated_at'] = gmdate('c');
                    $this->persistUnlocked();
                    return $this->records[$i];
                }
            }
            return null;
        });
    }
}

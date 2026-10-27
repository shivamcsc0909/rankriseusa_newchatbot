<?php

declare(strict_types=1);

namespace RankRise\Api\Services;

use RankRise\Api\Lib\Env;

/**
 * Community Comment JSON Store.
 * File: storage/community/comments.json
 */
final class CommentStore
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

        $this->filePath = rtrim($dir, '/\\') . '/comments.json';
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
            throw new \RuntimeException('Comment storage lock could not be opened.');
        }
        try {
            if (!flock($lock, LOCK_EX)) {
                throw new \RuntimeException('Comment storage lock could not be acquired.');
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
            throw new \RuntimeException('Comments could not be encoded.');
        }
        if (file_put_contents($tmp, $json, LOCK_EX) === false) {
            throw new \RuntimeException('Comments temp write failed.');
        }
        if (!@rename($tmp, $this->filePath)) {
            @unlink($tmp);
            throw new \RuntimeException('Comments atomic rename failed.');
        }
    }

    private function sanitizeRecord(array $row): array
    {
        $now = gmdate('c');
        return [
            'id' => (isset($row['id']) && is_string($row['id']) && $row['id'] !== '') ? $row['id'] : rankrise_uuid(),
            'profile_id' => (string) ($row['profile_id'] ?? ''),
            'author_name' => trim((string) ($row['author_name'] ?? '')),
            'author_email' => strtolower(trim((string) ($row['author_email'] ?? ''))),
            'author_company' => is_string($row['author_company'] ?? null) ? trim((string) $row['author_company']) : '',
            'author_industry' => is_string($row['author_industry'] ?? null) ? trim((string) $row['author_industry']) : '',
            'author_avatar' => is_string($row['author_avatar'] ?? null) ? trim((string) $row['author_avatar']) : '',
            'target_type' => is_string($row['target_type'] ?? null) ? trim((string) $row['target_type']) : 'blog',
            'target_id' => is_string($row['target_id'] ?? null) ? trim((string) $row['target_id']) : 'general',
            'parent_id' => (isset($row['parent_id']) && is_string($row['parent_id']) && $row['parent_id'] !== '') ? $row['parent_id'] : null,
            'content' => trim((string) ($row['content'] ?? '')),
            'status' => in_array($row['status'] ?? null, ['pending', 'approved', 'rejected', 'hidden'], true) ? $row['status'] : 'pending',
            'is_pinned' => ($row['is_pinned'] ?? false) === true || ($row['is_pinned'] ?? false) === 'true' || ($row['is_pinned'] ?? false) === 1,
            'created_at' => is_string($row['created_at'] ?? null) ? $row['created_at'] : $now,
            'updated_at' => $now,
        ];
    }

    public function create(array $data): array
    {
        return $this->withLock(function () use ($data): array {
            $this->records = $this->loadUnlocked();
            $record = $this->sanitizeRecord($data);
            $this->records[] = $record;
            $this->persistUnlocked();
            return $record;
        });
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

    public function update(string $id, string $content, string $authorEmail): ?array
    {
        return $this->withLock(function () use ($id, $content, $authorEmail): ?array {
            $this->records = $this->loadUnlocked();
            $targetEmail = strtolower(trim($authorEmail));
            foreach ($this->records as $i => $r) {
                if (($r['id'] ?? null) === $id && strtolower((string) ($r['author_email'] ?? '')) === $targetEmail) {
                    $this->records[$i]['content'] = trim($content);
                    $this->records[$i]['updated_at'] = gmdate('c');
                    $this->persistUnlocked();
                    return $this->records[$i];
                }
            }
            return null;
        });
    }

    public function delete(string $id, string $authorEmail, bool $isAdmin = false): bool
    {
        return $this->withLock(function () use ($id, $authorEmail, $isAdmin): bool {
            $this->records = $this->loadUnlocked();
            $targetEmail = strtolower(trim($authorEmail));
            foreach ($this->records as $i => $r) {
                if (($r['id'] ?? null) === $id && ($isAdmin || strtolower((string) ($r['author_email'] ?? '')) === $targetEmail)) {
                    array_splice($this->records, $i, 1);
                    $this->persistUnlocked();
                    return true;
                }
            }
            return false;
        });
    }

    public function listByTarget(string $targetType, string $targetId, ?string $userEmail = null): array
    {
        $out = array_filter(
            $this->records,
            static function (array $r) use ($targetType, $targetId, $userEmail): bool {
                if (($r['target_type'] ?? '') !== $targetType || ($r['target_id'] ?? '') !== $targetId) {
                    return false;
                }
                $status = $r['status'] ?? 'approved';
                if ($status === 'approved') {
                    return true;
                }
                // Allow user to see their own pending comments
                if ($userEmail !== null && strtolower((string) ($r['author_email'] ?? '')) === strtolower(trim($userEmail))) {
                    return $status !== 'hidden';
                }
                return false;
            }
        );

        $list = array_values($out);
        usort($list, static function (array $a, array $b): int {
            $pinA = ($a['is_pinned'] ?? false) ? 1 : 0;
            $pinB = ($b['is_pinned'] ?? false) ? 1 : 0;
            if ($pinA !== $pinB) {
                return $pinB <=> $pinA;
            }
            return strcmp((string) ($b['created_at'] ?? ''), (string) ($a['created_at'] ?? ''));
        });

        return $list;
    }

    public function listAllAdmin(): array
    {
        $list = array_values($this->records);
        usort($list, static function (array $a, array $b): int {
            $pinA = ($a['is_pinned'] ?? false) ? 1 : 0;
            $pinB = ($b['is_pinned'] ?? false) ? 1 : 0;
            if ($pinA !== $pinB) {
                return $pinB <=> $pinA;
            }
            return strcmp((string) ($b['created_at'] ?? ''), (string) ($a['created_at'] ?? ''));
        });
        return $list;
    }

    public function updateStatus(string $id, string $status): ?array
    {
        if (!in_array($status, ['pending', 'approved', 'rejected', 'hidden'], true)) {
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

    public function togglePin(string $id, ?bool $pinnedState = null): ?array
    {
        return $this->withLock(function () use ($id, $pinnedState): ?array {
            $this->records = $this->loadUnlocked();
            foreach ($this->records as $i => $r) {
                if (($r['id'] ?? null) === $id) {
                    $newState = $pinnedState !== null ? $pinnedState : !($r['is_pinned'] ?? false);
                    $this->records[$i]['is_pinned'] = $newState;
                    $this->records[$i]['updated_at'] = gmdate('c');
                    $this->persistUnlocked();
                    return $this->records[$i];
                }
            }
            return null;
        });
    }
}

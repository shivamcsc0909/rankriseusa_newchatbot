<?php

declare(strict_types=1);

namespace RankRise\Api\Services;

/**
 * Handover notifications JSON store (mirrors adminNotifier.js log channel).
 * Reloads from disk on every read/write so PHP-FPM static singletons stay fresh.
 */
final class NotificationStore
{
    private string $filePath;
    private string $lockPath;

    /** @var list<array<string, mixed>> */
    private array $records;

    public function __construct(string $dataDir)
    {
        if (!is_dir($dataDir)) {
            if (!@mkdir($dataDir, 0755, true) && !is_dir($dataDir)) {
                throw new \RuntimeException('Notification storage directory could not be created.');
            }
        }
        if (!is_writable($dataDir)) {
            throw new \RuntimeException('Notification storage directory is not writable.');
        }
        $this->filePath = rtrim($dataDir, '/\\') . '/notifications.json';
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
            throw new \RuntimeException('Notification storage lock could not be opened.');
        }
        try {
            if (!flock($lock, LOCK_EX)) {
                throw new \RuntimeException('Notification storage lock could not be acquired.');
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
            throw new \RuntimeException('Notifications could not be encoded.');
        }
        if (file_put_contents($tmp, $json, LOCK_EX) === false) {
            throw new \RuntimeException('Notifications temp write failed.');
        }
        if (!@rename($tmp, $this->filePath)) {
            @unlink($tmp);
            throw new \RuntimeException('Notifications atomic rename failed.');
        }
    }

    private function reloadFromDisk(): void
    {
        $this->records = $this->withLock(fn (): array => $this->loadUnlocked());
    }

    /**
     * @param array<string, mixed> $event
     * @return array<string, mixed>
     */
    public function notify(array $event): array
    {
        return $this->withLock(function () use ($event): array {
            $this->records = $this->loadUnlocked();
            $notification = [
                'id' => rankrise_uuid(),
                'type' => 'human_handover',
                'conversation_id' => $event['conversation_id'] ?? null,
                'visitor_id' => $event['visitor_id'] ?? null,
                'trigger' => $event['trigger'] ?? 'handover',
                'label' => $event['label'] ?? 'Human handover',
                'priority' => $event['priority'] ?? 'normal',
                'visitor_message' => $event['visitor_message'] ?? null,
                'status' => $event['status'] ?? 'pending',
                'read' => false,
                'created_at' => gmdate('c'),
            ];
            $this->records[] = $notification;
            $this->persistUnlocked();
            return $notification;
        });
    }

    /**
     * @return list<array<string, mixed>>
     */
    public function listUnread(int $limit = 50): array
    {
        $this->reloadFromDisk();
        $unread = array_values(array_filter(
            $this->records,
            static fn (array $n): bool => ($n['read'] ?? false) !== true
        ));
        usort(
            $unread,
            static fn (array $a, array $b): int => strcmp((string) ($b['created_at'] ?? ''), (string) ($a['created_at'] ?? ''))
        );
        return array_slice($unread, 0, $limit);
    }

    /**
     * @return list<array<string, mixed>>
     */
    public function listAll(int $limit = 50): array
    {
        $this->reloadFromDisk();
        $all = $this->records;
        usort(
            $all,
            static fn (array $a, array $b): int => strcmp((string) ($b['created_at'] ?? ''), (string) ($a['created_at'] ?? ''))
        );
        return array_slice($all, 0, $limit);
    }

    public function markRead(string $id): bool
    {
        return $this->withLock(function () use ($id): bool {
            $this->records = $this->loadUnlocked();
            foreach ($this->records as $i => $n) {
                if (($n['id'] ?? null) === $id) {
                    $this->records[$i]['read'] = true;
                    $this->persistUnlocked();
                    return true;
                }
            }
            return false;
        });
    }

    public function markAllRead(): int
    {
        return $this->withLock(function (): int {
            $this->records = $this->loadUnlocked();
            $count = 0;
            foreach ($this->records as $i => $n) {
                if (($n['read'] ?? false) === true) {
                    continue;
                }
                $this->records[$i]['read'] = true;
                $count++;
            }
            if ($count > 0) {
                $this->persistUnlocked();
            }
            return $count;
        });
    }
}

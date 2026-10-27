<?php

declare(strict_types=1);

namespace RankRise\Api\Services;

/**
 * JSON conversation store (mirrors backend/chat/ConversationStore.js).
 * Intentional file persistence for Hostinger shared hosting (not MySQL).
 */
final class ConversationStore
{
    private string $filePath;
    private string $lockPath;

    /** @var list<array<string, mixed>> */
    private array $records;

    public function __construct(string $dataDir)
    {
        $this->ensureDataDir($dataDir);
        $this->filePath = rtrim($dataDir, '/\\') . '/chat-conversations.json';
        $this->lockPath = $this->filePath . '.lock';
        $this->records = $this->withLock(fn (): array => $this->loadUnlocked());
    }

    private function ensureDataDir(string $dataDir): void
    {
        if (!is_dir($dataDir)) {
            if (!@mkdir($dataDir, 0755, true) && !is_dir($dataDir)) {
                throw new \RuntimeException('Chat storage directory could not be created.');
            }
        }
        if (!is_writable($dataDir)) {
            throw new \RuntimeException('Chat storage directory is not writable.');
        }
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
            throw new \RuntimeException('Chat storage lock could not be opened.');
        }
        try {
            if (!flock($lock, LOCK_EX)) {
                throw new \RuntimeException('Chat storage lock could not be acquired.');
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
        if ($raw === false) {
            return [];
        }
        if (trim($raw) === '') {
            return [];
        }
        try {
            /** @var mixed $parsed */
            $parsed = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            $backup = $this->filePath . '.corrupt.' . date('YmdHis');
            @copy($this->filePath, $backup);
            return [];
        }
        if (!is_array($parsed)) {
            $backup = $this->filePath . '.corrupt.' . date('YmdHis');
            @copy($this->filePath, $backup);
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
            throw new \RuntimeException('Chat conversations could not be encoded.');
        }
        if (file_put_contents($tmp, $json, LOCK_EX) === false) {
            throw new \RuntimeException('Chat conversations temp write failed.');
        }
        if (!@rename($tmp, $this->filePath)) {
            @unlink($tmp);
            throw new \RuntimeException('Chat conversations atomic rename failed.');
        }
    }

    private function persist(): void
    {
        $this->withLock(function (): void {
            $this->persistUnlocked();
        });
    }

    /**
     * @return array<string, mixed>
     */
    public function getOrCreate(string $visitorId): array
    {
        return $this->withLock(function () use ($visitorId): array {
            $this->records = $this->loadUnlocked();
            foreach ($this->records as $item) {
                $vid = $item['visitor']['id'] ?? null;
                $status = $item['status'] ?? 'open';
                if ($vid === $visitorId && $status !== 'closed') {
                    return $item;
                }
            }

            $now = (int) round(microtime(true) * 1000);
            $conversation = [
                'id' => rankrise_uuid(),
                'visitor' => [
                    'id' => $visitorId,
                    'name' => 'Visitor ' . substr($visitorId, -6),
                    'firstSeenAt' => $now,
                    'lastSeenAt' => $now,
                ],
                'status' => 'open',
                'mode' => 'ai',
                'unreadCount' => 0,
                'lastMessageAt' => $now,
                'messages' => [],
                'assignedAgentId' => null,
            ];
            $this->records[] = $conversation;
            $this->persistUnlocked();
            return $conversation;
        });
    }

    /**
     * @param array<string, mixed> $message
     * @return array<string, mixed>
     */
    public function addMessage(string $visitorId, array $message, bool $unread = false): array
    {
        return $this->withLock(function () use ($visitorId, $message, $unread): array {
            $this->records = $this->loadUnlocked();
            $conversation = null;
            foreach ($this->records as $item) {
                $vid = $item['visitor']['id'] ?? null;
                $status = $item['status'] ?? 'open';
                if ($vid === $visitorId && $status !== 'closed') {
                    $conversation = $item;
                    break;
                }
            }
            if ($conversation === null) {
                $now = (int) round(microtime(true) * 1000);
                $conversation = [
                    'id' => rankrise_uuid(),
                    'visitor' => [
                        'id' => $visitorId,
                        'name' => 'Visitor ' . substr($visitorId, -6),
                        'firstSeenAt' => $now,
                        'lastSeenAt' => $now,
                    ],
                    'status' => 'open',
                    'mode' => 'ai',
                    'unreadCount' => 0,
                    'lastMessageAt' => $now,
                    'messages' => [],
                    'assignedAgentId' => null,
                ];
                $this->records[] = $conversation;
            }

            $id = (string) ($message['id'] ?? '');
            $exists = false;
            foreach ($conversation['messages'] as $existing) {
                if (($existing['id'] ?? null) === $id) {
                    $exists = true;
                    break;
                }
            }

            if (!$exists) {
                $conversation['messages'][] = $message;
                $conversation['lastMessageAt'] = (int) ($message['timestamp'] ?? (int) round(microtime(true) * 1000));
                $conversation['visitor']['lastSeenAt'] = $conversation['lastMessageAt'];
                if ($unread) {
                    $conversation['unreadCount'] = (int) ($conversation['unreadCount'] ?? 0) + 1;
                }
                $this->replaceUnlocked($conversation);
            }

            return $this->clone($conversation);
        });
    }

    /**
     * @return array<string, mixed>
     */
    public function setStatus(string $visitorId, string $status): array
    {
        $conversation = $this->getOrCreate($visitorId);
        $conversation['status'] = $status;
        $this->replace($conversation);
        return $this->clone($conversation);
    }

    /**
     * @return array<string, mixed>
     */
    public function assign(string $visitorId, string $agentId): array
    {
        return $this->assignAgent($visitorId, $agentId, true);
    }

    /**
     * Assign an agent. When $forceOpen is true (default), status becomes open
     * — matching Node ConversationStore.assign().
     *
     * @return array<string, mixed>
     */
    public function assignAgent(string $visitorId, string $agentId, bool $forceOpen = true): array
    {
        $conversation = $this->getOrCreate($visitorId);
        $conversation['assignedAgentId'] = $agentId;
        $conversation['mode'] = 'human';
        if ($forceOpen) {
            $conversation['status'] = 'open';
        }
        $this->replace($conversation);
        return $this->clone($conversation);
    }

    /**
     * Switch conversation between AI and human takeover modes.
     *
     * @return array<string, mixed>
     */
    public function setMode(string $visitorId, string $mode): array
    {
        $mode = strtolower(trim($mode)) === 'human' ? 'human' : 'ai';
        $conversation = $this->getOrCreate($visitorId);
        $conversation['mode'] = $mode;
        $this->replace($conversation);
        return $this->clone($conversation);
    }

    /**
     * Set status by conversation id (works for closed threads too).
     *
     * @return array<string, mixed>|null
     */
    public function setStatusById(string $conversationId, string $status): ?array
    {
        return $this->withLock(function () use ($conversationId, $status): ?array {
            $this->records = $this->loadUnlocked();
            foreach ($this->records as $i => $item) {
                if (($item['id'] ?? null) !== $conversationId) {
                    continue;
                }
                $this->records[$i]['status'] = $status;
                $this->persistUnlocked();
                return $this->clone($this->records[$i]);
            }
            return null;
        });
    }

    /**
     * Assign by conversation id.
     *
     * @return array<string, mixed>|null
     */
    public function assignById(string $conversationId, string $agentId, bool $forceOpen = true): ?array
    {
        return $this->withLock(function () use ($conversationId, $agentId, $forceOpen): ?array {
            $this->records = $this->loadUnlocked();
            foreach ($this->records as $i => $item) {
                if (($item['id'] ?? null) !== $conversationId) {
                    continue;
                }
                $this->records[$i]['assignedAgentId'] = $agentId;
                $this->records[$i]['mode'] = 'human';
                if ($forceOpen) {
                    $this->records[$i]['status'] = 'open';
                }
                $this->persistUnlocked();
                return $this->clone($this->records[$i]);
            }
            return null;
        });
    }

    /**
     * Merge visitor metadata (IP, UA, page, etc.) into the active conversation.
     *
     * @param array<string, mixed> $meta
     * @return array<string, mixed>|null
     */
    public function updateVisitorMeta(string $visitorId, array $meta): ?array
    {
        return $this->withLock(function () use ($visitorId, $meta): ?array {
            $this->records = $this->loadUnlocked();
            foreach ($this->records as $i => $item) {
                $vid = $item['visitor']['id'] ?? null;
                $status = $item['status'] ?? 'open';
                if ($vid !== $visitorId || $status === 'closed') {
                    continue;
                }
                $visitor = is_array($item['visitor'] ?? null) ? $item['visitor'] : [];
                foreach ($meta as $key => $value) {
                    if (!is_string($key) || $key === 'id') {
                        continue;
                    }
                    if ($value === null || $value === '') {
                        continue;
                    }
                    // Don't overwrite a custom display name with empty/generic
                    if ($key === 'name' && is_string($value) && $value !== '') {
                        $visitor['name'] = $value;
                        continue;
                    }
                    $visitor[$key] = $value;
                }
                $visitor['lastSeenAt'] = (int) round(microtime(true) * 1000);
                $this->records[$i]['visitor'] = $visitor;
                $this->persistUnlocked();
                return $this->clone($this->records[$i]);
            }
            return null;
        });
    }

    /**
     * Mark messages from $author as seen (read receipts).
     *
     * @return array<string, mixed>|null
     */
    public function markMessagesSeen(string $conversationId, string $author): ?array
    {
        return $this->withLock(function () use ($conversationId, $author): ?array {
            $this->records = $this->loadUnlocked();
            $now = (int) round(microtime(true) * 1000);
            foreach ($this->records as $i => $item) {
                if (($item['id'] ?? null) !== $conversationId) {
                    continue;
                }
                $changed = false;
                $messages = is_array($item['messages'] ?? null) ? $item['messages'] : [];
                foreach ($messages as $j => $msg) {
                    if (!is_array($msg)) {
                        continue;
                    }
                    if (($msg['author'] ?? '') !== $author) {
                        continue;
                    }
                    if (!empty($msg['seenAt'])) {
                        continue;
                    }
                    $messages[$j]['seenAt'] = $now;
                    $messages[$j]['status'] = 'seen';
                    $changed = true;
                }
                if ($changed) {
                    $this->records[$i]['messages'] = $messages;
                    if ($author === 'visitor') {
                        $this->records[$i]['unreadCount'] = 0;
                    }
                    $this->persistUnlocked();
                }
                return $this->clone($this->records[$i]);
            }
            return null;
        });
    }

    /**
     * Touch visitor lastSeenAt without creating a message.
     *
     * @return array<string, mixed>|null
     */
    public function touchVisitor(string $visitorId): ?array
    {
        return $this->withLock(function () use ($visitorId): ?array {
            $this->records = $this->loadUnlocked();
            $now = (int) round(microtime(true) * 1000);
            foreach ($this->records as $i => $item) {
                $vid = $item['visitor']['id'] ?? null;
                $status = $item['status'] ?? 'open';
                if ($vid !== $visitorId || $status === 'closed') {
                    continue;
                }
                $this->records[$i]['visitor']['lastSeenAt'] = $now;
                $this->persistUnlocked();
                return $this->clone($this->records[$i]);
            }
            return null;
        });
    }

    /**
     * Export transcript as plain text lines.
     */
    public function exportTranscript(string $conversationId): ?string
    {
        $c = $this->findById($conversationId);
        if ($c === null) {
            return null;
        }
        $visitor = is_array($c['visitor'] ?? null) ? $c['visitor'] : [];
        $lines = [];
        $lines[] = 'RankRise USA Chat Export';
        $lines[] = 'Conversation: ' . ($c['id'] ?? '');
        $lines[] = 'Visitor: ' . ($visitor['name'] ?? '') . ' (' . ($visitor['id'] ?? '') . ')';
        $lines[] = 'Status: ' . ($c['status'] ?? '');
        $lines[] = 'Assigned: ' . (($c['assignedAgentId'] ?? '') ?: 'unassigned');
        if (!empty($visitor['ip'])) {
            $lines[] = 'IP: ' . $visitor['ip'];
        }
        if (!empty($visitor['browser']) || !empty($visitor['device'])) {
            $lines[] = 'Client: ' . trim(($visitor['browser'] ?? '') . ' / ' . ($visitor['device'] ?? '') . ' / ' . ($visitor['os'] ?? ''));
        }
        $lines[] = str_repeat('-', 40);
        foreach ($c['messages'] ?? [] as $m) {
            if (!is_array($m)) {
                continue;
            }
            $ts = (int) ($m['timestamp'] ?? 0);
            $when = $ts > 0 ? gmdate('Y-m-d H:i:s', (int) floor($ts / 1000)) . ' UTC' : '';
            $who = (($m['author'] ?? '') === 'visitor') ? 'Visitor' : 'Agent';
            $seen = !empty($m['seenAt']) ? ' [seen]' : '';
            $lines[] = '[' . $when . '] ' . $who . $seen . ': ' . (string) ($m['content'] ?? '');
        }
        return implode("\n", $lines) . "\n";
    }

    public function markRead(string $conversationId): ?array
    {
        return $this->withLock(function () use ($conversationId): ?array {
            $this->records = $this->loadUnlocked();
            $now = (int) round(microtime(true) * 1000);
            foreach ($this->records as $i => $item) {
                if (($item['id'] ?? null) !== $conversationId) {
                    continue;
                }
                $messages = is_array($item['messages'] ?? null) ? $item['messages'] : [];
                foreach ($messages as $j => $msg) {
                    if (!is_array($msg)) {
                        continue;
                    }
                    if (($msg['author'] ?? '') !== 'visitor') {
                        continue;
                    }
                    if (!empty($msg['seenAt'])) {
                        continue;
                    }
                    $messages[$j]['seenAt'] = $now;
                    $messages[$j]['status'] = 'seen';
                }
                $this->records[$i]['messages'] = $messages;
                $this->records[$i]['unreadCount'] = 0;
                $this->persistUnlocked();
                return $this->clone($this->records[$i]);
            }
            return null;
        });
    }

    /**
     * Reload from disk so PHP-FPM/LiteSpeed static singletons see writes from other workers.
     */
    private function reloadFromDisk(): void
    {
        $this->records = $this->withLock(fn (): array => $this->loadUnlocked());
    }

    /**
     * @return array<string, mixed>|null
     */
    public function findById(string $conversationId): ?array
    {
        $this->reloadFromDisk();
        foreach ($this->records as $item) {
            if (($item['id'] ?? null) === $conversationId) {
                return $this->clone($item);
            }
        }
        return null;
    }

    /**
     * @return array<string, mixed>|null
     */
    public function findActiveByVisitor(string $visitorId): ?array
    {
        $this->reloadFromDisk();
        foreach ($this->records as $item) {
            $vid = $item['visitor']['id'] ?? null;
            $status = $item['status'] ?? 'open';
            if ($vid === $visitorId && $status !== 'closed') {
                return $this->clone($item);
            }
        }
        return null;
    }

    /**
     * @return list<array<string, mixed>>
     */
    public function list(): array
    {
        $this->reloadFromDisk();
        $items = array_map(fn (array $item): array => $this->clone($item), $this->records);
        usort(
            $items,
            static fn (array $a, array $b): int => ((int) ($b['lastMessageAt'] ?? 0)) <=> ((int) ($a['lastMessageAt'] ?? 0))
        );
        return $items;
    }

    /**
     * Messages newer than $since (exclusive) for a visitor.
     *
     * @return list<array<string, mixed>>
     */
    public function messagesSince(string $visitorId, int $since): array
    {
        $conversation = $this->findActiveByVisitor($visitorId);
        if ($conversation === null) {
            return [];
        }
        $out = [];
        foreach ($conversation['messages'] as $message) {
            if (!is_array($message)) {
                continue;
            }
            $ts = (int) ($message['timestamp'] ?? 0);
            if ($ts > $since) {
                $out[] = $message;
            }
        }
        return $out;
    }

    /**
     * @param array<string, mixed> $conversation
     */
    private function replace(array $conversation): void
    {
        $this->withLock(function () use ($conversation): void {
            $this->records = $this->loadUnlocked();
            $this->replaceUnlocked($conversation);
        });
    }

    /**
     * @param array<string, mixed> $conversation
     */
    private function replaceUnlocked(array $conversation): void
    {
        foreach ($this->records as $i => $item) {
            if (($item['id'] ?? null) === ($conversation['id'] ?? null)) {
                $this->records[$i] = $conversation;
                $this->persistUnlocked();
                return;
            }
        }
        $this->records[] = $conversation;
        $this->persistUnlocked();
    }

    /**
     * @param array<string, mixed> $value
     * @return array<string, mixed>
     */
    private function clone(array $value): array
    {
        /** @var array<string, mixed> $copy */
        $copy = json_decode(json_encode($value), true);
        return is_array($copy) ? $copy : $value;
    }
}

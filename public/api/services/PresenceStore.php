<?php

declare(strict_types=1);

namespace RankRise\Api\Services;

/**
 * Ephemeral typing + admin presence for AJAX polling (replaces WebSocket presence).
 */
final class PresenceStore
{
    private string $filePath;

    public function __construct(string $dataDir)
    {
        if (!is_dir($dataDir)) {
            if (!@mkdir($dataDir, 0755, true) && !is_dir($dataDir)) {
                throw new \RuntimeException('Presence storage directory could not be created.');
            }
        }
        if (!is_writable($dataDir)) {
            throw new \RuntimeException('Presence storage directory is not writable.');
        }
        $this->filePath = rtrim($dataDir, '/\\') . '/presence.json';
    }

    /**
     * @return array{agents: array<string, int>, visitors: array<string, int>, typing: array<string, array{author: string, expiresAt: int}>}
     */
    private function load(): array
    {
        if (!is_file($this->filePath)) {
            return ['agents' => [], 'visitors' => [], 'typing' => []];
        }
        $raw = file_get_contents($this->filePath);
        if ($raw === false || trim($raw) === '') {
            return ['agents' => [], 'visitors' => [], 'typing' => []];
        }
        try {
            /** @var mixed $parsed */
            $parsed = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            @copy($this->filePath, $this->filePath . '.corrupt.' . date('YmdHis'));
            return ['agents' => [], 'visitors' => [], 'typing' => []];
        }
        if (!is_array($parsed)) {
            @copy($this->filePath, $this->filePath . '.corrupt.' . date('YmdHis'));
            return ['agents' => [], 'visitors' => [], 'typing' => []];
        }
        return [
            'agents' => is_array($parsed['agents'] ?? null) ? $parsed['agents'] : [],
            'visitors' => is_array($parsed['visitors'] ?? null) ? $parsed['visitors'] : [],
            'typing' => is_array($parsed['typing'] ?? null) ? $parsed['typing'] : [],
        ];
    }

    /**
     * @param array{agents: array<string, int>, visitors: array<string, int>, typing: array<string, array{author: string, expiresAt: int}>} $data
     */
    private function save(array $data): void
    {
        $tmp = $this->filePath . '.tmp';
        $json = json_encode($data, JSON_UNESCAPED_SLASHES);
        if ($json === false) {
            throw new \RuntimeException('Presence data could not be encoded.');
        }
        if (file_put_contents($tmp, $json, LOCK_EX) === false) {
            throw new \RuntimeException('Presence temp write failed.');
        }
        if (!@rename($tmp, $this->filePath)) {
            @unlink($tmp);
            throw new \RuntimeException('Presence atomic rename failed.');
        }
    }

    public function heartbeat(string $adminId, int $ttlSeconds = 30): void
    {
        $data = $this->load();
        $now = time();
        $data['agents'][$adminId] = $now + $ttlSeconds;
        foreach ($data['agents'] as $id => $expires) {
            if ((int) $expires < $now) {
                unset($data['agents'][$id]);
            }
        }
        foreach ($data['visitors'] as $id => $expires) {
            if ((int) $expires < $now) {
                unset($data['visitors'][$id]);
            }
        }
        $this->save($data);
    }

    public function visitorHeartbeat(string $visitorId, int $ttlSeconds = 45): void
    {
        if ($visitorId === '') {
            return;
        }
        $data = $this->load();
        $now = time();
        $data['visitors'][$visitorId] = $now + $ttlSeconds;
        foreach ($data['visitors'] as $id => $expires) {
            if ((int) $expires < $now) {
                unset($data['visitors'][$id]);
            }
        }
        $this->save($data);
    }

    /**
     * @return list<string>
     */
    public function liveVisitorIds(int $ttlSeconds = 45): array
    {
        $data = $this->load();
        $now = time();
        $out = [];
        $dirty = false;
        foreach ($data['visitors'] as $id => $expires) {
            if ((int) $expires >= $now) {
                $out[] = (string) $id;
            } else {
                unset($data['visitors'][$id]);
                $dirty = true;
            }
        }
        if ($dirty) {
            $this->save($data);
        }
        return $out;
    }

    public function isVisitorOnline(string $visitorId, int $ttlSeconds = 45): bool
    {
        return in_array($visitorId, $this->liveVisitorIds($ttlSeconds), true);
    }

    /**
     * @return list<string>
     */
    public function onlineAgentIds(int $ttlSeconds = 30): array
    {
        $data = $this->load();
        $now = time();
        $out = [];
        foreach ($data['agents'] as $id => $expires) {
            if ((int) $expires >= $now) {
                $out[] = (string) $id;
            }
        }
        return $out;
    }

    public function agentsOnline(int $ttlSeconds = 30): int
    {
        $data = $this->load();
        $now = time();
        $count = 0;
        foreach ($data['agents'] as $id => $expires) {
            if ((int) $expires >= $now) {
                $count++;
            } else {
                unset($data['agents'][$id]);
            }
        }
        $this->save($data);
        return $count;
    }

    public function setTyping(string $conversationKey, string $author, bool $isTyping, int $ttlSeconds = 5): void
    {
        $data = $this->load();
        $now = time();
        $key = $conversationKey . ':' . $author;
        if ($isTyping) {
            $data['typing'][$key] = [
                'author' => $author,
                'expiresAt' => $now + $ttlSeconds,
                'conversationKey' => $conversationKey,
            ];
        } else {
            unset($data['typing'][$key]);
        }
        foreach ($data['typing'] as $k => $row) {
            if ((int) ($row['expiresAt'] ?? 0) < $now) {
                unset($data['typing'][$k]);
            }
        }
        $this->save($data);
    }

    /**
     * @return array{author: string, isTyping: bool}|null
     */
    public function getTypingForVisitor(string $visitorId): ?array
    {
        $data = $this->load();
        $now = time();
        $key = $visitorId . ':agent';
        $row = $data['typing'][$key] ?? null;
        if (!is_array($row) || (int) ($row['expiresAt'] ?? 0) < $now) {
            return null;
        }
        return [
            'author' => 'agent',
            'isTyping' => true,
            'visitorId' => $visitorId,
        ];
    }

    /**
     * @return list<array{author: string, isTyping: bool, visitorId: string}>
     */
    public function listTyping(): array
    {
        $data = $this->load();
        $now = time();
        $out = [];
        foreach ($data['typing'] as $row) {
            if (!is_array($row) || (int) ($row['expiresAt'] ?? 0) < $now) {
                continue;
            }
            $author = (string) ($row['author'] ?? '');
            $ck = (string) ($row['conversationKey'] ?? '');
            if ($author === '' || $ck === '') {
                continue;
            }
            $out[] = [
                'author' => $author,
                'isTyping' => true,
                'visitorId' => $ck,
            ];
        }
        return $out;
    }
}

<?php

declare(strict_types=1);

namespace RankRise\Api\Services;

require_once __DIR__ . '/ChatRuntime.php';

/**
 * Phase 6 — Admin conversation / notification / assignment management.
 * Stateless request handlers for Hostinger shared hosting (no sockets).
 */
final class AdminChatService
{
    private ChatRuntime $runtime;

    public function __construct(?ChatRuntime $runtime = null)
    {
        $this->runtime = $runtime ?? new ChatRuntime();
    }

    public function runtime(): ChatRuntime
    {
        return $this->runtime;
    }

    /**
     * @param array{status?: string, unread?: bool, assigned?: string, search?: string, limit?: int} $filters
     * @return list<array<string, mixed>>
     */
    public function listConversations(array $filters = []): array
    {
        $items = $this->runtime->store()->list();
        $status = isset($filters['status']) ? trim((string) $filters['status']) : '';
        $unreadOnly = ($filters['unread'] ?? false) === true || ($filters['unread'] ?? '') === '1';
        $assigned = isset($filters['assigned']) ? trim((string) $filters['assigned']) : '';
        $search = isset($filters['search']) ? strtolower(trim((string) $filters['search'])) : '';
        $limit = isset($filters['limit']) ? max(1, (int) $filters['limit']) : 500;

        $out = [];
        foreach ($items as $item) {
            if ($status !== '' && $status !== 'all' && ($item['status'] ?? '') !== $status) {
                continue;
            }
            if ($unreadOnly && (int) ($item['unreadCount'] ?? 0) <= 0) {
                continue;
            }
            if ($assigned !== '') {
                $agent = (string) ($item['assignedAgentId'] ?? '');
                if ($assigned === 'unassigned') {
                    if ($agent !== '') {
                        continue;
                    }
                } elseif ($agent !== $assigned) {
                    continue;
                }
            }
            if ($search !== '' && !$this->matchesSearch($item, $search)) {
                continue;
            }
            $out[] = $item;
        }

        return array_slice($out, 0, $limit);
    }

    /**
     * @return array<string, mixed>|null
     */
    public function getConversation(string $conversationId): ?array
    {
        return $this->runtime->store()->findById($conversationId);
    }

    /**
     * Update status and/or assignment (mirrors Node conversation:update).
     *
     * @return array<string, mixed>|null
     */
    public function updateConversation(
        string $conversationId,
        ?string $status = null,
        ?string $agentId = null
    ): ?array {
        $allowed = ['open', 'pending', 'closed'];
        if ($status !== null && $status !== '' && !in_array($status, $allowed, true)) {
            return null;
        }

        $conversation = $this->runtime->store()->findById($conversationId);
        if ($conversation === null) {
            return null;
        }

        if ($agentId !== null && $agentId !== '') {
            $forceOpen = ($status === null || $status === '');
            $conversation = $this->runtime->store()->assignById($conversationId, $agentId, $forceOpen);
            if ($conversation === null) {
                return null;
            }
        }

        if ($status !== null && $status !== '') {
            return $this->runtime->store()->setStatusById($conversationId, $status);
        }

        return $this->runtime->store()->findById($conversationId);
    }

    /**
     * @return array<string, mixed>|null
     */
    public function assign(string $conversationId, string $agentId): ?array
    {
        return $this->updateConversation($conversationId, null, $agentId);
    }

    /**
     * @return array<string, mixed>|null
     */
    public function setStatus(string $conversationId, string $status): ?array
    {
        return $this->updateConversation($conversationId, $status, null);
    }

    /**
     * @return array<string, mixed>|null
     */
    public function markRead(string $conversationId): ?array
    {
        return $this->runtime->store()->markRead($conversationId);
    }

    /**
     * @return list<array<string, mixed>>
     */
    public function listNotifications(bool $unreadOnly = true, int $limit = 50): array
    {
        if ($unreadOnly) {
            return $this->runtime->notifications()->listUnread($limit);
        }
        return $this->runtime->notifications()->listAll($limit);
    }

    public function markNotificationRead(string $id): bool
    {
        return $this->runtime->notifications()->markRead($id);
    }

    public function markAllNotificationsRead(): int
    {
        return $this->runtime->notifications()->markAllRead();
    }

    /**
     * Admin poll payload: conversations + notifications + presence.
     *
     * @return array<string, mixed>
     */
    public function pollSnapshot(string $adminId = 'dashboard', int $presenceTtl = 30): array
    {
        $this->runtime->presence()->heartbeat($adminId, $presenceTtl);
        $liveIds = $this->runtime->presence()->liveVisitorIds(max(45, $presenceTtl));
        $conversations = $this->listConversations();

        // Annotate online status on each conversation visitor
        $liveMap = array_fill_keys($liveIds, true);
        foreach ($conversations as &$c) {
            $vid = (string) (($c['visitor']['id'] ?? '') ?: '');
            $c['visitorOnline'] = $vid !== '' && isset($liveMap[$vid]);
        }
        unset($c);

        $liveVisitors = [];
        foreach ($conversations as $c) {
            $vid = (string) (($c['visitor']['id'] ?? '') ?: '');
            if ($vid !== '' && isset($liveMap[$vid])) {
                $liveVisitors[] = [
                    'visitorId' => $vid,
                    'name' => $c['visitor']['name'] ?? ('Visitor ' . substr($vid, -6)),
                    'conversationId' => $c['id'] ?? null,
                    'currentPage' => $c['visitor']['currentPage'] ?? null,
                    'lastSeenAt' => $c['visitor']['lastSeenAt'] ?? null,
                    'unreadCount' => $c['unreadCount'] ?? 0,
                    'status' => $c['status'] ?? 'open',
                ];
            }
        }

        return [
            'conversations' => $conversations,
            'notifications' => $this->listNotifications(true, 50),
            'presence' => [
                'agentsOnline' => $this->runtime->presence()->agentsOnline($presenceTtl),
                'agentIds' => $this->runtime->presence()->onlineAgentIds($presenceTtl),
                'liveVisitors' => count($liveIds),
            ],
            'liveVisitors' => $liveVisitors,
            'typing' => $this->runtime->presence()->listTyping(),
            'serverTime' => (int) round(microtime(true) * 1000),
        ];
    }

    public function exportConversation(string $conversationId): ?string
    {
        return $this->runtime->store()->exportTranscript($conversationId);
    }

    /**
     * @param array<string, mixed> $item
     */
    private function matchesSearch(array $item, string $search): bool
    {
        $visitor = is_array($item['visitor'] ?? null) ? $item['visitor'] : [];
        $hay = strtolower(
            (string) ($visitor['name'] ?? '') . ' ' .
            (string) ($visitor['email'] ?? '') . ' ' .
            (string) ($visitor['id'] ?? '')
        );
        if (str_contains($hay, $search)) {
            return true;
        }
        foreach ($item['messages'] ?? [] as $m) {
            if (!is_array($m)) {
                continue;
            }
            if (str_contains(strtolower((string) ($m['content'] ?? '')), $search)) {
                return true;
            }
        }
        return false;
    }
}

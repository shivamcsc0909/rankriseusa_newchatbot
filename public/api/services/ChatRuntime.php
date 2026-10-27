<?php

declare(strict_types=1);

namespace RankRise\Api\Services;

use RankRise\Api\Lib\Env;

require_once __DIR__ . '/AiWorkflow.php';
require_once __DIR__ . '/ConversationStore.php';
require_once __DIR__ . '/NotificationStore.php';
require_once __DIR__ . '/PresenceStore.php';
require_once __DIR__ . '/ChatSanitize.php';

/**
 * Chat runtime for AJAX polling (mirrors backend/chat/ChatRuntime.js).
 * Uses PHP AiWorkflow instead of Node; JSON file persistence.
 */
final class ChatRuntime
{
    private ConversationStore $store;
    private NotificationStore $notifications;
    private PresenceStore $presence;
    private AiWorkflow $workflow;

    /** @var array<string, mixed> */
    private array $spamRules;

    public function __construct(?string $dataDir = null)
    {
        $fromEnv = Env::get('CHAT_DATA_DIR');
        $dir = $dataDir
            ?? (($fromEnv !== null && $fromEnv !== '') ? $fromEnv : null)
            ?? (dirname(__DIR__) . '/storage/chat');

        if (!is_dir($dir)) {
            if (!@mkdir($dir, 0755, true) && !is_dir($dir)) {
                throw new \RuntimeException('Chat data directory could not be created.');
            }
        }
        if (!is_writable($dir)) {
            throw new \RuntimeException('Chat data directory is not writable.');
        }

        $this->store = new ConversationStore($dir);
        $this->notifications = new NotificationStore($dir);
        $this->presence = new PresenceStore($dir);
        $this->workflow = new AiWorkflow();
        $this->spamRules = [
            'maxUrlCount' => 5,
            'maxRepeatedCharRun' => 12,
            'blockedPatterns' => ['viagra', 'casino bonus', 'crypto giveaway'],
        ];
    }

    public function store(): ConversationStore
    {
        return $this->store;
    }

    public function notifications(): NotificationStore
    {
        return $this->notifications;
    }

    public function presence(): PresenceStore
    {
        return $this->presence;
    }

    /**
     * @param array<string, mixed> $payload
     * @return array<string, mixed>
     */
    public function receiveVisitorMessage(array $payload): array
    {
        $visitorId = trim((string) ($payload['visitorId'] ?? ''));
        $content = ChatSanitize::stripXss(ChatSanitize::sanitizeString((string) ($payload['content'] ?? '')));

        if ($visitorId === '' || $content === '') {
            return ['ok' => false, 'error' => ['code' => 'invalid_message', 'message' => 'Message is invalid.']];
        }

        $spam = ChatSanitize::detectSpam($content, $this->spamRules);
        if ($spam['spam'] === true) {
            return ['ok' => false, 'error' => ['code' => 'spam_detected', 'message' => 'Message rejected.']];
        }

        $visitorMessage = [
            'id' => (string) ($payload['id'] ?? rankrise_uuid()),
            'author' => 'visitor',
            'content' => $content,
            'timestamp' => (int) ($payload['timestamp'] ?? (int) round(microtime(true) * 1000)),
            'visitorId' => $visitorId,
            'status' => 'sent',
        ];

        $conversation = $this->store->addMessage($visitorId, $visitorMessage, true);
        $this->presence->visitorHeartbeat($visitorId);
        $agentsOnline = $this->presence->agentsOnline();

        // Presence = admin AVAILABLE. It does NOT disable the bot.
        // Bot is suppressed only after explicit human takeover.
        if ($this->isHumanTakeover($conversation)) {
            $this->notifications->notify([
                'conversation_id' => $conversation['id'] ?? null,
                'visitor_id' => $visitorId,
                'trigger' => 'visitor_message_human_mode',
                'label' => 'Visitor message (human takeover)',
                'priority' => 'high',
                'visitor_message' => $content,
                'status' => (string) ($conversation['status'] ?? 'open'),
            ]);

            return [
                'ok' => true,
                'conversation' => $conversation,
                'reply' => null,
                'bot' => false,
                'ai' => null,
                'handover' => null,
                'agentsOnline' => $agentsOnline,
                'mode' => 'human',
            ];
        }

        // AI mode: Knowledge Engine ALWAYS runs first (even when agentsOnline > 0).
        $history = [];
        $messages = is_array($conversation['messages'] ?? null) ? $conversation['messages'] : [];
        $prior = array_slice($messages, 0, -1);
        foreach ($prior as $m) {
            if (!is_array($m)) {
                continue;
            }
            $history[] = [
                'author' => (($m['author'] ?? '') === 'visitor') ? 'visitor' : 'agent',
                'content' => (string) ($m['content'] ?? ''),
            ];
        }

        $aiResult = $this->workflow->processVisitorMessage([
            'visitorId' => $visitorId,
            'message' => $content,
            'history' => $history,
            'promptHint' => null,
        ]);

        $isHandover = ($aiResult['type'] ?? '') === 'handover';
        $handoverReason = (string) ($aiResult['reason'] ?? '');
        $explicitHuman = in_array($handoverReason, ['visitor_requested_human', 'escalation_topic'], true);

        if ($explicitHuman) {
            // Visitor asked for a human → lock conversation into human mode.
            $conversation = $this->store->setMode($visitorId, 'human');
            $conversation = $this->store->setStatus($visitorId, 'pending');
            $this->notifications->notify([
                'conversation_id' => $conversation['id'] ?? null,
                'visitor_id' => $visitorId,
                'trigger' => $handoverReason,
                'label' => 'Human takeover requested',
                'priority' => 'high',
                'visitor_message' => $content,
                'status' => 'pending',
            ]);
        } elseif ($isHandover) {
            $conversation = $this->store->setStatus($visitorId, 'pending');
            $this->notifications->notify([
                'conversation_id' => $conversation['id'] ?? null,
                'visitor_id' => $visitorId,
                'trigger' => $handoverReason !== '' ? $handoverReason : 'handover',
                'label' => 'Human handover',
                'priority' => 'high',
                'visitor_message' => $content,
                'status' => 'pending',
            ]);
        } elseif ($agentsOnline > 0) {
            // Admin is available — notify, but keep AI mode and still reply.
            $this->notifications->notify([
                'conversation_id' => $conversation['id'] ?? null,
                'visitor_id' => $visitorId,
                'trigger' => 'visitor_message_ai_reply',
                'label' => 'Bot replied (admin available)',
                'priority' => 'normal',
                'visitor_message' => $content,
                'status' => (string) ($conversation['status'] ?? 'open'),
            ]);
        }

        $replyText = trim((string) ($aiResult['message'] ?? ''));
        $reply = null;
        if ($replyText !== '') {
            $reply = $this->reply($visitorId, $replyText);
            $conversation = $this->store->addMessage($visitorId, $reply);
        }

        // Ensure mode stays ai unless explicit human takeover locked it.
        if (!$explicitHuman && (($conversation['mode'] ?? 'ai') !== 'human')) {
            if (!isset($conversation['mode']) || $conversation['mode'] === '') {
                $conversation = $this->store->setMode($visitorId, 'ai');
            }
        }

        return [
            'ok' => true,
            'conversation' => $conversation,
            'reply' => $reply,
            'bot' => true,
            'ai' => $aiResult,
            'handover' => $isHandover
                ? ['handover' => true, 'reason' => $aiResult['reason'] ?? null, 'message' => $aiResult['message'] ?? null]
                : null,
            'agentsOnline' => $agentsOnline,
            'mode' => (string) ($conversation['mode'] ?? ($explicitHuman ? 'human' : 'ai')),
        ];
    }

    /**
     * Human takeover is explicit — never inferred from agentsOnline alone.
     *
     * @param array<string, mixed> $conversation
     */
    private function isHumanTakeover(array $conversation): bool
    {
        $mode = strtolower(trim((string) ($conversation['mode'] ?? 'ai')));
        if ($mode === 'human') {
            return true;
        }
        $assigned = trim((string) ($conversation['assignedAgentId'] ?? $conversation['assignedTo'] ?? ''));
        return $assigned !== '';
    }

    /**
     * @param array<string, mixed> $payload
     * @return array<string, mixed>
     */
    public function receiveAgentMessage(array $payload, string $agentId = 'admin'): array
    {
        $visitorId = trim((string) ($payload['visitorId'] ?? ''));
        $content = ChatSanitize::stripXss(ChatSanitize::sanitizeString((string) ($payload['content'] ?? '')));

        if ($visitorId === '' || $content === '') {
            return ['ok' => false, 'error' => ['code' => 'invalid_message', 'message' => 'Message is invalid.']];
        }

        $message = [
            'id' => (string) ($payload['id'] ?? rankrise_uuid()),
            'author' => 'agent',
            'content' => $content,
            'timestamp' => (int) ($payload['timestamp'] ?? (int) round(microtime(true) * 1000)),
            'visitorId' => $visitorId,
            'agentId' => $agentId,
            'status' => 'sent',
        ];

        // Admin reply / Take Over → human mode (bot suppressed afterwards).
        $this->store->assign($visitorId, $agentId);
        $conversation = $this->store->addMessage($visitorId, $message);

        return [
            'ok' => true,
            'conversation' => $conversation,
            'message' => $message,
        ];
    }

    /**
     * @return array<string, mixed>|null
     */
    public function updateConversation(?string $conversationId, ?string $status, ?string $agentId): ?array
    {
        if ($conversationId === null || $conversationId === '') {
            return null;
        }
        $conversation = $this->store->findById($conversationId);
        if ($conversation === null) {
            return null;
        }
        if ($agentId) {
            $forceOpen = !$status;
            $this->store->assignById($conversationId, $agentId, $forceOpen);
        }
        if ($status) {
            return $this->store->setStatusById($conversationId, $status);
        }
        return $this->store->findById($conversationId);
    }

    /**
     * @return list<array<string, mixed>>
     */
    public function history(string $visitorId): array
    {
        $conversation = $this->store->findActiveByVisitor($visitorId);
        if ($conversation === null) {
            return [];
        }
        /** @var list<array<string, mixed>> $messages */
        $messages = [];
        foreach ($conversation['messages'] as $m) {
            if (is_array($m)) {
                $messages[] = $m;
            }
        }
        return $messages;
    }

    /**
     * @return array{id: string, author: string, content: string, timestamp: int, visitorId: string, status: string}
     */
    private function reply(string $visitorId, string $content): array
    {
        return [
            'id' => rankrise_uuid(),
            'author' => 'agent',
            'content' => $content,
            'timestamp' => (int) round(microtime(true) * 1000),
            'visitorId' => $visitorId,
            'status' => 'sent',
            'source' => 'bot',
        ];
    }
}

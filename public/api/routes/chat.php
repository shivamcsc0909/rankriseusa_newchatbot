<?php

declare(strict_types=1);

/**
 * Phase 5 — AJAX chat polling routes (replaces Node WebSocket transport).
 *
 * @var array{
 *   app: array<string, mixed>,
 *   auth: \RankRise\Api\Lib\Auth,
 *   router: \RankRise\Api\Lib\Router,
 *   logger: \RankRise\Api\Lib\Logger
 * } $rankrise
 */

use RankRise\Api\Lib\AppException;
use RankRise\Api\Lib\Request;
use RankRise\Api\Lib\Response;
use RankRise\Api\Middleware\AuthMiddleware;
use RankRise\Api\Middleware\JsonBodyMiddleware;
use RankRise\Api\Services\ChatRuntime;

$router = $rankrise['router'];
$auth = $rankrise['auth'];
$app = $rankrise['app'];
$logger = $rankrise['logger'];

$runtimeFactory = static function (): ChatRuntime {
    static $runtime = null;
    if (!$runtime instanceof ChatRuntime) {
        $runtime = new ChatRuntime();
    }
    return $runtime;
};

$pollTtl = (int) (($app['poll']['presence_ttl_seconds'] ?? 30));
$typingTtl = (int) (($app['poll']['typing_ttl_seconds'] ?? 5));

// Visitor: ensure session / conversation exists
$router->post(
    '/v1/chat/session',
    static function (Request $request) use ($runtimeFactory): void {
        require_once dirname(__DIR__) . '/services/VisitorMeta.php';
        $body = $request->json();
        $visitorId = trim((string) ($body['visitorId'] ?? $request->queryString('visitorId', '') ?? ''));
        if ($visitorId === '') {
            throw new AppException('visitorId is required.', 422, 'validation_error');
        }
        $runtime = $runtimeFactory();
        $conversation = $runtime->store()->getOrCreate($visitorId);
        $meta = \RankRise\Api\Services\VisitorMeta::collect($request, is_array($body) ? $body : []);
        if ($meta !== []) {
            $updated = $runtime->store()->updateVisitorMeta($visitorId, $meta);
            if ($updated !== null) {
                $conversation = $updated;
            }
        }
        $runtime->presence()->visitorHeartbeat($visitorId);
        Response::ok([
            'visitorId' => $visitorId,
            'conversationId' => $conversation['id'] ?? null,
            'visitor' => $conversation['visitor'] ?? null,
        ]);
    },
    [(new JsonBodyMiddleware())()]
);

// Visitor: history
$router->get('/v1/chat/history', static function (Request $request) use ($runtimeFactory): void {
    $visitorId = trim((string) ($request->queryString('visitorId', '') ?? ''));
    if ($visitorId === '') {
        throw new AppException('visitorId is required.', 422, 'validation_error');
    }
    $runtime = $runtimeFactory();
    Response::ok([
        'messages' => $runtime->history($visitorId),
    ]);
});

// Visitor or agent: send message
$router->post(
    '/v1/chat/message',
    static function (Request $request) use ($runtimeFactory, $auth, $logger): void {
        $body = $request->json();
        $role = (string) ($body['role'] ?? 'visitor');
        $runtime = $runtimeFactory();

        if ($role === 'agent') {
            $auth->assert($request);
            $result = $runtime->receiveAgentMessage($body, (string) ($body['agentId'] ?? 'admin'));
            if (($result['ok'] ?? false) !== true) {
                throw new AppException(
                    (string) ($result['error']['message'] ?? 'Invalid message.'),
                    422,
                    (string) ($result['error']['code'] ?? 'invalid_message')
                );
            }
            $logger->info('chat.agent_message', [
                'visitorId' => $body['visitorId'] ?? null,
            ]);
            Response::ok([
                'message' => $result['message'],
                'conversation' => $result['conversation'],
            ]);
            return;
        }

        $result = $runtime->receiveVisitorMessage($body);
        if (($result['ok'] ?? false) !== true) {
            throw new AppException(
                (string) ($result['error']['message'] ?? 'Invalid message.'),
                422,
                (string) ($result['error']['code'] ?? 'invalid_message')
            );
        }
        $logger->info('chat.visitor_message', [
            'visitorId' => $body['visitorId'] ?? null,
            'handover' => (bool) ($result['handover'] ?? false),
        ]);
        Response::ok([
            'reply' => $result['reply'],
            'conversation' => $result['conversation'],
            'handover' => $result['handover'],
            'bot' => $result['bot'] ?? null,
            'agentsOnline' => $result['agentsOnline'] ?? null,
            'mode' => $result['mode'] ?? ($result['conversation']['mode'] ?? null),
        ]);
    },
    [(new JsonBodyMiddleware())()]
);

// Visitor poll
$router->get('/v1/chat/poll', static function (Request $request) use ($runtimeFactory, $pollTtl): void {
    $visitorId = trim((string) ($request->queryString('visitorId', '') ?? ''));
    if ($visitorId === '') {
        throw new AppException('visitorId is required.', 422, 'validation_error');
    }
    $since = (int) ($request->queryString('since', '0') ?? '0');
    $runtime = $runtimeFactory();
    $runtime->presence()->visitorHeartbeat($visitorId, max(45, $pollTtl));
    $runtime->store()->touchVisitor($visitorId);

    // Visitor saw agent messages → seen receipts for admin
    $active = $runtime->store()->findActiveByVisitor($visitorId);
    if ($active !== null && !empty($active['id'])) {
        $runtime->store()->markMessagesSeen((string) $active['id'], 'agent');
    }

    $messages = $runtime->store()->messagesSince($visitorId, $since);
    $typing = $runtime->presence()->getTypingForVisitor($visitorId);
    $cursor = $since;
    foreach ($messages as $m) {
        $ts = (int) ($m['timestamp'] ?? 0);
        if ($ts > $cursor) {
            $cursor = $ts;
        }
    }
    Response::ok([
        'messages' => $messages,
        'typing' => $typing,
        'presence' => ['agentsOnline' => $runtime->presence()->agentsOnline($pollTtl)],
        'cursor' => $cursor,
        'serverTime' => (int) round(microtime(true) * 1000),
    ]);
});

// Typing indicator
$router->post(
    '/v1/chat/typing',
    static function (Request $request) use ($runtimeFactory, $auth, $typingTtl): void {
        $body = $request->json();
        $author = (string) ($body['author'] ?? 'visitor');
        $isTyping = (bool) ($body['isTyping'] ?? false);
        $visitorId = trim((string) ($body['visitorId'] ?? ''));
        if ($visitorId === '') {
            throw new AppException('visitorId is required.', 422, 'validation_error');
        }
        if ($author === 'agent') {
            $auth->assert($request);
        }
        $runtimeFactory()->presence()->setTyping($visitorId, $author, $isTyping, $typingTtl);
        Response::ok(['ok' => true]);
    },
    [(new JsonBodyMiddleware())()]
);

// Admin presence heartbeat
$router->post(
    '/v1/chat/presence',
    static function (Request $request) use ($runtimeFactory, $pollTtl): void {
        $body = $request->json();
        $adminId = (string) ($body['adminId'] ?? 'dashboard');
        $runtime = $runtimeFactory();
        $runtime->presence()->heartbeat($adminId, $pollTtl);
        Response::ok([
            'agentsOnline' => $runtime->presence()->agentsOnline($pollTtl),
        ]);
    },
    [
        (new JsonBodyMiddleware())(),
        (new AuthMiddleware($auth))(),
    ]
);

// Admin: conversation snapshot
$router->get(
    '/v1/chat/conversations',
    static function (Request $request) use ($runtimeFactory): void {
        Response::ok([
            'conversations' => $runtimeFactory()->store()->list(),
        ]);
    },
    [(new AuthMiddleware($auth))()]
);

// Admin poll (conversations + notifications + presence + typing)
$router->get(
    '/v1/chat/admin/poll',
    static function (Request $request) use ($runtimeFactory, $pollTtl): void {
        $runtime = $runtimeFactory();
        $adminId = (string) ($request->queryString('adminId', 'dashboard') ?? 'dashboard');
        $runtime->presence()->heartbeat($adminId, $pollTtl);

        Response::ok([
            'conversations' => $runtime->store()->list(),
            'notifications' => $runtime->notifications()->listUnread(50),
            'presence' => ['agentsOnline' => $runtime->presence()->agentsOnline($pollTtl)],
            'typing' => $runtime->presence()->listTyping(),
            'serverTime' => (int) round(microtime(true) * 1000),
        ]);
    },
    [(new AuthMiddleware($auth))()]
);

// Admin: mark conversation read
$router->post(
    '/v1/chat/conversation/read',
    static function (Request $request) use ($runtimeFactory): void {
        $body = $request->json();
        $id = (string) ($body['conversationId'] ?? '');
        if ($id === '') {
            throw new AppException('conversationId is required.', 422, 'validation_error');
        }
        $updated = $runtimeFactory()->store()->markRead($id);
        Response::ok(['conversation' => $updated]);
    },
    [
        (new JsonBodyMiddleware())(),
        (new AuthMiddleware($auth))(),
    ]
);

// Admin: notifications list
$router->get(
    '/v1/chat/notifications',
    static function (Request $request) use ($runtimeFactory): void {
        Response::ok([
            'notifications' => $runtimeFactory()->notifications()->listUnread(50),
        ]);
    },
    [(new AuthMiddleware($auth))()]
);

// Admin: mark notification read
$router->post(
    '/v1/chat/notifications/read',
    static function (Request $request) use ($runtimeFactory): void {
        $body = $request->json();
        $id = (string) ($body['id'] ?? '');
        if ($id === '') {
            throw new AppException('id is required.', 422, 'validation_error');
        }
        $ok = $runtimeFactory()->notifications()->markRead($id);
        Response::ok(['read' => $ok]);
    },
    [
        (new JsonBodyMiddleware())(),
        (new AuthMiddleware($auth))(),
    ]
);

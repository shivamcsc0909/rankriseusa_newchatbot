<?php

declare(strict_types=1);

/**
 * Infrastructure + AI API routes (Phase 3–4).
 * Chat persistence / polling will be registered in later phases.
 *
 * @var array{
 *   app: array<string, mixed>,
 *   db: array<string, mixed>,
 *   cors: array<string, mixed>,
 *   logger: \RankRise\Api\Lib\Logger,
 *   auth: \RankRise\Api\Lib\Auth,
 *   router: \RankRise\Api\Lib\Router
 * } $rankrise
 */

use RankRise\Api\Lib\AppException;
use RankRise\Api\Lib\Database;
use RankRise\Api\Lib\Request;
use RankRise\Api\Lib\Response;
use RankRise\Api\Middleware\AuthMiddleware;
use RankRise\Api\Middleware\JsonBodyMiddleware;
use RankRise\Api\Services\AiWorkflow;

$router = $rankrise['router'];
$auth = $rankrise['auth'];
$app = $rankrise['app'];
$db = $rankrise['db'];
$logger = $rankrise['logger'];

$router->get('/health', static function (Request $request) use ($app, $auth, $db): void {
    $dbConfigured = is_string($db['database'] ?? null)
        && $db['database'] !== ''
        && is_string($db['username'] ?? null)
        && $db['username'] !== '';

    $dbReachable = false;
    if ($dbConfigured) {
        try {
            $dbReachable = Database::ping();
        } catch (\Throwable) {
            $dbReachable = false;
        }
    }

    Response::ok([
        'service' => (string) ($app['name'] ?? 'RankRise API'),
        'env' => (string) ($app['env'] ?? 'production'),
        'status' => 'up',
        'time' => gmdate('c'),
        'php' => PHP_VERSION,
        'database' => [
            'configured' => $dbConfigured,
            'reachable' => $dbReachable,
        ],
        'auth' => [
            'admin_configured' => $auth->isConfigured(),
        ],
        'ai' => [
            'workflow' => true,
            'openai_key_configured' => (rankrise_env('OPENAI_API_KEY') !== null && rankrise_env('OPENAI_API_KEY') !== ''),
        ],
        'poll' => $app['poll'] ?? [],
    ]);
});

// Authenticated ping — verifies admin key wiring without exposing secrets.
$router->get(
    '/health/auth',
    static function (Request $request): void {
        Response::ok([
            'authenticated' => true,
            'time' => gmdate('c'),
        ]);
    },
    [(new AuthMiddleware($auth))()]
);

// Placeholder secured echo endpoint for infrastructure smoke tests.
$router->post(
    '/v1/ping',
    static function (Request $request): void {
        Response::ok([
            'pong' => true,
            'echo' => $request->json(),
            'ip' => $request->ip(),
            'time' => gmdate('c'),
        ]);
    },
    [
        (new JsonBodyMiddleware())(),
        (new AuthMiddleware($auth))(),
    ]
);

/**
 * Phase 4 — AI workflow (identical Node AiWorkflow output shape).
 * Admin-protected; not wired to the frontend yet.
 *
 * POST /api/v1/ai/process
 * Body: { visitorId?, message, history?, promptHint? }
 */
$router->post(
    '/v1/ai/process',
    static function (Request $request) use ($logger): void {
        $body = $request->json();
        $message = $body['message'] ?? null;
        if (!is_string($message)) {
            throw new AppException(
                'Field "message" (string) is required.',
                422,
                'validation_error'
            );
        }

        $history = $body['history'] ?? [];
        if ($history !== null && !is_array($history)) {
            throw new AppException(
                'Field "history" must be an array when provided.',
                422,
                'validation_error'
            );
        }

        $workflow = new AiWorkflow();
        $result = $workflow->processVisitorMessage([
            'visitorId' => isset($body['visitorId']) && (is_string($body['visitorId']) || is_numeric($body['visitorId']))
                ? (string) $body['visitorId']
                : null,
            'message' => $message,
            'history' => is_array($history) ? $history : [],
            'promptHint' => isset($body['promptHint']) && is_string($body['promptHint'])
                ? $body['promptHint']
                : null,
        ]);

        $logger->info('ai.workflow.process', [
            'type' => $result['type'] ?? null,
            'reason' => $result['reason'] ?? null,
            'visitorId' => $result['visitorId'] ?? null,
        ]);

        // HTTP envelope uses Response::ok; data payload matches Node workflow output.
        Response::ok($result);
    },
    [
        (new JsonBodyMiddleware())(),
        (new AuthMiddleware($auth))(),
    ]
);

/* Public lead capture (dual-write target from frontend forms). */
require_once dirname(__DIR__) . '/services/LeadStore.php';
require_once dirname(__DIR__) . '/services/UploadService.php';

use RankRise\Api\Services\LeadStore;
use RankRise\Api\Services\UploadService;

$router->post(
    '/v1/leads',
    static function (Request $request) use ($logger): void {
        $body = $request->json();

        // Honeypot — bots fill hidden fields. Do NOT treat website_url as honeypot
        // (real free-audit / contact forms submit a legitimate website URL).
        if (trim((string) ($body['hp_field'] ?? $body['hp'] ?? '')) !== '') {
            Response::ok(['accepted' => true]);
            return;
        }

        $source = trim((string) ($body['source'] ?? ''));
        if ($source === '') {
            throw new AppException('source is required.', 422, 'validation_error');
        }

        $fields = [];
        if (isset($body['fields']) && is_array($body['fields'])) {
            $fields = $body['fields'];
        } else {
            foreach ($body as $k => $v) {
                if ($k === 'source' || $k === 'hp_field') {
                    continue;
                }
                if (is_string($k) && (is_string($v) || is_numeric($v))) {
                    $fields[$k] = (string) $v;
                }
            }
        }

        $store = new LeadStore();
        $lead = $store->create([
            'source' => $source,
            'name' => $body['name'] ?? null,
            'email' => $body['email'] ?? null,
            'phone' => $body['phone'] ?? null,
            'company' => $body['company'] ?? null,
            'message' => $body['message'] ?? null,
            'fields' => $fields,
        ]);
        $logger->info('leads.create', ['id' => $lead['id'], 'source' => $lead['source']]);
        Response::ok(['lead' => ['id' => $lead['id']], 'accepted' => true]);
    },
    [(new JsonBodyMiddleware())()]
);

/** Public serve for uploaded images. */
$router->get(
    '/v1/uploads/{token}',
    static function (Request $request): void {
        $token = rawurldecode((string) $request->attribute('token', ''));
        if ($token === '') {
            throw new AppException('Not found.', 404, 'not_found');
        }
        $service = new UploadService();
        $path = $service->resolveAbsolute($token);
        if ($path === null) {
            throw new AppException('Not found.', 404, 'not_found');
        }
        $mime = mime_content_type($path) ?: 'application/octet-stream';
        if (!headers_sent()) {
            header('Content-Type: ' . $mime);
            header('Cache-Control: public, max-age=31536000, immutable');
            header('X-Content-Type-Options: nosniff');
        }
        readfile($path);
        exit;
    }
);

/*
 * Stale production index.php sometimes only required api.php + chat.php.
 * Ensure blog + community routes register whenever an updated api.php is deployed.
 */
foreach (['community.php', 'blog.php'] as $extraRoute) {
    $extraPath = __DIR__ . '/' . $extraRoute;
    if (is_file($extraPath)) {
        require_once $extraPath;
    }
}

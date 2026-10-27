<?php

declare(strict_types=1);

/**
 * Front controller for RankRise PHP API infrastructure.
 *
 * Existing PayPal endpoints remain direct scripts:
 *   /api/create-order.php
 *   /api/capture-order.php
 *
 * Infrastructure routes are served through this file, e.g.:
 *   /api/index.php/health
 *   /api/health  (via api/.htaccess rewrite when enabled)
 */

use RankRise\Api\Lib\AppException;
use RankRise\Api\Lib\Request;
use RankRise\Api\Lib\Response;
use RankRise\Api\Middleware\CorsMiddleware;

/** @var array $rankrise */
$rankrise = require __DIR__ . '/bootstrap.php';

require_once __DIR__ . '/routes/api.php';
require_once __DIR__ . '/routes/chat.php';
require_once __DIR__ . '/routes/admin.php';
require_once __DIR__ . '/routes/community.php';
require_once __DIR__ . '/routes/blog.php';

$cors = new CorsMiddleware($rankrise['cors']);
$router = $rankrise['router'];
$app = $rankrise['app'];
$logger = $rankrise['logger'];
$debug = (bool) ($app['debug'] ?? false);

try {
    $limit = (int) ($app['json_body_limit_bytes'] ?? 1_048_576);
    $request = Request::fromGlobals($limit);

    // CORS must run for OPTIONS even when no route matches (preflight).
    $corsResult = $cors->handle($request, static function (Request $req) use ($router): mixed {
        return $router->dispatch($req);
    });

    $result = $corsResult;

    // Handlers may return null after sending a response (e.g. OPTIONS).
    if ($result !== null && is_array($result) && !headers_sent()) {
        Response::json($result);
    }
} catch (AppException $e) {
    $extra = [];
    if ($debug && $e->getContext() !== []) {
        $extra['context'] = $e->getContext();
    }
    if ($e->getStatus() >= 500) {
        $logger->error($e->getMessage(), [
            'code' => $e->getErrorCode(),
            'context' => $e->getContext(),
        ]);
    }
    Response::fail($e->getMessage(), $e->getStatus(), $e->getErrorCode(), $extra);
} catch (\Throwable $e) {
    $logger->error($e->getMessage(), ['exception' => $e]);
    $msg = $debug ? $e->getMessage() : 'An unexpected server error occurred.';
    Response::fail($msg, 500, 'server_error');
}

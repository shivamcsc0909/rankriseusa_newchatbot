<?php

declare(strict_types=1);

/**
 * Convenience health endpoint that does not require rewrite rules.
 * GET /api/health.php
 */

use RankRise\Api\Lib\Database;
use RankRise\Api\Lib\Response;
use RankRise\Api\Middleware\CorsMiddleware;

/** @var array $rankrise */
$rankrise = require __DIR__ . '/bootstrap.php';

$cors = new CorsMiddleware($rankrise['cors']);
$cors->handle(
    \RankRise\Api\Lib\Request::fromGlobals((int) ($rankrise['app']['json_body_limit_bytes'] ?? 1_048_576)),
    static function () use ($rankrise) {
        $app = $rankrise['app'];
        $auth = $rankrise['auth'];
        $db = $rankrise['db'];

        $dbConfigured = is_string($db['database'] ?? null)
            && $db['database'] !== ''
            && is_string($db['username'] ?? null)
            && $db['username'] !== '';

        $dbReachable = false;
        if ($dbConfigured) {
            try {
                $dbReachable = Database::ping();
            } catch (Throwable) {
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
            'entry' => 'health.php',
        ]);

        return null;
    }
);

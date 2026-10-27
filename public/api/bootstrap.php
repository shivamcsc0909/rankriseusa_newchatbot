<?php

declare(strict_types=1);

/**
 * RankRise PHP API bootstrap.
 *
 * Load this from any endpoint:
 *   require __DIR__ . '/bootstrap.php';
 *
 * Does not modify PayPal scripts (create-order.php / capture-order.php / config.php).
 */

use RankRise\Api\Lib\Auth;
use RankRise\Api\Lib\Database;
use RankRise\Api\Lib\Env;
use RankRise\Api\Lib\Logger;
use RankRise\Api\Lib\Router;
use RankRise\Api\Middleware\ErrorHandler;

define('RANKRIS_API_ROOT', __DIR__);

spl_autoload_register(static function (string $class): void {
    $prefix = 'RankRise\\Api\\';
    if (!str_starts_with($class, $prefix)) {
        return;
    }

    $relative = substr($class, strlen($prefix));
    $parts = explode('\\', $relative);
    if ($parts === []) {
        return;
    }

    $map = [
        'Lib' => 'lib',
        'Middleware' => 'middleware',
        'Services' => 'services',
        'Repositories' => 'repositories',
    ];

    $rootSegment = array_shift($parts);
    if ($rootSegment === null || !isset($map[$rootSegment]) || $parts === []) {
        return;
    }

    $file = RANKRIS_API_ROOT . '/' . $map[$rootSegment] . '/' . implode('/', $parts) . '.php';
    if (is_file($file)) {
        require_once $file;
    }
});

require_once __DIR__ . '/helpers/functions.php';

Env::load([
    // Prefer env above public_html when available on Hostinger.
    dirname(__DIR__, 2) . '/.env',
    dirname(__DIR__) . '/.env',
    __DIR__ . '/.env',
]);

/** @var array<string, mixed> $appConfig */
$appConfig = require __DIR__ . '/config/app.php';
/** @var array<string, mixed> $dbConfig */
$dbConfig = require __DIR__ . '/config/database.php';
/** @var array<string, mixed> $corsConfig */
$corsConfig = require __DIR__ . '/config/cors.php';

date_default_timezone_set((string) ($appConfig['timezone'] ?? 'UTC'));

$logger = new Logger(
    __DIR__ . '/storage/logs',
    (string) ($appConfig['log_channel'] ?? 'app'),
    (string) ($appConfig['log_level'] ?? 'info')
);

$errorHandler = new ErrorHandler($logger, (bool) ($appConfig['debug'] ?? false));
$errorHandler->register();

Database::configure($dbConfig);

$auth = new Auth(
    isset($appConfig['admin_api_key']) && is_string($appConfig['admin_api_key'])
        ? $appConfig['admin_api_key']
        : null,
    (string) ($appConfig['admin_header'] ?? 'X-Admin-Key')
);

$router = new Router();

/**
 * Shared container for route files / endpoints.
 *
 * @var array{
 *   app: array<string, mixed>,
 *   db: array<string, mixed>,
 *   cors: array<string, mixed>,
 *   logger: Logger,
 *   auth: Auth,
 *   router: Router,
 *   errorHandler: ErrorHandler
 * }
 */
$rankrise = [
    'app' => $appConfig,
    'db' => $dbConfig,
    'cors' => $corsConfig,
    'logger' => $logger,
    'auth' => $auth,
    'router' => $router,
    'errorHandler' => $errorHandler,
];

return $rankrise;

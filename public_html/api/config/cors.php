<?php

declare(strict_types=1);

use RankRise\Api\Lib\Env;

/**
 * CORS allowlist for RankRise API routes.
 *
 * @return array<string, mixed>
 */
$origins = array_values(array_filter(array_map(
    'trim',
    explode(',', Env::getString(
        'CORS_ALLOWED_ORIGINS',
        'https://rankriseusa.com,https://www.rankriseusa.com'
    ))
)));

if (Env::getBool('CORS_ALLOW_LOCALHOST', Env::getString('APP_ENV', 'production') !== 'production')) {
    $origins[] = 'http://localhost:5173';
    $origins[] = 'http://127.0.0.1:5173';
}

return [
    'allowed_origins' => array_values(array_unique($origins)),
    'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    'allowed_headers' => [
        'Content-Type',
        'Accept',
        'X-Admin-Key',
        'X-CSRF-Token',
        'X-Requested-With',
    ],
    'max_age' => Env::getInt('CORS_MAX_AGE', 86400),
];

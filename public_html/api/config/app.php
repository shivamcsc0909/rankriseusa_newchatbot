<?php

declare(strict_types=1);

use RankRise\Api\Lib\Env;

/**
 * Application configuration (non-secret defaults + env overrides).
 *
 * @return array<string, mixed>
 */
return [
    'name' => Env::getString('APP_NAME', 'RankRise API'),
    'env' => Env::getString('APP_ENV', 'production'),
    'debug' => Env::getBool('APP_DEBUG', false),
    'url' => Env::getString('APP_URL', 'https://rankriseusa.com'),
    'timezone' => Env::getString('APP_TIMEZONE', 'UTC'),
    'log_level' => Env::getString('LOG_LEVEL', 'info'),
    'log_channel' => Env::getString('LOG_CHANNEL', 'app'),
    'admin_api_key' => Env::getString('ADMIN_API_KEY', 'RankRiseAdmin2026!'),
    'admin_header' => Env::getString('ADMIN_API_HEADER', 'X-Admin-Key'),
    'json_body_limit_bytes' => Env::getInt('JSON_BODY_LIMIT_BYTES', 1_048_576),
    'poll' => [
        'visitor_interval_ms' => Env::getInt('POLL_VISITOR_INTERVAL_MS', 2000),
        'admin_interval_ms' => Env::getInt('POLL_ADMIN_INTERVAL_MS', 1500),
        'presence_ttl_seconds' => Env::getInt('PRESENCE_TTL_SECONDS', 30),
        'typing_ttl_seconds' => Env::getInt('TYPING_TTL_SECONDS', 5),
    ],
    'openai' => [
        'api_key' => Env::get('OPENAI_API_KEY'),
        'base_url' => Env::getString('OPENAI_BASE_URL', 'https://api.openai.com/v1'),
        'model' => Env::getString('OPENAI_MODEL', 'gpt-4o-mini'),
        'timeout_seconds' => Env::getInt('OPENAI_TIMEOUT_SECONDS', 25),
    ],
];

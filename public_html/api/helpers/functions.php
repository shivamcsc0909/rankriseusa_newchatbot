<?php

declare(strict_types=1);

use RankRise\Api\Lib\AppException;
use RankRise\Api\Lib\Database;
use RankRise\Api\Lib\Env;

/**
 * Shared helper functions for the RankRise PHP API.
 */

if (!function_exists('rankrise_config')) {
    /**
     * @return array<string, mixed>
     */
    function rankrise_config(?string $key = null, mixed $default = null): mixed
    {
        /** @var array<string, mixed>|null $config */
        static $config = null;

        if ($config === null) {
            $config = require dirname(__DIR__) . '/config/app.php';
        }

        if ($key === null) {
            return $config;
        }

        $segments = explode('.', $key);
        $value = $config;
        foreach ($segments as $segment) {
            if (!is_array($value) || !array_key_exists($segment, $value)) {
                return $default;
            }
            $value = $value[$segment];
        }

        return $value;
    }
}

if (!function_exists('rankrise_uuid')) {
    function rankrise_uuid(): string
    {
        $data = random_bytes(16);
        $data[6] = chr((ord($data[6]) & 0x0f) | 0x40);
        $data[8] = chr((ord($data[8]) & 0x3f) | 0x80);

        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }
}

if (!function_exists('rankrise_now')) {
    function rankrise_now(): string
    {
        return (new DateTimeImmutable('now', new DateTimeZone('UTC')))->format('Y-m-d H:i:s.v');
    }
}

if (!function_exists('rankrise_env')) {
    function rankrise_env(string $key, ?string $default = null): ?string
    {
        return Env::get($key, $default);
    }
}

if (!function_exists('rankrise_db')) {
    function rankrise_db(): PDO
    {
        return Database::connection();
    }
}

if (!function_exists('rankrise_abort')) {
    /**
     * @param array<string, mixed> $context
     */
    function rankrise_abort(
        string $message,
        int $status = 400,
        string $code = 'bad_request',
        array $context = []
    ): never {
        throw new AppException($message, $status, $code, $context);
    }
}

if (!function_exists('rankrise_base_path')) {
    function rankrise_base_path(string $suffix = ''): string
    {
        $base = dirname(__DIR__);
        if ($suffix === '') {
            return $base;
        }
        return $base . '/' . ltrim($suffix, '/');
    }
}

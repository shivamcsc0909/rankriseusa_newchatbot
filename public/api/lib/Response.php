<?php

declare(strict_types=1);

namespace RankRise\Api\Lib;

/**
 * JSON response helpers for the RankRise API.
 */
final class Response
{
    /**
     * @param array<string, mixed> $data
     * @param array<string, string> $headers
     */
    public static function json(array $data, int $status = 200, array $headers = []): void
    {
        if (!headers_sent()) {
            http_response_code($status);
            header('Content-Type: application/json; charset=utf-8');
            header('X-Content-Type-Options: nosniff');
            // Never let hosting cache (LiteSpeed/ExpiresDefault) freeze API JSON.
            if (!isset($headers['Cache-Control']) && !isset($headers['cache-control'])) {
                header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
                header('Pragma: no-cache');
            }
            foreach ($headers as $name => $value) {
                header($name . ': ' . $value);
            }
        }

        echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }

    /**
     * @param array<string, mixed> $data
     * @param array<string, string> $headers
     */
    public static function ok(array $data = [], int $status = 200, array $headers = []): void
    {
        self::json(['ok' => true, 'data' => $data], $status, $headers);
    }

    /**
     * @param array<string, mixed> $error
     * @param array<string, string> $headers
     */
    public static function fail(
        string $message,
        int $status = 400,
        string $code = 'bad_request',
        array $error = [],
        array $headers = []
    ): void {
        self::json([
            'ok' => false,
            'error' => array_merge([
                'code' => $code,
                'message' => $message,
            ], $error),
        ], $status, $headers);
    }

    public static function noContent(): void
    {
        if (!headers_sent()) {
            http_response_code(204);
        }
    }
}

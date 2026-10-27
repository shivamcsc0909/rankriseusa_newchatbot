<?php

declare(strict_types=1);

namespace RankRise\Api\Lib;

/**
 * Minimal .env loader. Real environment variables always win.
 */
final class Env
{
    private static bool $loaded = false;

    /** @var array<string, string> */
    private static array $values = [];

    /**
     * Load one or more .env files (first key wins per file; process env wins overall).
     *
     * @param list<string> $paths
     */
    public static function load(array $paths): void
    {
        foreach ($paths as $path) {
            if (!is_string($path) || $path === '' || !is_file($path) || !is_readable($path)) {
                continue;
            }

            $lines = file($path, FILE_IGNORE_NEW_LINES);
            if ($lines === false) {
                continue;
            }

            foreach ($lines as $line) {
                $trimmed = trim($line);
                if ($trimmed === '' || str_starts_with($trimmed, '#')) {
                    continue;
                }

                $eq = strpos($trimmed, '=');
                if ($eq === false) {
                    continue;
                }

                $key = trim(substr($trimmed, 0, $eq));
                $value = trim(substr($trimmed, $eq + 1));

                if ($key === '') {
                    continue;
                }

                // Strip matching single/double quotes.
                if (
                    strlen($value) >= 2
                    && (
                        ($value[0] === '"' && str_ends_with($value, '"'))
                        || ($value[0] === "'" && str_ends_with($value, "'"))
                    )
                ) {
                    $value = substr($value, 1, -1);
                }

                self::$values[$key] = $value;

                if (!array_key_exists($key, $_ENV) && getenv($key) === false) {
                    $_ENV[$key] = $value;
                    putenv($key . '=' . $value);
                }
            }
        }

        self::$loaded = true;
    }

    public static function get(string $key, ?string $default = null): ?string
    {
        if (array_key_exists($key, $_ENV) && is_string($_ENV[$key])) {
            return $_ENV[$key];
        }

        $fromGetenv = getenv($key);
        if ($fromGetenv !== false) {
            return $fromGetenv;
        }

        return self::$values[$key] ?? $default;
    }

    public static function getString(string $key, string $default = ''): string
    {
        $value = self::get($key);
        return $value === null || $value === '' ? $default : $value;
    }

    public static function getInt(string $key, int $default = 0): int
    {
        $value = self::get($key);
        if ($value === null || $value === '' || !is_numeric($value)) {
            return $default;
        }

        return (int) $value;
    }

    public static function getBool(string $key, bool $default = false): bool
    {
        $value = self::get($key);
        if ($value === null || $value === '') {
            return $default;
        }

        return in_array(strtolower($value), ['1', 'true', 'yes', 'on'], true);
    }

    public static function require(string $key): string
    {
        $value = self::get($key);
        if ($value === null || $value === '') {
            throw new AppException(
                'Configuration error.',
                500,
                'config_missing',
                ['key' => $key]
            );
        }

        return $value;
    }

    public static function isLoaded(): bool
    {
        return self::$loaded;
    }
}

<?php

declare(strict_types=1);

namespace RankRise\Api\Services;

use RankRise\Api\Lib\Request;

/**
 * Parse visitor device / browser metadata for live chat sessions.
 */
final class VisitorMeta
{
    /**
     * @param array<string, mixed> $clientMeta Optional body fields from the browser
     * @return array<string, mixed>
     */
    public static function collect(Request $request, array $clientMeta = []): array
    {
        $ua = trim((string) (
            $clientMeta['userAgent']
            ?? $request->header('User-Agent')
            ?? ($_SERVER['HTTP_USER_AGENT'] ?? '')
        ));

        $parsed = self::parseUserAgent($ua);
        $ip = $request->ip();

        $meta = [
            'ip' => $ip !== '' ? $ip : null,
            'country' => self::normalizeOptionalString($clientMeta['country'] ?? null),
            'userAgent' => $ua !== '' ? $ua : null,
            'browser' => $parsed['browser'],
            'device' => $parsed['device'],
            'os' => $parsed['os'],
            'currentPage' => self::normalizeOptionalString($clientMeta['currentPage'] ?? $clientMeta['page'] ?? null),
            'referrer' => self::normalizeOptionalString($clientMeta['referrer'] ?? null),
            'language' => self::normalizeOptionalString(
                $clientMeta['language']
                ?? $request->header('Accept-Language')
            ),
            'timezone' => self::normalizeOptionalString($clientMeta['timezone'] ?? null),
            'email' => self::normalizeOptionalString($clientMeta['email'] ?? null),
            'name' => self::normalizeOptionalString($clientMeta['name'] ?? null),
        ];

        // Drop nulls for cleaner JSON
        return array_filter(
            $meta,
            static fn ($v) => $v !== null && $v !== ''
        );
    }

    /**
     * @return array{browser: string, device: string, os: string}
     */
    public static function parseUserAgent(string $ua): array
    {
        $uaLower = strtolower($ua);
        $browser = 'Unknown';
        if (str_contains($uaLower, 'edg/')) {
            $browser = 'Edge';
        } elseif (str_contains($uaLower, 'chrome/') && !str_contains($uaLower, 'edg/')) {
            $browser = 'Chrome';
        } elseif (str_contains($uaLower, 'safari/') && !str_contains($uaLower, 'chrome/')) {
            $browser = 'Safari';
        } elseif (str_contains($uaLower, 'firefox/')) {
            $browser = 'Firefox';
        } elseif (str_contains($uaLower, 'opera') || str_contains($uaLower, 'opr/')) {
            $browser = 'Opera';
        }

        $device = 'Desktop';
        if (str_contains($uaLower, 'ipad') || str_contains($uaLower, 'tablet')) {
            $device = 'Tablet';
        } elseif (
            str_contains($uaLower, 'mobi')
            || str_contains($uaLower, 'iphone')
            || str_contains($uaLower, 'android')
        ) {
            $device = 'Mobile';
        }

        $os = 'Unknown';
        if (str_contains($uaLower, 'windows')) {
            $os = 'Windows';
        } elseif (str_contains($uaLower, 'mac os') || str_contains($uaLower, 'macintosh')) {
            $os = 'macOS';
        } elseif (str_contains($uaLower, 'android')) {
            $os = 'Android';
        } elseif (str_contains($uaLower, 'iphone') || str_contains($uaLower, 'ipad') || str_contains($uaLower, 'ios')) {
            $os = 'iOS';
        } elseif (str_contains($uaLower, 'linux')) {
            $os = 'Linux';
        }

        return ['browser' => $browser, 'device' => $device, 'os' => $os];
    }

    private static function normalizeOptionalString(mixed $value): ?string
    {
        if (!is_string($value)) {
            return null;
        }
        $trimmed = trim($value);
        if ($trimmed === '' || strlen($trimmed) > 500) {
            return null;
        }
        return $trimmed;
    }
}

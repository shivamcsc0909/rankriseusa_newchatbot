<?php

declare(strict_types=1);

namespace RankRise\Api\Services;

/**
 * Lightweight chat sanitization (subset of Node backend/security).
 */
final class ChatSanitize
{
    /**
     * @param array{maxUrlCount?: int, maxRepeatedCharRun?: int, blockedPatterns?: list<string>} $rules
     * @return array{spam: bool, reason?: string}
     */
    public static function detectSpam(string $content, array $rules = []): array
    {
        $maxUrls = (int) ($rules['maxUrlCount'] ?? 5);
        $maxRun = (int) ($rules['maxRepeatedCharRun'] ?? 12);
        /** @var list<string> $blocked */
        $blocked = $rules['blockedPatterns'] ?? ['viagra', 'casino bonus', 'crypto giveaway'];

        $lower = strtolower($content);
        foreach ($blocked as $pattern) {
            if ($pattern !== '' && str_contains($lower, strtolower($pattern))) {
                return ['spam' => true, 'reason' => 'blocked_pattern'];
            }
        }

        if (preg_match_all('#https?://#i', $content, $m) && count($m[0]) > $maxUrls) {
            return ['spam' => true, 'reason' => 'too_many_urls'];
        }

        if ($maxRun > 0 && preg_match('/(.)\1{' . $maxRun . ',}/u', $content) === 1) {
            return ['spam' => true, 'reason' => 'repeated_chars'];
        }

        return ['spam' => false];
    }

    public static function sanitizeString(string $value): string
    {
        $value = strip_tags($value);
        $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value) ?? $value;
        return trim($value);
    }

    public static function stripXss(string $value): string
    {
        $value = preg_replace('#<script\b[^>]*>.*?</script>#is', '', $value) ?? $value;
        return self::sanitizeString($value);
    }
}

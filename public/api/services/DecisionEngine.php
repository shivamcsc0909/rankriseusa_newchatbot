<?php

declare(strict_types=1);

namespace RankRise\Api\Services;

/**
 * Reply vs human-handover decisions (mirrors decisionEngine.js).
 */
final class DecisionEngine
{
    /** @var array<string, mixed> */
    private array $config;
    private string $handoverToken;

    /**
     * @param array<string, mixed> $decisionConfig
     */
    public function __construct(array $decisionConfig, string $handoverToken)
    {
        $this->config = $decisionConfig;
        $this->handoverToken = $handoverToken;
    }

    /**
     * @return array{type: string, reason: string, message: string}|null
     */
    public function beforeAi(string $visitorMessage): ?array
    {
        $text = strtolower($visitorMessage);

        $humanPatterns = $this->config['humanRequestPatterns'] ?? [];
        if (is_array($humanPatterns) && self::matchesAny($text, $humanPatterns)) {
            return self::handover('visitor_requested_human', (string) ($this->config['handoverMessage'] ?? ''));
        }

        $escalation = $this->config['escalationPatterns'] ?? [];
        if (is_array($escalation) && self::matchesAny($text, $escalation)) {
            return self::handover('escalation_topic', (string) ($this->config['handoverMessage'] ?? ''));
        }

        return null;
    }

    /**
     * @param array{ok: bool, data?: array<string, mixed>, error?: array<string, mixed>} $aiResult
     * @return array{type: string, message: string, reason?: string, error?: array<string, mixed>}
     */
    public function afterAi(array $aiResult): array
    {
        if (($aiResult['ok'] ?? false) !== true) {
            $result = self::handover('ai_error', (string) ($this->config['errorMessage'] ?? ''));
            if (isset($aiResult['error']) && is_array($aiResult['error'])) {
                $result['error'] = $aiResult['error'];
            }
            return $result;
        }

        $content = trim((string) ($aiResult['data']['content'] ?? ''));
        if ($content === '') {
            return self::handover('empty_reply', (string) ($this->config['errorMessage'] ?? ''));
        }

        if (str_contains($content, $this->handoverToken)) {
            return self::handover('ai_uncertain', (string) ($this->config['handoverMessage'] ?? ''));
        }

        return ['type' => 'reply', 'message' => $content];
    }

    /**
     * @param list<mixed> $patterns
     */
    private static function matchesAny(string $text, array $patterns): bool
    {
        $normalized = strtolower($text);
        foreach ($patterns as $p) {
            $needle = strtolower(trim((string) $p));
            if ($needle === '') {
                continue;
            }
            // Multi-word phrases: substring OK. Single tokens: word boundary
            // so "agent" does not match "agency" / "management".
            if (str_contains($needle, ' ')) {
                if (str_contains($normalized, $needle)) {
                    return true;
                }
                continue;
            }
            if (preg_match('/\b' . preg_quote($needle, '/') . '\b/', $normalized) === 1) {
                return true;
            }
        }
        return false;
    }

    /**
     * @return array{type: string, reason: string, message: string}
     */
    private static function handover(string $reason, string $message): array
    {
        return [
            'type' => 'handover',
            'reason' => $reason,
            'message' => $message,
        ];
    }
}

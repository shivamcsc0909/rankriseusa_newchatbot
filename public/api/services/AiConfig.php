<?php

declare(strict_types=1);

namespace RankRise\Api\Services;

use RankRise\Api\Lib\Env;

/**
 * AI client configuration (mirrors backend/ai/config.js).
 *
 * @return array{
 *   apiKey: ?string,
 *   baseUrl: string,
 *   defaultModel: string,
 *   timeoutMs: int,
 *   maxRetries: int,
 *   retryBaseDelayMs: int
 * }
 */
function get_ai_config(): array
{
    $timeoutMs = Env::getInt('OPENAI_TIMEOUT_MS', 0);
    if ($timeoutMs <= 0) {
        $seconds = Env::getInt('OPENAI_TIMEOUT_SECONDS', 0);
        $timeoutMs = $seconds > 0 ? $seconds * 1000 : 30_000;
    }

    $maxRetries = Env::get('OPENAI_MAX_RETRIES');
    $maxRetriesInt = ($maxRetries !== null && $maxRetries !== '' && is_numeric($maxRetries))
        ? max(0, (int) $maxRetries)
        : 2;

    $retryBase = Env::getInt('OPENAI_RETRY_BASE_DELAY_MS', 0);
    if ($retryBase <= 0) {
        $retryBase = 500;
    }

    $apiKey = Env::get('OPENAI_API_KEY');

    return [
        'apiKey' => ($apiKey !== null && $apiKey !== '') ? $apiKey : null,
        'baseUrl' => rtrim(Env::getString('OPENAI_BASE_URL', 'https://api.openai.com/v1'), '/'),
        'defaultModel' => Env::getString('OPENAI_MODEL', 'gpt-4o-mini'),
        'timeoutMs' => $timeoutMs,
        'maxRetries' => $maxRetriesInt,
        'retryBaseDelayMs' => $retryBase,
    ];
}

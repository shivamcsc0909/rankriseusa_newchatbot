<?php

declare(strict_types=1);

namespace RankRise\Api\Services;

require_once __DIR__ . '/AiErrors.php';
require_once __DIR__ . '/AiConfig.php';

/**
 * Low-level OpenAI-compatible chat completions client via PHP cURL.
 * Mirrors backend/ai/OpenAiClient.js (non-streaming path used by the workflow).
 */
final class OpenAiClient
{
    private ?string $apiKey;
    private string $baseUrl;
    public string $defaultModel;
    private int $timeoutMs;
    private int $maxRetries;
    private int $retryBaseDelayMs;

    /**
     * @param array<string, mixed> $options
     */
    public function __construct(array $options = [])
    {
        $config = get_ai_config();

        $this->apiKey = array_key_exists('apiKey', $options)
            ? (isset($options['apiKey']) && is_string($options['apiKey']) && $options['apiKey'] !== ''
                ? $options['apiKey']
                : null)
            : $config['apiKey'];

        $base = isset($options['baseUrl']) && is_string($options['baseUrl'])
            ? $options['baseUrl']
            : $config['baseUrl'];
        $this->baseUrl = rtrim($base, '/');

        $this->defaultModel = isset($options['defaultModel']) && is_string($options['defaultModel'])
            ? $options['defaultModel']
            : $config['defaultModel'];

        $this->timeoutMs = isset($options['timeoutMs']) && is_numeric($options['timeoutMs'])
            ? (int) $options['timeoutMs']
            : $config['timeoutMs'];

        $this->maxRetries = isset($options['maxRetries']) && is_numeric($options['maxRetries'])
            ? (int) $options['maxRetries']
            : $config['maxRetries'];

        $this->retryBaseDelayMs = isset($options['retryBaseDelayMs']) && is_numeric($options['retryBaseDelayMs'])
            ? (int) $options['retryBaseDelayMs']
            : $config['retryBaseDelayMs'];
    }

    /**
     * Non-streaming chat completion. Returns the parsed API response body.
     *
     * @param array<string, mixed> $payload
     * @return array<string, mixed>
     */
    public function chatCompletion(array $payload): array
    {
        $payload['stream'] = false;
        $raw = $this->requestWithRetry($payload);

        /** @var mixed $decoded */
        $decoded = json_decode($raw, true);
        if (!is_array($decoded)) {
            throw new AiApiError('AI API returned invalid JSON.', 502);
        }

        return $decoded;
    }

    /**
     * @param array<string, mixed> $body
     */
    private function requestWithRetry(array $body): string
    {
        if ($this->apiKey === null || $this->apiKey === '') {
            throw new AiConfigError(
                'OPENAI_API_KEY is not configured (public/api/.env or environment).'
            );
        }

        $url = $this->baseUrl . '/chat/completions';
        $lastError = null;

        for ($attempt = 0; $attempt <= $this->maxRetries; $attempt++) {
            try {
                return $this->performRequest($url, $body);
            } catch (AiError $error) {
                $lastError = $error;
                $canRetry = $error->retryable === true && $attempt < $this->maxRetries;
                if (!$canRetry) {
                    throw $error;
                }
                usleep($this->retryDelayMs($attempt, $error) * 1000);
            }
        }

        if ($lastError instanceof AiError) {
            throw $lastError;
        }

        throw new AiNetworkError('AI request failed after retries.');
    }

    /**
     * @param array<string, mixed> $body
     */
    private function performRequest(string $url, array $body): string
    {
        $json = json_encode($body, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        if ($json === false) {
            throw new AiConfigError('Failed to encode AI request body.');
        }

        $ch = curl_init($url);
        if ($ch === false) {
            throw new AiNetworkError('Failed to initialize cURL.');
        }

        $timeoutSeconds = max(1, (int) ceil($this->timeoutMs / 1000));

        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'Authorization: Bearer ' . $this->apiKey,
            ],
            CURLOPT_POSTFIELDS => $json,
            CURLOPT_CONNECTTIMEOUT => min(10, $timeoutSeconds),
            CURLOPT_TIMEOUT => $timeoutSeconds,
        ]);

        $responseBody = curl_exec($ch);
        $errno = curl_errno($ch);
        $error = curl_error($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        /** @var array<string, mixed>|false $headerSizeInfo */
        curl_close($ch);

        if ($errno === CURLE_OPERATION_TIMEDOUT || $errno === 28) {
            throw new AiTimeoutError();
        }

        if ($responseBody === false) {
            throw new AiNetworkError(
                'Failed to reach AI service.' . ($error !== '' ? ' ' . $error : '')
            );
        }

        if ($status >= 200 && $status < 300) {
            return (string) $responseBody;
        }

        $errorMessage = $this->readErrorMessage((string) $responseBody, $status);

        if ($status === 401 || $status === 403) {
            throw new AiAuthError($errorMessage, $status);
        }

        if ($status === 429) {
            $err = new AiRateLimitError($errorMessage, $status);
            // Retry-After is not always available via curl_getinfo headers easily;
            // exponential backoff still applies.
            throw $err;
        }

        throw new AiApiError($errorMessage, $status);
    }

    private function readErrorMessage(string $responseBody, int $status): string
    {
        try {
            /** @var mixed $data */
            $data = json_decode($responseBody, true, 512, JSON_THROW_ON_ERROR);
            if (is_array($data) && isset($data['error']) && is_array($data['error'])) {
                $msg = $data['error']['message'] ?? null;
                if (is_string($msg) && $msg !== '') {
                    return $msg;
                }
            }
        } catch (\JsonException) {
            // fall through
        }

        return 'AI API error (HTTP ' . $status . ').';
    }

    private function retryDelayMs(int $attempt, AiError $error): int
    {
        if ($error->retryAfterMs !== null && $error->retryAfterMs > 0) {
            return $error->retryAfterMs;
        }

        $backoff = $this->retryBaseDelayMs * (2 ** $attempt);
        $jitter = (int) floor(mt_rand(0, max(1, $this->retryBaseDelayMs)));

        return $backoff + $jitter;
    }
}

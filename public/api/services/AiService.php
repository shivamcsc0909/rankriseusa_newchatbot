<?php

declare(strict_types=1);

namespace RankRise\Api\Services;

require_once __DIR__ . '/AiErrors.php';
require_once __DIR__ . '/OpenAiClient.php';

/**
 * High-level AI reply service (mirrors backend/ai/AiService.js).
 * Always returns a structured result — never throws for expected failure modes.
 */
final class AiService
{
    private OpenAiClient $client;

    /**
     * @param array<string, mixed> $options  Forwarded to OpenAiClient.
     */
    public function __construct(array $options = [])
    {
        $this->client = new OpenAiClient($options);
    }

    /**
     * @param array{
     *   messages: list<array{role: string, content: string}>,
     *   systemPrompt?: string,
     *   model?: string,
     *   temperature?: float|int,
     *   maxTokens?: int
     * } $request
     * @return array{ok: true, data: array<string, mixed>}|array{ok: false, error: array<string, mixed>}
     */
    public function generateReply(array $request): array
    {
        $invalid = $this->validate($request);
        if ($invalid !== null) {
            return $invalid;
        }

        try {
            $data = $this->client->chatCompletion($this->buildPayload($request));
            $choice = $data['choices'][0] ?? null;
            $message = is_array($choice) ? ($choice['message'] ?? null) : null;
            $content = is_array($message) && isset($message['content']) && is_string($message['content'])
                ? $message['content']
                : '';

            $usage = is_array($data['usage'] ?? null) ? $data['usage'] : [];

            return [
                'ok' => true,
                'data' => [
                    'content' => $content,
                    'model' => is_string($data['model'] ?? null)
                        ? $data['model']
                        : ($request['model'] ?? $this->client->defaultModel),
                    'finishReason' => is_array($choice) ? ($choice['finish_reason'] ?? null) : null,
                    'usage' => [
                        'promptTokens' => $usage['prompt_tokens'] ?? null,
                        'completionTokens' => $usage['completion_tokens'] ?? null,
                        'totalTokens' => $usage['total_tokens'] ?? null,
                    ],
                ],
            ];
        } catch (AiError $error) {
            return $this->toFailure($error);
        } catch (\Throwable $error) {
            return [
                'ok' => false,
                'error' => [
                    'code' => 'unknown',
                    'message' => $error->getMessage() !== '' ? $error->getMessage() : 'Unknown AI service error.',
                    'retryable' => false,
                ],
            ];
        }
    }

    /**
     * @param array<string, mixed> $request
     * @return array<string, mixed>
     */
    private function buildPayload(array $request): array
    {
        /** @var list<array{role: string, content: string}> $messages */
        $messages = $request['messages'];
        $systemPrompt = isset($request['systemPrompt']) && is_string($request['systemPrompt'])
            ? $request['systemPrompt']
            : null;

        $payload = [
            'model' => $request['model'] ?? $this->client->defaultModel,
            'messages' => $systemPrompt !== null
                ? array_merge([['role' => 'system', 'content' => $systemPrompt]], $messages)
                : $messages,
        ];

        if (array_key_exists('temperature', $request)) {
            $payload['temperature'] = $request['temperature'];
        }
        if (array_key_exists('maxTokens', $request)) {
            $payload['max_tokens'] = $request['maxTokens'];
        }

        return $payload;
    }

    /**
     * @param array<string, mixed> $request
     * @return array{ok: false, error: array<string, mixed>}|null
     */
    private function validate(array $request): ?array
    {
        $messages = $request['messages'] ?? null;
        $valid = is_array($messages) && $messages !== [];

        if ($valid) {
            foreach ($messages as $m) {
                if (
                    !is_array($m)
                    || !isset($m['role'], $m['content'])
                    || !in_array($m['role'], ['system', 'user', 'assistant'], true)
                    || !is_string($m['content'])
                ) {
                    $valid = false;
                    break;
                }
            }
        }

        if ($valid) {
            return null;
        }

        return [
            'ok' => false,
            'error' => [
                'code' => 'invalid_request',
                'message' => 'messages must be a non-empty array of { role, content } objects.',
                'retryable' => false,
            ],
        ];
    }

    /**
     * @return array{ok: false, error: array<string, mixed>}
     */
    private function toFailure(AiError $error): array
    {
        $payload = [
            'code' => $error->errorCode,
            'message' => $error->getMessage(),
            'retryable' => $error->retryable,
        ];
        if ($error->status !== null) {
            $payload['status'] = $error->status;
        }

        return [
            'ok' => false,
            'error' => $payload,
        ];
    }
}

<?php

declare(strict_types=1);

namespace RankRise\Api\Lib;

/**
 * Timing-safe admin API key authentication.
 */
final class Auth
{
    private ?string $adminApiKey;
    private string $headerName;

    public function __construct(?string $adminApiKey, string $headerName = 'X-Admin-Key')
    {
        $this->adminApiKey = $adminApiKey !== null && $adminApiKey !== '' ? $adminApiKey : null;
        $this->headerName = $headerName;
    }

    public function isConfigured(): bool
    {
        return $this->adminApiKey !== null;
    }

    public function headerName(): string
    {
        return $this->headerName;
    }

    /**
     * @return array{ok: bool, status?: int, code?: string, message?: string}
     */
    public function validateRequest(Request $request): array
    {
        if ($this->adminApiKey === null) {
            return [
                'ok' => false,
                'status' => 503,
                'code' => 'auth_not_configured',
                'message' => 'Admin authentication is not configured.',
            ];
        }

        $presented = $request->header($this->headerName);
        if ($presented === null || $presented === '') {
            // Also accept Authorization: Bearer <key>
            $auth = $request->header('authorization');
            if (is_string($auth) && preg_match('/^Bearer\s+(.+)$/i', $auth, $m) === 1) {
                $presented = trim($m[1]);
            }
        }

        if ($presented === null || $presented === '') {
            return [
                'ok' => false,
                'status' => 401,
                'code' => 'unauthorized',
                'message' => 'Missing admin credentials.',
            ];
        }

        if (!$this->safeEquals($this->adminApiKey, $presented)) {
            return [
                'ok' => false,
                'status' => 401,
                'code' => 'unauthorized',
                'message' => 'Invalid admin credentials.',
            ];
        }

        return ['ok' => true];
    }

    public function assert(Request $request): void
    {
        $result = $this->validateRequest($request);
        if ($result['ok'] === true) {
            return;
        }

        throw new AppException(
            $result['message'] ?? 'Unauthorized',
            $result['status'] ?? 401,
            $result['code'] ?? 'unauthorized'
        );
    }

    private function safeEquals(string $expected, string $presented): bool
    {
        $a = hash('sha256', $expected, true);
        $b = hash('sha256', $presented, true);
        return hash_equals($a, $b);
    }
}

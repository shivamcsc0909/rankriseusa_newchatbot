<?php

declare(strict_types=1);

namespace RankRise\Api\Services;

use Exception;
use Throwable;

/**
 * Typed errors for the AI layer (mirrors backend/ai/errors.js).
 */
class AiError extends Exception
{
    public string $errorCode;
    public ?int $status;
    public bool $retryable;
    public ?int $retryAfterMs = null;

    public function __construct(
        string $message,
        string $code,
        ?int $status = null,
        bool $retryable = false,
        ?Throwable $cause = null
    ) {
        parent::__construct($message, 0, $cause);
        $this->errorCode = $code;
        $this->status = $status;
        $this->retryable = $retryable;
    }
}

class AiConfigError extends AiError
{
    public function __construct(string $message)
    {
        parent::__construct($message, 'config', null, false);
    }
}

class AiTimeoutError extends AiError
{
    public function __construct(string $message = 'AI request timed out.')
    {
        parent::__construct($message, 'timeout', null, true);
    }
}

class AiRateLimitError extends AiError
{
    public function __construct(string $message = 'AI rate limit exceeded.', int $status = 429)
    {
        parent::__construct($message, 'rate_limit', $status, true);
    }
}

class AiAuthError extends AiError
{
    public function __construct(string $message = 'AI authentication failed.', int $status = 401)
    {
        parent::__construct($message, 'auth', $status, false);
    }
}

class AiApiError extends AiError
{
    public function __construct(string $message, int $status)
    {
        parent::__construct($message, 'api', $status, $status >= 500);
    }
}

class AiNetworkError extends AiError
{
    public function __construct(
        string $message = 'Network error while contacting AI service.',
        ?Throwable $cause = null
    ) {
        parent::__construct($message, 'network', null, true, $cause);
    }
}

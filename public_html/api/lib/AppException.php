<?php

declare(strict_types=1);

namespace RankRise\Api\Lib;

use Exception;
use Throwable;

/**
 * Application-level HTTP-aware exception.
 */
class AppException extends Exception
{
    private string $errorCode;

    /** @var array<string, mixed> */
    private array $context;

    /**
     * @param array<string, mixed> $context
     */
    public function __construct(
        string $message,
        int $status = 400,
        string $errorCode = 'bad_request',
        array $context = [],
        ?Throwable $previous = null
    ) {
        parent::__construct($message, $status, $previous);
        $this->errorCode = $errorCode;
        $this->context = $context;
    }

    public function getStatus(): int
    {
        $code = $this->getCode();
        return $code >= 400 && $code < 600 ? $code : 500;
    }

    public function getErrorCode(): string
    {
        return $this->errorCode;
    }

    /**
     * @return array<string, mixed>
     */
    public function getContext(): array
    {
        return $this->context;
    }
}

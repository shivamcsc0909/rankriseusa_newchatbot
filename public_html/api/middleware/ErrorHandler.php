<?php

declare(strict_types=1);

namespace RankRise\Api\Middleware;

use RankRise\Api\Lib\AppException;
use RankRise\Api\Lib\Logger;
use RankRise\Api\Lib\Response;
use Throwable;

/**
 * Registers PHP error / exception handlers and maps them to JSON responses.
 */
final class ErrorHandler
{
    private Logger $logger;
    private bool $debug;

    public function __construct(Logger $logger, bool $debug = false)
    {
        $this->logger = $logger;
        $this->debug = $debug;
    }

    public function register(): void
    {
        set_exception_handler([$this, 'handleException']);
        set_error_handler([$this, 'handleError']);
        register_shutdown_function([$this, 'handleShutdown']);
    }

    public function handleException(Throwable $e): void
    {
        if ($e instanceof AppException) {
            $status = $e->getStatus();
            $extra = [];

            if ($this->debug && $e->getContext() !== []) {
                $extra['context'] = $e->getContext();
            }

            if ($status >= 500) {
                $this->logger->error($e->getMessage(), [
                    'code' => $e->getErrorCode(),
                    'context' => $e->getContext(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                ]);
            }

            Response::fail($e->getMessage(), $status, $e->getErrorCode(), $extra);
            exit(1);
        }

        $this->logger->critical($e->getMessage(), [
            'class' => $e::class,
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $this->debug ? $e->getTraceAsString() : null,
        ]);

        Response::fail(
            $this->debug ? $e->getMessage() : 'Internal server error.',
            500,
            'internal',
            $this->debug ? [
                'exception' => $e::class,
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ] : []
        );
        exit(1);
    }

    public function handleError(int $severity, string $message, string $file, int $line): bool
    {
        if (!(error_reporting() & $severity)) {
            return false;
        }

        throw new AppException(
            $message,
            500,
            'php_error',
            ['severity' => $severity, 'file' => $file, 'line' => $line]
        );
    }

    public function handleShutdown(): void
    {
        $error = error_get_last();
        if ($error === null) {
            return;
        }

        $fatalTypes = [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR];
        if (!in_array($error['type'], $fatalTypes, true)) {
            return;
        }

        $this->logger->critical('Fatal error', $error);

        if (!headers_sent()) {
            Response::fail('Internal server error.', 500, 'fatal');
        }
    }
}

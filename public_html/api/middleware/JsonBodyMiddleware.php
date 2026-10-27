<?php

declare(strict_types=1);

namespace RankRise\Api\Middleware;

use RankRise\Api\Lib\AppException;
use RankRise\Api\Lib\Request;

/**
 * Ensures JSON Content-Type on mutating requests that include a body.
 */
final class JsonBodyMiddleware
{
    public function handle(Request $request, callable $next): mixed
    {
        if (!in_array($request->method(), ['POST', 'PUT', 'PATCH'], true)) {
            return $next($request);
        }

        if ($request->rawBody() === '') {
            return $next($request);
        }

        $contentType = strtolower((string) $request->header('content-type', ''));
        if (!str_contains($contentType, 'application/json')) {
            throw new AppException(
                'Content-Type must be application/json.',
                415,
                'unsupported_media_type'
            );
        }

        return $next($request);
    }

    /**
     * @return callable(Request, callable): mixed
     */
    public function __invoke(): callable
    {
        return [$this, 'handle'];
    }
}

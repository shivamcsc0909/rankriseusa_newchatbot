<?php

declare(strict_types=1);

namespace RankRise\Api\Middleware;

use RankRise\Api\Lib\Request;
use RankRise\Api\Lib\Response;

/**
 * Applies CORS headers and short-circuits OPTIONS.
 */
final class CorsMiddleware
{
    /** @var array<string, mixed> */
    private array $config;

    /**
     * @param array<string, mixed> $config
     */
    public function __construct(array $config)
    {
        $this->config = $config;
    }

    public function handle(Request $request, callable $next): mixed
    {
        $origin = $request->header('origin');
        /** @var list<string> $allowed */
        $allowed = $this->config['allowed_origins'] ?? [];
        /** @var list<string> $methods */
        $methods = $this->config['allowed_methods'] ?? ['GET', 'POST', 'OPTIONS'];
        /** @var list<string> $headers */
        $headers = $this->config['allowed_headers'] ?? ['Content-Type'];
        $maxAge = (int) ($this->config['max_age'] ?? 86400);

        if ($origin !== null && in_array($origin, $allowed, true) && !headers_sent()) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Vary: Origin');
            header('Access-Control-Allow-Methods: ' . implode(', ', $methods));
            header('Access-Control-Allow-Headers: ' . implode(', ', $headers));
            header('Access-Control-Max-Age: ' . $maxAge);
        }

        if ($request->method() === 'OPTIONS') {
            Response::noContent();
            return null;
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

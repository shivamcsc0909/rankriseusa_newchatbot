<?php

declare(strict_types=1);

namespace RankRise\Api\Middleware;

use RankRise\Api\Lib\Auth;
use RankRise\Api\Lib\Request;

/**
 * Requires valid admin API key.
 */
final class AuthMiddleware
{
    private Auth $auth;

    public function __construct(Auth $auth)
    {
        $this->auth = $auth;
    }

    public function handle(Request $request, callable $next): mixed
    {
        $this->auth->assert($request);
        return $next($request->withAttribute('auth', true));
    }

    /**
     * @return callable(Request, callable): mixed
     */
    public function __invoke(): callable
    {
        return [$this, 'handle'];
    }
}

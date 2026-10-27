<?php

declare(strict_types=1);

namespace RankRise\Api\Lib;

/**
 * Lightweight method + path router (no long-running process).
 */
final class Router
{
    /** @var list<array{methods: list<string>, pattern: string, regex: string, keys: list<string>, handler: callable, middleware: list<callable>}> */
    private array $routes = [];

    /** @var list<callable> */
    private array $globalMiddleware = [];

    /**
     * @param callable $middleware function(Request $request, callable $next): mixed
     */
    public function use(callable $middleware): self
    {
        $this->globalMiddleware[] = $middleware;
        return $this;
    }

    /**
     * @param list<callable> $middleware
     */
    public function add(string|array $methods, string $pattern, callable $handler, array $middleware = []): self
    {
        $methodList = array_map('strtoupper', (array) $methods);
        [$regex, $keys] = $this->compile($pattern);

        $this->routes[] = [
            'methods' => $methodList,
            'pattern' => $pattern,
            'regex' => $regex,
            'keys' => $keys,
            'handler' => $handler,
            'middleware' => $middleware,
        ];

        return $this;
    }

    /**
     * @param list<callable> $middleware
     */
    public function get(string $pattern, callable $handler, array $middleware = []): self
    {
        return $this->add('GET', $pattern, $handler, $middleware);
    }

    /**
     * @param list<callable> $middleware
     */
    public function post(string $pattern, callable $handler, array $middleware = []): self
    {
        return $this->add('POST', $pattern, $handler, $middleware);
    }

    /**
     * @param list<callable> $middleware
     */
    public function put(string $pattern, callable $handler, array $middleware = []): self
    {
        return $this->add('PUT', $pattern, $handler, $middleware);
    }

    /**
     * @param list<callable> $middleware
     */
    public function patch(string $pattern, callable $handler, array $middleware = []): self
    {
        return $this->add('PATCH', $pattern, $handler, $middleware);
    }

    /**
     * @param list<callable> $middleware
     */
    public function delete(string $pattern, callable $handler, array $middleware = []): self
    {
        return $this->add('DELETE', $pattern, $handler, $middleware);
    }

    public function dispatch(Request $request): mixed
    {
        foreach ($this->routes as $route) {
            if (!in_array($request->method(), $route['methods'], true)) {
                continue;
            }

            if (preg_match($route['regex'], $request->path(), $matches) !== 1) {
                continue;
            }

            $params = [];
            foreach ($route['keys'] as $key) {
                if (isset($matches[$key])) {
                    $params[$key] = $matches[$key];
                }
            }

            $request = $request->withAttribute('route_params', $params);
            foreach ($params as $key => $value) {
                $request = $request->withAttribute($key, $value);
            }

            $stack = array_merge($this->globalMiddleware, $route['middleware']);
            $handler = $route['handler'];

            $runner = array_reduce(
                array_reverse($stack),
                /**
                 * @param callable $next
                 * @param callable $middleware
                 */
                static function (callable $next, callable $middleware): callable {
                    return static function (Request $req) use ($middleware, $next): mixed {
                        return $middleware($req, $next);
                    };
                },
                static function (Request $req) use ($handler): mixed {
                    return $handler($req);
                }
            );

            return $runner($request);
        }

        throw new AppException('Not found.', 404, 'not_found');
    }

    /**
     * @return array{0: string, 1: list<string>}
     */
    private function compile(string $pattern): array
    {
        $keys = [];
        $regex = preg_replace_callback(
            '/\{([a-zA-Z_][a-zA-Z0-9_]*)\}/',
            static function (array $m) use (&$keys): string {
                $keys[] = $m[1];
                return '(?P<' . $m[1] . '>[^/]+)';
            },
            $pattern
        );

        if (!is_string($regex)) {
            $regex = $pattern;
        }

        return ['#^' . $regex . '$#', $keys];
    }
}

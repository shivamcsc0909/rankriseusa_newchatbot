<?php

declare(strict_types=1);

namespace RankRise\Api\Lib;

/**
 * Immutable HTTP request snapshot.
 */
final class Request
{
    private string $method;
    private string $path;
    private string $rawBody;

    /** @var array<string, mixed> */
    private array $query;

    /** @var array<string, mixed>|null */
    private ?array $json;

    /** @var array<string, string> */
    private array $headers;

    /** @var array<string, mixed> */
    private array $attributes;

    /**
     * @param array<string, mixed> $query
     * @param array<string, mixed>|null $json
     * @param array<string, string> $headers
     * @param array<string, mixed> $attributes
     */
    public function __construct(
        string $method,
        string $path,
        array $query = [],
        ?array $json = null,
        string $rawBody = '',
        array $headers = [],
        array $attributes = []
    ) {
        $this->method = strtoupper($method);
        $this->path = $path === '' ? '/' : $path;
        $this->query = $query;
        $this->json = $json;
        $this->rawBody = $rawBody;
        $this->headers = $headers;
        $this->attributes = $attributes;
    }

    public static function fromGlobals(int $jsonBodyLimitBytes = 1_048_576): self
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

        // Prefer PATH_INFO when using front controller rewrites (index.php/health).
        $pathInfo = $_SERVER['PATH_INFO'] ?? '';
        if (is_string($pathInfo) && $pathInfo !== '') {
            $path = $pathInfo;
        } else {
            $uri = $_SERVER['REQUEST_URI'] ?? '/';
            $path = parse_url($uri, PHP_URL_PATH);
            $path = is_string($path) ? $path : '/';

            // Normalize when front controller lives under /api.
            if (str_starts_with($path, '/api')) {
                $path = substr($path, 4);
                if ($path === '' || $path === false) {
                    $path = '/';
                }
            }

            // Strip front-controller filename if present.
            $scriptName = (string) ($_SERVER['SCRIPT_NAME'] ?? '');
            $script = basename($scriptName);
            if ($script !== '' && str_contains($path, '/' . $script)) {
                $parts = explode('/' . $script, $path, 2);
                $path = $parts[1] ?? '/';
                if ($path === '') {
                    $path = '/';
                }
            }
        }

        if ($path === '' || $path[0] !== '/') {
            $path = '/' . ltrim((string) $path, '/');
        }

        $headers = self::normalizeHeaders();
        $rawBody = '';
        $json = null;

        if (in_array(strtoupper((string) $method), ['POST', 'PUT', 'PATCH', 'DELETE'], true)) {
            $rawBody = file_get_contents('php://input') ?: '';
            if (strlen($rawBody) > $jsonBodyLimitBytes) {
                throw new AppException('Request body too large.', 413, 'payload_too_large');
            }

            $contentType = $headers['content-type'] ?? '';
            if ($rawBody !== '' && str_contains(strtolower($contentType), 'application/json')) {
                try {
                    /** @var mixed $decoded */
                    $decoded = json_decode($rawBody, true, 512, JSON_THROW_ON_ERROR);
                } catch (\JsonException $e) {
                    throw new AppException(
                        'Request body is not valid JSON.',
                        400,
                        'invalid_json',
                        [],
                        $e
                    );
                }

                if (!is_array($decoded)) {
                    throw new AppException('JSON body must be an object or array.', 400, 'invalid_json');
                }

                $json = $decoded;
            }
        }

        /** @var array<string, mixed> $query */
        $query = $_GET;

        return new self((string) $method, $path, $query, $json, $rawBody, $headers);
    }

    /**
     * @return array<string, string>
     */
    private static function normalizeHeaders(): array
    {
        $headers = [];

        if (function_exists('getallheaders')) {
            $all = getallheaders();
            if (is_array($all)) {
                foreach ($all as $key => $value) {
                    if (is_string($key) && (is_string($value) || is_numeric($value))) {
                        $headers[strtolower($key)] = (string) $value;
                    }
                }
            }
        }

        foreach ($_SERVER as $key => $value) {
            if (!is_string($key) || !str_starts_with($key, 'HTTP_')) {
                continue;
            }
            if (!is_string($value) && !is_numeric($value)) {
                continue;
            }
            $name = strtolower(str_replace('_', '-', substr($key, 5)));
            $headers[$name] = (string) $value;
        }

        if (isset($_SERVER['CONTENT_TYPE']) && is_string($_SERVER['CONTENT_TYPE'])) {
            $headers['content-type'] = $_SERVER['CONTENT_TYPE'];
        }

        return $headers;
    }

    public function method(): string
    {
        return $this->method;
    }

    public function path(): string
    {
        return $this->path;
    }

    public function rawBody(): string
    {
        return $this->rawBody;
    }

    /**
     * @return array<string, mixed>
     */
    public function query(): array
    {
        return $this->query;
    }

    public function queryString(string $key, ?string $default = null): ?string
    {
        if (!array_key_exists($key, $this->query)) {
            return $default;
        }
        $value = $this->query[$key];
        if (is_string($value) || is_numeric($value)) {
            return (string) $value;
        }
        return $default;
    }

    /**
     * @return array<string, mixed>
     */
    public function json(): array
    {
        return $this->json ?? [];
    }

    public function input(string $key, mixed $default = null): mixed
    {
        return $this->json[$key] ?? $this->query[$key] ?? $default;
    }

    public function header(string $name, ?string $default = null): ?string
    {
        $key = strtolower($name);
        return $this->headers[$key] ?? $default;
    }

    /**
     * @return array<string, string>
     */
    public function headers(): array
    {
        return $this->headers;
    }

    public function ip(): string
    {
        $candidates = [
            $this->header('x-forwarded-for'),
            $this->header('x-real-ip'),
            isset($_SERVER['REMOTE_ADDR']) && is_string($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : null,
        ];

        foreach ($candidates as $candidate) {
            if ($candidate === null || $candidate === '') {
                continue;
            }
            // Take first IP in X-Forwarded-For list.
            $ip = trim(explode(',', $candidate)[0]);
            if (filter_var($ip, FILTER_VALIDATE_IP)) {
                return $ip;
            }
        }

        return '0.0.0.0';
    }

    public function withAttribute(string $key, mixed $value): self
    {
        $clone = clone $this;
        $clone->attributes[$key] = $value;
        return $clone;
    }

    public function attribute(string $key, mixed $default = null): mixed
    {
        return $this->attributes[$key] ?? $default;
    }

    /**
     * @return array<string, mixed>
     */
    public function attributes(): array
    {
        return $this->attributes;
    }
}

<?php
/**
 * PayPal credentials — loaded from environment / .env only.
 * No hardcoded secrets or placeholders.
 */

(static function (): void {
    $paths = [
        dirname(__DIR__, 2) . '/.env',
        dirname(__DIR__) . '/.env',
        __DIR__ . '/.env',
    ];

    foreach ($paths as $path) {
        if (!is_file($path) || !is_readable($path)) {
            continue;
        }

        $lines = file($path, FILE_IGNORE_NEW_LINES);
        if ($lines === false) {
            continue;
        }

        foreach ($lines as $line) {
            $trimmed = trim($line);
            if ($trimmed === '' || str_starts_with($trimmed, '#')) {
                continue;
            }

            $eq = strpos($trimmed, '=');
            if ($eq === false) {
                continue;
            }

            $key = trim(substr($trimmed, 0, $eq));
            $value = trim(substr($trimmed, $eq + 1));
            if ($key === '') {
                continue;
            }

            if (
                strlen($value) >= 2
                && (
                    ($value[0] === '"' && str_ends_with($value, '"'))
                    || ($value[0] === "'" && str_ends_with($value, "'"))
                )
            ) {
                $value = substr($value, 1, -1);
            }

            if (!array_key_exists($key, $_ENV) && getenv($key) === false) {
                $_ENV[$key] = $value;
                putenv($key . '=' . $value);
            }
        }
    }
})();

/**
 * Read a non-empty env value.
 */
function paypal_env(string $key): string
{
    if (array_key_exists($key, $_ENV) && is_string($_ENV[$key]) && $_ENV[$key] !== '') {
        return $_ENV[$key];
    }

    $fromGetenv = getenv($key);
    if ($fromGetenv !== false && $fromGetenv !== '') {
        return $fromGetenv;
    }

    return '';
}

$paypalClientId = paypal_env('PAYPAL_CLIENT_ID');
if ($paypalClientId === '') {
    // Public client id may also be provided for the SPA build.
    $paypalClientId = paypal_env('VITE_PAYPAL_CLIENT_ID');
}

$paypalSecret = paypal_env('PAYPAL_SECRET');
$paypalApi = paypal_env('PAYPAL_API');
if ($paypalApi === '') {
    $paypalApi = 'https://api-m.paypal.com';
}

define('PAYPAL_CLIENT_ID', $paypalClientId);
define('PAYPAL_SECRET', $paypalSecret);
define('PAYPAL_API', $paypalApi);

function setCorsHeaders() {
    // Allow your frontend origin(s)
    $allowed = ['https://rankriseusa.com', 'https://www.rankriseusa.com'];
    // Also allow local development (remove in production)
    if ($_SERVER['HTTP_HOST'] === 'localhost' || $_SERVER['HTTP_HOST'] === '127.0.0.1') {
        $allowed[] = 'http://localhost:5173';
        $allowed[] = 'http://127.0.0.1:5173';
    }
    $origin  = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (in_array($origin, $allowed)) {
        header('Access-Control-Allow-Origin: ' . $origin);
    }
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Content-Type: application/json');
}

function getAccessToken() {
    if (PAYPAL_CLIENT_ID === '' || PAYPAL_SECRET === '') {
        return null;
    }

    $credentials = base64_encode(PAYPAL_CLIENT_ID . ':' . PAYPAL_SECRET);
    $ch = curl_init(PAYPAL_API . '/v1/oauth2/token');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => 'grant_type=client_credentials',
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/x-www-form-urlencoded',
            'Authorization: Basic ' . $credentials,
        ],
    ]);
    $response = curl_exec($ch);
    curl_close($ch);
    $data = json_decode($response, true);
    return $data['access_token'] ?? null;
}

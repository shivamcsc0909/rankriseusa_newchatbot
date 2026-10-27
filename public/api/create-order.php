<?php
require_once __DIR__ . '/config.php';
setCorsHeaders();

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST')    { http_response_code(405); echo json_encode(['error' => 'Method not allowed']); exit; }

$body   = json_decode(file_get_contents('php://input'), true);
$amount = $body['amount'] ?? null;

if (!$amount || !is_numeric($amount) || floatval($amount) <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid amount']);
    exit;
}

$accessToken = getAccessToken();
if (!$accessToken) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to authenticate with PayPal']);
    exit;
}

$orderData = json_encode([
    'intent' => 'CAPTURE',
    'purchase_units' => [[
        'description' => 'RankRise USA - Digital Marketing Services',
        'amount' => [
            'currency_code' => 'USD',
            'value'         => number_format(floatval($amount), 2, '.', ''),
        ],
    ]],
]);

$ch = curl_init(PAYPAL_API . '/v2/checkout/orders');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $orderData,
    CURLOPT_HTTPHEADER     => [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $accessToken,
    ],
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

http_response_code($httpCode);
echo $response;
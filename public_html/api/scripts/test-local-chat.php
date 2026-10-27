<?php

/**
 * Offline chatbot regression: local answers must work WITHOUT OpenAI.
 * Run: php public/api/scripts/test-local-chat.php
 */

declare(strict_types=1);

$root = dirname(__DIR__);
require_once $root . '/lib/Env.php';
require_once $root . '/lib/AppException.php';
require_once $root . '/services/WorkflowConfig.php';
require_once $root . '/services/AiWorkflow.php';

use RankRise\Api\Services\AiWorkflow;
use RankRise\Api\Services\LocalAnswerEngine;

// Force OpenAI unavailable for this test.
putenv('OPENAI_API_KEY=');
$_ENV['OPENAI_API_KEY'] = '';

LocalAnswerEngine::clearCache();

$wf = new AiWorkflow([
    'config' => array_replace_recursive(
        \RankRise\Api\Services\WorkflowConfig::load(),
        ['ai' => ['enabled' => false]]
    ),
]);

$cases = [
    ['hi', ['faq', 'website_index', 'knowledge', 'faq_soft']],
    ['What services do you offer?', ['website_index', 'knowledge', 'faq', 'business_data', 'faq_soft']],
    ['How much does SEO cost?', ['website_index', 'knowledge', 'faq', 'business_data', 'faq_soft']],
    ['What is your phone number?', ['website_index', 'knowledge', 'faq', 'business_data', 'faq_soft']],
    ['Where is your office?', ['website_index', 'knowledge', 'faq', 'business_data', 'faq_soft']],
    ['business hours', ['website_index', 'knowledge', 'faq', 'business_data', 'faq_soft']],
    ['Do you have courses?', ['website_index', 'knowledge', 'faq', 'business_data', 'faq_soft']],
    ['Show me your portfolio', ['website_index', 'knowledge', 'faq', 'business_data', 'faq_soft']],
    ['privacy policy', ['website_index', 'knowledge', 'faq', 'business_data', 'faq_soft']],
    ['pricng packages', ['website_index', 'knowledge', 'faq', 'business_data', 'faq_soft']],
    ['Tell me about RankRise', ['website_index', 'knowledge', 'faq', 'business_data', 'faq_soft']],
];

$pass = 0;
$fail = 0;
$timings = [];

echo "=== Local-first chatbot tests (OpenAI disabled) ===\n\n";

foreach ($cases as [$message, $allowedSources]) {
    $allowed = is_array($allowedSources) ? $allowedSources : [$allowedSources];
    $t0 = hrtime(true);
    $out = $wf->processVisitorMessage(['message' => $message, 'history' => []]);
    $ms = round((hrtime(true) - $t0) / 1e6, 2);
    $timings[] = $ms;

    $type = $out['type'] ?? '';
    $source = $out['source'] ?? '';
    $openaiUsed = $out['openai']['used'] ?? null;
    $msgLen = strlen((string) ($out['message'] ?? ''));

    $ok = $type === 'reply'
        && in_array($source, $allowed, true)
        && $msgLen > 20
        && $openaiUsed === false;

    // Cached second call timing
    $t1 = hrtime(true);
    $wf->processVisitorMessage(['message' => $message, 'history' => []]);
    $cacheMs = round((hrtime(true) - $t1) / 1e6, 2);

    $status = $ok ? 'PASS' : 'FAIL';
    if ($ok) {
        $pass++;
    } else {
        $fail++;
    }

    echo sprintf(
        "[%s] %s\n  type=%s source=%s openai_used=%s len=%d time=%sms cache=%sms\n  preview=%s\n\n",
        $status,
        $message,
        $type,
        $source,
        $openaiUsed === true ? 'yes' : 'no',
        $msgLen,
        $ms,
        $cacheMs,
        substr(preg_replace('/\s+/', ' ', (string) ($out['message'] ?? '')), 0, 100)
    );
}

// Confirm random unrelated still handovers without OpenAI (acceptable)
$out = $wf->processVisitorMessage(['message' => 'What is the capital of Mars?', 'history' => []]);
echo sprintf(
    "[INFO] unrelated query → type=%s reason=%s openai=%s\n",
    $out['type'] ?? '',
    $out['reason'] ?? '',
    !empty($out['openai']['available']) ? 'available' : 'unavailable'
);

$avg = $timings ? round(array_sum($timings) / count($timings), 2) : 0;
$max = $timings ? max($timings) : 0;
echo "\n=== Summary: {$pass} passed, {$fail} failed | avg {$avg}ms | max {$max}ms ===\n";
exit($fail > 0 ? 1 : 0);

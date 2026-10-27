<?php

/**
 * Website-knowledge chatbot regression (no OpenAI required).
 * Run: php public/api/scripts/test-website-knowledge.php
 */

declare(strict_types=1);

$root = dirname(__DIR__);
require_once $root . '/lib/Env.php';
require_once $root . '/lib/AppException.php';
require_once $root . '/services/WorkflowConfig.php';
require_once $root . '/services/WebsiteKnowledgeBuilder.php';
require_once $root . '/services/WebsiteKnowledgeIndex.php';
require_once $root . '/services/AiWorkflow.php';

use RankRise\Api\Services\AiWorkflow;
use RankRise\Api\Services\LocalAnswerEngine;
use RankRise\Api\Services\WebsiteKnowledgeBuilder;
use RankRise\Api\Services\WebsiteKnowledgeIndex;

putenv('OPENAI_API_KEY=');
$_ENV['OPENAI_API_KEY'] = '';

LocalAnswerEngine::clearCache();
WebsiteKnowledgeIndex::clearMemory();

echo "=== Rebuild index ===\n";
$rebuild = (new WebsiteKnowledgeBuilder())->rebuild();
echo 'docs=' . $rebuild['doc_count'] . ' sources=' . json_encode($rebuild['sources']) . "\n\n";

$wf = new AiWorkflow([
    'config' => array_replace_recursive(
        \RankRise\Api\Services\WorkflowConfig::load(),
        [
            'ai' => ['enabled' => false],
            'websiteKnowledge' => ['strict' => true, 'enabled' => true],
        ]
    ),
]);

$cases = [
    ['Do you provide SEO?', 'website_index', false],
    ['What services do you offer?', null, false],
    ['How much does SEO cost?', null, false],
    ['What is your phone number?', null, false],
    ['privacy policy', null, false],
    ['Show me your portfolio', null, false],
    ['asdfzxcv qwerty nonsense 99999', 'website_low_confidence', true],
];

$pass = 0;
$fail = 0;
$timings = [];

echo "=== Website knowledge chat tests ===\n\n";

foreach ($cases as [$q, $expectSource, $expectLow]) {
    LocalAnswerEngine::clearCache();
    $t0 = hrtime(true);
    $r = $wf->processVisitorMessage(['visitorId' => 'test', 'message' => $q, 'history' => []]);
    $ms = (hrtime(true) - $t0) / 1e6;
    $timings[] = $ms;

    $type = $r['type'] ?? '';
    $source = $r['source'] ?? '';
    $msg = trim((string) ($r['message'] ?? ''));
    $openaiUsed = !empty($r['openai']['used']);
    $low = !empty($r['local']['low_confidence']) || $source === 'website_low_confidence';

    $ok = $type === 'reply'
        && $msg !== ''
        && $openaiUsed === false
        && ($expectSource === null || $source === $expectSource || ($expectSource === 'website_index' && in_array($source, ['website_index', 'knowledge', 'faq', 'business_data', 'faq_soft'], true)))
        && ($expectLow ? $low : true)
        && $ms < 200;

    if ($expectLow && !str_contains($msg, "couldn't find")) {
        $ok = false;
    }
    if (!$expectLow && str_contains(strtolower($msg), 'openai')) {
        $ok = false;
    }

    if ($ok) {
        $pass++;
        echo "[PASS] {$q}\n";
    } else {
        $fail++;
        echo "[FAIL] {$q}\n";
    }
    echo "  type={$type} source={$source} openai_used=" . ($openaiUsed ? 'yes' : 'no')
        . ' len=' . strlen($msg) . ' time=' . round($ms, 2) . "ms\n";
    echo '  preview=' . substr(str_replace("\n", ' ', $msg), 0, 100) . "\n\n";
}

$avg = $timings !== [] ? array_sum($timings) / count($timings) : 0;
$max = $timings !== [] ? max($timings) : 0;
echo "=== Summary: {$pass} passed, {$fail} failed | avg " . round($avg, 2) . 'ms | max ' . round($max, 2) . "ms ===\n";
exit($fail > 0 ? 1 : 0);

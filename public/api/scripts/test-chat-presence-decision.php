<?php

/**
 * Presence vs human-takeover decision regression.
 * Run: php public/api/scripts/test-chat-presence-decision.php
 *
 * Agents online must NOT silence the bot.
 * Bot is silenced only when conversation.mode=human or assignedAgentId is set.
 */

declare(strict_types=1);

$root = dirname(__DIR__);
require_once $root . '/bootstrap.php';
require_once $root . '/services/ChatRuntime.php';
require_once $root . '/services/LocalAnswerEngine.php';

use RankRise\Api\Services\ChatRuntime;
use RankRise\Api\Services\LocalAnswerEngine;

putenv('OPENAI_API_KEY=');
$_ENV['OPENAI_API_KEY'] = '';
LocalAnswerEngine::clearCache();

$tmp = sys_get_temp_dir() . '/rankrise-chat-presence-' . bin2hex(random_bytes(4));
if (!@mkdir($tmp, 0755, true) && !is_dir($tmp)) {
    fwrite(STDERR, "Failed to create temp dir\n");
    exit(1);
}
putenv('CHAT_DATA_DIR=' . $tmp);
$_ENV['CHAT_DATA_DIR'] = $tmp;

$runtime = new ChatRuntime($tmp);
$pass = 0;
$fail = 0;

function assert_case(bool $ok, string $label, string $detail = ''): void
{
    global $pass, $fail;
    if ($ok) {
        $pass++;
        echo "[PASS] {$label}\n";
    } else {
        $fail++;
        echo "[FAIL] {$label}" . ($detail !== '' ? " — {$detail}" : '') . "\n";
    }
}

// --- 1) Agents online + AI mode → bot MUST reply ---
$runtime->presence()->heartbeat('dashboard', 120);
$agents = $runtime->presence()->agentsOnline(120);
assert_case($agents > 0, 'presence agentsOnline > 0', "got {$agents}");

$r1 = $runtime->receiveVisitorMessage([
    'visitorId' => 'visitor-presence-ai',
    'content' => 'Do you provide SEO?',
    'id' => 'msg-seo-1',
    'timestamp' => (int) round(microtime(true) * 1000),
]);

assert_case(($r1['ok'] ?? false) === true, 'AI+presence: ok');
assert_case(($r1['bot'] ?? null) === true, 'AI+presence: bot=true', 'bot=' . json_encode($r1['bot'] ?? null));
assert_case(is_array($r1['reply'] ?? null), 'AI+presence: reply present', 'reply=' . json_encode($r1['reply'] ?? null));
assert_case(($r1['agentsOnline'] ?? 0) > 0, 'AI+presence: agentsOnline still reported');
assert_case(($r1['mode'] ?? 'ai') !== 'human', 'AI+presence: stays AI mode', 'mode=' . ($r1['mode'] ?? ''));
$replyText = (string) (($r1['reply']['content'] ?? ''));
assert_case(stripos($replyText, 'SEO') !== false || strlen($replyText) > 40, 'AI+presence: knowledge answer', substr($replyText, 0, 120));

// --- 2) Admin take over (assign) → subsequent visitor message silences bot ---
$runtime->receiveAgentMessage([
    'visitorId' => 'visitor-presence-ai',
    'content' => 'Hi, I am taking over this chat.',
    'id' => 'msg-admin-1',
], 'admin-1');

$r2 = $runtime->receiveVisitorMessage([
    'visitorId' => 'visitor-presence-ai',
    'content' => 'What is your pricing?',
    'id' => 'msg-visitor-after-takeover',
    'timestamp' => (int) round(microtime(true) * 1000),
]);

assert_case(($r2['bot'] ?? null) === false, 'human mode: bot=false', 'bot=' . json_encode($r2['bot'] ?? null));
assert_case(array_key_exists('reply', $r2) && $r2['reply'] === null, 'human mode: reply=null', 'reply=' . json_encode($r2['reply'] ?? 'missing'));
assert_case(($r2['mode'] ?? '') === 'human', 'human mode: mode=human', 'mode=' . ($r2['mode'] ?? ''));

// --- 3) Fresh visitor, agents still online → bot replies again ---
$r3 = $runtime->receiveVisitorMessage([
    'visitorId' => 'visitor-fresh-ai',
    'content' => 'What is your phone number?',
    'id' => 'msg-phone-1',
    'timestamp' => (int) round(microtime(true) * 1000),
]);
assert_case(($r3['bot'] ?? null) === true, 'fresh visitor+presence: bot=true');
assert_case(is_array($r3['reply'] ?? null), 'fresh visitor+presence: reply present');

// --- 4) Explicit human request → locks human mode; follow-up silences bot ---
$r4 = $runtime->receiveVisitorMessage([
    'visitorId' => 'visitor-ask-human',
    'content' => 'I want to talk to a human agent please',
    'id' => 'msg-human-req',
    'timestamp' => (int) round(microtime(true) * 1000),
]);
// First response may include handover message, but mode becomes human.
$mode4 = (string) (($r4['conversation']['mode'] ?? $r4['mode'] ?? ''));
assert_case($mode4 === 'human' || ($r4['handover']['reason'] ?? '') === 'visitor_requested_human', 'human request flagged', json_encode([
    'mode' => $mode4,
    'handover' => $r4['handover'] ?? null,
]));

$r5 = $runtime->receiveVisitorMessage([
    'visitorId' => 'visitor-ask-human',
    'content' => 'Are you still there?',
    'id' => 'msg-human-followup',
    'timestamp' => (int) round(microtime(true) * 1000),
]);
assert_case(
    ($r5['bot'] ?? null) === false && array_key_exists('reply', $r5) && $r5['reply'] === null,
    'after human request: bot silenced',
    json_encode(['bot' => $r5['bot'] ?? null, 'reply' => $r5['reply'] ?? 'missing', 'mode' => $r5['mode'] ?? null])
);

// cleanup
foreach (glob($tmp . '/*') ?: [] as $f) {
    @unlink($f);
}
@rmdir($tmp);

echo "\n=== Summary: {$pass} passed, {$fail} failed ===\n";
exit($fail > 0 ? 1 : 0);

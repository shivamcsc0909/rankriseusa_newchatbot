<?php

declare(strict_types=1);

namespace RankRise\Api\Services;

use RankRise\Api\Lib\Database;
use RankRise\Api\Lib\Env;

require_once __DIR__ . '/BlogStore.php';
require_once __DIR__ . '/FaqStore.php';
require_once __DIR__ . '/KnowledgeStore.php';
require_once __DIR__ . '/LeadStore.php';
require_once __DIR__ . '/ConversationStore.php';
require_once __DIR__ . '/PresenceStore.php';

/**
 * Aggregated admin dashboard / analytics counters.
 */
final class AdminStatsService
{
    public function snapshot(): array
    {
        $blogs = $this->blogStats();
        $chats = $this->chatStats();
        $faqs = $this->faqStats();
        $knowledge = $this->knowledgeStats();
        $leads = $this->leadStats();
        $presence = $this->presenceStats();
        $series = $this->buildSeries($chats['by_day'] ?? [], $leads['by_day'] ?? []);

        return [
            'blogs' => $blogs,
            'chats' => [
                'total' => $chats['total'],
                'pending' => $chats['pending'],
                'open' => $chats['open'],
                'closed' => $chats['closed'],
                'today' => $chats['today'],
            ],
            'presence' => $presence,
            'visitors' => [
                'today' => $chats['today'],
                'active' => $presence['activeVisitors'],
            ],
            'faqs' => $faqs,
            'knowledge' => $knowledge,
            'leads' => [
                'total' => $leads['total'],
                'today' => $leads['today'],
                'new' => $leads['new'],
            ],
            'series' => $series,
        ];
    }

    public function settings(): array
    {
        $db = require dirname(__DIR__) . '/config/database.php';
        $app = require dirname(__DIR__) . '/config/app.php';
        $cors = require dirname(__DIR__) . '/config/cors.php';

        $dbConfigured = is_string($db['database'] ?? null)
            && $db['database'] !== ''
            && is_string($db['username'] ?? null)
            && $db['username'] !== '';

        $dbReachable = false;
        if ($dbConfigured) {
            try {
                $dbReachable = Database::ping();
            } catch (\Throwable) {
                $dbReachable = false;
            }
        }

        $openaiKey = Env::get('OPENAI_API_KEY');
        $kb = new KnowledgeStore();
        $chatDir = dirname(__DIR__) . '/storage/chat';
        $leadsDir = dirname(__DIR__) . '/storage/leads';
        $uploadsDir = dirname(__DIR__) . '/storage/uploads';

        return [
            'app' => [
                'name' => (string) ($app['name'] ?? 'RankRise API'),
                'env' => (string) ($app['env'] ?? 'production'),
                'debug' => (bool) ($app['debug'] ?? false),
                'url' => (string) (Env::get('APP_URL') ?? ''),
            ],
            'php' => PHP_VERSION,
            'database' => [
                'configured' => $dbConfigured,
                'reachable' => $dbReachable,
            ],
            'openai' => [
                'configured' => $openaiKey !== null && $openaiKey !== '',
                'model' => (string) (Env::get('OPENAI_MODEL') ?? 'gpt-4o-mini'),
            ],
            'auth' => [
                'admin_configured' => (Env::get('ADMIN_API_KEY') ?? '') !== '',
                'header' => (string) (Env::get('ADMIN_API_HEADER') ?? 'X-Admin-Key'),
            ],
            'cors' => [
                'origins_count' => is_array($cors['allowed_origins'] ?? null)
                    ? count($cors['allowed_origins'])
                    : 0,
                'allow_localhost' => (bool) ($cors['allow_localhost'] ?? false),
            ],
            'poll' => is_array($app['poll'] ?? null) ? $app['poll'] : [],
            'knowledge' => [
                'collections' => $kb->collections(),
                'files_present' => $kb->filesPresent(),
            ],
            'storage' => [
                'chat_writable' => is_dir($chatDir) && is_writable($chatDir),
                'leads_writable' => is_dir($leadsDir) ? is_writable($leadsDir) : @mkdir($leadsDir, 0755, true),
                'uploads_writable' => is_dir($uploadsDir) ? is_writable($uploadsDir) : @mkdir($uploadsDir, 0755, true),
                'knowledge_writable' => is_writable($kb->dataDir()),
            ],
        ];
    }

    /**
     * @return array{total: int, published: int, draft: int}
     */
    private function blogStats(): array
    {
        try {
            $store = new BlogStore();
            $all = $store->listPosts(true);
            $published = 0;
            $draft = 0;
            foreach ($all as $p) {
                $st = (string) ($p['status'] ?? 'published');
                if ($st === 'published') {
                    $published++;
                } elseif ($st === 'draft') {
                    $draft++;
                }
            }
            return ['total' => count($all), 'published' => $published, 'draft' => $draft];
        } catch (\Throwable) {
            return ['total' => 0, 'published' => 0, 'draft' => 0];
        }
    }

    /**
     * @return array{total: int, pending: int, open: int, closed: int, today: int, by_day: array<string, int>}
     */
    private function chatDataDir(): string
    {
        $fromEnv = Env::get('CHAT_DATA_DIR');
        return ($fromEnv !== null && $fromEnv !== '')
            ? $fromEnv
            : (dirname(__DIR__) . '/storage/chat');
    }

    /**
     * @return array{total: int, pending: int, open: int, closed: int, today: int, by_day: array<string, int>}
     */
    private function chatStats(): array
    {
        try {
            $store = new ConversationStore($this->chatDataDir());
            $items = $store->list();
            $pending = $open = $closed = $today = 0;
            $todayPrefix = gmdate('Y-m-d');
            $byDay = [];
            for ($i = 6; $i >= 0; $i--) {
                $byDay[gmdate('Y-m-d', time() - ($i * 86400))] = 0;
            }

            foreach ($items as $c) {
                $status = (string) ($c['status'] ?? 'open');
                if ($status === 'pending') {
                    $pending++;
                } elseif ($status === 'closed') {
                    $closed++;
                } else {
                    $open++;
                }

                $ts = (int) ($c['firstSeenAt'] ?? $c['lastMessageAt'] ?? 0);
                if ($ts > 1000000000000) {
                    $ts = (int) floor($ts / 1000);
                }
                if ($ts > 0) {
                    $day = gmdate('Y-m-d', $ts);
                    if (isset($byDay[$day])) {
                        $byDay[$day]++;
                    }
                    if ($day === $todayPrefix) {
                        $today++;
                    }
                }
            }

            return [
                'total' => count($items),
                'pending' => $pending,
                'open' => $open,
                'closed' => $closed,
                'today' => $today,
                'by_day' => $byDay,
            ];
        } catch (\Throwable) {
            return ['total' => 0, 'pending' => 0, 'open' => 0, 'closed' => 0, 'today' => 0, 'by_day' => []];
        }
    }

    /**
     * @return array{total: int, enabled: int}
     */
    private function faqStats(): array
    {
        try {
            $store = new FaqStore();
            $all = $store->listAll(['limit' => 1000]);
            $enabled = count($store->listEnabled());
            return ['total' => count($all), 'enabled' => $enabled];
        } catch (\Throwable) {
            return ['total' => 0, 'enabled' => 0];
        }
    }

    /**
     * @return array{total: int, collections: int}
     */
    private function knowledgeStats(): array
    {
        try {
            $store = new KnowledgeStore();
            return [
                'total' => $store->countAll(),
                'collections' => count($store->filesPresent()),
            ];
        } catch (\Throwable) {
            return ['total' => 0, 'collections' => 0];
        }
    }

    /**
     * @return array{total: int, today: int, new: int, by_day: array<string, int>}
     */
    private function leadStats(): array
    {
        try {
            $store = new LeadStore();
            $byDay = [];
            foreach ($store->seriesLastDays(7) as $row) {
                $byDay[$row['day']] = $row['leads'];
            }
            return [
                'total' => $store->count(),
                'today' => $store->countToday(),
                'new' => $store->countNew(),
                'by_day' => $byDay,
            ];
        } catch (\Throwable) {
            return ['total' => 0, 'today' => 0, 'new' => 0, 'by_day' => []];
        }
    }

    /**
     * @return array{agentsOnline: int, activeVisitors: int}
     */
    private function presenceStats(): array
    {
        try {
            $dir = $this->chatDataDir();
            $presence = new PresenceStore($dir);
            $agents = $presence->agentsOnline(30);
            $store = new ConversationStore($dir);
            $active = 0;
            $cutoff = (int) round(microtime(true) * 1000) - (30 * 60 * 1000);
            foreach ($store->list() as $c) {
                $last = (int) ($c['lastMessageAt'] ?? $c['visitor']['lastSeenAt'] ?? 0);
                if ($last >= $cutoff && ($c['status'] ?? '') !== 'closed') {
                    $active++;
                }
            }
            return ['agentsOnline' => $agents, 'activeVisitors' => $active];
        } catch (\Throwable) {
            return ['agentsOnline' => 0, 'activeVisitors' => 0];
        }
    }

    /**
     * @param array<string, int> $chatsByDay
     * @param array<string, int> $leadsByDay
     * @return list<array{day: string, chats: int, leads: int}>
     */
    private function buildSeries(array $chatsByDay, array $leadsByDay): array
    {
        $out = [];
        for ($i = 6; $i >= 0; $i--) {
            $day = gmdate('Y-m-d', time() - ($i * 86400));
            $out[] = [
                'day' => $day,
                'chats' => (int) ($chatsByDay[$day] ?? 0),
                'leads' => (int) ($leadsByDay[$day] ?? 0),
            ];
        }
        return $out;
    }
}

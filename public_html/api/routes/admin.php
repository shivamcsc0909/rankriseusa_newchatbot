<?php

declare(strict_types=1);

/**
 * Phase 6 — Admin backend routes (conversation management, notifications,
 * assignments, status updates). All auth via X-Admin-Key. Polling-based.
 *
 * @var array{
 *   app: array<string, mixed>,
 *   auth: \RankRise\Api\Lib\Auth,
 *   router: \RankRise\Api\Lib\Router,
 *   logger: \RankRise\Api\Lib\Logger
 * } $rankrise
 */

use RankRise\Api\Lib\AppException;
use RankRise\Api\Lib\Request;
use RankRise\Api\Lib\Response;
use RankRise\Api\Middleware\AuthMiddleware;
use RankRise\Api\Middleware\JsonBodyMiddleware;
use RankRise\Api\Services\AdminChatService;
use RankRise\Api\Services\FaqStore;

require_once dirname(__DIR__) . '/services/FaqStore.php';
require_once dirname(__DIR__) . '/services/LocalAnswerEngine.php';

$router = $rankrise['router'];
$auth = $rankrise['auth'];
$app = $rankrise['app'];
$logger = $rankrise['logger'];

$adminFactory = static function (): AdminChatService {
    static $admin = null;
    if (!$admin instanceof AdminChatService) {
        $admin = new AdminChatService();
    }
    return $admin;
};

$pollTtl = (int) (($app['poll']['presence_ttl_seconds'] ?? 30));
$adminMw = [(new AuthMiddleware($auth))()];
$adminJsonMw = [
    (new JsonBodyMiddleware())(),
    (new AuthMiddleware($auth))(),
];

/**
 * Admin poll — conversations + notifications + presence (primary dashboard feed).
 * GET /v1/admin/poll
 */
$router->get(
    '/v1/admin/poll',
    static function (Request $request) use ($adminFactory, $pollTtl): void {
        $adminId = (string) ($request->queryString('adminId', 'dashboard') ?? 'dashboard');
        Response::ok($adminFactory()->pollSnapshot($adminId, $pollTtl));
    },
    $adminMw
);

/**
 * List conversations with optional filters.
 * GET /v1/admin/conversations?status=&unread=1&assigned=&search=
 */
$router->get(
    '/v1/admin/conversations',
    static function (Request $request) use ($adminFactory): void {
        $unread = $request->queryString('unread');
        $conversations = $adminFactory()->listConversations([
            'status' => $request->queryString('status'),
            'unread' => $unread === '1' || $unread === 'true',
            'assigned' => $request->queryString('assigned'),
            'search' => $request->queryString('search'),
            'limit' => (int) ($request->queryString('limit', '500') ?? '500'),
        ]);
        Response::ok([
            'conversations' => $conversations,
            'total' => count($conversations),
        ]);
    },
    $adminMw
);

/**
 * Get one conversation.
 * GET /v1/admin/conversations/{id}
 */
$router->get(
    '/v1/admin/conversations/{id}',
    static function (Request $request) use ($adminFactory): void {
        $id = (string) $request->attribute('id', '');
        $conversation = $adminFactory()->getConversation($id);
        if ($conversation === null) {
            throw new AppException('Conversation not found.', 404, 'not_found');
        }
        Response::ok(['conversation' => $conversation]);
    },
    $adminMw
);

/**
 * Export conversation transcript (text/plain download).
 * GET /v1/admin/conversations/{id}/export
 */
$router->get(
    '/v1/admin/conversations/{id}/export',
    static function (Request $request) use ($adminFactory): void {
        $id = (string) $request->attribute('id', '');
        $text = $adminFactory()->exportConversation($id);
        if ($text === null) {
            throw new AppException('Conversation not found.', 404, 'not_found');
        }
        if (!headers_sent()) {
            http_response_code(200);
            header('Content-Type: text/plain; charset=utf-8');
            header('Content-Disposition: attachment; filename="chat-' . preg_replace('/[^a-zA-Z0-9_-]/', '', $id) . '.txt"');
            header('Cache-Control: no-store');
        }
        echo $text;
        exit;
    },
    $adminMw
);

/**
 * Update conversation status and/or assignment.
 * POST /v1/admin/conversations/update
 * Body: { conversationId, status?, agentId? }
 */
$router->post(
    '/v1/admin/conversations/update',
    static function (Request $request) use ($adminFactory, $logger): void {
        $body = $request->json();
        $id = trim((string) ($body['conversationId'] ?? ''));
        if ($id === '') {
            throw new AppException('conversationId is required.', 422, 'validation_error');
        }

        $status = isset($body['status']) && is_string($body['status']) ? $body['status'] : null;
        $agentId = isset($body['agentId']) && is_string($body['agentId']) ? $body['agentId'] : null;

        if (($status === null || $status === '') && ($agentId === null || $agentId === '')) {
            throw new AppException(
                'Provide status and/or agentId.',
                422,
                'validation_error'
            );
        }

        $updated = $adminFactory()->updateConversation($id, $status, $agentId);
        if ($updated === null) {
            throw new AppException('Conversation not found or invalid status.', 404, 'not_found');
        }

        $logger->info('admin.conversation.update', [
            'conversationId' => $id,
            'status' => $status,
            'agentId' => $agentId,
        ]);

        Response::ok(['conversation' => $updated]);
    },
    $adminJsonMw
);

/**
 * Assign conversation to an agent.
 * POST /v1/admin/conversations/assign
 * Body: { conversationId, agentId }
 */
$router->post(
    '/v1/admin/conversations/assign',
    static function (Request $request) use ($adminFactory, $logger): void {
        $body = $request->json();
        $id = trim((string) ($body['conversationId'] ?? ''));
        $agentId = trim((string) ($body['agentId'] ?? ''));
        if ($id === '' || $agentId === '') {
            throw new AppException(
                'conversationId and agentId are required.',
                422,
                'validation_error'
            );
        }

        $updated = $adminFactory()->assign($id, $agentId);
        if ($updated === null) {
            throw new AppException('Conversation not found.', 404, 'not_found');
        }

        $logger->info('admin.conversation.assign', [
            'conversationId' => $id,
            'agentId' => $agentId,
        ]);

        Response::ok(['conversation' => $updated]);
    },
    $adminJsonMw
);

/**
 * Set conversation status (open | pending | closed).
 * POST /v1/admin/conversations/status
 * Body: { conversationId, status }
 */
$router->post(
    '/v1/admin/conversations/status',
    static function (Request $request) use ($adminFactory, $logger): void {
        $body = $request->json();
        $id = trim((string) ($body['conversationId'] ?? ''));
        $status = trim((string) ($body['status'] ?? ''));
        if ($id === '' || $status === '') {
            throw new AppException(
                'conversationId and status are required.',
                422,
                'validation_error'
            );
        }

        $updated = $adminFactory()->setStatus($id, $status);
        if ($updated === null) {
            throw new AppException('Conversation not found or invalid status.', 404, 'not_found');
        }

        $logger->info('admin.conversation.status', [
            'conversationId' => $id,
            'status' => $status,
        ]);

        Response::ok(['conversation' => $updated]);
    },
    $adminJsonMw
);

/**
 * Mark conversation read.
 * POST /v1/admin/conversations/read
 */
$router->post(
    '/v1/admin/conversations/read',
    static function (Request $request) use ($adminFactory): void {
        $body = $request->json();
        $id = trim((string) ($body['conversationId'] ?? ''));
        if ($id === '') {
            throw new AppException('conversationId is required.', 422, 'validation_error');
        }
        $updated = $adminFactory()->markRead($id);
        Response::ok(['conversation' => $updated]);
    },
    $adminJsonMw
);

/**
 * List notifications.
 * GET /v1/admin/notifications?all=1
 */
$router->get(
    '/v1/admin/notifications',
    static function (Request $request) use ($adminFactory): void {
        $all = $request->queryString('all');
        $unreadOnly = !($all === '1' || $all === 'true');
        Response::ok([
            'notifications' => $adminFactory()->listNotifications($unreadOnly, 100),
        ]);
    },
    $adminMw
);

/**
 * Mark one notification read.
 * POST /v1/admin/notifications/read
 */
$router->post(
    '/v1/admin/notifications/read',
    static function (Request $request) use ($adminFactory): void {
        $body = $request->json();
        $id = trim((string) ($body['id'] ?? ''));
        if ($id === '') {
            throw new AppException('id is required.', 422, 'validation_error');
        }
        Response::ok(['read' => $adminFactory()->markNotificationRead($id)]);
    },
    $adminJsonMw
);

/**
 * Mark all notifications read.
 * POST /v1/admin/notifications/read-all
 */
$router->post(
    '/v1/admin/notifications/read-all',
    static function (Request $request) use ($adminFactory, $logger): void {
        $count = $adminFactory()->markAllNotificationsRead();
        $logger->info('admin.notifications.read_all', ['count' => $count]);
        Response::ok(['count' => $count]);
    },
    $adminJsonMw
);

/* ------------------------------------------------------------------ *
 * FAQ First Response System — admin management (same X-Admin-Key auth).
 * ------------------------------------------------------------------ */

$faqFactory = static function (): FaqStore {
    static $store = null;
    if (!$store instanceof FaqStore) {
        $store = new FaqStore();
    }
    return $store;
};

/**
 * List / search FAQs.
 * GET /v1/admin/faqs?search=&category=&enabled=
 */
$router->get(
    '/v1/admin/faqs',
    static function (Request $request) use ($faqFactory): void {
        $faqs = $faqFactory()->listAll([
            'search' => $request->queryString('search'),
            'category' => $request->queryString('category'),
            'enabled' => $request->queryString('enabled'),
            'limit' => (int) ($request->queryString('limit', '500') ?? '500'),
        ]);
        Response::ok(['faqs' => $faqs, 'total' => count($faqs)]);
    },
    $adminMw
);

/**
 * Add FAQ.
 * POST /v1/admin/faqs
 * Body: { question, answer, keywords[], category?, enabled?, priority? }
 */
$router->post(
    '/v1/admin/faqs',
    static function (Request $request) use ($faqFactory, $logger): void {
        $body = $request->json();
        $answer = trim((string) ($body['answer'] ?? ''));
        $keywords = is_array($body['keywords'] ?? null) ? $body['keywords'] : [];
        if ($answer === '' || $keywords === []) {
            throw new AppException(
                'answer and keywords[] are required.',
                422,
                'validation_error'
            );
        }

        $faq = $faqFactory()->create($body);
        if (class_exists(\RankRise\Api\Services\LocalAnswerEngine::class)) {
            \RankRise\Api\Services\LocalAnswerEngine::clearCache();
        }
        $logger->info('admin.faq.create', ['id' => $faq['id'], 'category' => $faq['category']]);
        Response::ok(['faq' => $faq]);
    },
    $adminJsonMw
);

/**
 * Edit FAQ (partial: question / answer / keywords / category / enabled / priority).
 * POST /v1/admin/faqs/update
 * Body: { id, ...fields }
 */
$router->post(
    '/v1/admin/faqs/update',
    static function (Request $request) use ($faqFactory, $logger): void {
        $body = $request->json();
        $id = trim((string) ($body['id'] ?? ''));
        if ($id === '') {
            throw new AppException('id is required.', 422, 'validation_error');
        }

        $faq = $faqFactory()->update($id, $body);
        if ($faq === null) {
            throw new AppException('FAQ not found.', 404, 'not_found');
        }

        if (class_exists(\RankRise\Api\Services\LocalAnswerEngine::class)) {
            \RankRise\Api\Services\LocalAnswerEngine::clearCache();
        }
        $logger->info('admin.faq.update', ['id' => $id]);
        Response::ok(['faq' => $faq]);
    },
    $adminJsonMw
);

/**
 * Delete FAQ.
 * POST /v1/admin/faqs/delete
 * Body: { id }
 */
$router->post(
    '/v1/admin/faqs/delete',
    static function (Request $request) use ($faqFactory, $logger): void {
        $body = $request->json();
        $id = trim((string) ($body['id'] ?? ''));
        if ($id === '') {
            throw new AppException('id is required.', 422, 'validation_error');
        }

        $deleted = $faqFactory()->delete($id);
        if (!$deleted) {
            throw new AppException('FAQ not found.', 404, 'not_found');
        }

        if (class_exists(\RankRise\Api\Services\LocalAnswerEngine::class)) {
            \RankRise\Api\Services\LocalAnswerEngine::clearCache();
        }
        $logger->info('admin.faq.delete', ['id' => $id]);
        Response::ok(['deleted' => true]);
    },
    $adminJsonMw
);

/* ------------------------------------------------------------------ *
 * Admin CMS extensions: stats, settings, knowledge, leads, uploads.
 * ------------------------------------------------------------------ */

require_once dirname(__DIR__) . '/services/AdminStatsService.php';
require_once dirname(__DIR__) . '/services/KnowledgeStore.php';
require_once dirname(__DIR__) . '/services/LeadStore.php';
require_once dirname(__DIR__) . '/services/UploadService.php';

use RankRise\Api\Services\AdminStatsService;
use RankRise\Api\Services\KnowledgeStore;
use RankRise\Api\Services\LeadStore;
use RankRise\Api\Services\UploadService;

$statsFactory = static function (): AdminStatsService {
    static $s = null;
    if (!$s instanceof AdminStatsService) {
        $s = new AdminStatsService();
    }
    return $s;
};

$knowledgeFactory = static function (): KnowledgeStore {
    static $s = null;
    if (!$s instanceof KnowledgeStore) {
        $s = new KnowledgeStore();
    }
    return $s;
};

$leadFactory = static function (): LeadStore {
    static $s = null;
    if (!$s instanceof LeadStore) {
        $s = new LeadStore();
    }
    return $s;
};

$uploadFactory = static function (): UploadService {
    static $s = null;
    if (!$s instanceof UploadService) {
        $s = new UploadService();
    }
    return $s;
};

$router->get(
    '/v1/admin/stats',
    static function (Request $request) use ($statsFactory): void {
        Response::ok($statsFactory()->snapshot());
    },
    $adminMw
);

$router->get(
    '/v1/admin/settings',
    static function (Request $request) use ($statsFactory): void {
        Response::ok($statsFactory()->settings());
    },
    $adminMw
);

$router->get(
    '/v1/admin/settings/workflow',
    static function (): void {
        require_once dirname(__DIR__) . '/services/WorkflowConfig.php';
        Response::ok(['workflow' => \RankRise\Api\Services\WorkflowConfig::adminView()]);
    },
    $adminMw
);

$router->post(
    '/v1/admin/settings/workflow',
    static function (Request $request) use ($logger): void {
        require_once dirname(__DIR__) . '/services/WorkflowConfig.php';
        $body = $request->json();
        $merged = \RankRise\Api\Services\WorkflowConfig::mergeAdminPatch($body);
        $saved = \RankRise\Api\Services\WorkflowConfig::save($merged);
        $logger->info('admin.settings.workflow_update', [
            'company' => $saved['prompt']['companyName'] ?? null,
        ]);
        Response::ok(['workflow' => \RankRise\Api\Services\WorkflowConfig::adminView()]);
    },
    $adminMw
);

$router->get(
    '/v1/admin/knowledge',
    static function (Request $request) use ($knowledgeFactory): void {
        $store = $knowledgeFactory();
        $items = $store->list(
            $request->queryString('collection'),
            $request->queryString('search')
        );
        Response::ok([
            'collections' => $store->collections(),
            'items' => $items,
            'total' => count($items),
        ]);
    },
    $adminMw
);

$router->post(
    '/v1/admin/knowledge',
    static function (Request $request) use ($knowledgeFactory, $logger): void {
        $body = $request->json();
        if (trim((string) ($body['title'] ?? '')) === '' || trim((string) ($body['content'] ?? '')) === '') {
            throw new AppException('title and content are required.', 422, 'validation_error');
        }
        $item = $knowledgeFactory()->create($body);
        \RankRise\Api\Services\LocalAnswerEngine::clearCache();
        $logger->info('admin.knowledge.create', ['id' => $item['id'], 'collection' => $item['collection']]);
        Response::ok(['item' => $item]);
    },
    $adminJsonMw
);

$router->post(
    '/v1/admin/knowledge/update',
    static function (Request $request) use ($knowledgeFactory, $logger): void {
        $body = $request->json();
        $id = trim((string) ($body['id'] ?? ''));
        if ($id === '') {
            throw new AppException('id is required.', 422, 'validation_error');
        }
        $item = $knowledgeFactory()->update($id, $body);
        if ($item === null) {
            throw new AppException('Knowledge item not found.', 404, 'not_found');
        }
        \RankRise\Api\Services\LocalAnswerEngine::clearCache();
        $logger->info('admin.knowledge.update', ['id' => $id]);
        Response::ok(['item' => $item]);
    },
    $adminJsonMw
);

$router->post(
    '/v1/admin/knowledge/delete',
    static function (Request $request) use ($knowledgeFactory, $logger): void {
        $body = $request->json();
        $id = trim((string) ($body['id'] ?? ''));
        $collection = isset($body['collection']) ? (string) $body['collection'] : null;
        if ($id === '') {
            throw new AppException('id is required.', 422, 'validation_error');
        }
        $ok = $knowledgeFactory()->delete($id, $collection);
        if (!$ok) {
            throw new AppException('Knowledge item not found.', 404, 'not_found');
        }
        \RankRise\Api\Services\LocalAnswerEngine::clearCache();
        $logger->info('admin.knowledge.delete', ['id' => $id]);
        Response::ok(['deleted' => true]);
    },
    $adminJsonMw
);

$router->get(
    '/v1/admin/knowledge/export',
    static function (Request $request) use ($knowledgeFactory): void {
        $collection = (string) ($request->queryString('collection', 'company_info') ?? 'company_info');
        $items = $knowledgeFactory()->export($collection);
        Response::ok(['collection' => $collection, 'items' => $items]);
    },
    $adminMw
);

$router->post(
    '/v1/admin/knowledge/import',
    static function (Request $request) use ($knowledgeFactory, $logger): void {
        $body = $request->json();
        $collection = trim((string) ($body['collection'] ?? ''));
        $items = $body['items'] ?? null;
        if ($collection === '' || !is_array($items)) {
            throw new AppException('collection and items[] are required.', 422, 'validation_error');
        }
        $replace = ($body['replace'] ?? false) === true;
        $result = $knowledgeFactory()->import($collection, $items, $replace);
        \RankRise\Api\Services\LocalAnswerEngine::clearCache();
        $logger->info('admin.knowledge.import', ['collection' => $collection] + $result);
        Response::ok($result);
    },
    $adminJsonMw
);

/**
 * Rebuild website knowledge index (pages + KB + FAQ + blog).
 * POST /v1/admin/knowledge/rebuild-index
 */
$router->post(
    '/v1/admin/knowledge/rebuild-index',
    static function () use ($logger): void {
        require_once dirname(__DIR__) . '/services/WebsiteKnowledgeBuilder.php';
        $result = (new \RankRise\Api\Services\WebsiteKnowledgeBuilder())->rebuild();
        $logger->info('admin.knowledge.rebuild_index', [
            'doc_count' => $result['doc_count'] ?? 0,
            'sources' => $result['sources'] ?? [],
        ]);
        Response::ok($result);
    },
    $adminMw
);

/**
 * Index status.
 * GET /v1/admin/knowledge/index-status
 */
$router->get(
    '/v1/admin/knowledge/index-status',
    static function (): void {
        require_once dirname(__DIR__) . '/services/WebsiteKnowledgeIndex.php';
        $index = new \RankRise\Api\Services\WebsiteKnowledgeIndex();
        $data = $index->load();
        Response::ok([
            'exists' => $index->exists(),
            'path' => $index->indexPath(),
            'built_at' => $data['built_at'] ?? '',
            'doc_count' => $data['doc_count'] ?? 0,
            'sources' => $data['sources'] ?? [],
        ]);
    },
    $adminMw
);

$router->get(
    '/v1/admin/leads',
    static function (Request $request) use ($leadFactory): void {
        $leads = $leadFactory()->list([
            'source' => $request->queryString('source'),
            'search' => $request->queryString('search'),
            'status' => $request->queryString('status'),
            'limit' => (int) ($request->queryString('limit', '500') ?? '500'),
        ]);
        Response::ok(['leads' => $leads, 'total' => count($leads)]);
    },
    $adminMw
);

$router->post(
    '/v1/admin/leads/status',
    static function (Request $request) use ($leadFactory): void {
        $body = $request->json();
        $id = trim((string) ($body['id'] ?? ''));
        $status = trim((string) ($body['status'] ?? ''));
        if ($id === '' || $status === '') {
            throw new AppException('id and status are required.', 422, 'validation_error');
        }
        try {
            $lead = $leadFactory()->updateStatus($id, $status);
        } catch (\InvalidArgumentException $e) {
            throw new AppException($e->getMessage(), 422, 'validation_error');
        }
        if ($lead === null) {
            throw new AppException('Lead not found.', 404, 'not_found');
        }
        Response::ok(['lead' => $lead]);
    },
    $adminJsonMw
);

$router->post(
    '/v1/admin/leads/delete',
    static function (Request $request) use ($leadFactory): void {
        $body = $request->json();
        $id = trim((string) ($body['id'] ?? ''));
        if ($id === '') {
            throw new AppException('id is required.', 422, 'validation_error');
        }
        if (!$leadFactory()->delete($id)) {
            throw new AppException('Lead not found.', 404, 'not_found');
        }
        Response::ok(['deleted' => true]);
    },
    $adminJsonMw
);

$router->post(
    '/v1/admin/uploads',
    static function (Request $request) use ($uploadFactory, $logger): void {
        if (!isset($_FILES['file']) || !is_array($_FILES['file'])) {
            throw new AppException('file is required (multipart).', 422, 'validation_error');
        }

        $options = [
            'webp' => ($_POST['webp'] ?? '1') !== '0',
            'maxWidth' => (int) ($_POST['maxWidth'] ?? 1920),
            'maxHeight' => (int) ($_POST['maxHeight'] ?? 1920),
            'quality' => (int) ($_POST['quality'] ?? 82),
        ];
        if (isset($_POST['crop']) && is_string($_POST['crop']) && $_POST['crop'] !== '') {
            try {
                $crop = json_decode($_POST['crop'], true, 512, JSON_THROW_ON_ERROR);
                if (is_array($crop)) {
                    $options['crop'] = $crop;
                }
            } catch (\Throwable) {
                // ignore bad crop payload
            }
        }

        try {
            $saved = $uploadFactory()->store($_FILES['file'], $options);
        } catch (\InvalidArgumentException $e) {
            throw new AppException($e->getMessage(), 422, 'validation_error');
        }
        $logger->info('admin.upload', [
            'path' => $saved['path'] ?? null,
            'mime' => $saved['mime'] ?? null,
            'optimized' => $saved['optimized'] ?? false,
        ]);
        Response::ok($saved);
    },
    $adminMw
);

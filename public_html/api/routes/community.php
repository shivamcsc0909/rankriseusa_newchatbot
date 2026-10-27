<?php

declare(strict_types=1);

use RankRise\Api\Lib\AppException;
use RankRise\Api\Lib\Request;
use RankRise\Api\Lib\Response;
use RankRise\Api\Middleware\AuthMiddleware;
use RankRise\Api\Middleware\JsonBodyMiddleware;
use RankRise\Api\Services\CommentStore;
use RankRise\Api\Services\ProfileStore;

/**
 * @var array{
 *   app: array<string, mixed>,
 *   auth: \RankRise\Api\Lib\Auth,
 *   router: \RankRise\Api\Lib\Router,
 *   logger: \RankRise\Api\Lib\Logger
 * } $rankrise
 */

$router = $rankrise['router'];
$auth = $rankrise['auth'];
$logger = $rankrise['logger'];

$profileFactory = static function (): ProfileStore {
    static $store = null;
    if (!$store instanceof ProfileStore) {
        $store = new ProfileStore();
    }
    return $store;
};

$commentFactory = static function (): CommentStore {
    static $store = null;
    if (!$store instanceof CommentStore) {
        $store = new CommentStore();
    }
    return $store;
};

$adminMw = [(new AuthMiddleware($auth))()];
$adminJsonMw = [
    (new JsonBodyMiddleware())(),
    (new AuthMiddleware($auth))(),
];
$jsonMw = [(new JsonBodyMiddleware())()];

/* ==================================================================
 * PUBLIC / USER ENDPOINTS
 * ================================================================== */

/**
 * Submit or update user profile.
 * POST /v1/profiles
 * Body: { name, email, company?, website?, industry?, country?, phone?, profile_image?, bio?, hp_field? }
 */
$router->post(
    '/v1/profiles',
    static function (Request $request) use ($profileFactory, $logger): void {
        $body = $request->json();

        // Honeypot check for spam bots
        if (isset($body['hp_field']) && is_string($body['hp_field']) && trim($body['hp_field']) !== '') {
            // Drop silently for bot trap
            Response::ok(['success' => true, 'profile' => null]);
            return;
        }

        $name = trim((string) ($body['name'] ?? ''));
        $email = strtolower(trim((string) ($body['email'] ?? '')));

        if ($name === '' || $email === '') {
            throw new AppException('Name and Email are required fields.', 422, 'validation_error');
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new AppException('Invalid email address format.', 422, 'validation_error');
        }

        $website = trim((string) ($body['website'] ?? ''));
        if ($website !== '' && !filter_var($website, FILTER_VALIDATE_URL)) {
            throw new AppException('Invalid website URL format.', 422, 'validation_error');
        }

        // Sanitize bio
        $rawBio = (string) ($body['bio'] ?? '');
        $sanitizedBio = strip_tags($rawBio);

        $profileData = [
            'name' => htmlspecialchars($name, ENT_QUOTES, 'UTF-8'),
            'email' => $email,
            'company' => htmlspecialchars(trim((string) ($body['company'] ?? '')), ENT_QUOTES, 'UTF-8'),
            'website' => $website,
            'industry' => htmlspecialchars(trim((string) ($body['industry'] ?? '')), ENT_QUOTES, 'UTF-8'),
            'country' => htmlspecialchars(trim((string) ($body['country'] ?? '')), ENT_QUOTES, 'UTF-8'),
            'phone' => htmlspecialchars(trim((string) ($body['phone'] ?? '')), ENT_QUOTES, 'UTF-8'),
            'profile_image' => trim((string) ($body['profile_image'] ?? '')),
            'bio' => htmlspecialchars($sanitizedBio, ENT_QUOTES, 'UTF-8'),
            'status' => 'pending',
        ];

        $profile = $profileFactory()->save($profileData);
        $logger->info('community.profile.save', ['email' => $email, 'id' => $profile['id']]);

        Response::ok([
            'success' => true,
            'profile' => $profile,
            'message' => 'Profile submitted for moderation.',
        ]);
    },
    $jsonMw
);

/**
 * Get profile by email.
 * GET /v1/profiles/me?email=
 */
$router->get(
    '/v1/profiles/me',
    static function (Request $request) use ($profileFactory): void {
        $email = $request->queryString('email');
        if (!is_string($email) || trim($email) === '') {
            Response::ok(['profile' => null]);
            return;
        }

        $profile = $profileFactory()->findByEmail($email);
        Response::ok(['profile' => $profile]);
    }
);

/**
 * List comments for a target (e.g. blog post).
 * GET /v1/comments?targetType=blog&targetId=123&userEmail=...
 */
$router->get(
    '/v1/comments',
    static function (Request $request) use ($commentFactory): void {
        $targetType = (string) ($request->queryString('targetType', 'blog') ?? 'blog');
        $targetId = (string) ($request->queryString('targetId', 'general') ?? 'general');
        $userEmail = $request->queryString('userEmail');

        $comments = $commentFactory()->listByTarget($targetType, $targetId, is_string($userEmail) ? $userEmail : null);
        Response::ok(['comments' => $comments, 'count' => count($comments)]);
    }
);

/**
 * Add comment or reply.
 * POST /v1/comments
 * Body: { targetType, targetId, parentId?, content, email, hp_field? }
 */
$router->post(
    '/v1/comments',
    static function (Request $request) use ($commentFactory, $profileFactory, $logger): void {
        $body = $request->json();

        // Honeypot check
        if (isset($body['hp_field']) && is_string($body['hp_field']) && trim($body['hp_field']) !== '') {
            Response::ok(['success' => true, 'comment' => null]);
            return;
        }

        $email = strtolower(trim((string) ($body['email'] ?? '')));
        $content = trim((string) ($body['content'] ?? ''));

        if ($email === '' || $content === '') {
            throw new AppException('Email and Content are required to post a comment.', 422, 'validation_error');
        }

        $profile = $profileFactory()->findByEmail($email);
        if ($profile === null) {
            throw new AppException('You must complete a profile submission before commenting.', 403, 'profile_required');
        }

        // Sanitize comment HTML / content
        $sanitizedContent = htmlspecialchars(strip_tags($content), ENT_QUOTES, 'UTF-8');

        $commentData = [
            'profile_id' => $profile['id'],
            'author_name' => $profile['name'],
            'author_email' => $profile['email'],
            'author_company' => $profile['company'] ?? '',
            'author_industry' => $profile['industry'] ?? '',
            'author_avatar' => $profile['profile_image'] ?? '',
            'target_type' => (string) ($body['targetType'] ?? 'blog'),
            'target_id' => (string) ($body['targetId'] ?? 'general'),
            'parent_id' => isset($body['parentId']) && is_string($body['parentId']) && trim($body['parentId']) !== '' ? trim($body['parentId']) : null,
            'content' => $sanitizedContent,
            'status' => 'pending',
            'is_pinned' => false,
        ];

        $comment = $commentFactory()->create($commentData);
        $logger->info('community.comment.create', ['id' => $comment['id'], 'author' => $email]);

        Response::ok([
            'success' => true,
            'comment' => $comment,
            'message' => 'Comment submitted for moderation.',
        ]);
    },
    $jsonMw
);

/**
 * Edit own comment.
 * PUT /v1/comments/{id}
 * Body: { content, email }
 */
$router->put(
    '/v1/comments/{id}',
    static function (Request $request) use ($commentFactory): void {
        $id = (string) $request->attribute('id', '');
        $body = $request->json();
        $email = strtolower(trim((string) ($body['email'] ?? '')));
        $content = trim((string) ($body['content'] ?? ''));

        if ($id === '' || $email === '' || $content === '') {
            throw new AppException('Missing required fields for comment edit.', 422, 'validation_error');
        }

        $sanitizedContent = htmlspecialchars(strip_tags($content), ENT_QUOTES, 'UTF-8');
        $updated = $commentFactory()->update($id, $sanitizedContent, $email);

        if ($updated === null) {
            throw new AppException('Comment not found or unauthorized to edit.', 404, 'not_found');
        }

        Response::ok(['success' => true, 'comment' => $updated]);
    },
    $jsonMw
);

/**
 * Delete own comment.
 * DELETE /v1/comments/{id}?email=
 */
$router->delete(
    '/v1/comments/{id}',
    static function (Request $request) use ($commentFactory): void {
        $id = (string) $request->attribute('id', '');
        $email = (string) $request->queryString('email', '');

        if ($id === '' || $email === '') {
            throw new AppException('Missing comment ID or email.', 422, 'validation_error');
        }

        $deleted = $commentFactory()->delete($id, $email, false);
        if (!$deleted) {
            throw new AppException('Comment not found or unauthorized to delete.', 404, 'not_found');
        }

        Response::ok(['success' => true]);
    }
);

/* ==================================================================
 * ADMIN MODERATION ENDPOINTS
 * ================================================================== */

/**
 * Admin list all comments.
 * GET /v1/admin/comments
 */
$router->get(
    '/v1/admin/comments',
    static function (Request $request) use ($commentFactory): void {
        $comments = $commentFactory()->listAllAdmin();
        Response::ok(['comments' => $comments, 'count' => count($comments)]);
    },
    $adminMw
);

/**
 * Admin update comment status (Approve, Reject, Hide).
 * POST /v1/admin/comments/status
 * Body: { id, status }
 */
$router->post(
    '/v1/admin/comments/status',
    static function (Request $request) use ($commentFactory, $logger): void {
        $body = $request->json();
        $id = trim((string) ($body['id'] ?? ''));
        $status = trim((string) ($body['status'] ?? ''));

        if ($id === '' || $status === '') {
            throw new AppException('id and status are required.', 422, 'validation_error');
        }

        $updated = $commentFactory()->updateStatus($id, $status);
        if ($updated === null) {
            throw new AppException('Comment not found or invalid status.', 404, 'not_found');
        }

        $logger->info('admin.comment.status', ['id' => $id, 'status' => $status]);
        Response::ok(['success' => true, 'comment' => $updated]);
    },
    $adminJsonMw
);

/**
 * Admin pin / unpin comment.
 * POST /v1/admin/comments/pin
 * Body: { id, is_pinned? }
 */
$router->post(
    '/v1/admin/comments/pin',
    static function (Request $request) use ($commentFactory, $logger): void {
        $body = $request->json();
        $id = trim((string) ($body['id'] ?? ''));

        if ($id === '') {
            throw new AppException('id is required.', 422, 'validation_error');
        }

        $pinnedState = isset($body['is_pinned']) ? (bool) $body['is_pinned'] : null;
        $updated = $commentFactory()->togglePin($id, $pinnedState);

        if ($updated === null) {
            throw new AppException('Comment not found.', 404, 'not_found');
        }

        $logger->info('admin.comment.pin', ['id' => $id, 'is_pinned' => $updated['is_pinned']]);
        Response::ok(['success' => true, 'comment' => $updated]);
    },
    $adminJsonMw
);

/**
 * Admin delete comment.
 * POST /v1/admin/comments/delete
 * Body: { id }
 */
$router->post(
    '/v1/admin/comments/delete',
    static function (Request $request) use ($commentFactory, $logger): void {
        $body = $request->json();
        $id = trim((string) ($body['id'] ?? ''));

        if ($id === '') {
            throw new AppException('id is required.', 422, 'validation_error');
        }

        $deleted = $commentFactory()->delete($id, '', true);
        if (!$deleted) {
            throw new AppException('Comment not found.', 404, 'not_found');
        }

        $logger->info('admin.comment.delete', ['id' => $id]);
        Response::ok(['success' => true]);
    },
    $adminJsonMw
);

/**
 * Admin list user profiles.
 * GET /v1/admin/profiles
 */
$router->get(
    '/v1/admin/profiles',
    static function (Request $request) use ($profileFactory): void {
        $status = $request->queryString('status');
        $profiles = $profileFactory()->listAll(is_string($status) ? $status : null);
        Response::ok(['profiles' => $profiles, 'count' => count($profiles)]);
    },
    $adminMw
);

/**
 * Admin update profile status (Approve / Reject).
 * POST /v1/admin/profiles/status
 * Body: { id, status }
 */
$router->post(
    '/v1/admin/profiles/status',
    static function (Request $request) use ($profileFactory, $logger): void {
        $body = $request->json();
        $id = trim((string) ($body['id'] ?? ''));
        $status = trim((string) ($body['status'] ?? ''));

        if ($id === '' || $status === '') {
            throw new AppException('id and status are required.', 422, 'validation_error');
        }

        $updated = $profileFactory()->updateStatus($id, $status);
        if ($updated === null) {
            throw new AppException('Profile not found or invalid status.', 404, 'not_found');
        }

        $logger->info('admin.profile.status', ['id' => $id, 'status' => $status]);
        Response::ok(['success' => true, 'profile' => $updated]);
    },
    $adminJsonMw
);

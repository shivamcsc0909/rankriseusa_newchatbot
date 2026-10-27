<?php

declare(strict_types=1);

use RankRise\Api\Lib\AppException;
use RankRise\Api\Lib\Request;
use RankRise\Api\Lib\Response;
use RankRise\Api\Middleware\AuthMiddleware;
use RankRise\Api\Middleware\JsonBodyMiddleware;
use RankRise\Api\Services\BlogStore;

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

$blogStoreFactory = static function (): BlogStore {
    static $store = null;
    if (!$store instanceof BlogStore) {
        $store = new BlogStore();
    }
    return $store;
};

$adminMw = [(new AuthMiddleware($auth))()];
$adminJsonMw = [
    (new JsonBodyMiddleware())(),
    (new AuthMiddleware($auth))(),
];

/**
 * List blog posts.
 * GET /v1/blog?includeDrafts=true&category=&tag=&search=&sort=latest|popular
 * includeDrafts requires admin auth.
 */
$router->get(
    '/v1/blog',
    static function (Request $request) use ($blogStoreFactory, $auth): void {
        $wantDrafts = $request->queryString('includeDrafts') === 'true';
        $includeDrafts = false;
        if ($wantDrafts) {
            try {
                $auth->assert($request);
                $includeDrafts = true;
            } catch (\Throwable) {
                throw new AppException('Admin authentication required to list drafts.', 401, 'unauthorized');
            }
        }

        $category = $request->queryString('category');
        $tag = $request->queryString('tag');
        $search = $request->queryString('search');
        $sort = (string) ($request->queryString('sort', 'latest') ?? 'latest');
        if (!in_array($sort, ['latest', 'popular'], true)) {
            $sort = 'latest';
        }

        $posts = $blogStoreFactory()->listPosts(
            $includeDrafts,
            is_string($category) ? $category : null,
            is_string($tag) ? $tag : null,
            is_string($search) ? $search : null,
            $sort
        );

        Response::ok(['posts' => $posts, 'count' => count($posts)]);
    }
);

/**
 * Popular posts.
 * GET /v1/blog/popular?limit=6
 */
$router->get(
    '/v1/blog/popular',
    static function (Request $request) use ($blogStoreFactory): void {
        $limit = (int) ($request->queryString('limit', '6') ?? '6');
        $posts = $blogStoreFactory()->listPopular($limit);
        Response::ok(['posts' => $posts, 'count' => count($posts)]);
    }
);

/**
 * Categories with counts.
 * GET /v1/blog/categories
 */
$router->get(
    '/v1/blog/categories',
    static function () use ($blogStoreFactory): void {
        Response::ok(['categories' => $blogStoreFactory()->listCategories()]);
    }
);

/**
 * Get single published blog post by slug (+ view increment).
 * GET /v1/blog/slug/{slug}?preview=1  (preview requires admin auth for drafts)
 */
$router->get(
    '/v1/blog/slug/{slug}',
    static function (Request $request) use ($blogStoreFactory, $auth): void {
        $slug = (string) $request->attribute('slug', '');
        if ($slug === '') {
            throw new AppException('Slug parameter is required.', 422, 'validation_error');
        }

        $preview = $request->queryString('preview') === '1' || $request->queryString('preview') === 'true';
        $allowDraft = false;
        if ($preview) {
            try {
                $auth->assert($request);
                $allowDraft = true;
            } catch (\Throwable) {
                // Public may open ?preview=1 on published URLs; only drafts need admin.
                $allowDraft = false;
            }
        }

        $post = $blogStoreFactory()->findBySlug($slug, $allowDraft);
        if ($post === null) {
            if ($preview && !$allowDraft) {
                throw new AppException('Admin authentication required for draft preview.', 401, 'unauthorized');
            }
            throw new AppException('Blog post not found.', 404, 'not_found');
        }

        // Count views for published traffic only
        if (!$allowDraft || ($post['status'] ?? '') === 'published') {
            $views = $blogStoreFactory()->incrementViews((string) ($post['id'] ?? $slug));
            $post['views'] = $views;
        }

        Response::ok(['post' => $post]);
    }
);

/**
 * Dynamic Blog Sitemap.xml
 * GET /v1/blog/sitemap.xml
 */
$router->get(
    '/v1/blog/sitemap.xml',
    static function () use ($blogStoreFactory): void {
        $posts = $blogStoreFactory()->listPosts(false);
        header('Content-Type: application/xml; charset=utf-8');
        header('Cache-Control: public, max-age=300');

        echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">' . "\n";
        echo "  <url>\n    <loc>https://rankriseusa.com/blog</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.90</priority>\n  </url>\n";

        foreach ($posts as $p) {
            $loc = htmlspecialchars((string) ($p['canonical_url'] ?? "https://rankriseusa.com/blog/{$p['slug']}"), ENT_XML1);
            $lastmod = date('Y-m-d', strtotime((string) ($p['updated_at'] ?? $p['created_at'] ?? 'now')));
            echo "  <url>\n";
            echo "    <loc>{$loc}</loc>\n";
            echo "    <lastmod>{$lastmod}</lastmod>\n";
            echo "    <changefreq>weekly</changefreq>\n";
            echo "    <priority>0.80</priority>\n";
            if (!empty($p['featured_image'])) {
                $img = htmlspecialchars((string) $p['featured_image'], ENT_XML1);
                $title = htmlspecialchars((string) ($p['title'] ?? ''), ENT_XML1);
                echo "    <image:image><image:loc>{$img}</image:loc><image:title>{$title}</image:title></image:image>\n";
            }
            echo "  </url>\n";
        }

        echo '</urlset>';
        exit;
    }
);

/**
 * Dynamic RSS 2.0 Feed
 * GET /v1/blog/rss.xml
 */
$router->get(
    '/v1/blog/rss.xml',
    static function () use ($blogStoreFactory): void {
        $posts = $blogStoreFactory()->listPosts(false);
        header('Content-Type: application/rss+xml; charset=utf-8');
        header('Cache-Control: public, max-age=300');

        echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        echo '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">' . "\n";
        echo "  <channel>\n";
        echo "    <title>RankRise USA Intelligence Hub</title>\n";
        echo "    <link>https://rankriseusa.com/blog</link>\n";
        echo "    <description>Executive intelligence and strategy on digital marketing, AI search, and growth mechanics.</description>\n";
        echo "    <language>en-us</language>\n";
        echo "    <atom:link href=\"https://rankriseusa.com/api/index.php/v1/blog/rss.xml\" rel=\"self\" type=\"application/rss+xml\" />\n";

        foreach (array_slice($posts, 0, 50) as $p) {
            $title = htmlspecialchars((string) $p['title'], ENT_XML1);
            $link = htmlspecialchars((string) ($p['canonical_url'] ?? "https://rankriseusa.com/blog/{$p['slug']}"), ENT_XML1);
            $desc = htmlspecialchars((string) ($p['excerpt'] ?? ''), ENT_XML1);
            $pubDate = date('r', strtotime((string) ($p['created_at'] ?? 'now')));
            echo "    <item>\n";
            echo "      <title>{$title}</title>\n";
            echo "      <link>{$link}</link>\n";
            echo "      <guid isPermaLink=\"true\">{$link}</guid>\n";
            echo "      <description>{$desc}</description>\n";
            echo "      <pubDate>{$pubDate}</pubDate>\n";
            echo "      <category>" . htmlspecialchars((string) ($p['category'] ?? ''), ENT_XML1) . "</category>\n";
            echo "    </item>\n";
        }

        echo "  </channel>\n";
        echo '</rss>';
        exit;
    }
);

/**
 * Create or update blog article.
 * POST /v1/admin/blog
 */
$router->post(
    '/v1/admin/blog',
    static function (Request $request) use ($blogStoreFactory, $logger): void {
        $body = $request->json();
        $title = trim((string) ($body['title'] ?? ''));

        if ($title === '') {
            throw new AppException('Blog title is required.', 422, 'validation_error');
        }

        $saved = $blogStoreFactory()->save($body);
        $logger->info('admin.blog.save', ['id' => $saved['id'], 'slug' => $saved['slug'], 'status' => $saved['status']]);

        Response::ok(['success' => true, 'post' => $saved]);
    },
    $adminJsonMw
);

/**
 * Delete blog article.
 * DELETE /v1/admin/blog/{id}
 */
$router->delete(
    '/v1/admin/blog/{id}',
    static function (Request $request) use ($blogStoreFactory, $logger): void {
        $id = (string) $request->attribute('id', '');
        if ($id === '') {
            throw new AppException('ID attribute is required.', 422, 'validation_error');
        }

        $blogStoreFactory()->delete($id);
        $logger->info('admin.blog.delete', ['id' => $id]);

        Response::ok(['success' => true]);
    },
    $adminMw
);

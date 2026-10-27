<?php

declare(strict_types=1);

namespace RankRise\Api\Services;

use RankRise\Api\Lib\Database;

/**
 * Dual-storage blog CMS: MySQL preferred, JSON fallback + mirror.
 */
class BlogStore
{
    private string $jsonFilePath;

    public function __construct(?string $jsonFilePath = null)
    {
        $this->jsonFilePath = $jsonFilePath ?? __DIR__ . '/../storage/blog_posts.json';
    }

    private function isDbAvailable(): bool
    {
        try {
            return Database::ping();
        } catch (\Throwable) {
            return false;
        }
    }

    private function getJsonPosts(): array
    {
        if (!file_exists($this->jsonFilePath)) {
            return [];
        }
        $content = file_get_contents($this->jsonFilePath);
        if (!$content) {
            return [];
        }
        $data = json_decode($content, true);
        return is_array($data) ? $data : [];
    }

    private function saveJsonPosts(array $posts): void
    {
        $dir = dirname($this->jsonFilePath);
        if (!is_dir($dir)) {
            @mkdir($dir, 0755, true);
        }
        file_put_contents(
            $this->jsonFilePath,
            json_encode(array_values($posts), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)
        );
    }

    /**
     * @param array<string, mixed> $row
     * @return array<string, mixed>
     */
    private function normalizeRow(array $row): array
    {
        $row['tags'] = is_string($row['tags'] ?? null)
            ? (json_decode($row['tags'], true) ?? [])
            : (is_array($row['tags'] ?? null) ? $row['tags'] : []);
        $row['gallery'] = is_string($row['gallery'] ?? null)
            ? (json_decode($row['gallery'], true) ?? [])
            : (is_array($row['gallery'] ?? null) ? $row['gallery'] : []);
        $row['views'] = (int) ($row['views'] ?? 0);
        return $row;
    }

    private function isPubliclyVisible(array $p, ?string $nowIso = null): bool
    {
        $now = $nowIso ?? gmdate('c');
        // Missing/unknown status must NOT be treated as published.
        $st = strtolower(trim((string) ($p['status'] ?? 'draft')));
        if ($st === 'published') {
            return true;
        }
        if ($st === 'scheduled') {
            $at = $p['scheduled_at'] ?? null;
            if (is_string($at) && $at !== '' && $at <= $now) {
                return true;
            }
        }
        return false;
    }

    /**
     * Promote due scheduled posts to published (soft cron on read).
     */
    public function publishDueScheduled(): int
    {
        $count = 0;
        $now = gmdate('Y-m-d H:i:s');

        if ($this->isDbAvailable()) {
            try {
                $pdo = Database::pdo();
                $stmt = $pdo->prepare(
                    "UPDATE blog_posts SET status = 'published', updated_at = :now
                     WHERE status = 'scheduled' AND scheduled_at IS NOT NULL AND scheduled_at <= :now2"
                );
                $stmt->execute(['now' => $now, 'now2' => $now]);
                $count += $stmt->rowCount();
            } catch (\Throwable) {
                // continue JSON path
            }
        }

        $posts = $this->getJsonPosts();
        $changed = false;
        $nowIso = gmdate('c');
        foreach ($posts as $i => $p) {
            if (($p['status'] ?? '') !== 'scheduled') {
                continue;
            }
            $at = $p['scheduled_at'] ?? null;
            if (!is_string($at) || $at === '') {
                continue;
            }
            if ($at <= $nowIso || $at <= $now) {
                $posts[$i]['status'] = 'published';
                $posts[$i]['updated_at'] = $now;
                $changed = true;
                $count++;
            }
        }
        if ($changed) {
            $this->saveJsonPosts($posts);
        }

        return $count;
    }

    public function listPosts(
        bool $includeDrafts = false,
        ?string $category = null,
        ?string $tag = null,
        ?string $search = null,
        string $sort = 'latest'
    ): array {
        $this->publishDueScheduled();

        if ($this->isDbAvailable()) {
            try {
                $pdo = Database::pdo();
                $where = [];
                $params = [];

                if (!$includeDrafts) {
                    $where[] = "(status = 'published' OR (status = 'scheduled' AND scheduled_at <= NOW()))";
                }

                if ($category !== null && trim($category) !== '' && strtolower($category) !== 'all') {
                    $where[] = 'LOWER(category) = LOWER(:category)';
                    $params['category'] = trim($category);
                }

                if ($tag !== null && trim($tag) !== '') {
                    $where[] = 'LOWER(tags) LIKE :tag';
                    $params['tag'] = '%' . strtolower(trim($tag)) . '%';
                }

                if ($search !== null && trim($search) !== '') {
                    $where[] = '(title LIKE :q OR excerpt LIKE :q OR content LIKE :q OR tags LIKE :q)';
                    $params['q'] = '%' . trim($search) . '%';
                }

                $order = $sort === 'popular' ? 'views DESC, created_at DESC' : 'created_at DESC';

                $sql = 'SELECT * FROM blog_posts';
                if ($where !== []) {
                    $sql .= ' WHERE ' . implode(' AND ', $where);
                }
                $sql .= ' ORDER BY ' . $order;

                $stmt = $pdo->prepare($sql);
                $stmt->execute($params);
                $rows = $stmt->fetchAll(\PDO::FETCH_ASSOC);

                return array_map(fn ($row) => $this->normalizeRow($row), $rows);
            } catch (\Throwable) {
                // Fallback to JSON
            }
        }

        $posts = array_map(fn ($p) => $this->normalizeRow($p), $this->getJsonPosts());
        $now = gmdate('c');

        $filtered = array_values(array_filter($posts, function ($p) use ($includeDrafts, $category, $tag, $search, $now) {
            if (!$includeDrafts && !$this->isPubliclyVisible($p, $now)) {
                return false;
            }
            if ($category !== null && trim($category) !== '' && strtolower($category) !== 'all') {
                if (strtolower((string) ($p['category'] ?? '')) !== strtolower(trim($category))) {
                    return false;
                }
            }
            if ($tag !== null && trim($tag) !== '') {
                $needle = strtolower(trim($tag));
                $tags = array_map('strtolower', array_map('strval', $p['tags'] ?? []));
                if (!in_array($needle, $tags, true)) {
                    return false;
                }
            }
            if ($search !== null && trim($search) !== '') {
                $q = strtolower(trim($search));
                $text = strtolower(
                    ($p['title'] ?? '') . ' ' . ($p['excerpt'] ?? '') . ' ' .
                    ($p['content'] ?? '') . ' ' . implode(' ', $p['tags'] ?? [])
                );
                if (!str_contains($text, $q)) {
                    return false;
                }
            }
            return true;
        }));

        if ($sort === 'popular') {
            usort($filtered, static fn ($a, $b) => ((int) ($b['views'] ?? 0)) <=> ((int) ($a['views'] ?? 0)));
        } else {
            usort($filtered, static fn ($a, $b) => strcmp((string) ($b['created_at'] ?? ''), (string) ($a['created_at'] ?? '')));
        }

        return $filtered;
    }

    public function listPopular(int $limit = 6): array
    {
        $posts = $this->listPosts(false, null, null, null, 'popular');
        return array_slice($posts, 0, max(1, $limit));
    }

    /**
     * Public slug lookup — drafts/future scheduled hidden unless $allowDraft.
     */
    public function findBySlug(string $slug, bool $allowDraft = false): ?array
    {
        $this->publishDueScheduled();
        $post = null;

        if ($this->isDbAvailable()) {
            try {
                $pdo = Database::pdo();
                $stmt = $pdo->prepare('SELECT * FROM blog_posts WHERE LOWER(slug) = LOWER(:slug) LIMIT 1');
                $stmt->execute(['slug' => trim($slug)]);
                $row = $stmt->fetch(\PDO::FETCH_ASSOC);
                if ($row) {
                    $post = $this->normalizeRow($row);
                }
            } catch (\Throwable) {
                // Fallback
            }
        }

        if ($post === null) {
            foreach ($this->getJsonPosts() as $p) {
                if (strtolower((string) ($p['slug'] ?? '')) === strtolower(trim($slug))) {
                    $post = $this->normalizeRow($p);
                    break;
                }
            }
        }

        if ($post === null) {
            return null;
        }

        if (!$allowDraft && !$this->isPubliclyVisible($post)) {
            return null;
        }

        return $post;
    }

    public function incrementViews(string $slugOrId): int
    {
        $views = 0;

        if ($this->isDbAvailable()) {
            try {
                $pdo = Database::pdo();
                $stmt = $pdo->prepare(
                    'UPDATE blog_posts SET views = views + 1 WHERE id = :id OR LOWER(slug) = LOWER(:slug)'
                );
                $stmt->execute(['id' => $slugOrId, 'slug' => $slugOrId]);
                $sel = $pdo->prepare(
                    'SELECT views FROM blog_posts WHERE id = :id OR LOWER(slug) = LOWER(:slug) LIMIT 1'
                );
                $sel->execute(['id' => $slugOrId, 'slug' => $slugOrId]);
                $views = (int) ($sel->fetchColumn() ?: 0);
            } catch (\Throwable) {
                // JSON path
            }
        }

        $posts = $this->getJsonPosts();
        foreach ($posts as $i => $p) {
            if (($p['id'] ?? '') === $slugOrId || strtolower((string) ($p['slug'] ?? '')) === strtolower($slugOrId)) {
                $posts[$i]['views'] = (int) ($p['views'] ?? 0) + 1;
                $views = (int) $posts[$i]['views'];
                $this->saveJsonPosts($posts);
                break;
            }
        }

        return $views;
    }

    public function save(array $postData): array
    {
        $id = $postData['id'] ?? ('post_' . bin2hex(random_bytes(6)) . '_' . time());
        $now = gmdate('Y-m-d H:i:s');

        $gallery = [];
        if (isset($postData['gallery']) && is_array($postData['gallery'])) {
            foreach ($postData['gallery'] as $g) {
                if (is_string($g) && trim($g) !== '') {
                    $gallery[] = trim($g);
                }
            }
        }

        $allowedStatus = ['draft', 'published', 'scheduled'];
        $statusRaw = strtolower(trim((string) ($postData['status'] ?? 'draft')));
        $status = in_array($statusRaw, $allowedStatus, true) ? $statusRaw : 'draft';
        if ($status === 'scheduled') {
            $sched = $postData['scheduled_at'] ?? null;
            if (!is_string($sched) || trim($sched) === '') {
                $status = 'draft';
            }
        }

        $record = [
            'id' => $id,
            'slug' => $postData['slug'] ?? 'post-' . time(),
            'title' => $postData['title'] ?? 'Untitled Article',
            'excerpt' => $postData['excerpt'] ?? '',
            'content' => $postData['content'] ?? '',
            'category' => $postData['category'] ?? 'Intelligence',
            'tags' => is_array($postData['tags'] ?? null) ? array_values($postData['tags']) : [],
            'featured_image' => $postData['featured_image'] ?? '',
            'gallery' => $gallery,
            'seo_title' => $postData['seo_title'] ?? '',
            'seo_description' => $postData['seo_description'] ?? '',
            'canonical_url' => $postData['canonical_url'] ?? '',
            'og_title' => $postData['og_title'] ?? '',
            'og_description' => $postData['og_description'] ?? '',
            'og_image' => $postData['og_image'] ?? '',
            'twitter_card' => $postData['twitter_card'] ?? 'summary_large_image',
            'twitter_title' => $postData['twitter_title'] ?? '',
            'twitter_description' => $postData['twitter_description'] ?? '',
            'twitter_image' => $postData['twitter_image'] ?? '',
            'json_ld' => $postData['json_ld'] ?? '',
            'reading_time' => $postData['reading_time'] ?? '5 min read',
            'author_name' => $postData['author_name'] ?? 'RankRise Intelligence',
            'author_title' => $postData['author_title'] ?? 'Growth Strategist',
            'author_avatar' => $postData['author_avatar'] ?? '',
            'status' => $status,
            'scheduled_at' => $postData['scheduled_at'] ?? null,
            'views' => (int) ($postData['views'] ?? 0),
            'created_at' => $postData['created_at'] ?? $now,
            'updated_at' => $now,
        ];

        if ($this->isDbAvailable()) {
            try {
                $pdo = Database::pdo();
                // Ensure gallery column exists (best-effort soft migrate)
                try {
                    $pdo->exec('ALTER TABLE blog_posts ADD COLUMN gallery TEXT NULL AFTER featured_image');
                } catch (\Throwable) {
                    // already exists
                }

                $sql = 'INSERT INTO blog_posts
                    (id, slug, title, excerpt, content, category, tags, featured_image, gallery, seo_title, seo_description, canonical_url, og_title, og_description, og_image, twitter_card, twitter_title, twitter_description, twitter_image, json_ld, reading_time, author_name, author_title, author_avatar, status, scheduled_at, views, created_at, updated_at)
                    VALUES
                    (:id, :slug, :title, :excerpt, :content, :category, :tags, :featured_image, :gallery, :seo_title, :seo_description, :canonical_url, :og_title, :og_description, :og_image, :twitter_card, :twitter_title, :twitter_description, :twitter_image, :json_ld, :reading_time, :author_name, :author_title, :author_avatar, :status, :scheduled_at, :views, :created_at, :updated_at)
                    ON DUPLICATE KEY UPDATE
                    slug=VALUES(slug), title=VALUES(title), excerpt=VALUES(excerpt), content=VALUES(content), category=VALUES(category), tags=VALUES(tags), featured_image=VALUES(featured_image), gallery=VALUES(gallery), seo_title=VALUES(seo_title), seo_description=VALUES(seo_description), canonical_url=VALUES(canonical_url), og_title=VALUES(og_title), og_description=VALUES(og_description), og_image=VALUES(og_image), twitter_card=VALUES(twitter_card), twitter_title=VALUES(twitter_title), twitter_description=VALUES(twitter_description), twitter_image=VALUES(twitter_image), json_ld=VALUES(json_ld), reading_time=VALUES(reading_time), author_name=VALUES(author_name), author_title=VALUES(author_title), author_avatar=VALUES(author_avatar), status=VALUES(status), scheduled_at=VALUES(scheduled_at), updated_at=VALUES(updated_at)';

                $stmt = $pdo->prepare($sql);
                $stmt->execute([
                    'id' => $record['id'],
                    'slug' => $record['slug'],
                    'title' => $record['title'],
                    'excerpt' => $record['excerpt'],
                    'content' => $record['content'],
                    'category' => $record['category'],
                    'tags' => json_encode($record['tags']),
                    'featured_image' => $record['featured_image'],
                    'gallery' => json_encode($record['gallery']),
                    'seo_title' => $record['seo_title'],
                    'seo_description' => $record['seo_description'],
                    'canonical_url' => $record['canonical_url'],
                    'og_title' => $record['og_title'],
                    'og_description' => $record['og_description'],
                    'og_image' => $record['og_image'],
                    'twitter_card' => $record['twitter_card'],
                    'twitter_title' => $record['twitter_title'],
                    'twitter_description' => $record['twitter_description'],
                    'twitter_image' => $record['twitter_image'],
                    'json_ld' => $record['json_ld'],
                    'reading_time' => $record['reading_time'],
                    'author_name' => $record['author_name'],
                    'author_title' => $record['author_title'],
                    'author_avatar' => $record['author_avatar'],
                    'status' => $record['status'],
                    'scheduled_at' => $record['scheduled_at'],
                    'views' => $record['views'],
                    'created_at' => $record['created_at'],
                    'updated_at' => $record['updated_at'],
                ]);
            } catch (\Throwable) {
                // JSON mirror still written below
            }
        }

        $posts = $this->getJsonPosts();
        $idx = -1;
        foreach ($posts as $i => $p) {
            if (($p['id'] ?? '') === $id || ($p['slug'] ?? '') === $record['slug']) {
                $idx = $i;
                // Preserve view count on update unless explicitly provided
                if (!isset($postData['views']) && isset($p['views'])) {
                    $record['views'] = (int) $p['views'];
                }
                if (!isset($postData['created_at']) && isset($p['created_at'])) {
                    $record['created_at'] = $p['created_at'];
                }
                break;
            }
        }
        if ($idx >= 0) {
            $posts[$idx] = $record;
        } else {
            array_unshift($posts, $record);
        }
        $this->saveJsonPosts($posts);

        require_once __DIR__ . '/WebsiteKnowledgeBuilder.php';
        WebsiteKnowledgeBuilder::rebuildSafe();

        return $record;
    }

    public function delete(string $id): bool
    {
        if ($this->isDbAvailable()) {
            try {
                $pdo = Database::pdo();
                $stmt = $pdo->prepare('DELETE FROM blog_posts WHERE id = :id');
                $stmt->execute(['id' => $id]);
            } catch (\Throwable) {
                // Fallback
            }
        }

        $posts = $this->getJsonPosts();
        $filtered = array_values(array_filter($posts, static fn ($p) => ($p['id'] ?? '') !== $id));
        $this->saveJsonPosts($filtered);

        require_once __DIR__ . '/WebsiteKnowledgeBuilder.php';
        WebsiteKnowledgeBuilder::rebuildSafe();

        return true;
    }

    /**
     * @return list<array{name: string, count: int}>
     */
    public function listCategories(): array
    {
        $counts = [];
        foreach ($this->listPosts(false) as $p) {
            $cat = trim((string) ($p['category'] ?? 'Uncategorized'));
            if ($cat === '') {
                $cat = 'Uncategorized';
            }
            $counts[$cat] = ($counts[$cat] ?? 0) + 1;
        }
        $out = [];
        foreach ($counts as $name => $count) {
            $out[] = ['name' => $name, 'count' => $count];
        }
        usort($out, static fn ($a, $b) => $b['count'] <=> $a['count']);
        return $out;
    }
}

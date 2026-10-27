<?php

declare(strict_types=1);

namespace RankRise\Api\Services;

require_once __DIR__ . '/WebsiteKnowledgeIndex.php';
require_once __DIR__ . '/FaqStore.php';
require_once __DIR__ . '/BlogStore.php';
require_once __DIR__ . '/KnowledgeSearchService.php';
require_once __DIR__ . '/LocalAnswerEngine.php';

/**
 * Builds website_index.json from pages + KB + FAQ + Blog (no live HTML crawl).
 * Index once; chatbot searches locally under 200ms.
 */
final class WebsiteKnowledgeBuilder
{
    private string $dataDir;
    private string $defaultsDir;

    public function __construct(?string $dataDir = null, ?string $defaultsDir = null)
    {
        $this->dataDir = $dataDir ?? (dirname(__DIR__) . '/storage/knowledge');
        $this->defaultsDir = $defaultsDir ?? (dirname(__DIR__) . '/config/knowledge');
        if (!is_dir($this->dataDir)) {
            if (!@mkdir($this->dataDir, 0755, true) && !is_dir($this->dataDir)) {
                throw new \RuntimeException('Knowledge storage directory could not be created.');
            }
        }
        if (!is_writable($this->dataDir)) {
            throw new \RuntimeException('Knowledge storage directory is not writable.');
        }
    }

    /**
     * @return array{ok: bool, doc_count: int, built_at: string, sources: array<string, int>, path: string}
     */
    public function rebuild(): array
    {
        $docs = [];
        $sources = [
            'pages' => 0,
            'knowledge' => 0,
            'faq' => 0,
            'blog' => 0,
        ];

        foreach ($this->loadWebsitePages() as $doc) {
            $docs[] = $doc;
            $sources['pages']++;
        }

        foreach ($this->loadKnowledgeCollections() as $doc) {
            $docs[] = $doc;
            $sources['knowledge']++;
        }

        foreach ($this->loadFaqs() as $doc) {
            $docs[] = $doc;
            $sources['faq']++;
        }

        foreach ($this->loadBlogs() as $doc) {
            $docs[] = $doc;
            $sources['blog']++;
        }

        // De-dupe by id (last wins)
        $byId = [];
        foreach ($docs as $doc) {
            $id = (string) ($doc['id'] ?? '');
            if ($id === '') {
                $id = 'doc_' . substr(sha1((string) ($doc['title'] ?? '') . (string) ($doc['content'] ?? '')), 0, 12);
                $doc['id'] = $id;
            }
            $byId[$id] = $doc;
        }
        $docs = array_values($byId);

        $builtAt = gmdate('c');
        $payload = [
            'built_at' => $builtAt,
            'version' => 1,
            'sources' => $sources,
            'docs' => $docs,
        ];

        $path = rtrim($this->dataDir, '/\\') . '/website_index.json';
        $tmp = $path . '.tmp';
        $json = json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        if ($json === false) {
            throw new \RuntimeException('Website knowledge index could not be encoded.');
        }
        if (file_put_contents($tmp, $json, LOCK_EX) === false) {
            throw new \RuntimeException('Website knowledge index temp write failed.');
        }
        if (!@rename($tmp, $path)) {
            @unlink($tmp);
            throw new \RuntimeException('Website knowledge index atomic rename failed.');
        }

        WebsiteKnowledgeIndex::clearMemory();
        LocalAnswerEngine::clearCache();

        return [
            'ok' => true,
            'doc_count' => count($docs),
            'built_at' => $builtAt,
            'sources' => $sources,
            'path' => $path,
        ];
    }

    /**
     * Rebuild if index missing or older than $maxAgeSeconds (0 = only if missing).
     *
     * @return array<string, mixed>|null rebuild result or null if skipped
     */
    public function rebuildIfStale(int $maxAgeSeconds = 0): ?array
    {
        $path = rtrim($this->dataDir, '/\\') . '/website_index.json';
        if (!is_file($path) || filesize($path) < 10) {
            return $this->rebuild();
        }
        if ($maxAgeSeconds > 0) {
            $age = time() - (int) @filemtime($path);
            if ($age >= $maxAgeSeconds) {
                return $this->rebuild();
            }
        }
        return null;
    }

    /** Fire-and-forget safe rebuild (swallows errors so CMS saves never fail). */
    public static function rebuildSafe(): void
    {
        try {
            (new self())->rebuild();
        } catch (\Throwable) {
            // ignore
        }
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function loadWebsitePages(): array
    {
        $file = $this->defaultsDir . '/website_pages.default.json';
        $rows = $this->readJsonArray($file);
        $out = [];
        foreach ($rows as $row) {
            if (!is_array($row)) {
                continue;
            }
            $content = trim((string) ($row['content'] ?? ''));
            if ($content === '') {
                continue;
            }
            $out[] = [
                'id' => (string) ($row['id'] ?? ('page_' . substr(sha1($content), 0, 8))),
                'title' => (string) ($row['title'] ?? 'Page'),
                'content' => $content,
                'url' => (string) ($row['url'] ?? ''),
                'section' => (string) ($row['section'] ?? 'pages'),
                'source' => 'pages',
                'keywords' => is_array($row['keywords'] ?? null) ? array_values($row['keywords']) : [],
                'is_active' => ($row['is_active'] ?? true) !== false,
            ];
        }
        return $out;
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function loadKnowledgeCollections(): array
    {
        $collections = [
            'company_info' => ['section' => 'about', 'url' => '/about'],
            'contact' => ['section' => 'contact', 'url' => '/contact'],
            'services' => ['section' => 'services', 'url' => '/services'],
            'pricing' => ['section' => 'pricing', 'url' => '/pricing'],
            'courses' => ['section' => 'courses', 'url' => '/courses'],
            'portfolio' => ['section' => 'portfolio', 'url' => '/portfolio'],
            'policies' => ['section' => 'policies', 'url' => '/privacy-policy'],
            'office_hours' => ['section' => 'contact', 'url' => '/contact'],
            'documents' => ['section' => 'policies', 'url' => '/'],
            'faqs' => ['section' => 'faq', 'url' => '/'],
            'blogs' => ['section' => 'blog', 'url' => '/blog'],
        ];

        $out = [];
        foreach ($collections as $name => $meta) {
            $path = rtrim($this->dataDir, '/\\') . '/' . $name . '.json';
            if (!is_file($path)) {
                $path = $this->defaultsDir . '/' . $name . '.default.json';
            }
            foreach ($this->readJsonArray($path) as $row) {
                if (!is_array($row) || ($row['is_active'] ?? true) === false) {
                    continue;
                }
                $content = trim((string) ($row['content'] ?? $row['answer'] ?? ''));
                if ($content === '') {
                    continue;
                }
                $id = (string) ($row['id'] ?? '');
                $out[] = [
                    'id' => 'kb_' . $name . '_' . ($id !== '' ? $id : substr(sha1($content), 0, 8)),
                    'title' => (string) ($row['title'] ?? $row['question'] ?? $name),
                    'content' => $content,
                    'url' => (string) ($row['url'] ?? $meta['url']),
                    'section' => $meta['section'],
                    'source' => 'knowledge:' . $name,
                    'keywords' => is_array($row['keywords'] ?? null) ? array_values($row['keywords']) : [],
                    'is_active' => true,
                ];
            }
        }
        return $out;
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function loadFaqs(): array
    {
        $out = [];
        try {
            $faqs = (new FaqStore())->listEnabled();
        } catch (\Throwable) {
            return [];
        }
        foreach ($faqs as $faq) {
            $answer = trim((string) ($faq['answer'] ?? ''));
            $question = trim((string) ($faq['question'] ?? ''));
            if ($answer === '') {
                continue;
            }
            $keywords = is_array($faq['keywords'] ?? null) ? array_values($faq['keywords']) : [];
            if ($question !== '') {
                $keywords[] = $question;
            }
            $out[] = [
                'id' => 'faq_' . (string) ($faq['id'] ?? substr(sha1($answer), 0, 8)),
                'title' => $question !== '' ? $question : 'FAQ',
                'content' => ($question !== '' ? $question . "\n\n" : '') . $answer,
                'url' => '/',
                'section' => 'faq',
                'source' => 'faq',
                'keywords' => $keywords,
                'is_active' => true,
            ];
        }
        return $out;
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function loadBlogs(): array
    {
        $out = [];
        try {
            $posts = (new BlogStore())->listPosts(false);
        } catch (\Throwable) {
            return [];
        }
        foreach ($posts as $post) {
            if (!is_array($post)) {
                continue;
            }
            $title = trim((string) ($post['title'] ?? ''));
            $excerpt = trim((string) ($post['excerpt'] ?? ''));
            $contentHtml = (string) ($post['content'] ?? '');
            $plain = trim(html_entity_decode(strip_tags($contentHtml), ENT_QUOTES | ENT_HTML5, 'UTF-8'));
            if (strlen($plain) > 1200) {
                $plain = rtrim(substr($plain, 0, 1197)) . '…';
            }
            $body = trim($excerpt . ($excerpt !== '' && $plain !== '' ? "\n\n" : '') . $plain);
            if ($title === '' && $body === '') {
                continue;
            }
            $slug = (string) ($post['slug'] ?? '');
            $url = $slug !== '' ? '/blog/' . $slug : '/blog';
            $tags = is_array($post['tags'] ?? null) ? $post['tags'] : [];
            $keywords = array_merge(
                [$title, (string) ($post['category'] ?? '')],
                array_map('strval', $tags)
            );
            $out[] = [
                'id' => 'blog_' . (string) ($post['id'] ?? $slug ?: substr(sha1($title), 0, 8)),
                'title' => $title !== '' ? $title : 'Blog post',
                'content' => $body !== '' ? $body : $title,
                'url' => $url,
                'section' => 'blog',
                'source' => 'blog',
                'keywords' => array_values(array_filter($keywords)),
                'is_active' => true,
            ];
        }
        return $out;
    }

    /**
     * @return list<mixed>
     */
    private function readJsonArray(string $path): array
    {
        if (!is_file($path)) {
            return [];
        }
        $raw = file_get_contents($path);
        if ($raw === false || trim($raw) === '') {
            return [];
        }
        try {
            $parsed = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            return [];
        }
        return is_array($parsed) ? $parsed : [];
    }
}

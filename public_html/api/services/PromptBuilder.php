<?php

declare(strict_types=1);

namespace RankRise\Api\Services;

/**
 * Builds the OpenAI message array from the config template (mirrors PromptBuilder.js).
 */
final class PromptBuilder
{
    /** @var array<string, mixed> */
    private array $config;

    /**
     * @param array<string, mixed> $promptConfig
     */
    public function __construct(array $promptConfig)
    {
        $this->config = $promptConfig;
    }

    /**
     * @param array{
     *   visitorMessage: string,
     *   knowledgeSnippets: list<string>,
     *   history?: list<array{author: string, content: string}>,
     *   promptHint?: string|null
     * } $input
     * @return array{
     *   systemPrompt: string,
     *   messages: list<array{role: string, content: string}>
     * }
     */
    public function build(array $input): array
    {
        $knowledgeSnippets = $input['knowledgeSnippets'] ?? [];
        $history = $input['history'] ?? [];
        $promptHint = $input['promptHint'] ?? null;
        $visitorMessage = (string) ($input['visitorMessage'] ?? '');

        $knowledge = count($knowledgeSnippets) > 0
            ? implode("\n\n", $knowledgeSnippets)
            : (string) ($this->config['emptyKnowledgePlaceholder'] ?? '');

        $systemPrompt = self::renderTemplate((string) ($this->config['systemTemplate'] ?? ''), [
            'companyName' => (string) ($this->config['companyName'] ?? ''),
            'handoverToken' => (string) ($this->config['handoverToken'] ?? ''),
            'knowledge' => $knowledge,
        ]);

        if (is_string($promptHint) && $promptHint !== '') {
            $systemPrompt = $systemPrompt . "\n\n" . $promptHint;
        }

        $maxHistory = (int) ($this->config['maxHistoryMessages'] ?? 10);
        if ($maxHistory < 0) {
            $maxHistory = 0;
        }

        $recent = array_slice($history, -$maxHistory);
        $messages = [];
        foreach ($recent as $m) {
            if (!is_array($m) || !isset($m['content']) || !is_string($m['content'])) {
                continue;
            }
            if (trim($m['content']) === '') {
                continue;
            }
            $author = $m['author'] ?? '';
            $messages[] = [
                'role' => $author === 'visitor' ? 'user' : 'assistant',
                'content' => $m['content'],
            ];
        }

        $messages[] = ['role' => 'user', 'content' => $visitorMessage];

        return [
            'systemPrompt' => $systemPrompt,
            'messages' => $messages,
        ];
    }

    /**
     * @param array<string, string> $values
     */
    public static function renderTemplate(string $template, array $values): string
    {
        return (string) preg_replace_callback(
            '/\{\{(\w+)\}\}/',
            static function (array $m) use ($values): string {
                $key = $m[1];
                return array_key_exists($key, $values) ? (string) $values[$key] : $m[0];
            },
            $template
        );
    }
}

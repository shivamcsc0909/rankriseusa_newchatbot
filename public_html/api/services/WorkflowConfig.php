<?php

declare(strict_types=1);

namespace RankRise\Api\Services;

use RankRise\Api\Lib\AppException;

/**
 * Loads workflow prompts / decision rules (mirrors backend/services/workflowConfig.js).
 */
final class WorkflowConfig
{
    /**
     * @return array<string, mixed>
     */
    public static function load(?string $configPath = null): array
    {
        $path = $configPath ?? (dirname(__DIR__) . '/config/workflow.config.json');
        if (!is_file($path) || !is_readable($path)) {
            throw new AppException(
                'Workflow config is missing.',
                500,
                'workflow_config_missing',
                ['path' => $path]
            );
        }

        $raw = file_get_contents($path);
        if ($raw === false) {
            throw new AppException('Failed to read workflow config.', 500, 'workflow_config_unreadable');
        }

        try {
            /** @var mixed $parsed */
            $parsed = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException $e) {
            throw new AppException(
                'Workflow config is not valid JSON.',
                500,
                'workflow_config_invalid',
                [],
                $e
            );
        }

        if (!is_array($parsed)) {
            throw new AppException('Workflow config must be a JSON object.', 500, 'workflow_config_invalid');
        }

        return $parsed;
    }

    /**
     * Persist workflow config (admin settings editor).
     *
     * @param array<string, mixed> $config
     */
    public static function save(array $config, ?string $configPath = null): array
    {
        $path = $configPath ?? (dirname(__DIR__) . '/config/workflow.config.json');
        $dir = dirname($path);
        if (!is_dir($dir) || !is_writable($dir)) {
            throw new AppException('Workflow config directory is not writable.', 500, 'workflow_config_unwritable');
        }

        $json = json_encode($config, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        if ($json === false) {
            throw new AppException('Failed to encode workflow config.', 500, 'workflow_config_encode_failed');
        }

        $tmp = $path . '.tmp.' . bin2hex(random_bytes(4));
        if (file_put_contents($tmp, $json . "\n", LOCK_EX) === false) {
            throw new AppException('Failed to write workflow config.', 500, 'workflow_config_write_failed');
        }
        if (!rename($tmp, $path)) {
            @unlink($tmp);
            throw new AppException('Failed to replace workflow config.', 500, 'workflow_config_replace_failed');
        }

        return self::load($path);
    }

    /**
     * Safe subset for admin UI (no secrets).
     *
     * @return array<string, mixed>
     */
    public static function adminView(?string $configPath = null): array
    {
        $cfg = self::load($configPath);
        return [
            'prompt' => [
                'companyName' => (string) ($cfg['prompt']['companyName'] ?? 'RankRise USA'),
                'maxHistoryMessages' => (int) ($cfg['prompt']['maxHistoryMessages'] ?? 10),
                'emptyKnowledgePlaceholder' => (string) ($cfg['prompt']['emptyKnowledgePlaceholder'] ?? ''),
            ],
            'knowledgeSearch' => [
                'collections' => $cfg['knowledgeSearch']['collections'] ?? [],
                'maxResults' => (int) ($cfg['knowledgeSearch']['maxResults'] ?? 5),
                'minScore' => (int) ($cfg['knowledgeSearch']['minScore'] ?? 1),
            ],
            'decision' => [
                'handoverMessage' => (string) ($cfg['decision']['handoverMessage'] ?? ''),
                'errorMessage' => (string) ($cfg['decision']['errorMessage'] ?? ''),
                'humanRequestPatterns' => $cfg['decision']['humanRequestPatterns'] ?? [],
                'escalationPatterns' => $cfg['decision']['escalationPatterns'] ?? [],
            ],
            'ai' => [
                'enabled' => (bool) ($cfg['ai']['enabled'] ?? true),
                'temperature' => (float) ($cfg['ai']['temperature'] ?? 0.4),
                'maxTokens' => (int) ($cfg['ai']['maxTokens'] ?? 500),
            ],
            'faq' => [
                'enabled' => (bool) ($cfg['faq']['enabled'] ?? true),
                'minScore' => (int) ($cfg['faq']['minScore'] ?? 3),
            ],
            'localAnswer' => [
                'enabled' => (bool) ($cfg['localAnswer']['enabled'] ?? true),
                'knowledgeMinScore' => (int) ($cfg['localAnswer']['knowledgeMinScore'] ?? 4),
                'businessMinScore' => (int) ($cfg['localAnswer']['businessMinScore'] ?? 3),
            ],
        ];
    }

    /**
     * Merge admin-editable fields into existing config (preserves systemTemplate etc.).
     *
     * @param array<string, mixed> $patch
     * @return array<string, mixed>
     */
    public static function mergeAdminPatch(array $patch, ?string $configPath = null): array
    {
        $cfg = self::load($configPath);

        if (isset($patch['prompt']) && is_array($patch['prompt'])) {
            $p = $patch['prompt'];
            if (isset($p['companyName'])) {
                $cfg['prompt']['companyName'] = trim((string) $p['companyName']);
            }
            if (isset($p['maxHistoryMessages'])) {
                $cfg['prompt']['maxHistoryMessages'] = max(1, min(50, (int) $p['maxHistoryMessages']));
            }
            if (isset($p['emptyKnowledgePlaceholder'])) {
                $cfg['prompt']['emptyKnowledgePlaceholder'] = (string) $p['emptyKnowledgePlaceholder'];
            }
        }

        if (isset($patch['knowledgeSearch']) && is_array($patch['knowledgeSearch'])) {
            $k = $patch['knowledgeSearch'];
            if (isset($k['collections']) && is_array($k['collections'])) {
                $cfg['knowledgeSearch']['collections'] = array_values(array_filter(
                    array_map(static fn ($c) => trim((string) $c), $k['collections']),
                    static fn ($c) => $c !== ''
                ));
            }
            if (isset($k['maxResults'])) {
                $cfg['knowledgeSearch']['maxResults'] = max(1, min(20, (int) $k['maxResults']));
            }
            if (isset($k['minScore'])) {
                $cfg['knowledgeSearch']['minScore'] = max(0, (int) $k['minScore']);
            }
        }

        if (isset($patch['decision']) && is_array($patch['decision'])) {
            $d = $patch['decision'];
            if (isset($d['handoverMessage'])) {
                $cfg['decision']['handoverMessage'] = (string) $d['handoverMessage'];
            }
            if (isset($d['errorMessage'])) {
                $cfg['decision']['errorMessage'] = (string) $d['errorMessage'];
            }
            if (isset($d['humanRequestPatterns']) && is_array($d['humanRequestPatterns'])) {
                $cfg['decision']['humanRequestPatterns'] = array_values(array_filter(
                    array_map(static fn ($x) => trim((string) $x), $d['humanRequestPatterns'])
                ));
            }
            if (isset($d['escalationPatterns']) && is_array($d['escalationPatterns'])) {
                $cfg['decision']['escalationPatterns'] = array_values(array_filter(
                    array_map(static fn ($x) => trim((string) $x), $d['escalationPatterns'])
                ));
            }
        }

        if (isset($patch['ai']) && is_array($patch['ai'])) {
            $a = $patch['ai'];
            if (array_key_exists('enabled', $a)) {
                $cfg['ai']['enabled'] = (bool) $a['enabled'];
            }
            if (isset($a['temperature'])) {
                $cfg['ai']['temperature'] = max(0.0, min(2.0, (float) $a['temperature']));
            }
            if (isset($a['maxTokens'])) {
                $cfg['ai']['maxTokens'] = max(50, min(4000, (int) $a['maxTokens']));
            }
        }

        if (isset($patch['localAnswer']) && is_array($patch['localAnswer'])) {
            $l = $patch['localAnswer'];
            if (array_key_exists('enabled', $l)) {
                $cfg['localAnswer']['enabled'] = (bool) $l['enabled'];
            }
            if (isset($l['knowledgeMinScore'])) {
                $cfg['localAnswer']['knowledgeMinScore'] = max(1, (int) $l['knowledgeMinScore']);
            }
            if (isset($l['businessMinScore'])) {
                $cfg['localAnswer']['businessMinScore'] = max(1, (int) $l['businessMinScore']);
            }
        }

        if (isset($patch['faq']) && is_array($patch['faq'])) {
            $f = $patch['faq'];
            if (array_key_exists('enabled', $f)) {
                $cfg['faq']['enabled'] = (bool) $f['enabled'];
            }
            if (isset($f['minScore'])) {
                $cfg['faq']['minScore'] = max(0, (int) $f['minScore']);
            }
        }

        return $cfg;
    }
}

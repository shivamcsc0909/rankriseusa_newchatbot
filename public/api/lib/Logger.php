<?php

declare(strict_types=1);

namespace RankRise\Api\Lib;

/**
 * Simple file logger for Hostinger shared hosting (no Redis / workers).
 */
final class Logger
{
    private string $directory;
    private string $channel;
    private string $minLevel;

    /** @var array<string, int> */
    private const LEVELS = [
        'debug' => 10,
        'info' => 20,
        'warning' => 30,
        'error' => 40,
        'critical' => 50,
    ];

    public function __construct(?string $directory = null, string $channel = 'app', string $minLevel = 'info')
    {
        $this->directory = $directory ?? (dirname(__DIR__) . '/storage/logs');
        $this->channel = $channel;
        $this->minLevel = strtolower($minLevel);
    }

    /**
     * @param array<string, mixed> $context
     */
    public function debug(string $message, array $context = []): void
    {
        $this->log('debug', $message, $context);
    }

    /**
     * @param array<string, mixed> $context
     */
    public function info(string $message, array $context = []): void
    {
        $this->log('info', $message, $context);
    }

    /**
     * @param array<string, mixed> $context
     */
    public function warning(string $message, array $context = []): void
    {
        $this->log('warning', $message, $context);
    }

    /**
     * @param array<string, mixed> $context
     */
    public function error(string $message, array $context = []): void
    {
        $this->log('error', $message, $context);
    }

    /**
     * @param array<string, mixed> $context
     */
    public function critical(string $message, array $context = []): void
    {
        $this->log('critical', $message, $context);
    }

    /**
     * @param array<string, mixed> $context
     */
    public function log(string $level, string $message, array $context = []): void
    {
        $level = strtolower($level);
        if (!isset(self::LEVELS[$level])) {
            $level = 'info';
        }

        $min = self::LEVELS[$this->minLevel] ?? 20;
        if ((self::LEVELS[$level] ?? 20) < $min) {
            return;
        }

        if (!is_dir($this->directory)) {
            @mkdir($this->directory, 0755, true);
        }

        if (!is_dir($this->directory) || !is_writable($this->directory)) {
            return;
        }

        $file = $this->directory . '/' . $this->channel . '-' . date('Y-m-d') . '.log';
        $line = sprintf(
            "[%s] %s.%s: %s %s\n",
            date('c'),
            $this->channel,
            strtoupper($level),
            $message,
            $context === [] ? '' : json_encode($context, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)
        );

        @file_put_contents($file, $line, FILE_APPEND | LOCK_EX);
    }
}

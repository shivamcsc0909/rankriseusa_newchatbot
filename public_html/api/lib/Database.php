<?php

declare(strict_types=1);

namespace RankRise\Api\Lib;

use PDO;
use PDOException;
use PDOStatement;

/**
 * PDO MySQL singleton for Hostinger shared hosting.
 */
final class Database
{
    private static ?PDO $pdo = null;

    /** @var array<string, mixed> */
    private static array $config = [];

    /**
     * @param array<string, mixed> $config
     */
    public static function configure(array $config): void
    {
        self::$config = $config;
        self::$pdo = null;
    }

    public static function connection(): PDO
    {
        if (self::$pdo instanceof PDO) {
            return self::$pdo;
        }

        $host = (string) (self::$config['host'] ?? '127.0.0.1');
        $port = (int) (self::$config['port'] ?? 3306);
        $name = (string) (self::$config['database'] ?? '');
        $user = (string) (self::$config['username'] ?? '');
        $pass = (string) (self::$config['password'] ?? '');
        $charset = (string) (self::$config['charset'] ?? 'utf8mb4');

        if ($name === '' || $user === '') {
            throw new AppException(
                'Database is not configured.',
                503,
                'db_not_configured'
            );
        }

        $dsn = sprintf('mysql:host=%s;port=%d;dbname=%s;charset=%s', $host, $port, $name, $charset);

        try {
            self::$pdo = new PDO($dsn, $user, $pass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::ATTR_STRINGIFY_FETCHES => false,
            ]);
        } catch (PDOException $e) {
            throw new AppException(
                'Database connection failed.',
                503,
                'db_connection_failed',
                ['driver_message' => $e->getMessage()],
                $e
            );
        }

        return self::$pdo;
    }

    public static function ping(): bool
    {
        try {
            self::connection()->query('SELECT 1');
            return true;
        } catch (AppException) {
            return false;
        }
    }

    /**
     * @param array<int|string, mixed> $params
     */
    public static function query(string $sql, array $params = []): PDOStatement
    {
        $stmt = self::connection()->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }

    /**
     * @param array<int|string, mixed> $params
     * @return array<string, mixed>|null
     */
    public static function fetchOne(string $sql, array $params = []): ?array
    {
        $row = self::query($sql, $params)->fetch();
        return $row === false ? null : $row;
    }

    /**
     * @param array<int|string, mixed> $params
     * @return list<array<string, mixed>>
     */
    public static function fetchAll(string $sql, array $params = []): array
    {
        /** @var list<array<string, mixed>> $rows */
        $rows = self::query($sql, $params)->fetchAll();
        return $rows;
    }

    public static function beginTransaction(): void
    {
        self::connection()->beginTransaction();
    }

    public static function commit(): void
    {
        self::connection()->commit();
    }

    public static function rollBack(): void
    {
        $pdo = self::connection();
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
    }

    public static function lastInsertId(): string
    {
        return (string) self::connection()->lastInsertId();
    }

    public static function reset(): void
    {
        self::$pdo = null;
    }
}

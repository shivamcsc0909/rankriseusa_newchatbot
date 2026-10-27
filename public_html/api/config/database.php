<?php

declare(strict_types=1);

use RankRise\Api\Lib\Env;

/**
 * PDO MySQL connection settings for Hostinger.
 *
 * @return array<string, mixed>
 */
return [
    'driver' => 'mysql',
    'host' => Env::getString('DB_HOST', '127.0.0.1'),
    'port' => Env::getInt('DB_PORT', 3306),
    'database' => Env::getString('DB_DATABASE', 'u834013214_rrr'),
    'username' => Env::getString('DB_USERNAME', 'u834013214_rrr'),
    'password' => Env::getString('DB_PASSWORD', '123mshgdhd0%$#@F'),
    'charset' => Env::getString('DB_CHARSET', 'utf8mb4'),
    'collation' => Env::getString('DB_COLLATION', 'utf8mb4_unicode_ci'),
];

<?php

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

$file = dirname(__DIR__) . $uri;

if ($uri !== '/' && file_exists($file) && !is_dir($file)) {
    return false;
}

$_SERVER['SCRIPT_NAME'] = '/api/index.php';
require __DIR__ . '/index.php';

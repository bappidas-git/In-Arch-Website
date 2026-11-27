<?php
// Dev-only router for PHP's built-in server. Never deployed (it lives outside public/).
// Usage: php -S 127.0.0.1:8080 -t build scripts/dev-router.php
$root = $_SERVER['DOCUMENT_ROOT'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if ($path !== '/' && is_file($root . $path)) {
    return false; // real file: static asset or /api/leads.php
}
header('Content-Type: text/html; charset=utf-8');
readfile($root . '/index.html'); // SPA fallback, as public/.htaccess does on Apache

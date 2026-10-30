<?php
use Illuminate\Http\Request;
define('LARAVEL_START', microtime(true));
$deployRoot = DEPLOY_ROOT_LITERAL;
$release = trim((string) @file_get_contents($deployRoot.'/current'));
if (!preg_match('/^[0-9a-f]{40}-[0-9]+-[0-9]+$/D', $release)) {
    http_response_code(503);
    exit('Service temporarily unavailable.');
}
$root = $deployRoot.'/releases/'.$release;
if (!is_file($root.'/vendor/autoload.php')) {
    http_response_code(503);
    exit('Service temporarily unavailable.');
}
header('X-Luxurry-Release: '.$release);
if (file_exists($maintenance = $root.'/storage/framework/maintenance.php')) {
    require $maintenance;
}
require $root.'/vendor/autoload.php';
$app = require_once $root.'/bootstrap/app.php';
$app->usePublicPath(__DIR__);
$app->handleRequest(Request::capture());

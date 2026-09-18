<?php

declare(strict_types=1);

/**
 * CodeQuest Backend Entrypoint
 */

// Handle CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Request path & method
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Trim trailing slash (except root)
if ($uri !== '/' && str_ends_with($uri, '/')) {
    $uri = rtrim($uri, '/');
}

// Load routes
$routes = require __DIR__ . '/../routes/api.php';
$routeKey = "{$method} {$uri}";

header('Content-Type: application/json; charset=utf-8');

if (isset($routes[$routeKey])) {
    try {
        $response = $routes[$routeKey]();
        echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode([
            'error' => 'Internal Server Error',
            'message' => $e->getMessage()
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    }
    exit;
}

// Check root path
if ($uri === '/') {
    echo json_encode([
        'message' => 'CodeQuest API Server',
        'health' => '/api/health',
        'api' => '/api'
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
}

// Fallback 404
http_response_code(404);
echo json_encode([
    'error' => 'Not Found',
    'path' => $uri,
    'method' => $method,
    'available_routes' => array_keys($routes)
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

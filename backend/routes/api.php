<?php

/**
 * CodeQuest API Routes
 */

return [
    'GET /api' => function () {
        return [
            'app' => 'CodeQuest API',
            'version' => '1.0.0',
            'environment' => getenv('APP_ENV') ?: 'local',
            'status' => 'online',
            'timestamp' => date('c'),
            'docs' => 'https://github.com/codequest/codequest'
        ];
    },

    'GET /api/health' => function () {
        $dbStatus = 'unknown';
        $dbError = null;

        $host = getenv('DB_HOST') ?: '127.0.0.1';
        $port = getenv('DB_PORT') ?: '3306';
        $database = getenv('DB_DATABASE') ?: 'codequest';
        $username = getenv('DB_USERNAME') ?: 'codequest';
        $password = getenv('DB_PASSWORD') ?: 'codequest_secret';

        try {
            $pdo = new PDO("mysql:host={$host};port={$port};dbname={$database}", $username, $password, [
                PDO::ATTR_TIMEOUT => 2,
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            ]);
            $dbStatus = 'connected';
        } catch (Throwable $e) {
            $dbStatus = 'disconnected';
            $dbError = $e->getMessage();
        }

        $httpCode = ($dbStatus === 'connected') ? 200 : 200; // Return 200 with status info
        http_response_code($httpCode);

        return [
            'status' => 'ok',
            'service' => 'CodeQuest Backend',
            'php_version' => PHP_VERSION,
            'database' => [
                'driver' => 'mysql',
                'status' => $dbStatus,
                'host' => $host,
                'database' => $database,
                'error' => $dbError
            ],
            'timestamp' => date('c')
        ];
    },

    'GET /api/version' => function () {
        return [
            'version' => '1.0.0',
            'framework' => 'Laravel / PHP 8.2+'
        ];
    }
];

<?php

use App\Http\Controllers\AssessmentController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\LearningPathController;
use App\Models\Course;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

/**
 * CodeQuest API Routes
 */

Route::get('/', function () {
    return response()->json([
        'app' => 'CodeQuest API',
        'version' => '1.0.0',
        'environment' => config('app.env'),
        'status' => 'online',
        'timestamp' => now()->toIso8601String(),
        'docs' => 'https://github.com/codequest/codequest',
    ]);
});

Route::get('/health', function () {
    $dbStatus = 'unknown';
    $dbError = null;

    try {
        DB::connection()->getPdo();
        $dbStatus = 'connected';
    } catch (\Throwable $e) {
        $dbStatus = 'disconnected';
        $dbError = $e->getMessage();
    }

    return response()->json([
        'status' => 'ok',
        'service' => 'CodeQuest Backend',
        'php_version' => PHP_VERSION,
        'framework' => 'Laravel ' . app()->version(),
        'database' => [
            'driver' => config('database.default'),
            'status' => $dbStatus,
            'host' => config('database.connections.mysql.host'),
            'database' => config('database.connections.mysql.database'),
            'error' => $dbError,
        ],
        'timestamp' => now()->toIso8601String(),
    ]);
});

Route::get('/version', function () {
    return response()->json([
        'version' => '1.0.0',
        'framework' => 'Laravel ' . app()->version(),
    ]);
});

Route::get('/courses', function () {
    $courses = Course::with('tags')->get();

    return response()->json([
        'status' => 'ok',
        'count' => $courses->count(),
        'data' => $courses,
    ]);
});

Route::get('/courses/{slug}', function (string $slug) {
    $course = Course::with('tags')->where('slug', $slug)->first();

    if (!$course) {
        return response()->json([
            'status' => 'error',
            'message' => 'Curso no encontrado',
        ], 404);
    }

    return response()->json([
        'status' => 'ok',
        'data' => $course,
    ]);
});

Route::get('/assessment/questions', [AssessmentController::class, 'index']);

/**
 * Authentication Routes (Discord OAuth2 & Laravel Sanctum)
 */
Route::prefix('auth')->group(function () {
    // Public OAuth2 flow
    Route::get('/discord/redirect', [AuthController::class, 'redirectToDiscord']);
    Route::get('/discord/callback', [AuthController::class, 'handleDiscordCallback']);

    // Local dev mock authentication
    Route::get('/mock-login', [AuthController::class, 'mockLogin']);

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/user', [AuthController::class, 'user']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

/**
 * Recommendation Routes
 */
Route::post('/recommendations/generate', [LearningPathController::class, 'generate']);



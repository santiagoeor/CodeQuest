<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\LearningPath;
use App\Services\LearningPathGeneratorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LearningPathController extends Controller
{
    protected LearningPathGeneratorService $generatorService;

    public function __construct(LearningPathGeneratorService $generatorService)
    {
        $this->generatorService = $generatorService;
    }

    /**
     * Generate a personalized learning path recommendation based on questionnaire answers.
     *
     * POST /api/recommendations/generate
     */
    public function generate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'options' => 'nullable|array',
            'options.*' => 'nullable',
            'answers' => 'nullable|array',
            'answers.*' => 'nullable',
        ]);

        // Ensure at least one input container is provided
        if (empty($validated['options']) && empty($validated['answers'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Se requiere proporcionar al menos una opción o respuesta de diagnóstico.',
            ], 422);
        }

        $recommendation = $this->generatorService->generate($validated);

        return response()->json([
            'status' => 'ok',
            'data' => $recommendation,
        ]);
    }

    /**
     * List all learning paths for the authenticated user.
     *
     * GET /api/learning-paths
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $paths = LearningPath::with(['courses.tags'])
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        return response()->json([
            'status' => 'ok',
            'count' => $paths->count(),
            'data' => $paths,
        ]);
    }

    /**
     * Store a new learning path assigned to the authenticated user.
     *
     * POST /api/learning-paths
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'level' => 'nullable|string|max:50',
            'status' => 'nullable|string|in:active,completed,archived',
            'course_ids' => 'nullable|array',
            'course_ids.*' => 'integer|exists:courses,id',
            'courses' => 'nullable|array',
            'courses.*.id' => 'nullable|integer|exists:courses,id',
            'courses.*.course_id' => 'nullable|integer|exists:courses,id',
            'courses.*.order' => 'nullable|integer',
        ]);

        $user = $request->user();

        // Normalize courses and their sequential order
        $coursesToAttach = [];

        if (!empty($validated['courses'])) {
            foreach ($validated['courses'] as $index => $item) {
                $courseId = $item['course_id'] ?? $item['id'] ?? null;
                if ($courseId) {
                    $order = $item['order'] ?? ($index + 1);
                    $coursesToAttach[$courseId] = [
                        'order' => $order,
                        'status' => 'pending',
                    ];
                }
            }
        } elseif (!empty($validated['course_ids'])) {
            foreach ($validated['course_ids'] as $index => $courseId) {
                $coursesToAttach[$courseId] = [
                    'order' => $index + 1,
                    'status' => 'pending',
                ];
            }
        }

        $learningPath = DB::transaction(function () use ($user, $validated, $coursesToAttach) {
            $path = LearningPath::create([
                'user_id' => $user->id,
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
                'level' => $validated['level'] ?? null,
                'status' => $validated['status'] ?? 'active',
            ]);

            if (!empty($coursesToAttach)) {
                $path->courses()->attach($coursesToAttach);
            }

            return $path;
        });

        $learningPath->load(['courses.tags']);

        return response()->json([
            'status' => 'ok',
            'message' => 'Ruta de aprendizaje guardada exitosamente.',
            'data' => $learningPath,
        ], 201);
    }

    /**
     * Get a specific learning path with its ordered courses and tags.
     *
     * GET /api/learning-paths/{id}
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        $learningPath = LearningPath::with(['courses.tags'])
            ->where('user_id', $user->id)
            ->where('id', $id)
            ->first();

        if (!$learningPath) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ruta de aprendizaje no encontrada.',
            ], 404);
        }

        return response()->json([
            'status' => 'ok',
            'data' => $learningPath,
        ]);
    }

    /**
     * Delete a learning path owned by the authenticated user.
     *
     * DELETE /api/learning-paths/{id}
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        $learningPath = LearningPath::where('user_id', $user->id)
            ->where('id', $id)
            ->first();

        if (!$learningPath) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ruta de aprendizaje no encontrada.',
            ], 404);
        }

        $learningPath->delete();

        return response()->json([
            'status' => 'ok',
            'message' => 'Ruta de aprendizaje eliminada exitosamente.',
        ]);
    }
}

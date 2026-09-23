<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseProgress;
use App\Models\LearningPath;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProgressController extends Controller
{
    /**
     * Get the current user's progress.
     * Optionally filters and calculates metrics for a given learning_path_id.
     *
     * GET /api/progress
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $learningPathId = $request->query('learning_path_id');

        if ($learningPathId) {
            $learningPath = LearningPath::with(['courses.tags'])
                ->where('user_id', $user->id)
                ->where('id', $learningPathId)
                ->first();

            if (!$learningPath) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Ruta de aprendizaje no encontrada.',
                ], 404);
            }

            $pathCourseIds = $learningPath->courses->pluck('id')->toArray();
            $totalCourses = count($pathCourseIds);

            $completedCourseIds = CourseProgress::where('user_id', $user->id)
                ->whereIn('course_id', $pathCourseIds)
                ->where('is_completed', true)
                ->pluck('course_id')
                ->toArray();

            $completedCount = count($completedCourseIds);
            $percentage = $totalCourses > 0 ? round(($completedCount / $totalCourses) * 100, 1) : 0.0;

            return response()->json([
                'status' => 'ok',
                'data' => [
                    'learning_path_id' => (int) $learningPathId,
                    'total_courses_count' => $totalCourses,
                    'completed_courses_count' => $completedCount,
                    'progress_percentage' => $percentage,
                    'completed_course_ids' => $completedCourseIds,
                ],
            ]);
        }

        $allProgress = CourseProgress::where('user_id', $user->id)->get();
        $completedIds = $allProgress->where('is_completed', true)->pluck('course_id')->values()->toArray();

        return response()->json([
            'status' => 'ok',
            'data' => [
                'completed_course_ids' => $completedIds,
                'progress_entries' => $allProgress,
            ],
        ]);
    }

    /**
     * Toggle the completion status of a course for the authenticated user.
     * Updates learning path progress metrics if learning_path_id is provided.
     *
     * POST /api/progress/toggle
     */
    public function toggle(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'course_id' => 'required|integer|exists:courses,id',
            'learning_path_id' => 'nullable|integer|exists:learning_paths,id',
        ]);

        $user = $request->user();
        $courseId = $validated['course_id'];
        $learningPathId = $validated['learning_path_id'] ?? null;

        $learningPath = null;
        if ($learningPathId) {
            $learningPath = LearningPath::with('courses')
                ->where('user_id', $user->id)
                ->where('id', $learningPathId)
                ->first();

            if (!$learningPath) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Ruta de aprendizaje no encontrada.',
                ], 404);
            }
        }

        $result = DB::transaction(function () use ($user, $courseId, $learningPath) {
            $progress = CourseProgress::firstOrNew([
                'user_id' => $user->id,
                'course_id' => $courseId,
            ]);

            $newStatus = !$progress->is_completed;
            $progress->is_completed = $newStatus;
            $progress->completed_at = $newStatus ? now() : null;
            $progress->save();

            $metrics = [
                'learning_path_id' => null,
                'completed_courses_count' => null,
                'total_courses_count' => null,
                'progress_percentage' => null,
                'completed_course_ids' => [],
            ];

            if ($learningPath) {
                // Update pivot table status if course exists in the path
                if ($learningPath->courses->contains('id', $courseId)) {
                    $learningPath->courses()->updateExistingPivot($courseId, [
                        'status' => $newStatus ? 'completed' : 'pending',
                    ]);
                }

                $pathCourseIds = $learningPath->courses->pluck('id')->toArray();
                $totalCourses = count($pathCourseIds);

                $completedCourseIds = CourseProgress::where('user_id', $user->id)
                    ->whereIn('course_id', $pathCourseIds)
                    ->where('is_completed', true)
                    ->pluck('course_id')
                    ->toArray();

                $completedCount = count($completedCourseIds);
                $percentage = $totalCourses > 0 ? round(($completedCount / $totalCourses) * 100, 1) : 0.0;

                // Sync path overall status
                if ($totalCourses > 0 && $completedCount === $totalCourses) {
                    $learningPath->update(['status' => 'completed']);
                } elseif ($completedCount > 0 && $learningPath->status === 'completed') {
                    $learningPath->update(['status' => 'active']);
                }

                $metrics = [
                    'learning_path_id' => $learningPath->id,
                    'completed_courses_count' => $completedCount,
                    'total_courses_count' => $totalCourses,
                    'progress_percentage' => $percentage,
                    'completed_course_ids' => $completedCourseIds,
                ];
            }

            return [
                'progress' => $progress,
                'metrics' => $metrics,
            ];
        });

        return response()->json([
            'status' => 'ok',
            'message' => 'Progreso actualizado exitosamente.',
            'data' => array_merge([
                'course_id' => $courseId,
                'is_completed' => $result['progress']->is_completed,
                'completed_at' => $result['progress']->completed_at ? $result['progress']->completed_at->toIso8601String() : null,
            ], $result['metrics']),
        ]);
    }
}

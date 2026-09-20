<?php

namespace App\Http\Controllers;

use App\Models\Question;
use Illuminate\Http\JsonResponse;

class AssessmentController extends Controller
{
    /**
     * List all assessment questions with their options.
     *
     * GET /api/assessment/questions
     */
    public function index(): JsonResponse
    {
        $questions = Question::with(['options' => fn($q) => $q->orderBy('order')])
            ->orderBy('order')
            ->get();

        return response()->json([
            'status' => 'ok',
            'count' => $questions->count(),
            'data' => $questions,
        ]);
    }
}

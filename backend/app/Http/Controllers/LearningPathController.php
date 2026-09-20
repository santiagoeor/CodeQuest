<?php

namespace App\Http\Controllers;

use App\Services\LearningPathGeneratorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
}

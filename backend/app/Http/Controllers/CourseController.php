<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCourseRequest;
use App\Http\Requests\UpdateCourseRequest;
use App\Models\Course;
use App\Models\Tag;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CourseController extends Controller
{
    /**
     * Display a listing of courses with their tags.
     *
     * GET /api/courses
     */
    public function index(): JsonResponse
    {
        $courses = Course::with('tags')->get();

        return response()->json([
            'status' => 'ok',
            'count' => $courses->count(),
            'data' => $courses,
        ]);
    }

    /**
     * Display the specified course by slug or numeric ID.
     *
     * GET /api/courses/{slugOrId}
     */
    public function show(string $slugOrId): JsonResponse
    {
        $course = is_numeric($slugOrId)
            ? Course::with('tags')->find($slugOrId)
            : Course::with('tags')->where('slug', $slugOrId)->first();

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
    }

    /**
     * Store a newly created course with associated tags.
     *
     * POST /api/courses
     */
    public function store(StoreCourseRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $course = DB::transaction(function () use ($validated) {
            $course = Course::create([
                'title' => $validated['title'],
                'slug' => $validated['slug'],
                'description' => $validated['description'],
                'level' => $validated['level'],
                'url' => $validated['url'],
                'duration' => $validated['duration'],
                'image_url' => $validated['image_url'] ?? null,
            ]);

            if (isset($validated['tags']) && is_array($validated['tags'])) {
                $tagIds = $this->resolveTagIds($validated['tags']);
                $course->tags()->sync($tagIds);
            }

            return $course;
        });

        $course->load('tags');

        return response()->json([
            'status' => 'ok',
            'message' => 'Curso creado exitosamente.',
            'data' => $course,
        ], 201);
    }

    /**
     * Update the specified course and synchronize its tags.
     *
     * PUT /api/courses/{id}
     */
    public function update(UpdateCourseRequest $request, int $id): JsonResponse
    {
        $course = Course::find($id);

        if (!$course) {
            return response()->json([
                'status' => 'error',
                'message' => 'Curso no encontrado',
            ], 404);
        }

        $validated = $request->validated();

        DB::transaction(function () use ($course, $validated) {
            $courseData = collect($validated)->except('tags')->toArray();
            if (!empty($courseData)) {
                $course->update($courseData);
            }

            if (isset($validated['tags']) && is_array($validated['tags'])) {
                $tagIds = $this->resolveTagIds($validated['tags']);
                $course->tags()->sync($tagIds);
            }
        });

        $course->load('tags');

        return response()->json([
            'status' => 'ok',
            'message' => 'Curso actualizado exitosamente.',
            'data' => $course,
        ]);
    }

    /**
     * Resolve a mixed list of tag IDs, names, or slugs into an array of valid Tag IDs.
     * Auto-creates any missing tags by name/slug.
     */
    protected function resolveTagIds(array $tags): array
    {
        $tagIds = [];

        foreach ($tags as $item) {
            if (empty($item)) {
                continue;
            }

            if (is_numeric($item)) {
                $tag = Tag::find($item);
                if ($tag) {
                    $tagIds[] = $tag->id;
                }
            } elseif (is_string($item)) {
                $trimmed = trim($item);
                $slug = Str::slug($trimmed);
                if ($slug === '') {
                    continue;
                }

                $tag = Tag::firstOrCreate(
                    ['slug' => $slug],
                    ['name' => $trimmed]
                );
                $tagIds[] = $tag->id;
            } elseif (is_array($item)) {
                if (isset($item['id']) && is_numeric($item['id'])) {
                    $tagIds[] = (int) $item['id'];
                } elseif (isset($item['name']) && is_string($item['name'])) {
                    $trimmed = trim($item['name']);
                    $slug = Str::slug($trimmed);
                    if ($slug !== '') {
                        $tag = Tag::firstOrCreate(
                            ['slug' => $slug],
                            ['name' => $trimmed]
                        );
                        $tagIds[] = $tag->id;
                    }
                }
            }
        }

        return array_values(array_unique($tagIds));
    }
}

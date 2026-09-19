<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CourseTest extends TestCase
{
    public function test_can_list_all_courses(): void
    {
        $response = $this->getJson('/api/courses');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'count',
                'data' => [
                    '*' => [
                        'id',
                        'title',
                        'slug',
                        'description',
                        'level',
                        'url',
                        'duration',
                        'image_url',
                        'tags',
                    ],
                ],
            ]);
    }

    public function test_can_get_single_course_by_slug(): void
    {
        $response = $this->getJson('/api/courses/flutter-guia-completa-ios-android');

        $response->assertStatus(200)
            ->assertJsonPath('data.slug', 'flutter-guia-completa-ios-android')
            ->assertJsonPath('data.level', 'intermediate');
    }

    public function test_returns_404_for_non_existent_course(): void
    {
        $response = $this->getJson('/api/courses/curso-que-no-existe');

        $response->assertStatus(404);
    }
}

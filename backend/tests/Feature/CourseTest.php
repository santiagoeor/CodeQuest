<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CourseTest extends TestCase
{
    use RefreshDatabase;

    protected bool $seed = true;
    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create([
            'role' => 'student',
        ]);
    }

    public function test_unauthenticated_user_cannot_access_course_catalog(): void
    {
        $response = $this->getJson('/api/courses');
        $response->assertStatus(401);

        $responseSingle = $this->getJson('/api/courses/flutter-guia-completa-ios-android');
        $responseSingle->assertStatus(401);
    }

    public function test_authenticated_student_can_list_all_courses(): void
    {
        Sanctum::actingAs($this->user);

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

    public function test_authenticated_student_can_get_single_course_by_slug(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->getJson('/api/courses/flutter-guia-completa-ios-android');

        $response->assertStatus(200)
            ->assertJsonPath('data.slug', 'flutter-guia-completa-ios-android')
            ->assertJsonPath('data.level', 'intermediate');
    }

    public function test_authenticated_student_returns_404_for_non_existent_course(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->getJson('/api/courses/curso-que-no-existe');

        $response->assertStatus(404);
    }
}

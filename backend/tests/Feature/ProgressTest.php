<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\CourseProgress;
use App\Models\LearningPath;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProgressTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected User $otherUser;
    protected Course $course1;
    protected Course $course2;
    protected Course $course3;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create([
            'name' => 'John Doe',
            'email' => 'john@devtalles.com',
            'discord_id' => '111222333',
        ]);

        $this->otherUser = User::factory()->create([
            'name' => 'Jane Smith',
            'email' => 'jane@devtalles.com',
            'discord_id' => '444555666',
        ]);

        $tag = Tag::firstOrCreate(['slug' => 'backend'], ['name' => 'Backend']);

        $this->course1 = Course::firstOrCreate(
            ['slug' => 'node-de-cero-a-experto'],
            [
                'title' => 'Node.js de Cero a Experto',
                'description' => 'Curso de backend con Node.js',
                'level' => 'intermediate',
                'url' => 'https://cursos.devtalles.com/courses/node',
                'duration' => '36 horas',
            ]
        );
        $this->course1->tags()->syncWithoutDetaching([$tag->id]);

        $this->course2 = Course::firstOrCreate(
            ['slug' => 'nestjs-backend-escalable'],
            [
                'title' => 'NestJS: Backend Escalable',
                'description' => 'Curso avanzado con NestJS',
                'level' => 'advanced',
                'url' => 'https://cursos.devtalles.com/courses/nestjs',
                'duration' => '35 horas',
            ]
        );
        $this->course2->tags()->syncWithoutDetaching([$tag->id]);

        $this->course3 = Course::firstOrCreate(
            ['slug' => 'docker-guia-practica'],
            [
                'title' => 'Docker: Guía Práctica',
                'description' => 'Contenedores con Docker',
                'level' => 'intermediate',
                'url' => 'https://cursos.devtalles.com/courses/docker',
                'duration' => '18 horas',
            ]
        );
        $this->course3->tags()->syncWithoutDetaching([$tag->id]);
    }

    public function test_unauthenticated_user_cannot_access_progress_endpoints(): void
    {
        $this->postJson('/api/progress/toggle', [
            'course_id' => $this->course1->id,
        ])->assertStatus(401);

        $this->getJson('/api/progress')->assertStatus(401);
    }

    public function test_authenticated_user_can_toggle_course_completion_status(): void
    {
        Sanctum::actingAs($this->user);

        // 1. Toggle to completed
        $response = $this->postJson('/api/progress/toggle', [
            'course_id' => $this->course1->id,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'ok',
                'data' => [
                    'course_id' => $this->course1->id,
                    'is_completed' => true,
                ],
            ]);

        $this->assertDatabaseHas('course_progress', [
            'user_id' => $this->user->id,
            'course_id' => $this->course1->id,
            'is_completed' => true,
        ]);

        // 2. Toggle again to revert completion
        $responseRevert = $this->postJson('/api/progress/toggle', [
            'course_id' => $this->course1->id,
        ]);

        $responseRevert->assertStatus(200)
            ->assertJson([
                'status' => 'ok',
                'data' => [
                    'course_id' => $this->course1->id,
                    'is_completed' => false,
                    'completed_at' => null,
                ],
            ]);

        $this->assertDatabaseHas('course_progress', [
            'user_id' => $this->user->id,
            'course_id' => $this->course1->id,
            'is_completed' => false,
            'completed_at' => null,
        ]);
    }

    public function test_toggle_progress_with_learning_path_calculates_percentage_correctly(): void
    {
        Sanctum::actingAs($this->user);

        $learningPath = LearningPath::create([
            'user_id' => $this->user->id,
            'title' => 'Ruta Backend Node',
            'level' => 'intermediate',
            'status' => 'active',
        ]);

        $learningPath->courses()->attach([
            $this->course1->id => ['order' => 1, 'status' => 'pending'],
            $this->course2->id => ['order' => 2, 'status' => 'pending'],
        ]);

        // Complete first course (1 of 2 => 50%)
        $response1 = $this->postJson('/api/progress/toggle', [
            'course_id' => $this->course1->id,
            'learning_path_id' => $learningPath->id,
        ]);

        $response1->assertStatus(200)
            ->assertJson([
                'status' => 'ok',
                'data' => [
                    'course_id' => $this->course1->id,
                    'is_completed' => true,
                    'learning_path_id' => $learningPath->id,
                    'completed_courses_count' => 1,
                    'total_courses_count' => 2,
                    'progress_percentage' => 50.0,
                    'completed_course_ids' => [$this->course1->id],
                ],
            ]);

        $this->assertDatabaseHas('learning_path_course', [
            'learning_path_id' => $learningPath->id,
            'course_id' => $this->course1->id,
            'status' => 'completed',
        ]);

        // Path should still be active
        $this->assertEquals('active', $learningPath->fresh()->status);

        // Complete second course (2 of 2 => 100%)
        $response2 = $this->postJson('/api/progress/toggle', [
            'course_id' => $this->course2->id,
            'learning_path_id' => $learningPath->id,
        ]);

        $response2->assertStatus(200)
            ->assertJson([
                'status' => 'ok',
                'data' => [
                    'course_id' => $this->course2->id,
                    'is_completed' => true,
                    'learning_path_id' => $learningPath->id,
                    'completed_courses_count' => 2,
                    'total_courses_count' => 2,
                    'progress_percentage' => 100.0,
                ],
            ]);

        // Path status should automatically update to completed
        $this->assertEquals('completed', $learningPath->fresh()->status);

        // Uncheck first course (1 of 2 => 50% again)
        $response3 = $this->postJson('/api/progress/toggle', [
            'course_id' => $this->course1->id,
            'learning_path_id' => $learningPath->id,
        ]);

        $response3->assertStatus(200)
            ->assertJson([
                'status' => 'ok',
                'data' => [
                    'course_id' => $this->course1->id,
                    'is_completed' => false,
                    'progress_percentage' => 50.0,
                ],
            ]);

        // Path status should revert to active
        $this->assertEquals('active', $learningPath->fresh()->status);
    }

    public function test_cannot_toggle_progress_with_another_users_learning_path(): void
    {
        Sanctum::actingAs($this->user);

        $otherPath = LearningPath::create([
            'user_id' => $this->otherUser->id,
            'title' => 'Ruta de Jane',
            'status' => 'active',
        ]);

        $response = $this->postJson('/api/progress/toggle', [
            'course_id' => $this->course1->id,
            'learning_path_id' => $otherPath->id,
        ]);

        $response->assertStatus(404)
            ->assertJson([
                'status' => 'error',
                'message' => 'Ruta de aprendizaje no encontrada.',
            ]);
    }

    public function test_toggle_progress_validates_required_fields(): void
    {
        Sanctum::actingAs($this->user);

        // Missing course_id
        $this->postJson('/api/progress/toggle', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['course_id']);

        // Non-existent course_id
        $this->postJson('/api/progress/toggle', [
            'course_id' => 99999,
        ])->assertStatus(422)
            ->assertJsonValidationErrors(['course_id']);
    }

    public function test_user_can_get_all_progress(): void
    {
        Sanctum::actingAs($this->user);

        CourseProgress::create([
            'user_id' => $this->user->id,
            'course_id' => $this->course1->id,
            'is_completed' => true,
            'completed_at' => now(),
        ]);

        $response = $this->getJson('/api/progress');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'ok',
                'data' => [
                    'completed_course_ids' => [$this->course1->id],
                ],
            ]);
    }

    public function test_user_can_get_progress_filtered_by_learning_path(): void
    {
        Sanctum::actingAs($this->user);

        $path = LearningPath::create([
            'user_id' => $this->user->id,
            'title' => 'Ruta Fullstack',
            'status' => 'active',
        ]);

        $path->courses()->attach([
            $this->course1->id => ['order' => 1, 'status' => 'completed'],
            $this->course2->id => ['order' => 2, 'status' => 'pending'],
            $this->course3->id => ['order' => 3, 'status' => 'pending'],
        ]);

        CourseProgress::create([
            'user_id' => $this->user->id,
            'course_id' => $this->course1->id,
            'is_completed' => true,
            'completed_at' => now(),
        ]);

        $response = $this->getJson("/api/progress?learning_path_id={$path->id}");

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'ok',
                'data' => [
                    'learning_path_id' => $path->id,
                    'total_courses_count' => 3,
                    'completed_courses_count' => 1,
                    'progress_percentage' => 33.3,
                    'completed_course_ids' => [$this->course1->id],
                ],
            ]);
    }

    public function test_user_progress_is_isolated_between_users(): void
    {
        // Complete course1 for otherUser
        CourseProgress::create([
            'user_id' => $this->otherUser->id,
            'course_id' => $this->course1->id,
            'is_completed' => true,
            'completed_at' => now(),
        ]);

        // User checks their own progress - should be empty
        Sanctum::actingAs($this->user);

        $response = $this->getJson('/api/progress');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'ok',
                'data' => [
                    'completed_course_ids' => [],
                ],
            ]);
    }
}

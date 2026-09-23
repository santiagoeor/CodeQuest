<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\LearningPath;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class LearningPathTest extends TestCase
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
            ['slug' => 'docker-para-desarrolladores'],
            [
                'title' => 'Docker para Desarrolladores',
                'description' => 'Contenedores y Docker Compose',
                'level' => 'beginner',
                'url' => 'https://cursos.devtalles.com/courses/docker',
                'duration' => '10 horas',
            ]
        );
    }

    public function test_unauthenticated_user_cannot_access_learning_paths_endpoints(): void
    {
        $this->getJson('/api/learning-paths')->assertStatus(401);
        $this->postJson('/api/learning-paths', ['title' => 'Test'])->assertStatus(401);
        $this->getJson('/api/learning-paths/1')->assertStatus(401);
        $this->deleteJson('/api/learning-paths/1')->assertStatus(401);
    }

    public function test_authenticated_user_can_create_learning_path_with_course_ids(): void
    {
        Sanctum::actingAs($this->user);

        $payload = [
            'title' => 'Ruta Backend Especializada',
            'description' => 'Itinerario de especialización en arquitecturas Node y NestJS',
            'level' => 'intermediate',
            'course_ids' => [$this->course1->id, $this->course2->id],
        ];

        $response = $this->postJson('/api/learning-paths', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('status', 'ok')
            ->assertJsonPath('data.title', 'Ruta Backend Especializada')
            ->assertJsonPath('data.user_id', $this->user->id)
            ->assertJsonCount(2, 'data.courses');

        $this->assertDatabaseHas('learning_paths', [
            'title' => 'Ruta Backend Especializada',
            'user_id' => $this->user->id,
            'level' => 'intermediate',
        ]);

        $this->assertDatabaseHas('learning_path_course', [
            'course_id' => $this->course1->id,
            'order' => 1,
            'status' => 'pending',
        ]);

        $this->assertDatabaseHas('learning_path_course', [
            'course_id' => $this->course2->id,
            'order' => 2,
            'status' => 'pending',
        ]);
    }

    public function test_authenticated_user_can_create_learning_path_with_courses_array(): void
    {
        Sanctum::actingAs($this->user);

        $payload = [
            'title' => 'Ruta DevOps y Cloud',
            'courses' => [
                ['course_id' => $this->course3->id, 'order' => 1],
                ['course_id' => $this->course1->id, 'order' => 2],
            ],
        ];

        $response = $this->postJson('/api/learning-paths', $payload);

        $response->assertStatus(201)
            ->assertJsonCount(2, 'data.courses')
            ->assertJsonPath('data.courses.0.id', $this->course3->id)
            ->assertJsonPath('data.courses.0.pivot.order', 1);
    }

    public function test_create_learning_path_validates_course_existence(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/learning-paths', [
            'title' => 'Ruta Invalida',
            'course_ids' => [99999],
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['course_ids.0']);
    }

    public function test_authenticated_user_only_lists_their_own_learning_paths(): void
    {
        // Path for user 1
        $path1 = LearningPath::create([
            'user_id' => $this->user->id,
            'title' => 'Ruta de John',
            'level' => 'intermediate',
        ]);
        $path1->courses()->attach([$this->course1->id => ['order' => 1]]);

        // Path for user 2
        $path2 = LearningPath::create([
            'user_id' => $this->otherUser->id,
            'title' => 'Ruta de Jane',
            'level' => 'advanced',
        ]);
        $path2->courses()->attach([$this->course2->id => ['order' => 1]]);

        Sanctum::actingAs($this->user);

        $response = $this->getJson('/api/learning-paths');

        $response->assertStatus(200)
            ->assertJsonPath('status', 'ok')
            ->assertJsonPath('count', 1)
            ->assertJsonPath('data.0.id', $path1->id)
            ->assertJsonPath('data.0.title', 'Ruta de John');
    }

    public function test_authenticated_user_can_view_single_learning_path_with_ordered_courses(): void
    {
        $path = LearningPath::create([
            'user_id' => $this->user->id,
            'title' => 'Ruta Detallada',
            'description' => 'Descripción paso a paso',
            'level' => 'beginner',
        ]);
        $path->courses()->attach([
            $this->course3->id => ['order' => 1],
            $this->course1->id => ['order' => 2],
        ]);

        Sanctum::actingAs($this->user);

        $response = $this->getJson("/api/learning-paths/{$path->id}");

        $response->assertStatus(200)
            ->assertJsonPath('status', 'ok')
            ->assertJsonPath('data.id', $path->id)
            ->assertJsonPath('data.courses.0.id', $this->course3->id)
            ->assertJsonPath('data.courses.0.pivot.order', 1)
            ->assertJsonPath('data.courses.1.id', $this->course1->id)
            ->assertJsonPath('data.courses.1.pivot.order', 2);
    }

    public function test_user_cannot_view_another_users_learning_path(): void
    {
        $otherPath = LearningPath::create([
            'user_id' => $this->otherUser->id,
            'title' => 'Ruta Privada de Jane',
        ]);

        Sanctum::actingAs($this->user);

        $response = $this->getJson("/api/learning-paths/{$otherPath->id}");

        $response->assertStatus(404)
            ->assertJsonPath('status', 'error');
    }

    public function test_authenticated_user_can_delete_their_own_learning_path(): void
    {
        $path = LearningPath::create([
            'user_id' => $this->user->id,
            'title' => 'Ruta a Eliminar',
        ]);
        $path->courses()->attach([$this->course1->id => ['order' => 1]]);

        Sanctum::actingAs($this->user);

        $response = $this->deleteJson("/api/learning-paths/{$path->id}");

        $response->assertStatus(200)
            ->assertJsonPath('status', 'ok')
            ->assertJsonPath('message', 'Ruta de aprendizaje eliminada exitosamente.');

        $this->assertDatabaseMissing('learning_paths', ['id' => $path->id]);
        $this->assertDatabaseMissing('learning_path_course', ['learning_path_id' => $path->id]);
        // Course must still exist in catalog!
        $this->assertDatabaseHas('courses', ['id' => $this->course1->id]);
    }

    public function test_user_cannot_delete_another_users_learning_path(): void
    {
        $otherPath = LearningPath::create([
            'user_id' => $this->otherUser->id,
            'title' => 'Ruta Privada Intocable',
        ]);

        Sanctum::actingAs($this->user);

        $response = $this->deleteJson("/api/learning-paths/{$otherPath->id}");

        $response->assertStatus(404);
        $this->assertDatabaseHas('learning_paths', ['id' => $otherPath->id]);
    }
}

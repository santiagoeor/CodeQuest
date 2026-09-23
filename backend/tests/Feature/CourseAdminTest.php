<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CourseAdminTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@codequest.dev',
            'discord_id' => '999888777',
        ]);
    }

    public function test_unauthenticated_user_cannot_create_or_update_courses(): void
    {
        $this->postJson('/api/courses', [
            'title' => 'Vue.js de Cero a Experto',
        ])->assertStatus(401);

        $course = Course::create([
            'title' => 'Vue.js de Cero a Experto',
            'slug' => 'vue-js-de-cero-a-experto',
            'description' => 'Aprende Vue 3',
            'level' => 'intermediate',
            'url' => 'https://cursos.devtalles.com/courses/vue',
            'duration' => '25 horas',
        ]);

        $this->putJson("/api/courses/{$course->id}", [
            'title' => 'Vue 3 Avanzado',
        ])->assertStatus(401);
    }

    public function test_authenticated_user_can_create_course_with_tags(): void
    {
        Sanctum::actingAs($this->user);

        $existingTag = Tag::firstOrCreate(['slug' => 'backend'], ['name' => 'Backend']);

        $payload = [
            'title' => 'Golang: Rutas y Microservicios',
            'slug' => 'golang-rutas-y-microservicios',
            'description' => 'Desarrollo de microservicios con Go y gRPC',
            'level' => 'advanced',
            'url' => 'https://cursos.devtalles.com/courses/golang',
            'duration' => '30 horas',
            'image_url' => 'https://devtalles.com/assets/golang.png',
            'tags' => [$existingTag->id, 'Microservicios', 'gRPC'],
        ];

        $response = $this->postJson('/api/courses', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'status' => 'ok',
                'message' => 'Curso creado exitosamente.',
                'data' => [
                    'title' => 'Golang: Rutas y Microservicios',
                    'slug' => 'golang-rutas-y-microservicios',
                    'level' => 'advanced',
                ],
            ]);

        $this->assertDatabaseHas('courses', [
            'slug' => 'golang-rutas-y-microservicios',
            'level' => 'advanced',
        ]);

        $course = Course::where('slug', 'golang-rutas-y-microservicios')->first();
        $this->assertNotNull($course);
        $this->assertCount(3, $course->tags);
        $this->assertTrue($course->tags->contains('slug', 'backend'));
        $this->assertTrue($course->tags->contains('slug', 'microservicios'));
        $this->assertTrue($course->tags->contains('slug', 'grpc'));
    }

    public function test_create_course_auto_generates_slug_when_omitted(): void
    {
        Sanctum::actingAs($this->user);

        $payload = [
            'title' => 'Aprende TypeScript Moderno',
            'description' => 'Tipado estático con TS',
            'level' => 'beginner',
            'url' => 'https://cursos.devtalles.com/courses/ts',
            'duration' => '15 horas',
        ];

        $response = $this->postJson('/api/courses', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('data.slug', 'aprende-typescript-moderno');

        $this->assertDatabaseHas('courses', [
            'slug' => 'aprende-typescript-moderno',
        ]);
    }

    public function test_store_course_validates_required_and_typed_fields(): void
    {
        Sanctum::actingAs($this->user);

        // Empty payload
        $response = $this->postJson('/api/courses', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'description', 'level', 'url', 'duration']);

        // Invalid level and invalid URL
        $responseInvalid = $this->postJson('/api/courses', [
            'title' => 'Curso Test',
            'description' => 'Test',
            'level' => 'master_expert',
            'url' => 'not-a-valid-url',
            'duration' => '10h',
        ]);

        $responseInvalid->assertStatus(422)
            ->assertJsonValidationErrors(['level', 'url']);
    }

    public function test_store_course_rejects_duplicate_slug(): void
    {
        Sanctum::actingAs($this->user);

        Course::create([
            'title' => 'Docker Básico',
            'slug' => 'docker-basico',
            'description' => 'Intro a contenedores',
            'level' => 'beginner',
            'url' => 'https://cursos.devtalles.com/courses/docker',
            'duration' => '10 horas',
        ]);

        $response = $this->postJson('/api/courses', [
            'title' => 'Docker Básico Repetido',
            'slug' => 'docker-basico',
            'description' => 'Otro curso con el mismo slug',
            'level' => 'beginner',
            'url' => 'https://cursos.devtalles.com/courses/docker-2',
            'duration' => '10 horas',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['slug']);
    }

    public function test_authenticated_user_can_update_course(): void
    {
        Sanctum::actingAs($this->user);

        $course = Course::create([
            'title' => 'Python Inicial',
            'slug' => 'python-inicial',
            'description' => 'Aprende Python',
            'level' => 'beginner',
            'url' => 'https://cursos.devtalles.com/courses/python',
            'duration' => '12 horas',
        ]);

        $response = $this->putJson("/api/courses/{$course->id}", [
            'title' => 'Python Avanzado y Data Science',
            'level' => 'advanced',
            'duration' => '40 horas',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'ok',
                'message' => 'Curso actualizado exitosamente.',
                'data' => [
                    'id' => $course->id,
                    'title' => 'Python Avanzado y Data Science',
                    'level' => 'advanced',
                    'duration' => '40 horas',
                ],
            ]);

        $this->assertDatabaseHas('courses', [
            'id' => $course->id,
            'title' => 'Python Avanzado y Data Science',
            'level' => 'advanced',
        ]);
    }

    public function test_update_course_synchronizes_tags(): void
    {
        Sanctum::actingAs($this->user);

        $tag1 = Tag::firstOrCreate(['slug' => 'python'], ['name' => 'Python']);
        $tag2 = Tag::firstOrCreate(['slug' => 'django'], ['name' => 'Django']);

        $course = Course::create([
            'title' => 'Django Web',
            'slug' => 'django-web',
            'description' => 'Framework Django',
            'level' => 'intermediate',
            'url' => 'https://cursos.devtalles.com/courses/django',
            'duration' => '20 horas',
        ]);
        $course->tags()->attach([$tag1->id, $tag2->id]);

        $this->assertCount(2, $course->fresh()->tags);

        // Update with only 'FastAPI'
        $response = $this->putJson("/api/courses/{$course->id}", [
            'tags' => ['FastAPI'],
        ]);

        $response->assertStatus(200);

        $freshTags = $course->fresh()->tags;
        $this->assertCount(1, $freshTags);
        $this->assertEquals('fastapi', $freshTags->first()->slug);
    }

    public function test_update_course_ignores_own_slug_uniqueness(): void
    {
        Sanctum::actingAs($this->user);

        $course = Course::create([
            'title' => 'Rust Básico',
            'slug' => 'rust-basico',
            'description' => 'Intro a Rust',
            'level' => 'beginner',
            'url' => 'https://cursos.devtalles.com/courses/rust',
            'duration' => '10 horas',
        ]);

        // Sending the same slug shouldn't trigger unique validation failure
        $response = $this->putJson("/api/courses/{$course->id}", [
            'title' => 'Rust Básico Edición 2026',
            'slug' => 'rust-basico',
        ]);

        $response->assertStatus(200);
    }

    public function test_update_course_rejects_another_courses_slug(): void
    {
        Sanctum::actingAs($this->user);

        $course1 = Course::create([
            'title' => 'Elixir 1',
            'slug' => 'elixir-1',
            'description' => 'Elixir',
            'level' => 'beginner',
            'url' => 'https://cursos.devtalles.com/courses/elixir1',
            'duration' => '10 horas',
        ]);

        $course2 = Course::create([
            'title' => 'Elixir 2',
            'slug' => 'elixir-2',
            'description' => 'Elixir',
            'level' => 'intermediate',
            'url' => 'https://cursos.devtalles.com/courses/elixir2',
            'duration' => '10 horas',
        ]);

        $response = $this->putJson("/api/courses/{$course2->id}", [
            'slug' => 'elixir-1',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['slug']);
    }

    public function test_update_non_existent_course_returns_404(): void
    {
        Sanctum::actingAs($this->user);

        $this->putJson('/api/courses/99999', [
            'title' => 'Inexistente',
        ])->assertStatus(404);
    }
}

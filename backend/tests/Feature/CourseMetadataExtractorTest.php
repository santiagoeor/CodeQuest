<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CourseMetadataExtractorTest extends TestCase
{
    use RefreshDatabase;

    protected User $adminUser;
    protected User $studentUser;

    protected function setUp(): void
    {
        parent::setUp();

        $this->adminUser = User::factory()->admin()->create([
            'name' => 'Admin Instructor',
            'email' => 'admin.test@devtalles.com',
            'discord_id' => '111000111',
        ]);

        $this->studentUser = User::factory()->create([
            'name' => 'Student Dev',
            'email' => 'student.test@devtalles.com',
            'discord_id' => '222000222',
            'role' => 'student',
        ]);
    }

    public function test_unauthenticated_user_cannot_extract_metadata(): void
    {
        $response = $this->postJson('/api/courses/extract-metadata', [
            'url' => 'https://cursos.devtalles.com/courses/react-pro',
        ]);

        $response->assertStatus(401);
    }

    public function test_student_user_is_forbidden_from_extracting_metadata(): void
    {
        Sanctum::actingAs($this->studentUser);

        $response = $this->postJson('/api/courses/extract-metadata', [
            'url' => 'https://cursos.devtalles.com/courses/react-pro',
        ]);

        $response->assertStatus(403);
    }

    public function test_validation_fails_when_url_is_missing_or_invalid(): void
    {
        Sanctum::actingAs($this->adminUser);

        // Missing URL
        $this->postJson('/api/courses/extract-metadata', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['url']);

        // Invalid URL format
        $this->postJson('/api/courses/extract-metadata', [
            'url' => 'not-a-valid-url',
        ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['url']);
    }

    public function test_validation_fails_for_disallowed_external_domains(): void
    {
        Sanctum::actingAs($this->adminUser);

        $response = $this->postJson('/api/courses/extract-metadata', [
            'url' => 'https://sitio-no-autorizado.com/curso/react',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['url']);
    }

    public function test_extracts_metadata_from_open_graph_html_response(): void
    {
        Sanctum::actingAs($this->adminUser);

        $mockHtml = <<<'HTML'
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>React Pro: Lleva tus bases al siguiente nivel | DevTalles</title>
    <meta property="og:title" content="React Pro: Lleva tus bases al siguiente nivel | DevTalles">
    <meta property="og:description" content="Aprende patrones avanzados de React, TypeScript y arquitecturas limpias para aplicaciones modernas. Duración estimada: 24 horas de contenido práctico.">
    <meta property="og:image" content="https://cursos.devtalles.com/images/react-pro-cover.png">
    <meta property="og:url" content="https://cursos.devtalles.com/courses/react-pro">
</head>
<body>
    <h1>React Pro: Lleva tus bases al siguiente nivel</h1>
    <p>Curso avanzado impartido por Fernando Herrera.</p>
</body>
</html>
HTML;

        Http::fake([
            'https://cursos.devtalles.com/courses/react-pro' => Http::response($mockHtml, 200),
        ]);

        $response = $this->postJson('/api/courses/extract-metadata', [
            'url' => 'https://cursos.devtalles.com/courses/react-pro',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('status', 'ok')
            ->assertJsonPath('data.title', 'React Pro: Lleva tus bases al siguiente nivel')
            ->assertJsonPath('data.slug', 'react-pro')
            ->assertJsonPath('data.image_url', 'https://cursos.devtalles.com/images/react-pro-cover.png')
            ->assertJsonPath('data.duration', '24 horas')
            ->assertJsonPath('data.level', 'advanced');

        $tags = $response->json('data.tags');
        $this->assertContains('React', $tags);
        $this->assertContains('TypeScript', $tags);
    }

    public function test_extracts_metadata_with_heuristic_fallback_when_server_fails(): void
    {
        Sanctum::actingAs($this->adminUser);

        Http::fake([
            'https://cursos.devtalles.com/courses/angular-de-cero-a-experto' => Http::response(null, 500),
        ]);

        $response = $this->postJson('/api/courses/extract-metadata', [
            'url' => 'https://cursos.devtalles.com/courses/angular-de-cero-a-experto',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('status', 'ok')
            ->assertJsonPath('data.slug', 'angular-de-cero-a-experto')
            ->assertJsonPath('data.level', 'beginner');

        $tags = $response->json('data.tags');
        $this->assertContains('Angular', $tags);
    }
}

<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;
    public function test_redirect_to_discord_endpoint(): void
    {
        $response = $this->getJson('/api/auth/discord/redirect?format=json');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'url',
                'mock',
            ]);
    }

    public function test_mock_login_creates_user_and_returns_sanctum_token(): void
    {
        $response = $this->getJson('/api/auth/mock-login?id=999888777');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'token',
                'user' => [
                    'id',
                    'discord_id',
                    'name',
                    'email',
                    'avatar',
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'discord_id' => '999888777',
            'email' => 'estudiante_999888777@devtalles.com',
        ]);
    }

    public function test_unauthenticated_user_cannot_access_profile(): void
    {
        $response = $this->getJson('/api/auth/user');

        $response->assertStatus(401);
    }

    public function test_authenticated_user_can_access_profile(): void
    {
        $user = User::factory()->create([
            'discord_id' => '555444333',
            'name' => 'Usuario Autenticado',
            'email' => 'usuario@devtalles.com',
            'avatar' => 'https://cdn.discordapp.com/embed/avatars/1.png',
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/auth/user');

        $response->assertStatus(200)
            ->assertJsonPath('status', 'ok')
            ->assertJsonPath('data.discord_id', '555444333')
            ->assertJsonPath('data.name', 'Usuario Autenticado');
    }

    public function test_discord_callback_returns_token(): void
    {
        $response = $this->getJson('/api/auth/discord/callback?code=mock_code_123&format=json');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'token',
                'user' => [
                    'id',
                    'discord_id',
                    'name',
                    'email',
                    'avatar',
                ],
            ]);
    }

    public function test_logout_revokes_token(): void
    {
        $user = User::factory()->create([
            'discord_id' => '111222333',
            'name' => 'Logout User',
            'email' => 'logout@devtalles.com',
        ]);

        $token = $user->createToken('test-token')->plainTextToken;

        // Verify authorized access
        $verifyResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/auth/user');
        $verifyResponse->assertStatus(200);

        // Perform logout
        $logoutResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/auth/logout');
        $logoutResponse->assertStatus(200)
            ->assertJsonPath('status', 'ok');

        // Reset auth guard state in test runner
        auth()->forgetGuards();

        // Verify token is revoked and no longer accepted
        $afterLogoutResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/auth/user');
        $afterLogoutResponse->assertStatus(401);
    }

    public function test_redirect_to_google_endpoint(): void
    {
        $response = $this->getJson('/api/auth/google/redirect?format=json');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'url',
                'mock',
            ]);
    }

    public function test_mock_google_login_creates_user_and_returns_sanctum_token(): void
    {
        $response = $this->getJson('/api/auth/google/mock-login?id=google_123456');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'token',
                'user' => [
                    'id',
                    'google_id',
                    'name',
                    'email',
                    'avatar',
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'google_id' => 'google_123456',
            'email' => 'google_google_123456@gmail.com',
        ]);
    }

    public function test_mock_google_login_links_existing_user_by_email(): void
    {
        $user = User::factory()->create([
            'discord_id' => 'discord_user_99',
            'name' => 'Existing User',
            'email' => 'google_linked_test@gmail.com',
        ]);

        $response = $this->getJson('/api/auth/google/mock-login?id=linked_test');

        $response->assertStatus(200);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'discord_id' => 'discord_user_99',
            'google_id' => 'linked_test',
            'email' => 'google_linked_test@gmail.com',
        ]);
    }

    public function test_google_callback_returns_token(): void
    {
        $response = $this->getJson('/api/auth/google/callback?code=mock_code_google_123&format=json');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'token',
                'user' => [
                    'id',
                    'google_id',
                    'name',
                    'email',
                    'avatar',
                ],
            ]);
    }

    public function test_user_can_login_with_valid_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'login_success@codequest.dev',
            'password' => \Illuminate\Support\Facades\Hash::make('Secret123!'),
            'role' => 'student',
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'login_success@codequest.dev',
            'password' => 'Secret123!',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('status', 'ok')
            ->assertJsonStructure([
                'status',
                'token',
                'user' => [
                    'id',
                    'name',
                    'email',
                    'role',
                    'avatar',
                ],
            ])
            ->assertJsonPath('user.email', 'login_success@codequest.dev')
            ->assertJsonPath('user.role', 'student');
    }

    public function test_login_fails_with_invalid_password(): void
    {
        User::factory()->create([
            'email' => 'bad_pass@codequest.dev',
            'password' => \Illuminate\Support\Facades\Hash::make('CorrectPassword1!'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'bad_pass@codequest.dev',
            'password' => 'WrongPassword!',
        ]);

        $response->assertStatus(401)
            ->assertJsonPath('status', 'error')
            ->assertJsonPath('message', 'Credenciales inválidas. Verifica tu correo y contraseña.');
    }

    public function test_login_fails_with_nonexistent_email(): void
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'does_not_exist@codequest.dev',
            'password' => 'SomePassword123!',
        ]);

        $response->assertStatus(401)
            ->assertJsonPath('status', 'error');
    }

    public function test_login_validates_required_fields(): void
    {
        $response = $this->postJson('/api/auth/login', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email', 'password']);
    }

    public function test_user_seeder_creates_admin_and_student_users(): void
    {
        $this->seed(\Database\Seeders\UserSeeder::class);

        $this->assertDatabaseHas('users', [
            'email' => 'admin@codequest.dev',
            'role' => 'admin',
        ]);

        $this->assertDatabaseHas('users', [
            'email' => 'estudiante@codequest.dev',
            'role' => 'student',
        ]);
    }
}


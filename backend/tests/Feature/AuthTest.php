<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use DatabaseTransactions;
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
}

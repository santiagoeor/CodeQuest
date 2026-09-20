<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class DiscordOAuthService
{
    protected string $clientId;
    protected string $clientSecret;
    protected string $redirectUri;
    protected bool $mockEnabled;

    public function __construct()
    {
        $this->clientId = config('services.discord.client_id', '') ?? '';
        $this->clientSecret = config('services.discord.client_secret', '') ?? '';
        $this->redirectUri = config('services.discord.redirect', 'http://localhost:8000/api/auth/discord/callback');
        $this->mockEnabled = (bool) config('services.discord.mock', false) || empty($this->clientId);
    }

    /**
     * Check if mock mode is active (for local development or testing).
     */
    public function isMockEnabled(): bool
    {
        return $this->mockEnabled;
    }

    /**
     * Generate the Discord OAuth2 authorization URL.
     */
    public function getAuthorizationUrl(?string $state = null): string
    {
        if ($this->mockEnabled) {
            return url('/api/auth/mock-login');
        }

        $query = http_build_query([
            'client_id' => $this->clientId,
            'redirect_uri' => $this->redirectUri,
            'response_type' => 'code',
            'scope' => 'identify email',
            'state' => $state,
            'prompt' => 'consent',
        ]);

        return 'https://discord.com/oauth2/authorize?' . $query;
    }

    /**
     * Exchange the authorization code for an access token with Discord.
     */
    public function exchangeCode(string $code): array
    {
        if ($this->mockEnabled) {
            return [
                'access_token' => 'mock_discord_token_' . md5($code),
                'token_type' => 'Bearer',
            ];
        }

        $response = Http::asForm()->post('https://discord.com/api/oauth2/token', [
            'client_id' => $this->clientId,
            'client_secret' => $this->clientSecret,
            'grant_type' => 'authorization_code',
            'code' => $code,
            'redirect_uri' => $this->redirectUri,
        ]);

        if (!$response->successful()) {
            Log::error('Discord OAuth Token Exchange Failed', [
                'status' => $response->status(),
                'body' => $response->json(),
            ]);
            throw new RuntimeException('Error al intercambiar el código con Discord: ' . ($response->json('error_description') ?? 'Fallo de autenticación'));
        }

        return $response->json();
    }

    /**
     * Fetch user profile from Discord API using the access token.
     */
    public function getUserProfile(string $accessToken): array
    {
        if ($this->mockEnabled) {
            return $this->getMockUserProfile();
        }

        $response = Http::withToken($accessToken)
            ->get('https://discord.com/api/users/@me');

        if (!$response->successful()) {
            Log::error('Discord User Profile Fetch Failed', [
                'status' => $response->status(),
                'body' => $response->json(),
            ]);
            throw new RuntimeException('Error al obtener el perfil de usuario de Discord');
        }

        $data = $response->json();
        $avatarUrl = null;

        if (!empty($data['avatar'])) {
            $avatarUrl = sprintf(
                'https://cdn.discordapp.com/avatars/%s/%s.png',
                $data['id'],
                $data['avatar']
            );
        }

        return [
            'id' => (string) $data['id'],
            'username' => $data['global_name'] ?? $data['username'],
            'email' => $data['email'] ?? null,
            'avatar' => $avatarUrl,
        ];
    }

    /**
     * Return a standardized mock user profile for local tests.
     */
    public function getMockUserProfile(?string $identifier = null): array
    {
        $id = $identifier ?: '123456789012345678';
        return [
            'id' => $id,
            'username' => 'DevTallesStudent',
            'email' => 'estudiante_' . $id . '@devtalles.com',
            'avatar' => 'https://cdn.discordapp.com/embed/avatars/0.png',
        ];
    }
}

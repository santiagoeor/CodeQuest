<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class GoogleOAuthService
{
    protected string $clientId;
    protected string $clientSecret;
    protected string $redirectUri;
    protected bool $mockEnabled;

    public function __construct()
    {
        $this->clientId = (string) (config('services.google.client_id', '') ?? '');
        $this->clientSecret = (string) (config('services.google.client_secret', '') ?? '');
        $this->redirectUri = (string) (config('services.google.redirect', 'http://localhost:8000/api/auth/google/callback') ?? '');
        $this->mockEnabled = (bool) config('services.google.mock', false) || empty($this->clientId);
    }

    /**
     * Check if mock mode is active (for local development or testing without credentials).
     */
    public function isMockEnabled(): bool
    {
        return $this->mockEnabled;
    }

    /**
     * Generate the Google OAuth2 authorization URL.
     */
    public function getAuthorizationUrl(?string $state = null): string
    {
        if ($this->mockEnabled) {
            return url('/api/auth/google/mock-login');
        }

        $query = http_build_query([
            'client_id' => $this->clientId,
            'redirect_uri' => $this->redirectUri,
            'response_type' => 'code',
            'scope' => 'openid email profile',
            'state' => $state,
            'prompt' => 'select_account',
            'access_type' => 'online',
        ]);

        return 'https://accounts.google.com/o/oauth2/v2/auth?' . $query;
    }

    /**
     * Exchange authorization code for an access token with Google.
     */
    public function exchangeCode(string $code): array
    {
        if ($this->mockEnabled) {
            return [
                'access_token' => 'mock_google_token_' . md5($code),
                'token_type' => 'Bearer',
                'expires_in' => 3600,
            ];
        }

        $response = Http::asForm()->post('https://oauth2.googleapis.com/token', [
            'client_id' => $this->clientId,
            'client_secret' => $this->clientSecret,
            'grant_type' => 'authorization_code',
            'code' => $code,
            'redirect_uri' => $this->redirectUri,
        ]);

        if (!$response->successful()) {
            Log::error('Google OAuth token exchange failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            throw new RuntimeException('Failed to exchange authorization code with Google: ' . $response->body());
        }

        return $response->json();
    }

    /**
     * Retrieve the user's profile from Google using the access token.
     */
    public function getUserProfile(string $accessToken): array
    {
        if ($this->mockEnabled) {
            return $this->getMockUserProfile();
        }

        $response = Http::withToken($accessToken)
            ->get('https://www.googleapis.com/oauth2/v3/userinfo');

        if (!$response->successful()) {
            Log::error('Google OAuth user profile retrieval failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            throw new RuntimeException('Failed to fetch user profile from Google: ' . $response->body());
        }

        $data = $response->json();

        return [
            'id' => (string) ($data['sub'] ?? ''),
            'name' => $data['name'] ?? 'Google User',
            'email' => $data['email'] ?? null,
            'avatar' => $data['picture'] ?? null,
        ];
    }

    /**
     * Generate a deterministic mock user profile for testing or local development.
     */
    public function getMockUserProfile(?string $customId = null, ?string $customEmail = null): array
    {
        $id = $customId ?: 'mock_google_user_001';
        $email = $customEmail ?: ($customId ? "google_{$customId}@gmail.com" : 'dev.explorer@gmail.com');

        return [
            'id' => $id,
            'name' => 'Google Dev Explorer',
            'email' => $email,
            'avatar' => 'https://lh3.googleusercontent.com/a/ACg8ocL-mock-avatar=s96-c',
        ];
    }
}

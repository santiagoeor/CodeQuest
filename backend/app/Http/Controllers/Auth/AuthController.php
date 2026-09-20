<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\DiscordOAuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

class AuthController extends Controller
{
    protected DiscordOAuthService $discordService;

    public function __construct(DiscordOAuthService $discordService)
    {
        $this->discordService = $discordService;
    }

    /**
     * Redirect user to Discord OAuth2 authorization URL, or return URL in JSON format.
     */
    public function redirectToDiscord(Request $request): JsonResponse|RedirectResponse
    {
        $state = bin2hex(random_bytes(16));
        if ($request->hasSession()) {
            $request->session()->put('oauth_state', $state);
        }

        $authUrl = $this->discordService->getAuthorizationUrl($state);

        if ($request->wantsJson() || $request->query('format') === 'json') {
            return response()->json([
                'status' => 'ok',
                'url' => $authUrl,
                'mock' => $this->discordService->isMockEnabled(),
            ]);
        }

        return redirect()->away($authUrl);
    }

    /**
     * Handle the OAuth2 callback from Discord.
     */
    public function handleDiscordCallback(Request $request): JsonResponse|RedirectResponse
    {
        $frontendRedirect = config('services.discord.frontend_redirect', 'http://localhost:4200/auth/callback');

        // Check for errors returned by Discord
        if ($request->has('error')) {
            $errorMessage = $request->query('error_description', 'Autenticación cancelada o rechazada.');
            Log::warning('Discord OAuth Callback Error', ['error' => $errorMessage]);

            if ($request->wantsJson() || $request->query('format') === 'json') {
                return response()->json([
                    'status' => 'error',
                    'message' => $errorMessage,
                ], 400);
            }

            return redirect()->away($frontendRedirect . '?error=' . urlencode($errorMessage));
        }

        $code = $request->query('code');

        if (!$code && !$this->discordService->isMockEnabled()) {
            $errorMessage = 'Código de autorización no proporcionado.';
            if ($request->wantsJson() || $request->query('format') === 'json') {
                return response()->json([
                    'status' => 'error',
                    'message' => $errorMessage,
                ], 400);
            }
            return redirect()->away($frontendRedirect . '?error=' . urlencode($errorMessage));
        }

        try {
            // Exchange code and fetch user profile
            $tokenData = $this->discordService->exchangeCode((string) ($code ?: 'mock_code'));
            $profile = $this->discordService->getUserProfile($tokenData['access_token'] ?? '');

            // Synchronize user in database
            $email = $profile['email'] ?? ($profile['id'] . '@discord.codequest.dev');

            $user = User::updateOrCreate(
                ['discord_id' => $profile['id']],
                [
                    'name' => $profile['username'],
                    'email' => $email,
                    'avatar' => $profile['avatar'],
                ]
            );

            // Generate Sanctum Bearer Token
            $token = $user->createToken('codequest-auth')->plainTextToken;

            if ($request->wantsJson() || $request->query('format') === 'json') {
                return response()->json([
                    'status' => 'ok',
                    'token' => $token,
                    'user' => [
                        'id' => $user->id,
                        'discord_id' => $user->discord_id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'avatar' => $user->avatar,
                    ],
                ]);
            }

            return redirect()->away($frontendRedirect . '?token=' . urlencode($token));
        } catch (Throwable $e) {
            Log::error('Error processing Discord callback', [
                'exception' => $e->getMessage(),
            ]);

            if ($request->wantsJson() || $request->query('format') === 'json') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Error durante la autenticación: ' . $e->getMessage(),
                ], 500);
            }

            return redirect()->away($frontendRedirect . '?error=' . urlencode($e->getMessage()));
        }
    }

    /**
     * Local testing endpoint to authenticate instantly using a mock Discord profile.
     */
    public function mockLogin(Request $request): JsonResponse
    {
        $profile = $this->discordService->getMockUserProfile($request->query('id'));

        $user = User::updateOrCreate(
            ['discord_id' => $profile['id']],
            [
                'name' => $profile['username'],
                'email' => $profile['email'],
                'avatar' => $profile['avatar'],
            ]
        );

        $token = $user->createToken('codequest-auth')->plainTextToken;

        return response()->json([
            'status' => 'ok',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'discord_id' => $user->discord_id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar,
            ],
            'note' => 'Mock login generated for local development and testing',
        ]);
    }

    /**
     * Get authenticated user profile (protected via auth:sanctum).
     */
    public function user(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'status' => 'ok',
            'data' => [
                'id' => $user->id,
                'discord_id' => $user->discord_id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar,
                'created_at' => $user->created_at?->toIso8601String(),
            ],
        ]);
    }

    /**
     * Logout and revoke the current access token (protected via auth:sanctum).
     */
    public function logout(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user && $user->currentAccessToken()) {
            $user->currentAccessToken()->delete();
        }

        return response()->json([
            'status' => 'ok',
            'message' => 'Sesión cerrada exitosamente',
        ]);
    }
}

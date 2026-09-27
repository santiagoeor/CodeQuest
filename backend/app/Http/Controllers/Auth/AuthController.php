<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\DiscordOAuthService;
use App\Services\GoogleOAuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Throwable;

class AuthController extends Controller
{
    protected DiscordOAuthService $discordService;
    protected GoogleOAuthService $googleService;

    public function __construct(
        DiscordOAuthService $discordService,
        GoogleOAuthService $googleService
    ) {
        $this->discordService = $discordService;
        $this->googleService = $googleService;
    }

    /**
     * Authenticate user using standard email and password credentials (WI-020).
     */
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ], [
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'Debe ingresar un correo electrónico válido.',
            'password.required' => 'La contraseña es obligatoria.',
        ]);

        $user = User::where('email', strtolower(trim($validated['email'])))->first();

        if (!$user || empty($user->password) || !Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Credenciales inválidas. Verifica tu correo y contraseña.',
            ], 401);
        }

        $this->syncAdminRole($user);

        $token = $user->createToken('codequest-auth')->plainTextToken;

        return response()->json([
            'status' => 'ok',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'discord_id' => $user->discord_id,
                'google_id' => $user->google_id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'avatar' => $user->avatar,
            ],
        ]);
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

            // Synchronize user in database (link by email if exists)
            $email = $profile['email'] ?? ($profile['id'] . '@discord.codequest.dev');

            $user = User::where('discord_id', $profile['id'])->first();

            if (!$user && !empty($profile['email'])) {
                $user = User::where('email', $profile['email'])->first();
                if ($user) {
                    $user->discord_id = $profile['id'];
                    if (empty($user->avatar) && !empty($profile['avatar'])) {
                        $user->avatar = $profile['avatar'];
                    }
                    $user->save();
                }
            }

            if (!$user) {
                $user = User::create([
                    'discord_id' => $profile['id'],
                    'name' => $profile['username'],
                    'email' => $email,
                    'avatar' => $profile['avatar'],
                ]);
            }

            $this->syncAdminRole($user);

            // Generate Sanctum Bearer Token
            $token = $user->createToken('codequest-auth')->plainTextToken;

            if ($request->wantsJson() || $request->query('format') === 'json') {
                return response()->json([
                    'status' => 'ok',
                    'token' => $token,
                    'user' => [
                        'id' => $user->id,
                        'discord_id' => $user->discord_id,
                        'google_id' => $user->google_id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->role,
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

        $updateData = [
            'name' => $profile['username'],
            'email' => $profile['email'],
            'avatar' => $profile['avatar'],
        ];

        $role = $request->query('role');
        if ($role && in_array($role, ['student', 'admin'], true)) {
            $updateData['role'] = $role;
        }

        $user = User::updateOrCreate(
            ['discord_id' => $profile['id']],
            $updateData
        );

        $token = $user->createToken('codequest-auth')->plainTextToken;

        if ($request->wantsJson() || $request->query('format') === 'json') {
            return response()->json([
                'status' => 'ok',
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'discord_id' => $user->discord_id,
                    'google_id' => $user->google_id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'avatar' => $user->avatar,
                ],
                'note' => 'Mock login generated for local development and testing',
            ]);
        }

        $frontendRedirect = config('services.discord.frontend_redirect', 'http://localhost:4200/auth/callback');
        return redirect()->away($frontendRedirect . '?token=' . urlencode($token));
    }

    /**
     * Redirect user to Google OAuth2 authorization URL, or return URL in JSON format (AC-2).
     */
    public function redirectToGoogle(Request $request): JsonResponse|RedirectResponse
    {
        $state = bin2hex(random_bytes(16));
        if ($request->hasSession()) {
            $request->session()->put('oauth_google_state', $state);
        }

        $authUrl = $this->googleService->getAuthorizationUrl($state);

        if ($request->wantsJson() || $request->query('format') === 'json') {
            return response()->json([
                'status' => 'ok',
                'url' => $authUrl,
                'mock' => $this->googleService->isMockEnabled(),
            ]);
        }

        return redirect()->away($authUrl);
    }

    /**
     * Handle the OAuth2 callback from Google (AC-2, AC-3).
     */
    public function handleGoogleCallback(Request $request): JsonResponse|RedirectResponse
    {
        $frontendRedirect = config('services.google.frontend_redirect', 'http://localhost:4200/auth/callback');

        // Check for error returned by Google
        if ($request->has('error')) {
            $errorMessage = $request->query('error_description', 'Autenticación con Google cancelada o denegada.');
            Log::warning('Google OAuth Callback Error', ['error' => $errorMessage]);

            if ($request->wantsJson() || $request->query('format') === 'json') {
                return response()->json([
                    'status' => 'error',
                    'message' => $errorMessage,
                ], 400);
            }

            return redirect()->away($frontendRedirect . '?error=' . urlencode($errorMessage));
        }

        $code = $request->query('code');

        if (!$code && !$this->googleService->isMockEnabled()) {
            $errorMessage = 'Código de autorización de Google no proporcionado.';
            if ($request->wantsJson() || $request->query('format') === 'json') {
                return response()->json([
                    'status' => 'error',
                    'message' => $errorMessage,
                ], 400);
            }
            return redirect()->away($frontendRedirect . '?error=' . urlencode($errorMessage));
        }

        try {
            // Exchange code and fetch Google user profile
            $tokenData = $this->googleService->exchangeCode((string) ($code ?: 'mock_google_code'));
            $profile = $this->googleService->getUserProfile($tokenData['access_token'] ?? '');

            // Synchronize user (AC-3: Link accounts by email if user already registered via Discord)
            $user = User::where('google_id', $profile['id'])->first();

            if (!$user && !empty($profile['email'])) {
                $user = User::where('email', $profile['email'])->first();
                if ($user) {
                    $user->google_id = $profile['id'];
                    if (empty($user->avatar) && !empty($profile['avatar'])) {
                        $user->avatar = $profile['avatar'];
                    }
                    $user->save();
                }
            }

            if (!$user) {
                $user = User::create([
                    'google_id' => $profile['id'],
                    'name' => $profile['name'],
                    'email' => $profile['email'] ?? ($profile['id'] . '@gmail.codequest.dev'),
                    'avatar' => $profile['avatar'],
                ]);
            }

            $this->syncAdminRole($user);

            // Generate Sanctum Bearer Token
            $token = $user->createToken('codequest-auth')->plainTextToken;

            if ($request->wantsJson() || $request->query('format') === 'json') {
                return response()->json([
                    'status' => 'ok',
                    'token' => $token,
                    'user' => [
                        'id' => $user->id,
                        'discord_id' => $user->discord_id,
                        'google_id' => $user->google_id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->role,
                        'avatar' => $user->avatar,
                    ],
                ]);
            }

            return redirect()->away($frontendRedirect . '?token=' . urlencode($token));
        } catch (Throwable $e) {
            Log::error('Error processing Google callback', [
                'exception' => $e->getMessage(),
            ]);

            if ($request->wantsJson() || $request->query('format') === 'json') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Error durante la autenticación con Google: ' . $e->getMessage(),
                ], 500);
            }

            return redirect()->away($frontendRedirect . '?error=' . urlencode($e->getMessage()));
        }
    }

    /**
     * Local testing endpoint to authenticate instantly using a mock Google profile.
     */
    public function mockGoogleLogin(Request $request): JsonResponse
    {
        $profile = $this->googleService->getMockUserProfile(
            $request->query('id'),
            $request->query('email')
        );

        $user = User::where('google_id', $profile['id'])->first();

        if (!$user && !empty($profile['email'])) {
            $user = User::where('email', $profile['email'])->first();
            if ($user) {
                $user->google_id = $profile['id'];
                $user->save();
            }
        }

        $role = $request->query('role');
        if (!$user) {
            $user = User::create([
                'google_id' => $profile['id'],
                'name' => $profile['name'],
                'email' => $profile['email'],
                'avatar' => $profile['avatar'],
                'role' => ($role && in_array($role, ['student', 'admin'], true)) ? $role : 'student',
            ]);
        } elseif ($role && in_array($role, ['student', 'admin'], true)) {
            $user->update(['role' => $role]);
        }

        $token = $user->createToken('codequest-auth')->plainTextToken;

        if ($request->wantsJson() || $request->query('format') === 'json') {
            return response()->json([
                'status' => 'ok',
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'discord_id' => $user->discord_id,
                    'google_id' => $user->google_id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'avatar' => $user->avatar,
                ],
                'note' => 'Mock Google login generated for local development and testing',
            ]);
        }

        $frontendRedirect = config('services.google.frontend_redirect', 'http://localhost:4200/auth/callback');
        return redirect()->away($frontendRedirect . '?token=' . urlencode($token));
    }

    /**
     * Get authenticated user profile (protected via auth:sanctum).
     */
    public function user(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user) {
            $this->syncAdminRole($user);
        }

        return response()->json([
            'status' => 'ok',
            'data' => [
                'id' => $user->id,
                'discord_id' => $user->discord_id,
                'google_id' => $user->google_id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
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

    /**
     * Automatically promote user to admin if email matches configured admin emails.
     */
    protected function syncAdminRole(User $user): void
    {
        $adminEmails = config('services.admin_emails', ['snux324@gmail.com']);
        if (in_array(strtolower((string) $user->email), array_map('strtolower', $adminEmails), true)) {
            if ($user->role !== 'admin') {
                $user->role = 'admin';
                $user->save();
            }
        }
    }
}

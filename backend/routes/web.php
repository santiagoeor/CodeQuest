<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/auth/callback', function (\Illuminate\Http\Request $request) {
    $target = config('services.discord.frontend_redirect');
    if (empty($target) || str_contains($target, 'codequest-production.up.railway.app') || str_contains($target, 'localhost:8000')) {
        $target = 'https://delightful-reprieve-production-8aee.up.railway.app/auth/callback';
    }
    $query = $request->getQueryString();
    return redirect()->away($target . ($query ? '?' . $query : ''));
});

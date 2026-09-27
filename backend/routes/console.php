<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('user:set-role {email} {role=admin}', function (string $email, string $role) {
    if (!in_array($role, ['admin', 'student'], true)) {
        $this->error("El rol debe ser 'admin' o 'student'.");
        return 1;
    }

    $user = \App\Models\User::where('email', $email)->first();
    if (!$user) {
        $this->error("No se encontró ningún usuario con el correo: {$email}");
        return 1;
    }

    $user->update(['role' => $role]);
    $this->info("Usuario {$email} actualizado con éxito al rol: {$role}");
    return 0;
})->purpose('Asignar rol de admin o student a un usuario por su correo');

<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Administrador base para pruebas y gestión
        User::updateOrCreate(
            ['email' => 'admin@codequest.dev'],
            [
                'name' => 'Admin CodeQuest',
                'password' => Hash::make('Admin1234!'),
                'role' => 'admin',
                'avatar' => 'https://api.dicebear.com/7.x/bottts/svg?seed=AdminCQ',
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'snux324@gmail.com'],
            [
                'name' => 'Snux',
                'password' => Hash::make('Admin1234!'),
                'role' => 'admin',
                'avatar' => 'https://lh3.googleusercontent.com/a/ACg8ocL9Qx7LfpnyAO7bPmORFp5B4KpOpZQNT88i7ciuFHbBHuHbyg=s96-c',
                'email_verified_at' => now(),
            ]
        );

        // Estudiante base para pruebas de rutas y cuestionarios
        User::updateOrCreate(
            ['email' => 'estudiante@codequest.dev'],
            [
                'name' => 'Estudiante CodeQuest',
                'password' => Hash::make('Student1234!'),
                'role' => 'student',
                'avatar' => 'https://api.dicebear.com/7.x/bottts/svg?seed=StudentCQ',
                'email_verified_at' => now(),
            ]
        );
    }
}

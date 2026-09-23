<?php

namespace Database\Seeders;

use App\Models\Question;
use App\Models\QuestionOption;
use Illuminate\Database\Seeder;

class QuestionnaireSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $questions = [
            [
                'text' => '¿Cuál es tu nivel de experiencia en programación?',
                'category' => 'skill_level',
                'type' => 'single_choice',
                'order' => 1,
                'options' => [
                    [
                        'text' => 'Principiante — Menos de 6 meses programando',
                        'value' => 'beginner',
                        'weight' => [
                            'JavaScript' => 3,
                            'Frontend' => 2,
                            'Web' => 2,
                            'Programación' => 3,
                            'Git' => 2,
                        ],
                        'order' => 1,
                    ],
                    [
                        'text' => 'Intermedio — Entre 6 meses y 2 años de experiencia',
                        'value' => 'intermediate',
                        'weight' => [
                            'TypeScript' => 2,
                            'React' => 2,
                            'Angular' => 2,
                            'Node.js' => 2,
                            'Backend' => 2,
                            'Frontend' => 2,
                        ],
                        'order' => 2,
                    ],
                    [
                        'text' => 'Avanzado — Más de 2 años de experiencia profesional',
                        'value' => 'advanced',
                        'weight' => [
                            'Docker' => 2,
                            'DevOps' => 2,
                            'Kubernetes' => 2,
                            'Arquitectura' => 3,
                            'NestJS' => 2,
                            'Cloud' => 2,
                        ],
                        'order' => 3,
                    ],
                ],
            ],
            [
                'text' => '¿Qué áreas del desarrollo te interesan más?',
                'category' => 'interest_area',
                'type' => 'multiple_choice',
                'order' => 2,
                'options' => [
                    [
                        'text' => 'Frontend Web (React, Angular, Next.js)',
                        'value' => 'frontend',
                        'weight' => [
                            'React' => 3,
                            'Angular' => 3,
                            'Next.js' => 2,
                            'JavaScript' => 2,
                            'TypeScript' => 2,
                            'Frontend' => 3,
                            'Web' => 2,
                        ],
                        'order' => 1,
                    ],
                    [
                        'text' => 'Backend & APIs (Node.js, Laravel, NestJS)',
                        'value' => 'backend',
                        'weight' => [
                            'Node.js' => 3,
                            'Laravel' => 3,
                            'NestJS' => 2,
                            'PHP' => 2,
                            'Backend' => 3,
                            'Express' => 2,
                            'APIs' => 2,
                        ],
                        'order' => 2,
                    ],
                    [
                        'text' => 'Desarrollo Móvil (Flutter, React Native)',
                        'value' => 'mobile',
                        'weight' => [
                            'Flutter' => 3,
                            'React Native' => 3,
                            'Dart' => 2,
                            'Mobile' => 3,
                            'iOS' => 2,
                            'Android' => 2,
                        ],
                        'order' => 3,
                    ],
                    [
                        'text' => 'DevOps & Cloud (Docker, Kubernetes)',
                        'value' => 'devops',
                        'weight' => [
                            'Docker' => 3,
                            'Kubernetes' => 3,
                            'DevOps' => 3,
                            'Cloud' => 3,
                            'Contenedores' => 2,
                        ],
                        'order' => 4,
                    ],
                    [
                        'text' => 'Fullstack (Frontend + Backend completo)',
                        'value' => 'fullstack',
                        'weight' => [
                            'React' => 2,
                            'Angular' => 2,
                            'Node.js' => 2,
                            'Laravel' => 2,
                            'Frontend' => 2,
                            'Backend' => 2,
                            'Fullstack' => 3,
                            'MERN' => 2,
                        ],
                        'order' => 5,
                    ],
                ],
            ],
            [
                'text' => '¿Con qué tecnologías ya tienes experiencia?',
                'category' => 'experience',
                'type' => 'multiple_choice',
                'order' => 3,
                'options' => [
                    [
                        'text' => 'JavaScript / TypeScript',
                        'value' => 'js_ts',
                        'weight' => [
                            'JavaScript' => -1,
                            'TypeScript' => -1,
                        ],
                        'order' => 1,
                    ],
                    [
                        'text' => 'React',
                        'value' => 'react',
                        'weight' => [
                            'React' => -2,
                        ],
                        'order' => 2,
                    ],
                    [
                        'text' => 'Angular',
                        'value' => 'angular',
                        'weight' => [
                            'Angular' => -2,
                        ],
                        'order' => 3,
                    ],
                    [
                        'text' => 'Node.js',
                        'value' => 'nodejs',
                        'weight' => [
                            'Node.js' => -2,
                            'Express' => -1,
                        ],
                        'order' => 4,
                    ],
                    [
                        'text' => 'PHP / Laravel',
                        'value' => 'php_laravel',
                        'weight' => [
                            'PHP' => -2,
                            'Laravel' => -2,
                            'Eloquent' => -1,
                        ],
                        'order' => 5,
                    ],
                    [
                        'text' => 'Dart / Flutter',
                        'value' => 'dart_flutter',
                        'weight' => [
                            'Dart' => -2,
                            'Flutter' => -2,
                        ],
                        'order' => 6,
                    ],
                    [
                        'text' => 'Docker / Kubernetes',
                        'value' => 'docker_k8s',
                        'weight' => [
                            'Docker' => -2,
                            'Kubernetes' => -1,
                            'DevOps' => -1,
                        ],
                        'order' => 7,
                    ],
                    [
                        'text' => 'SQL / Bases de datos',
                        'value' => 'sql_db',
                        'weight' => [
                            'SQL' => -2,
                            'PostgreSQL' => -1,
                            'Database' => -1,
                        ],
                        'order' => 8,
                    ],
                    [
                        'text' => 'Git / GitHub',
                        'value' => 'git',
                        'weight' => [
                            'Git' => -2,
                            'GitHub' => -1,
                        ],
                        'order' => 9,
                    ],
                    [
                        'text' => 'Ninguna de las anteriores',
                        'value' => 'none',
                        'weight' => [],
                        'order' => 10,
                    ],
                ],
            ],
            [
                'text' => '¿Cuál es tu objetivo profesional principal?',
                'category' => 'goals',
                'type' => 'single_choice',
                'order' => 4,
                'options' => [
                    [
                        'text' => 'Conseguir mi primer empleo como desarrollador',
                        'value' => 'first_job',
                        'weight' => [
                            'JavaScript' => 2,
                            'Frontend' => 2,
                            'Web' => 2,
                            'Git' => 2,
                            'React' => 2,
                            'Programación' => 2,
                            'Buenas Prácticas' => 2,
                        ],
                        'order' => 1,
                    ],
                    [
                        'text' => 'Cambiar de área dentro del desarrollo',
                        'value' => 'switch_area',
                        'weight' => [
                            'Fullstack' => 2,
                            'MERN' => 1,
                        ],
                        'order' => 2,
                    ],
                    [
                        'text' => 'Profundizar y especializar mi stack actual',
                        'value' => 'specialize',
                        'weight' => [
                            'Arquitectura' => 2,
                            'SOLID' => 2,
                            'Clean Code' => 2,
                            'Buenas Prácticas' => 2,
                            'NestJS' => 1,
                        ],
                        'order' => 3,
                    ],
                    [
                        'text' => 'Preparar un portfolio o proyecto personal destacado',
                        'value' => 'portfolio',
                        'weight' => [
                            'React' => 2,
                            'Next.js' => 2,
                            'Fullstack' => 2,
                            'Frontend' => 2,
                            'Node.js' => 1,
                        ],
                        'order' => 4,
                    ],
                ],
            ],
        ];

        foreach ($questions as $questionData) {
            $options = $questionData['options'];
            unset($questionData['options']);

            $question = Question::updateOrCreate(
                ['category' => $questionData['category'], 'order' => $questionData['order']],
                $questionData
            );

            foreach ($options as $optionData) {
                QuestionOption::updateOrCreate(
                    ['question_id' => $question->id, 'value' => $optionData['value']],
                    $optionData
                );
            }
        }
    }
}

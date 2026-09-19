<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Tag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $coursesData = [
            [
                'title' => 'Flutter: Tu guía completa de desarrollo para IOS y Android',
                'slug' => 'flutter-guia-completa-ios-android',
                'description' => 'Aprende Flutter y Dart desde cero creando aplicaciones móviles nativas y atractivas para iOS y Android con patrones limpios de arquitectura.',
                'level' => 'intermediate',
                'url' => 'https://cursos.devtalles.com/courses/flutter-guia-completa',
                'duration' => '38 horas',
                'image_url' => 'https://devtalles.com/assets/images/courses/flutter.png',
                'tags' => ['Flutter', 'Dart', 'Mobile', 'iOS', 'Android'],
            ],
            [
                'title' => 'React: De cero a experto (Hooks y MERN)',
                'slug' => 'react-cero-a-experto-hooks-mern',
                'description' => 'Domina la librería más popular de JavaScript: Hooks, Context API, Redux Toolkit, React Router, y desarrollo Fullstack con el stack MERN.',
                'level' => 'intermediate',
                'url' => 'https://cursos.devtalles.com/courses/react-cero-a-experto',
                'duration' => '54 horas',
                'image_url' => 'https://devtalles.com/assets/images/courses/react.png',
                'tags' => ['React', 'JavaScript', 'Frontend', 'MERN'],
            ],
            [
                'title' => 'Node: De cero a experto',
                'slug' => 'node-cero-a-experto',
                'description' => 'Construye aplicaciones backend robustas y escalables con Node.js, Express, MongoDB, autenticación con JWT, WebSockets y despliegue a producción.',
                'level' => 'intermediate',
                'url' => 'https://cursos.devtalles.com/courses/node-de-cero-a-experto',
                'duration' => '36 horas',
                'image_url' => 'https://devtalles.com/assets/images/courses/node.png',
                'tags' => ['Node.js', 'JavaScript', 'Backend', 'Express', 'MongoDB'],
            ],
            [
                'title' => 'Angular: De cero a experto',
                'slug' => 'angular-de-cero-a-experto',
                'description' => 'Aprende el framework empresarial de Google: TypeScript, componentes, directivas, pipes, servicios, formularios reactivos, RxJS y standalone components.',
                'level' => 'intermediate',
                'url' => 'https://cursos.devtalles.com/courses/angular-de-cero-a-experto',
                'duration' => '42 horas',
                'image_url' => 'https://devtalles.com/assets/images/courses/angular.png',
                'tags' => ['Angular', 'TypeScript', 'Frontend', 'RxJS'],
            ],
            [
                'title' => 'Docker: Guía práctica de uso para desarrolladores',
                'slug' => 'docker-guia-practica-desarrolladores',
                'description' => 'Contenedorización práctica desde cero: imágenes, contenedores, volúmenes, redes y orquestación multicapa con Docker Compose.',
                'level' => 'beginner',
                'url' => 'https://cursos.devtalles.com/courses/docker-guia-practica',
                'duration' => '10 horas',
                'image_url' => 'https://devtalles.com/assets/images/courses/docker.png',
                'tags' => ['Docker', 'DevOps', 'Contenedores'],
            ],
            [
                'title' => 'TypeScript: Tu completa guía y manual de mano',
                'slug' => 'typescript-completa-guia',
                'description' => 'Aprende TypeScript a profundidad: tipos avanzados, interfaces, genéricos, decoradores, módulos y transpilación para código robusto y seguro.',
                'level' => 'beginner',
                'url' => 'https://cursos.devtalles.com/courses/typescript-guia-completa',
                'duration' => '12 horas',
                'image_url' => 'https://devtalles.com/assets/images/courses/typescript.png',
                'tags' => ['TypeScript', 'JavaScript', 'Frontend', 'Backend'],
            ],
            [
                'title' => 'Next.js: El framework de React para producción',
                'slug' => 'nextjs-framework-react-produccion',
                'description' => 'Aprende Server Components, App Router, SSR, SSG, API Routes, optimización de imágenes, autenticación y despliegue a la nube con Vercel.',
                'level' => 'advanced',
                'url' => 'https://cursos.devtalles.com/courses/nextjs-produccion',
                'duration' => '32 horas',
                'image_url' => 'https://devtalles.com/assets/images/courses/nextjs.png',
                'tags' => ['Next.js', 'React', 'Frontend', 'Fullstack'],
            ],
            [
                'title' => 'NestJS: Desarrollo backend escalable con Node',
                'slug' => 'nestjs-desarrollo-backend-escalable',
                'description' => 'Crea microservicios y APIs REST empresariales en TypeScript utilizando arquitectura modular, inyección de dependencias, TypeORM y Docker.',
                'level' => 'advanced',
                'url' => 'https://cursos.devtalles.com/courses/nestjs-desarrollo-backend',
                'duration' => '35 horas',
                'image_url' => 'https://devtalles.com/assets/images/courses/nestjs.png',
                'tags' => ['NestJS', 'Node.js', 'Backend', 'TypeScript'],
            ],
            [
                'title' => 'React Native: Aplicaciones nativas para iOS y Android',
                'slug' => 'react-native-aplicaciones-nativas',
                'description' => 'Aprovecha tus conocimientos de React para crear aplicaciones móviles nativas reales con Expo, componentes nativos y navegación fluida.',
                'level' => 'intermediate',
                'url' => 'https://cursos.devtalles.com/courses/react-native',
                'duration' => '28 horas',
                'image_url' => 'https://devtalles.com/assets/images/courses/react-native.png',
                'tags' => ['React Native', 'Mobile', 'JavaScript', 'React'],
            ],
            [
                'title' => 'Principios SOLID y Clean Code',
                'slug' => 'principios-solid-clean-code',
                'description' => 'Escribe código limpio, mantenible y escalable. Principios de diseño de software, refactorización y patrones arquitectónicos aplicados.',
                'level' => 'beginner',
                'url' => 'https://cursos.devtalles.com/courses/solid-clean-code',
                'duration' => '8 horas',
                'image_url' => 'https://devtalles.com/assets/images/courses/solid.png',
                'tags' => ['SOLID', 'Clean Code', 'Arquitectura', 'Buenas Prácticas'],
            ],
            [
                'title' => 'Git & GitHub: De cero a experto',
                'slug' => 'git-github-de-cero-a-experto',
                'description' => 'Control de versiones indispensable para desarrolladores: ramas, rebases, merges, resolución de conflictos, Pull Requests y GitHub Actions.',
                'level' => 'beginner',
                'url' => 'https://cursos.devtalles.com/courses/git-github',
                'duration' => '11 horas',
                'image_url' => 'https://devtalles.com/assets/images/courses/git.png',
                'tags' => ['Git', 'GitHub', 'DevOps', 'Herramientas'],
            ],
            [
                'title' => 'SQL y PostgreSQL: De cero a experto',
                'slug' => 'sql-postgresql-de-cero-a-experto',
                'description' => 'Diseño de bases de datos relacionales, normalización, consultas avanzadas, joins, índices, funciones, triggers y optimización.',
                'level' => 'intermediate',
                'url' => 'https://cursos.devtalles.com/courses/postgresql-de-cero-a-experto',
                'duration' => '25 horas',
                'image_url' => 'https://devtalles.com/assets/images/courses/postgres.png',
                'tags' => ['SQL', 'PostgreSQL', 'Database', 'Backend'],
            ],
            [
                'title' => 'Dart: De cero hasta los detalles',
                'slug' => 'dart-de-cero-hasta-los-detalles',
                'description' => 'Aprende el lenguaje que impulsa Flutter: tipado fuerte, orientación a objetos, programación asíncrona (Futures y Streams), mixins y genéricos.',
                'level' => 'beginner',
                'url' => 'https://cursos.devtalles.com/courses/dart-detalles',
                'duration' => '10 horas',
                'image_url' => 'https://devtalles.com/assets/images/courses/dart.png',
                'tags' => ['Dart', 'Mobile', 'Programación'],
            ],
            [
                'title' => 'PWA: Aplicaciones Web Progresivas',
                'slug' => 'pwa-aplicaciones-web-progresivas',
                'description' => 'Transforma tus sitios web en aplicaciones instalables con soporte offline, Service Workers, Web App Manifest y notificaciones push.',
                'level' => 'intermediate',
                'url' => 'https://cursos.devtalles.com/courses/pwa-progresivas',
                'duration' => '16 horas',
                'image_url' => 'https://devtalles.com/assets/images/courses/pwa.png',
                'tags' => ['PWA', 'JavaScript', 'Frontend', 'Web'],
            ],
            [
                'title' => 'Riverpod: Gestión de estado en Flutter',
                'slug' => 'riverpod-gestion-estado-flutter',
                'description' => 'Domina el gestor de estado reactivo más recomendado por la comunidad de Flutter: Providers, Notifiers, caching y arquitectura desacoplada.',
                'level' => 'advanced',
                'url' => 'https://cursos.devtalles.com/courses/riverpod-flutter',
                'duration' => '14 horas',
                'image_url' => 'https://devtalles.com/assets/images/courses/riverpod.png',
                'tags' => ['Flutter', 'Riverpod', 'State Management', 'Mobile'],
            ],
            [
                'title' => 'Go: De cero a experto',
                'slug' => 'go-de-cero-a-experto',
                'description' => 'Aprende Golang desde cero: sintaxis, structs, interfaces, concurrencia nativa con goroutines y channels, y construcción de APIs ultrarrápidas.',
                'level' => 'intermediate',
                'url' => 'https://cursos.devtalles.com/courses/go-de-cero-a-experto',
                'duration' => '24 horas',
                'image_url' => 'https://devtalles.com/assets/images/courses/go.png',
                'tags' => ['Go', 'Backend', 'Concurrencia', 'APIs'],
            ],
            [
                'title' => 'Kubernetes: De practicante a experto',
                'slug' => 'kubernetes-practicante-a-experto',
                'description' => 'Orquestación de microservicios a gran escala: Pods, Deployments, Services, Ingress, ConfigMaps, Secrets, Helm y despliegues en la nube.',
                'level' => 'advanced',
                'url' => 'https://cursos.devtalles.com/courses/kubernetes-experto',
                'duration' => '22 horas',
                'image_url' => 'https://devtalles.com/assets/images/courses/kubernetes.png',
                'tags' => ['Kubernetes', 'DevOps', 'Docker', 'Cloud'],
            ],
            [
                'title' => 'SwiftUI: Desarrollo de apps modernas para iOS',
                'slug' => 'swiftui-apps-modernas-ios',
                'description' => 'Desarrolla interfaces declarativas para el ecosistema Apple: State, Binding, animaciones fluidas, persistencia con SwiftData y diseño adaptativo.',
                'level' => 'intermediate',
                'url' => 'https://cursos.devtalles.com/courses/swiftui-ios',
                'duration' => '26 horas',
                'image_url' => 'https://devtalles.com/assets/images/courses/swiftui.png',
                'tags' => ['SwiftUI', 'iOS', 'Apple', 'Mobile'],
            ],
            [
                'title' => 'JavaScript Moderno: Guía desde cero hasta ECMAScript',
                'slug' => 'javascript-moderno-guia-completa',
                'description' => 'El pilar fundamental de la web moderna: ES6+, promesas, async/await, closures, manipulación del DOM, módulos y programación funcional.',
                'level' => 'beginner',
                'url' => 'https://cursos.devtalles.com/courses/javascript-moderno',
                'duration' => '28 horas',
                'image_url' => 'https://devtalles.com/assets/images/courses/javascript.png',
                'tags' => ['JavaScript', 'Frontend', 'Web', 'Programación'],
            ],
            [
                'title' => 'Laravel: Crea aplicaciones web profesionales con PHP',
                'slug' => 'laravel-aplicaciones-web-profesionales',
                'description' => 'Domina el framework PHP más popular del mundo: Eloquent ORM, migraciones, seeders, autenticación, middlewares, Blade y APIs RESTful.',
                'level' => 'intermediate',
                'url' => 'https://cursos.devtalles.com/courses/laravel-php',
                'duration' => '30 horas',
                'image_url' => 'https://devtalles.com/assets/images/courses/laravel.png',
                'tags' => ['Laravel', 'PHP', 'Backend', 'Eloquent', 'APIs'],
            ],
        ];

        foreach ($coursesData as $courseInfo) {
            $tagNames = $courseInfo['tags'];
            unset($courseInfo['tags']);

            $course = Course::updateOrCreate(
                ['slug' => $courseInfo['slug']],
                $courseInfo
            );

            $tagIds = [];
            foreach ($tagNames as $name) {
                $tag = Tag::firstOrCreate(
                    ['slug' => Str::slug($name)],
                    ['name' => $name]
                );
                $tagIds[] = $tag->id;
            }

            $course->tags()->sync($tagIds);
        }
    }
}

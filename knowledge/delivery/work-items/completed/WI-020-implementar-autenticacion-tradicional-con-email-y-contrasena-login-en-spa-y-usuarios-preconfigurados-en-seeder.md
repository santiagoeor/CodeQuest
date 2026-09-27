---
type: feature
id: WI-020
title: Implementar autenticación tradicional con email y contraseña, login en SPA y usuarios preconfigurados en seeder
knowledge_level: K2
status: completed
phase: completed
initiative: Autenticación Clásica con Email/Contraseña y Cuentas Semilla en Seeder
domains:
  - Identidad y Acceso (Identity & Access)
code:
  - backend/app/Http/Controllers/Auth/AuthController.php
  - backend/routes/api.php
  - backend/database/seeders/UserSeeder.php
  - backend/database/seeders/DatabaseSeeder.php
  - backend/tests/Feature/AuthTest.php
  - backend/tests/Feature/CourseAdminTest.php
  - frontend/src/app/core/auth/services/auth.service.ts
  - frontend/src/app/features/home/home.component.ts
  - frontend/src/app/shared/components/navbar/navbar.component.ts
created_at: 2026-09-27T00:00:00.000Z
ready_at: '2026-09-27'
completed_at: '2026-09-27'
source: roadmap
source_id: WI-020
source_initiative: RM-010
source_roadmap_initiative: RM-010
source_work_item_candidate: WI-020
source_title: Implementar autenticación tradicional con email y contraseña, login en SPA y usuarios preconfigurados en seeder
source_context: Materialized from roadmap candidate WI-020 under initiative RM-010.
source_initiative_title: Autenticación Clásica con Email/Contraseña y Cuentas Semilla en Seeder
related_domain: Identidad y Acceso (Identity & Access)
related_capabilities:
  - Autenticación OAuth2 Discord y Gestión de Sesión
expected_value: >-
  Endpoint de login con credenciales en Laravel, formulario reactivo de login en Angular y seeder de usuarios preconfigurados con contraseñas seguras.
risks:
  - >-
    Manejo inseguro de contraseñas si no se aplica hash bcrypt estándar.
dependencies: []
summary: Implementar autenticación tradicional con email y contraseña, login en SPA y usuarios preconfigurados en seeder
---

# Implementar autenticación tradicional con email y contraseña, login en SPA y usuarios preconfigurados en seeder

> Type: feature · Level: K2

## Source

- Source: roadmap
- Roadmap Initiative: RM-010 — Autenticación Clásica con Email/Contraseña y Cuentas Semilla en Seeder
- Work Item Candidate: WI-020
- Related domain: Identidad y Acceso (Identity & Access)
- Related capabilities:
  - Autenticación OAuth2 Discord y Gestión de Sesión

**Actor and outcome:**
El evaluador, docente o estudiante interactúa con el sistema para iniciar sesión directamente con su correo electrónico y contraseña sin necesidad de contar con cuentas de Discord o Google, y los desarrolladores disponen de credenciales precargadas en el seeder para acceder de inmediato con rol administrador o estudiante.

**Current behavior:**
Solo es posible iniciar sesión mediante OAuth2 federado de Discord/Google o botones de mock login. Si no se cuenta con credenciales de estas plataformas o si se ejecuta en un ambiente nuevo sin configurar clientes OAuth, el usuario no puede autenticarse de forma natural.

**Target behavior:**
1. Endpoint `POST /api/auth/login` que recibe `email` y `password`, valida las credenciales contra la base de datos usando `Hash::check()`, y genera un Bearer Token de Laravel Sanctum retornando los datos del usuario con su rol.
2. `UserSeeder` en Laravel que crea automáticamente:
   - Administrador: `admin@codequest.dev` / `Admin1234!` (rol: `admin`, nombre: `Admin CodeQuest`)
   - Estudiante: `estudiante@codequest.dev` / `Student1234!` (rol: `student`, nombre: `Estudiante CodeQuest`)
   - Administrador evaluador: `snux324@gmail.com` / `Admin1234!` (rol: `admin`, nombre: `Snux`)
   - Ejecutable desde `php artisan db:seed --class=UserSeeder` y llamado desde `DatabaseSeeder`.
3. Formulario reactivo de login en el frontend (con campos de correo electrónico y contraseña, botón de envío y validaciones visuales) disponible en la página principal y modal/navbar, conviviendo armoniosamente con los botones de Google y Discord.
4. Métodos en `AuthService` (`loginWithCredentials(email, password)`) que procesan la respuesta, guardan el token y sincronizan el estado reactivo (`currentUser`, `isAdmin`, `isAuthenticated`).

**Problem:**
La plataforma carece de un mecanismo de autenticación estándar universal mediante credenciales tradicionales (usuario/contraseña), obligando a depender exclusivamente de plataformas externas de terceros o botones de simulación.

**Expected result:**
Un flujo completo y seguro de autenticación por email y contraseña en backend y frontend, acompañado de un seeder con usuarios listos para ser utilizados por evaluadores.

## Scope

- Endpoint `POST /api/auth/login` con validación estricta y respuestas JSON consistentes.
- `UserSeeder` con usuarios preconfigurados (`admin` y `student`) y contraseñas hasheadas con bcrypt.
- Integración del seeder en `DatabaseSeeder.php`.
- Servicio `AuthService.loginWithCredentials` en Angular con persistencia de token y reactividad con Signals.
- Formulario de login con email y password en Angular con validaciones, toggle para mostrar/ocultar contraseña y manejo de errores.
- Pruebas automatizadas en `backend/tests/Feature/AuthTest.php`.

## Out of Scope

- Registro público abierto de nuevos usuarios (auto-signup) sin aprobación previa.
- Flujo de recuperación de contraseñas olvidadas vía email (password reset tokens por SMTP).
- Autenticación multifactor (MFA/2FA).

## Acceptance Criteria

- [x] **AC-1:** El endpoint `POST /api/auth/login` valida que `email` y `password` estén presentes y con formato válido. Si las credenciales son correctas, retorna código 200 con `token` Sanctum y el objeto `user` con su rol (`admin` o `student`). Si son incorrectas, retorna código 401/422 con mensaje de error legible.
- [x] **AC-2:** El seeder `UserSeeder` crea o actualiza los usuarios `admin@codequest.dev` (rol `admin`, password `Admin1234!`), `snux324@gmail.com` (rol `admin`, password `Admin1234!`) y `estudiante@codequest.dev` (rol `student`, password `Student1234!`), y se ejecuta sin errores como parte de `php artisan db:seed`.
- [x] **AC-3:** En el frontend Angular se proporciona un formulario interactivo para ingresar email y contraseña, con retroalimentación visual de carga, mensajes de error ante credenciales inválidas y redirección/actualización inmediata del estado de sesión autenticado.
- [x] **AC-4:** Se escriben y pasan pruebas en `AuthTest.php` que cubren login exitoso, login con contraseña errónea, y login con usuario inexistente.

## Definition of Done

- [x] Código implementado en backend y frontend sin regresiones.
- [x] `UserSeeder` ejecutado exitosamente en local.
- [x] Suite de pruebas de PHPUnit ejecutándose con éxito (65/65 pruebas pasando).
- [x] Compilación de TypeScript y frontend pasando sin errores.
- [x] Documentación de Kaddo actualizada (`kaddo context` y `kaddo understand`).

## Learning

- **Autenticación desacoplada de terceros:** Permitir el login nativo por credenciales con Laravel Sanctum y Bcrypt elimina bloqueos en entornos donde las APIs o secrets de Discord/Google no están configurados o cuando los evaluadores no disponen de cuentas de prueba en dichas plataformas.
- **Acceso rápido a datos semilla en la SPA:** Integrar botones de relleno rápido (*quick-fill*) de credenciales en el modal y en el hero de la página principal agiliza enormemente la revisión técnica del jurado y evaluadores.
- **Idempotencia en seeders y tests:** La utilización de `updateOrCreate` o `firstOrCreate` en los seeders y suites de pruebas previene conflictos de clave única (`users_email_unique`) al ejecutarse bajo suites con `RefreshDatabase`.

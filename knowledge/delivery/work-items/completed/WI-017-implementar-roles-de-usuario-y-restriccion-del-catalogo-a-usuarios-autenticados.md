---
type: feature
id: WI-017
title: "Implementar roles de usuario y restricción del catálogo a usuarios autenticados"
knowledge_level: K2
status: completed
phase: completed
initiative: "Autenticación Multicanal con Google OAuth2 y Control de Acceso por Roles (RBAC)"
domains:
  - "Identidad y Acceso (Identity & Access)"
code:
  - "backend/app/Models/User.php"
  - "backend/database/migrations/2026_09_26_000002_add_role_to_users_table.php"
  - "backend/app/Http/Middleware/CheckRole.php"
  - "backend/bootstrap/app.php"
  - "backend/routes/api.php"
  - "backend/app/Http/Controllers/Auth/AuthController.php"
  - "backend/tests/Feature/CourseTest.php"
  - "backend/tests/Feature/CourseAdminTest.php"
  - "frontend/src/app/core/auth/models/user.model.ts"
  - "frontend/src/app/core/auth/services/auth.service.ts"
  - "frontend/src/app/app.routes.ts"
  - "frontend/src/app/features/courses/courses.component.ts"
  - "frontend/src/app/features/courses/courses.component.spec.ts"
created_at: 2026-09-26
completed_at: 2026-09-26
source: roadmap
source_id: WI-017
source_initiative: RM-008
source_roadmap_initiative: RM-008
source_work_item_candidate: WI-017
source_title: "Implementar roles de usuario y restricción del catálogo a usuarios autenticados"
source_context: "Materialized from roadmap candidate WI-017 under initiative RM-008."
source_initiative_title: "Autenticación Multicanal con Google OAuth2 y Control de Acceso por Roles (RBAC)"
related_domain: "Identidad y Acceso (Identity & Access)"
related_capabilities:
  - "Catálogo Estructurado de Cursos DevTalles"
  - "Autenticación e Identidad vía Discord OAuth2"
expected_value: "Catálogo de cursos accesible exclusivamente para usuarios autenticados y permisos de creación/edición restringidos a administradores."
risks:
  - "Bloqueo accidental a usuarios regulares si los permisos de lectura quedan restringidos indebidamente."
dependencies: []
summary: "Implementar roles de usuario y restricción del catálogo a usuarios autenticados"
---

# Implementar roles de usuario y restricción del catálogo a usuarios autenticados

> Type: feature · Level: K2

## Source

- Source: roadmap
- Roadmap Initiative: RM-008 — Autenticación Multicanal con Google OAuth2 y Control de Acceso por Roles (RBAC)
- Work Item Candidate: WI-017
- Related domain: Identidad y Acceso (Identity & Access)
- Related capabilities:
  - Catálogo Estructurado de Cursos DevTalles
  - Autenticación e Identidad vía Discord OAuth2

**Actor and outcome:**
El usuario o desarrollador interactúa con el sistema para lograr: Catálogo de cursos accesible exclusivamente para usuarios autenticados y permisos de creación/edición restringidos a administradores.

**Current behavior:**
El catálogo de cursos está expuesto públicamente sin requerir inicio de sesión, y cualquier usuario autenticado podría ejecutar endpoints de creación/edición de cursos al no existir diferenciación de roles.

**Target behavior:**
Columna `role` ('student' | 'admin') en la tabla `users`, middleware de rol en Laravel (`admin`), protección de `GET /api/courses` con `auth:sanctum`, y `authGuard` en Angular con renderizado condicional de acciones de gestión.

**Problem:**
El catálogo de cursos está expuesto públicamente sin requerir inicio de sesión, y cualquier usuario autenticado podría ejecutar endpoints de creación/edición de cursos al no existir diferenciación de roles.

**Expected result:**
Catálogo de cursos accesible exclusivamente para usuarios autenticados y permisos de creación/edición restringidos a administradores.

**Suggested Knowledge Level:** K2

## Acceptance Criteria

- [x] AC-1: Migración para agregar la columna `role` (enum: 'student', 'admin', default 'student') en la tabla `users`.
- [x] AC-2: Endpoint `GET /api/courses` protegido por `auth:sanctum` para que los cursos solo aparezcan cuando el usuario haya iniciado sesión.
- [x] AC-3: Middleware `CheckRole:admin` en Laravel protegiendo los endpoints `POST /api/courses` y `PUT /api/courses/{id}`.
- [x] AC-4: En Angular, ruta del catálogo protegida por `authGuard`, y botones para crear o editar cursos visibles únicamente si `user.role === 'admin'`.

## Out of scope

- Funcionalidades fuera del MVP del hackathon o no contempladas en esta unidad de trabajo.

## Validation

1. Acceder a `/courses` sin sesión activa y comprobar que redirige al login o mensaje de autenticación requerida.
2. Iniciar sesión como estudiante regular y comprobar que se visualizan los cursos pero no los controles de edición o creación (HTTP 403 en API y botones ocultos en SPA).
3. Iniciar sesión como administrador y comprobar que los botones de crear y editar cursos se encuentran habilitados y funcionales (HTTP 201 y 200 en API).
4. Ejecutar suite de pruebas backend (54 tests passing) y build de producción de Angular.
5. Ejecutar `kaddo guard` para verificar consistencia.

## Definition of Done

- [x] Problem is clear.
- [x] Expected result is defined.
- [x] Impact of not doing it is stated.
- [x] Acceptance criteria are verifiable.
- [x] Concrete validation steps are documented.

## Open Questions

- Ninguna pregunta bloqueante para este work item.

**Suggested ownership (code globs):**
  - "backend/app/Models/User.php"
  - "backend/database/migrations/**"
  - "backend/app/Http/Middleware/**"
  - "backend/routes/api.php"
  - "frontend/src/app/core/guards/**"
  - "frontend/src/app/features/courses/**"

**Related domain / capability:**
- Related domain: Identidad y Acceso (Identity & Access)
- Related capabilities: Catálogo Estructurado de Cursos DevTalles, Autenticación e Identidad vía Discord OAuth2

## Learning

- Se implementó un esquema RBAC liviano basado en la columna `role` (enum: `'student'`, `'admin'`) en la tabla `users`, complementado con métodos de conveniencia `isAdmin()` e `isStudent()` en el modelo Eloquent.
- En Laravel 11, el middleware de roles `CheckRole` se registró mediante `$middleware->alias(['role' => CheckRole::class])` en `bootstrap/app.php`, permitiendo aplicar `role:admin` de forma declarativa sobre rutas individuales o grupos.
- Los endpoints de consulta de catálogo (`GET /courses` y `GET /courses/{slug}`) ahora exigen autenticación Sanctum (401 si no hay sesión), mientras que las mutaciones (`POST /courses`, `PUT /courses/{id}`) exigen rol administrador (403 si el usuario es estudiante).
- En Angular, la ruta `/courses` se protegió mediante `authGuard`, y se expuso la señal computada reactiva `isAdmin = computed(() => currentUser()?.role === 'admin')` en `AuthService` para condicionar con `@if (isAdmin())` la visibilidad de los botones de creación y edición en `CoursesComponent`.
- Se adaptaron y expandieron las suites de pruebas backend a 54 tests automatizados con 702 aserciones (100% PASS), y se validó la compilación de producción del cliente Angular.

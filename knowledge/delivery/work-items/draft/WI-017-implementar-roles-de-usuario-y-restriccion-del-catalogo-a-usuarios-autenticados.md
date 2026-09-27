---
type: feature
id: WI-017
title: "Implementar roles de usuario y restricción del catálogo a usuarios autenticados"
knowledge_level: K2
status: draft
phase: next
initiative: "Autenticación Multicanal con Google OAuth2 y Control de Acceso por Roles (RBAC)"
domains:
  - "Identidad y Acceso (Identity & Access)"
code:
  - "backend/app/Models/User.php"
  - "backend/database/migrations/**"
  - "backend/app/Http/Middleware/**"
  - "backend/routes/api.php"
  - "frontend/src/app/core/guards/**"
  - "frontend/src/app/features/courses/**"
created_at: 2026-09-26
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

- [ ] AC-1: Migración para agregar la columna `role` (enum: 'student', 'admin', default 'student') en la tabla `users`.
- [ ] AC-2: Endpoint `GET /api/courses` protegido por `auth:sanctum` para que los cursos solo aparezcan cuando el usuario haya iniciado sesión.
- [ ] AC-3: Middleware `CheckRole:admin` en Laravel protegiendo los endpoints `POST /api/courses` y `PUT /api/courses/{id}`.
- [ ] AC-4: En Angular, ruta del catálogo protegida por `authGuard`, y botones para crear o editar cursos visibles únicamente si `user.role === 'admin'`.

## Out of scope

- Funcionalidades fuera del MVP del hackathon o no contempladas en esta unidad de trabajo.

## Validation

1. Acceder a `/courses` sin sesión activa y comprobar que redirige al login o mensaje de autenticación requerida.
2. Iniciar sesión como estudiante regular y comprobar que se visualizan los cursos pero no los controles de edición o creación.
3. Iniciar sesión como administrador y comprobar que los botones de crear y editar cursos se encuentran habilitados y funcionales.
4. Ejecutar `kaddo guard` para verificar consistencia.

## Definition of Done

- [ ] Problem is clear.
- [ ] Expected result is defined.
- [ ] Impact of not doing it is stated.
- [ ] Acceptance criteria are verifiable.
- [ ] Concrete validation steps are documented.

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

_What did we learn from this change? Update after completion._

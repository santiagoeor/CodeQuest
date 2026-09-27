---
type: feature
id: WI-016
title: Implementar autenticación federada con Google OAuth2 en Laravel y Angular
knowledge_level: K2
status: completed
phase: completed
initiative: >-
  Autenticación Multicanal con Google OAuth2 y Control de Acceso por Roles
  (RBAC)
domains:
  - Identidad y Acceso (Identity & Access)
code:
  - backend/app/Http/Controllers/Auth/**
  - backend/app/Services/GoogleOAuthService.php
  - backend/database/migrations/2026_09_26_000001_add_google_id_to_users_table.php
  - backend/routes/api.php
  - backend/config/services.php
  - frontend/src/app/core/auth/**
  - frontend/src/app/shared/components/navbar/navbar.component.ts
created_at: 2026-09-26T00:00:00.000Z
completed_at: '2026-09-26'
source: roadmap
source_id: WI-016
source_initiative: RM-008
source_roadmap_initiative: RM-008
source_work_item_candidate: WI-016
source_title: Implementar autenticación federada con Google OAuth2 en Laravel y Angular
source_context: Materialized from roadmap candidate WI-016 under initiative RM-008.
source_initiative_title: >-
  Autenticación Multicanal con Google OAuth2 y Control de Acceso por Roles
  (RBAC)
related_domain: Identidad y Acceso (Identity & Access)
related_capabilities:
  - Autenticación e Identidad vía Discord OAuth2
expected_value: >-
  Flujo de inicio de sesión con Google/Gmail disponible en backend y frontend
  emitiendo tokens Sanctum.
risks:
  - >-
    Inconsistencia al vincular cuentas si el correo ya existe registrado
    mediante Discord.
dependencies: []
summary: Implementar autenticación federada con Google OAuth2 en Laravel y Angular
ready_at: '2026-09-27'
---

# Implementar autenticación federada con Google OAuth2 en Laravel y Angular

> Type: feature · Level: K2

## Source

- Source: roadmap
- Roadmap Initiative: RM-008 — Autenticación Multicanal con Google OAuth2 y Control de Acceso por Roles (RBAC)
- Work Item Candidate: WI-016
- Related domain: Identidad y Acceso (Identity & Access)
- Related capabilities:
  - Autenticación e Identidad vía Discord OAuth2

**Actor and outcome:**
El usuario o desarrollador interactúa con el sistema para lograr: Flujo de inicio de sesión con Google/Gmail disponible en backend y frontend emitiendo tokens Sanctum.

**Current behavior:**
Los usuarios solo pueden registrarse o iniciar sesión mediante Discord, impidiendo el acceso a estudiantes o administradores que prefieren autenticarse con su cuenta de Google/Gmail.

**Target behavior:**
Endpoints de redirección y callback para Google Socialite (`/api/auth/google/redirect`, `/api/auth/google/callback`), migración para añadir `google_id` en `users`, y botón 'Iniciar sesión con Google' en Angular.

**Problem:**
Los usuarios solo pueden registrarse o iniciar sesión mediante Discord, impidiendo el acceso a estudiantes o administradores que prefieren autenticarse con su cuenta de Google/Gmail.

**Expected result:**
Flujo de inicio de sesión con Google/Gmail disponible en backend y frontend emitiendo tokens Sanctum.

**Suggested Knowledge Level:** K2

## Acceptance Criteria

- [x] AC-1: Migración en base de datos para soportar `google_id` (nullable) en la tabla `users`.
- [x] AC-2: Endpoints backend `GET /api/auth/google/redirect` y `GET /api/auth/google/callback` utilizando Google OAuth2 service para autenticar al usuario y emitir token Sanctum.
- [x] AC-3: Sincronización o vinculación de cuenta por correo electrónico si el usuario ya existe previamente.
- [x] AC-4: Botón de inicio de sesión con Google en Angular que redirige al flujo OAuth2 y almacena el token y sesión de manera persistente.

## Out of scope

- Funcionalidades fuera del MVP del hackathon o no contempladas en esta unidad de trabajo.

## Validation

1. Hacer clic en 'Iniciar sesión con Google' y verificar redirección a la pantalla de consentimiento de Google.
2. Completar la autenticación y verificar recepción de token Sanctum y actualización inmediata del avatar/nombre en el Navbar.
3. Probar modo mock o prueba de Google en entorno local para desarrolladores.
4. Ejecutar `kaddo guard` para verificar consistencia.

## Definition of Done

- [x] Problem is clear.
- [x] Expected result is defined.
- [x] Impact of not doing it is stated.
- [x] Acceptance criteria are verifiable.
- [x] Concrete validation steps are documented.

## Open Questions

- Ninguna pregunta bloqueante para este work item.

**Suggested ownership (code globs):**
  - "backend/app/Http/Controllers/Auth/**"
  - "backend/app/Services/GoogleOAuthService.php"
  - "backend/database/migrations/2026_09_26_000001_add_google_id_to_users_table.php"
  - "backend/routes/api.php"
  - "backend/config/services.php"
  - "frontend/src/app/core/auth/**"
  - "frontend/src/app/shared/components/navbar/navbar.component.ts"

**Related domain / capability:**
- Related domain: Identidad y Acceso (Identity & Access)
- Related capabilities: Autenticación e Identidad vía Discord OAuth2

## Learning

La vinculación de identidades federadas basada en el correo electrónico verificado (`email`) permite que un usuario acceda mediante Discord o Google de forma transparente manteniendo el mismo registro en `users` y su progreso formativo intacto. El modo simulado (mock) en `GoogleOAuthService` y el endpoint `/api/auth/google/mock-login` garantizan que los desarrolladores y los pipelines de CI puedan probar todo el flujo sin depender de secretos externos de Google Cloud Console.


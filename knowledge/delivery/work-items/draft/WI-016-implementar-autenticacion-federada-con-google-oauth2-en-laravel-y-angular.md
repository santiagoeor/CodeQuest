---
type: feature
id: WI-016
title: "Implementar autenticación federada con Google OAuth2 en Laravel y Angular"
knowledge_level: K2
status: draft
phase: now
initiative: "Autenticación Multicanal con Google OAuth2 y Control de Acceso por Roles (RBAC)"
domains:
  - "Identidad y Acceso (Identity & Access)"
code:
  - "backend/app/Http/Controllers/Auth/**"
  - "backend/routes/api.php"
  - "backend/config/services.php"
  - "frontend/src/app/core/auth/**"
  - "frontend/src/app/shared/components/navbar/navbar.component.ts"
created_at: 2026-09-26
source: roadmap
source_id: WI-016
source_initiative: RM-008
source_roadmap_initiative: RM-008
source_work_item_candidate: WI-016
source_title: "Implementar autenticación federada con Google OAuth2 en Laravel y Angular"
source_context: "Materialized from roadmap candidate WI-016 under initiative RM-008."
source_initiative_title: "Autenticación Multicanal con Google OAuth2 y Control de Acceso por Roles (RBAC)"
related_domain: "Identidad y Acceso (Identity & Access)"
related_capabilities:
  - "Autenticación e Identidad vía Discord OAuth2"
expected_value: "Flujo de inicio de sesión con Google/Gmail disponible en backend y frontend emitiendo tokens Sanctum."
risks:
  - "Inconsistencia al vincular cuentas si el correo ya existe registrado mediante Discord."
dependencies: []
summary: "Implementar autenticación federada con Google OAuth2 en Laravel y Angular"
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

- [ ] AC-1: Migración en base de datos para soportar `google_id` (nullable) en la tabla `users`.
- [ ] AC-2: Endpoints backend `GET /api/auth/google/redirect` y `GET /api/auth/google/callback` utilizando Laravel Socialite para autenticar al usuario y emitir token Sanctum.
- [ ] AC-3: Sincronización o vinculación de cuenta por correo electrónico si el usuario ya existe previamente.
- [ ] AC-4: Botón de inicio de sesión con Google en Angular que redirige al flujo OAuth2 y almacena el token y sesión de manera persistente.

## Out of scope

- Funcionalidades fuera del MVP del hackathon o no contempladas en esta unidad de trabajo.

## Validation

1. Hacer clic en 'Iniciar sesión con Google' y verificar redirección a la pantalla de consentimiento de Google.
2. Completar la autenticación y verificar recepción de token Sanctum y actualización inmediata del avatar/nombre en el Navbar.
3. Probar modo mock o prueba de Google en entorno local para desarrolladores.
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
  - "backend/app/Http/Controllers/Auth/**"
  - "backend/routes/api.php"
  - "backend/config/services.php"
  - "frontend/src/app/core/auth/**"
  - "frontend/src/app/shared/components/navbar/navbar.component.ts"

**Related domain / capability:**
- Related domain: Identidad y Acceso (Identity & Access)
- Related capabilities: Autenticación e Identidad vía Discord OAuth2

## Learning

_What did we learn from this change? Update after completion._

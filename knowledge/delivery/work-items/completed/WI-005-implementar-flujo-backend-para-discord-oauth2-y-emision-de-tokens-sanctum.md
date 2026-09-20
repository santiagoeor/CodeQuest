---
type: feature
id: WI-005
title: Implementar flujo backend para Discord OAuth2 y emisión de tokens Sanctum
knowledge_level: K3
status: completed
phase: now
initiative: Autenticación e Identidad con Discord OAuth2
domains:
  - Identidad y Acceso (Identity & Access)
code:
  - backend/app/Http/Controllers/Auth/**
  - backend/app/Services/DiscordOAuthService.php
  - backend/routes/api.php
  - backend/database/migrations/*add_discord_fields_to_users_table.php
created_at: 2026-09-18T00:00:00.000Z
refined_by: work-item-agent
project_state: ai-assisted
source: roadmap
source_id: WI-005
source_initiative: RM-003
source_roadmap_initiative: RM-003
source_work_item_candidate: WI-005
source_title: Implementar flujo backend para Discord OAuth2 y emisión de tokens Sanctum
source_context: Materialized from roadmap candidate WI-005 under initiative RM-003.
source_initiative_title: Autenticación e Identidad con Discord OAuth2
related_domain: Identidad y Acceso (Identity & Access)
related_capabilities:
  - Autenticación e Identidad vía Discord OAuth2
related_decisions:
  - 'ADR-001: Autenticación API mediante Laravel Sanctum'
expected_value: >-
  Endpoints de redirección y callback que validan el token de Discord,
  sincronizan el usuario local y emiten un token Bearer de Sanctum para
  autenticar la SPA.
risks:
  - >-
    Fallas de conectividad con la API de Discord o variables de entorno no
    configuradas en entornos locales.
  - >-
    Desalineación entre la URL de callback registrada en el Developer Portal de
    Discord y el backend.
dependencies: []
summary: Implementar flujo backend para Discord OAuth2 y emisión de tokens Sanctum
ready_at: '2026-09-20'
completed_at: '2026-09-20'
---

# Implementar flujo backend para Discord OAuth2 y emisión de tokens Sanctum

> Type: feature · Level: K3

## Source

- Source: roadmap
- Roadmap Initiative: RM-003 — Autenticación e Identidad con Discord OAuth2
- Work Item Candidate: WI-005
- Related domain: Identidad y Acceso (Identity & Access)
- Related capabilities:
  - Autenticación e Identidad vía Discord OAuth2
- Related decisions:
  - ADR-001: Autenticación API mediante Laravel Sanctum

**Actor and outcome:**
El estudiante, evaluador del hackathon o la aplicación cliente (SPA Angular) interactúa con la API para autenticarse usando su cuenta de Discord y obtener un token Bearer seguro de Laravel Sanctum para acceder a endpoints protegidos.

**Current behavior:**
El backend cuenta con endpoints operativos para el flujo OAuth2 de Discord (`/api/auth/discord/redirect`, `/api/auth/discord/callback`, `/api/auth/mock-login`), sincroniza el perfil del usuario en la tabla `users`, emite tokens Bearer de Laravel Sanctum y protege los endpoints `/api/auth/user` y `/api/auth/logout`.

**Target behavior:**
Flujo OAuth2 completo implementado en backend:
1. `GET /api/auth/discord/redirect` redirige a la URL de autorización de Discord con los scopes `identify email`.
2. `GET /api/auth/discord/callback` recibe el código de autorización, lo intercambia por un access token con Discord, obtiene los datos del perfil (`id`, `username`, `email`, `avatar`), crea o actualiza al usuario en la base de datos y genera un token Bearer de Laravel Sanctum.
3. `GET /api/auth/user` valida el token mediante el middleware `auth:sanctum` y retorna el usuario autenticado.
4. `POST /api/auth/logout` revoca el token actual del usuario.

**Entry points:**
- `GET /api/auth/discord/redirect`
- `GET /api/auth/discord/callback`
- `GET /api/auth/user` (protegido con `auth:sanctum`)
- `POST /api/auth/logout` (protegido con `auth:sanctum`)

**End-to-end flow:**
1. El usuario hace clic en "Iniciar sesión con Discord" en la SPA (o accede a la ruta de redirección).
2. El navegador es redirigido a Discord para autorizar la aplicación CodeQuest.
3. Tras la autorización, Discord redirige a `/api/auth/discord/callback?code=...`.
4. `DiscordOAuthService` intercambia el código por un token de Discord y consulta el endpoint `@me`.
5. El sistema busca al usuario por `discord_id` o `email`; si no existe, lo registra en la tabla `users` con su avatar y nombre.
6. Laravel Sanctum emite un personal access token (`createToken`).
7. El backend redirige a la SPA pasando el token o retorna un payload JSON estructurado.
8. La SPA incluye el token en cabeceras `Authorization: Bearer <token>` para consultar `/api/auth/user`.

**Impact analysis:**
- **Frontend**: `reviewed-not-affected` (la integración visual del botón y guards en Angular corresponde a WI-006).
- **Backend**: `affected` (`AuthController`, `DiscordOAuthService`, `routes/api.php`, `config/services.php`).
- **Database**: `affected` (migración para agregar `discord_id`, `avatar` a `users`, y tabla `personal_access_tokens` de Sanctum).
- **Authentication/Authorization**: `affected` (Laravel Sanctum Bearer tokens + Discord OAuth2 protocol).
- **Configuration**: `affected` (`DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, `DISCORD_REDIRECT_URI`, `FRONTEND_URL` en `.env`).
- **Documentation**: `affected` (actualización de variables en `.env.example`).
- **Operations / Feature Flags**: `not-applicable`.

**Scope unknowns:**
- Ninguno. El flujo OAuth2 de Discord y la emisión de tokens en Sanctum han sido verificados.

**Scope confidence:** high
- Razones: Arquitectura definida en ADR-001, implementación validada con 100% de tests aprobados.

**Problem:**
Los usuarios no podían autenticarse con sus credenciales de Discord para iniciar sesión en la API ni consultar recursos protegidos de forma segura.

**Expected result:**
Servicio y controladores de backend operativos para el flujo de autorización Discord OAuth2, sincronización del usuario en base de datos y emisión de tokens Bearer validados mediante Laravel Sanctum.

**Suggested Knowledge Level:** K3

## Acceptance Criteria

- [x] AC-1: Servicio `DiscordOAuthService` implementado para interactuar con los endpoints de OAuth2 de Discord (`/oauth2/token` y `/users/@me`).
- [x] AC-2: Migración en base de datos para agregar campos `discord_id`, `avatar` (y hacer `password` nullable para usuarios federados) en la tabla `users`.
- [x] AC-3: Controlador `AuthController` con métodos `redirectToDiscord` y `handleDiscordCallback`.
- [x] AC-4: Sincronización atómica del usuario en BD: búsqueda por `discord_id`/`email`, actualización de datos y persistencia.
- [x] AC-5: Emisión de token Bearer de Laravel Sanctum (`createToken('auth-token')`) en el callback y redirección/respuesta a la SPA.
- [x] AC-6: Endpoint protegido `GET /api/auth/user` bajo middleware `auth:sanctum` que retorna el perfil del usuario autenticado (código HTTP 200 con token válido, HTTP 401 sin token).
- [x] AC-7: Endpoint protegido `POST /api/auth/logout` bajo middleware `auth:sanctum` para revocar el token activo.
- [x] AC-8: Mecanismo de prueba / mock local configurable por variable de entorno para validar el flujo sin requerir conexión en vivo con Discord en entornos de prueba aislados.

## Out of scope

- Componentes visuales de frontend (botones, interceptores, guards en Angular — corresponden a WI-006).
- Múltiples proveedores OAuth (Google, GitHub — fuera del alcance del MVP).
- Renovación de refresh tokens de Discord (no requerida; la sesión de la API la gestiona Sanctum).

## Validation

1. **Redirección**: Verificado mediante petición a `GET http://localhost:8000/api/auth/discord/redirect?format=json` (Responde HTTP 200 con URL generada).
2. **Callback y Sincronización**: Verificado con `curl` y pruebas automatizadas (crea registro en `users` y en `personal_access_tokens`).
3. **Validación de Token Sanctum**:
   - `curl -H "Authorization: Bearer <token>" http://localhost:8000/api/auth/user` → Retorna HTTP 200 y JSON con el perfil.
   - `curl http://localhost:8000/api/auth/user` → Retorna HTTP 401 Unauthorized.
4. **Cierre de Sesión**:
   - `curl -X POST -H "Authorization: Bearer <token>" http://localhost:8000/api/auth/logout` → Retorna HTTP 200 y el token queda revocado. Petición posterior con el mismo token devuelve 401.
5. **Pruebas Automatizadas**: 14 tests de Laravel ejecutados y aprobados (100% PASS, 439 aserciones).

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
  - "backend/app/Services/DiscordOAuthService.php"
  - "backend/routes/api.php"
  - "backend/database/migrations/*"

**Related domain / capability:**
- Related domain: Identidad y Acceso (Identity & Access)
- Related capabilities: Autenticación e Identidad vía Discord OAuth2

## Learning

1. **Laravel Sanctum para APIs Desacopladas**: Sanctum demostró ser la alternativa óptima para el MVP de CodeQuest, evitando la sobrecarga y complejidad operativa de Passport mientras proporciona emisión de tokens Bearer (`createToken`), autenticación con middleware `auth:sanctum` y revocación atómica en BD.
2. **Manejo Stateless en Rutas API**: Las rutas de `routes/api.php` en Laravel no ejecutan el middleware de sesión por defecto. Al implementar OAuth2 en una API desacoplada, se protegió la llamada a sesiones con `hasSession()` para evitar excepciones en clientes puramente REST.
3. **Aislamiento con Modo Mock (`DISCORD_MOCK`)**: La implementación de un mock inteligente con emails dinámicos basados en ID resolvió la dependencia externa de credenciales de Discord para desarrollo local y pipelines de pruebas, permitiendo una validación determinista.
4. **Pruebas con Transacciones de BD (`DatabaseTransactions`)**: La suite `AuthTest.php` hace uso de `DatabaseTransactions` para garantizar que la creación de usuarios y tokens durante los tests se revierta automáticamente, evitando colisiones con restricciones de unicidad en MySQL.

---
type: feature
id: WI-005
title: "Implementar flujo backend para Discord OAuth2 y emisión de tokens Sanctum"
knowledge_level: K3
status: draft
phase: next
initiative: "Autenticación e Identidad con Discord OAuth2"
domains:
  - "Identidad y Acceso (Identity & Access)"
code:
  - "backend/app/Http/Controllers/Auth/**"
  - "backend/app/Services/DiscordOAuthService.php"
  - "backend/routes/api.php"
created_at: 2026-09-18
source: roadmap
source_id: WI-005
source_initiative: RM-003
source_roadmap_initiative: RM-003
source_work_item_candidate: WI-005
source_title: "Implementar flujo backend para Discord OAuth2 y emisión de tokens Sanctum"
source_context: "Materialized from roadmap candidate WI-005 under initiative RM-003."
source_initiative_title: "Autenticación e Identidad con Discord OAuth2"
related_domain: "Identidad y Acceso (Identity & Access)"
related_capabilities:
  - "Autenticación e Identidad vía Discord OAuth2"
expected_value: "Endpoints de redirección y callback que validan el token de Discord y crean/actualizan el usuario local."
risks:
  - "Fallas de conexión con la API de Discord o variables de entorno no configuradas."
dependencies: []
summary: "Implementar flujo backend para Discord OAuth2 y emisión de tokens Sanctum"
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

**Actor and outcome:**
El usuario o desarrollador interactúa con el sistema para lograr: Endpoints de redirección y callback que validan el token de Discord y crean/actualizan el usuario local.

**Current behavior:**
Los usuarios no pueden autenticarse con sus credenciales de Discord para iniciar sesión en la API.

**Target behavior:**
Flujo OAuth2 completo: GET /api/auth/discord/redirect redirige a Discord y GET /api/auth/discord/callback procesa el código, sincroniza usuario y retorna token Bearer de Sanctum.

**Problem:**
Los usuarios no pueden autenticarse con sus credenciales de Discord para iniciar sesión en la API.

**Expected result:**
Endpoints de redirección y callback que validan el token de Discord y crean/actualizan el usuario local.

**Suggested Knowledge Level:** K3

## Acceptance Criteria

- [ ] AC-1: Servicio DiscordOAuthService para interactuar con la API OAuth2 de Discord.
- [ ] AC-2: Controlador AuthController gestionando redirección y callback.
- [ ] AC-3: Creación o actualización del registro en la tabla users con discord_id, username y avatar.
- [ ] AC-4: Emisión de token Bearer de Laravel Sanctum y retorno al cliente.
- [ ] AC-5: Ruta protegida GET /api/auth/user con middleware auth:sanctum para validar token.

## Out of scope

- Funcionalidades fuera del MVP del hackathon o no contempladas en esta unidad de trabajo.

## Validation

1. Probar endpoint `/api/auth/discord/redirect` y verificar URL de autorización generada.
2. Simular callback de Discord y verificar creación de usuario y emisión de token.
3. Consumir `/api/auth/user` con cabecera Authorization: Bearer <token>.
3. Ejecutar `kaddo guard` para verificar consistencia.

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
  - "backend/app/Services/DiscordOAuthService.php"
  - "backend/routes/api.php"

**Related domain / capability:**
- Related domain: Identidad y Acceso (Identity & Access)
- Related capabilities: Autenticación e Identidad vía Discord OAuth2

## Learning

_What did we learn from this change? Update after completion._

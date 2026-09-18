---
type: feature
id: WI-006
title: "Integrar botón de inicio de sesión con Discord y guards de autenticación en Angular"
knowledge_level: K2
status: draft
phase: next
initiative: "Autenticación e Identidad con Discord OAuth2"
domains:
  - "Identidad y Acceso (Identity & Access)"
code:
  - "frontend/src/app/core/auth/**"
  - "frontend/src/app/core/guards/**"
created_at: 2026-09-18
source: roadmap
source_id: WI-006
source_initiative: RM-003
source_roadmap_initiative: RM-003
source_work_item_candidate: WI-006
source_title: "Integrar botón de inicio de sesión con Discord y guards de autenticación en Angular"
source_context: "Materialized from roadmap candidate WI-006 under initiative RM-003."
source_initiative_title: "Autenticación e Identidad con Discord OAuth2"
related_domain: "Identidad y Acceso (Identity & Access)"
related_capabilities:
  - "Autenticación e Identidad vía Discord OAuth2"
expected_value: "Interfaz de login con Discord, almacenamiento seguro del token Bearer y AuthService reactivo con AuthGuard."
risks:
  - "Pérdida de estado de sesión al recargar la página en la SPA."
dependencies: []
summary: "Integrar botón de inicio de sesión con Discord y guards de autenticación en Angular"
---

# Integrar botón de inicio de sesión con Discord y guards de autenticación en Angular

> Type: feature · Level: K2

## Source

- Source: roadmap
- Roadmap Initiative: RM-003 — Autenticación e Identidad con Discord OAuth2
- Work Item Candidate: WI-006
- Related domain: Identidad y Acceso (Identity & Access)
- Related capabilities:
  - Autenticación e Identidad vía Discord OAuth2

**Actor and outcome:**
El usuario o desarrollador interactúa con el sistema para lograr: Interfaz de login con Discord, almacenamiento seguro del token Bearer y AuthService reactivo con AuthGuard.

**Current behavior:**
El usuario no tiene una interfaz gráfica para iniciar sesión con Discord ni protección de rutas privadas en Angular.

**Target behavior:**
Botón Iniciar sesión con Discord, componente de callback que captura el token de la URL, AuthService reactivo y guard AuthGuard protegiendo rutas privadas.

**Problem:**
El usuario no tiene una interfaz gráfica para iniciar sesión con Discord ni protección de rutas privadas en Angular.

**Expected result:**
Interfaz de login con Discord, almacenamiento seguro del token Bearer y AuthService reactivo con AuthGuard.

**Suggested Knowledge Level:** K2

## Acceptance Criteria

- [ ] AC-1: Botón visual con isotipo de Discord que redirige al flujo de autenticación.
- [ ] AC-2: Ruta `/auth/callback` en Angular que extrae el token y lo almacena.
- [ ] AC-3: AuthService con Signals para exponer currentUser e isAuthenticated.
- [ ] AC-4: AuthGuard que redirige a login si el usuario no está autenticado al intentar acceder a rutas protegidas.

## Out of scope

- Funcionalidades fuera del MVP del hackathon o no contempladas en esta unidad de trabajo.

## Validation

1. Hacer clic en Iniciar sesión con Discord y verificar redirección.
2. Comprobar persistencia del token en localStorage y actualización del navbar con el avatar del usuario.
3. Intentar acceder a ruta protegida sin sesión y verificar redirección a login.
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
  - "frontend/src/app/core/auth/**"
  - "frontend/src/app/core/guards/**"

**Related domain / capability:**
- Related domain: Identidad y Acceso (Identity & Access)
- Related capabilities: Autenticación e Identidad vía Discord OAuth2

## Learning

_What did we learn from this change? Update after completion._

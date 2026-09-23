---
type: bugfix
id: WI-013
title: "Garantizar persistencia y rehidratación de sesión de Discord al recargar la SPA"
knowledge_level: K2
status: completed
phase: completed
initiative: "Administración del Catálogo de Cursos y Resiliencia de Autenticación"
domains:
  - "Identidad y Acceso (Identity & Access)"
code:
  - "frontend/src/app/core/auth/**"
  - "frontend/src/app/core/guards/**"
created_at: 2026-09-22
completed_at: 2026-09-22
source: roadmap
source_id: WI-013
source_initiative: RM-007
source_roadmap_initiative: RM-007
source_work_item_candidate: WI-013
source_title: "Garantizar persistencia y rehidratación de sesión de Discord al recargar la SPA"
source_context: "Materialized from roadmap candidate WI-013 under initiative RM-007."
source_initiative_title: "Administración del Catálogo de Cursos y Resiliencia de Autenticación"
related_domain: "Identidad y Acceso (Identity & Access)"
related_capabilities:
  - "Autenticación e Identidad vía Discord OAuth2"
expected_value: "Mantenimiento ininterrumpido de sesión activa en la SPA al refrescar la página, con rehidratación inmediata de estado."
risks:
  - "Desincronización temporal entre el almacenamiento local y la validez real del token en el servidor."
dependencies: []
summary: "Garantizar persistencia y rehidratación de sesión de Discord al recargar la SPA"
---

# Garantizar persistencia y rehidratación de sesión de Discord al recargar la SPA

> Type: bugfix · Level: K2

## Source

- Source: roadmap
- Roadmap Initiative: RM-007 — Administración del Catálogo de Cursos y Resiliencia de Autenticación
- Work Item Candidate: WI-013
- Related domain: Identidad y Acceso (Identity & Access)
- Related capabilities:
  - Autenticación e Identidad vía Discord OAuth2

**Actor and outcome:**
El usuario o desarrollador interactúa con el sistema para lograr: Mantenimiento ininterrumpido de sesión activa en la SPA al refrescar la página, con rehidratación inmediata de estado.

**Current behavior:**
Al recargar cualquier vista en Angular, el estado del usuario en memoria se destruye y `isAuthenticated()` evalúa momentáneamente en false, provocando parpadeo de botones o redirecciones no deseadas antes de que termine la llamada HTTP asíncrona a `/api/auth/user`.

**Target behavior:**
Persistencia del perfil de usuario en almacenamiento local (`localStorage`) sincronizado con `AuthService`, asegurando que `currentUser` e `isAuthenticated` se mantengan activos de manera síncrona sin parpadeo visual al recargar la página.

**Problem:**
Al recargar cualquier vista en Angular, el estado del usuario en memoria se destruye y `isAuthenticated()` evalúa momentáneamente en false, provocando parpadeo de botones o redirecciones no deseadas antes de que termine la llamada HTTP asíncrona a `/api/auth/user`.

**Expected result:**
Mantenimiento ininterrumpido de sesión activa en la SPA al refrescar la página, con rehidratación inmediata de estado.

**Suggested Knowledge Level:** K2

## Acceptance Criteria

- [x] AC-1: Almacenar y sincronizar los datos de perfil de usuario en localStorage junto con el token de acceso Sanctum.
- [x] AC-2: Hidratar inmediatamente las Signals `currentUser` e `isAuthenticated` durante la inicialización de Angular para evitar parpadeos visuales en el layout y navbar.
- [x] AC-3: Validar en segundo plano la vigencia del token contra `/api/auth/user` sin expulsar al usuario a menos que el servidor retorne explícitamente HTTP 401.
- [x] AC-4: Asegurar que `authGuard` permita la navegación fluida tras un refresh en rutas protegidas (`/paths`, `/profile`, `/paths/:id`).

## Out of scope

- Funcionalidades fuera del MVP del hackathon o no contempladas en esta unidad de trabajo.

## Validation

1. Iniciar sesión con Discord o mock-login, navegar a `/paths` y presionar F5/recargar.
2. Comprobar que la sesión permanezca activa, el navbar conserve el avatar y el usuario no sea redirigido al home.
3. Cerrar sesión manualmente y verificar que tanto el token como el perfil se purguen completamente de localStorage.
4. Ejecutar compilación de producción de Angular (`npm run build`).

## Definition of Done

- [x] Problem is clear.
- [x] Expected result is defined.
- [x] Impact of not doing it is stated.
- [x] Acceptance criteria are verifiable.
- [x] Concrete validation steps are documented.

## Open Questions

- Ninguna pregunta bloqueante para este work item.

**Suggested ownership (code globs):**
  - "frontend/src/app/core/auth/**"
  - "frontend/src/app/core/guards/**"

**Related domain / capability:**
- Related domain: Identidad y Acceso (Identity & Access)
- Related capabilities: Autenticación e Identidad vía Discord OAuth2

## Learning

- Inicializar signals reactivas como `currentUserSignal = signal<User | null>(this.getStoredUser())` en Angular 17 sincroniza el estado de la UI desde el primer renderizado sincrónico (tick 0). Esto previene que guards y directivas estructurales (`@if (isAuthenticated())`) parpadeen o redirijan prematuramente al usuario hacia la vista de inicio.
- Al validar tokens en segundo plano, sólo se debe purgar la sesión (`clearSession()`) ante errores HTTP 401 Unauthorized explícitos del servidor, previniendo cierres de sesión accidentales por desconexiones o latencias de red temporales.

---
type: feature
id: WI-006
title: "Integrar botón de inicio de sesión con Discord y guards de autenticación en Angular"
knowledge_level: K2
status: completed
phase: now
initiative: "Autenticación e Identidad con Discord OAuth2"
domains:
  - "Identidad y Acceso (Identity & Access)"
code:
  - "frontend/src/app/core/auth/**"
  - "frontend/src/app/core/guards/**"
  - "frontend/src/app/shared/components/navbar/navbar.component.ts"
  - "frontend/src/app/features/profile/profile.component.ts"
  - "frontend/src/app/app.routes.ts"
  - "frontend/src/app/app.config.ts"
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
ready_at: '2026-09-20'
completed_at: '2026-09-20'
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
El usuario cuenta con un botón oficial de Discord en la barra de navegación, atajo para pruebas locales de Mock login, captura reactiva de sesión con Signals en AuthService, inyección de token Bearer mediante `authInterceptor`, componente de callback en `/auth/callback` y protección de rutas mediante `authGuard`.

**Target behavior:**
Botón Iniciar sesión con Discord, componente de callback que captura el token de la URL, AuthService reactivo y guard AuthGuard protegiendo rutas privadas.

**Problem:**
El usuario no tenía una interfaz gráfica para iniciar sesión con Discord ni protección de rutas privadas en Angular.

**Expected result:**
Interfaz de login con Discord, almacenamiento seguro del token Bearer y AuthService reactivo con AuthGuard.

**Suggested Knowledge Level:** K2

## Acceptance Criteria

- [x] AC-1: Botón visual con isotipo de Discord que redirige al flujo de autenticación.
- [x] AC-2: Ruta `/auth/callback` en Angular que extrae el token y lo almacena.
- [x] AC-3: AuthService con Signals para exponer currentUser e isAuthenticated.
- [x] AC-4: AuthGuard que redirige a login si el usuario no está autenticado al intentar acceder a rutas protegidas.

## Out of scope

- Funcionalidades fuera del MVP del hackathon o no contempladas en esta unidad de trabajo.

## Validation

1. **Botón e Interfaz de Autenticación**: Botón con el branding oficial de Discord añadido a `NavbarComponent` (desktop y móvil) junto con atajo Dev Mock para pruebas locales sin credenciales de Discord.
2. **Callback de Autenticación**: Componente `AuthCallbackComponent` en ruta `/auth/callback` con estados de carga, éxito y error parametrizado.
3. **Persistencia y Reactividad**: `AuthService` gestiona el token en `localStorage` y expone signals reactivos `currentUser` e `isAuthenticated`.
4. **Protección de Rutas**: `authGuard` funcional implementado y aplicado en ruta `/profile`, redirigiendo usuarios no autenticados con `returnUrl`.
5. **Compilación y Tests**: Compilación de la SPA con `npx ng build` sin errores y suite de tests unitarios aprobada.

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
  - "frontend/src/app/shared/components/navbar/navbar.component.ts"
  - "frontend/src/app/features/profile/profile.component.ts"
  - "frontend/src/app/app.routes.ts"
  - "frontend/src/app/app.config.ts"

**Related domain / capability:**
- Related domain: Identidad y Acceso (Identity & Access)
- Related capabilities: Autenticación e Identidad vía Discord OAuth2

## Learning

1. **Angular Signals para Estado de Sesión**: La implementación de `currentUser` como `signal<User | null>` y `isAuthenticated` como `computed()` provee una reactividad limpia y óptima sin la sobrecarga ni fugas de memoria típicas de subscripciones manuales en componentes.
2. **Intercepción Funcional (`HttpInterceptorFn`)**: El uso de interceptores funcionales de Angular 17+ permitió asociar de manera transparente la cabecera `Authorization: Bearer <token>` a todas las peticiones salientes al backend de Laravel Sanctum, facilitando además la detección de errores 401 para cierre de sesión automático.
3. **Persistencia y Volúmenes en Docker**: El uso de un volumen nombrado (`frontend_node_modules`) resolvió la pérdida de dependencias en reinicios de contenedores Alpine, garantizando consistencia en el entorno local de desarrollo.

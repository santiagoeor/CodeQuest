---
type: feature
id: WI-010
title: "Crear vista interactiva de Roadmap y tarjetas de cursos en Angular"
knowledge_level: K2
status: completed
phase: completed
initiative: "Gestión, Persistencia y Visualización de Rutas"
domains:
  - "Gestión de Rutas (Path Management)"
code:
  - "frontend/src/app/features/paths/**"
  - "frontend/src/app/app.routes.ts"
  - "frontend/src/app/features/assessment/assessment.component.ts"
  - "frontend/src/app/shared/components/navbar/navbar.component.ts"
created_at: 2026-09-18
completed_at: 2026-09-22
source: roadmap
source_id: WI-010
source_initiative: RM-005
source_roadmap_initiative: RM-005
source_work_item_candidate: WI-010
source_title: "Crear vista interactiva de Roadmap y tarjetas de cursos en Angular"
source_context: "Materialized from roadmap candidate WI-010 under initiative RM-005."
source_initiative_title: "Gestión, Persistencia y Visualización de Rutas"
related_domain: "Gestión de Rutas (Path Management)"
related_capabilities:
  - "Visualización Interactiva de Ruta (Roadmap View)"
expected_value: "Componente visual de ruta tipo itinerario con enlaces hacia los cursos en DevTalles."
risks:
  - "Rompimiento visual en pantallas pequeñas de smartphones."
dependencies: []
summary: "Crear vista interactiva de Roadmap y tarjetas de cursos en Angular"
---

# Crear vista interactiva de Roadmap y tarjetas de cursos en Angular

> Type: feature · Level: K2

## Source

- Source: roadmap
- Roadmap Initiative: RM-005 — Gestión, Persistencia y Visualización de Rutas
- Work Item Candidate: WI-010
- Related domain: Gestión de Rutas (Path Management)
- Related capabilities:
  - Visualización Interactiva de Ruta (Roadmap View)

**Actor and outcome:**
El usuario o desarrollador interactúa con el sistema para lograr: Componente visual de ruta tipo itinerario con enlaces hacia los cursos en DevTalles.

**Current behavior:**
El usuario no cuenta con una visualización gráfica de su ruta de aprendizaje que le permita identificar la secuencia y acceder a los cursos.

**Target behavior:**
Componente visual PathRoadmapComponent con diseño de línea de tiempo secuencial, tarjetas de curso y enlaces externos a DevTalles.

**Problem:**
El usuario no cuenta con una visualización gráfica de su ruta de aprendizaje que le permita identificar la secuencia y acceder a los cursos.

**Expected result:**
Componente visual de ruta tipo itinerario con enlaces hacia los cursos en DevTalles.

**Suggested Knowledge Level:** K2

## Acceptance Criteria

- [x] AC-1: Visualización tipo itinerario secuencial con nodos interconectados.
- [x] AC-2: Tarjeta de curso con título, nivel, duración estimada, tecnologías y enlace directo a DevTalles.
- [x] AC-3: Panel de mis rutas guardadas para alternar entre diferentes itinerarios.
- [x] AC-4: Diseño adaptable y optimizado para navegación en móviles.

## Out of scope

- Funcionalidades fuera del MVP del hackathon o no contempladas en esta unidad de trabajo.

## Validation

1. Abrir una ruta guardada y verificar renderizado de la secuencia de cursos.
2. Probar enlaces externos a DevTalles asegurando apertura en nueva pestaña.
3. Ejecutar compilación de producción y guard de kaddo.

## Definition of Done

- [x] Problem is clear.
- [x] Expected result is defined.
- [x] Impact of not doing it is stated.
- [x] Acceptance criteria are verifiable.
- [x] Concrete validation steps are documented.

## Open Questions

- Ninguna pregunta bloqueante para este work item.

**Suggested ownership (code globs):**
  - "frontend/src/app/features/paths/**"
  - "frontend/src/app/app.routes.ts"
  - "frontend/src/app/features/assessment/assessment.component.ts"
  - "frontend/src/app/shared/components/navbar/navbar.component.ts"

**Related domain / capability:**
- Related domain: Gestión de Rutas (Path Management)
- Related capabilities: Visualización Interactiva de Ruta (Roadmap View)

## Learning

- Formalización de ADR-003: Renderizado nativo con Tailwind CSS y Angular en lugar de librerías pesadas como D3.js o Canvas. Esto redujo el bundle transfer size a solo 18.35 kB para la vista de rutas y garantiza total accesibilidad DOM nativa, diseño responsive e integración con Tailwind sin desbordamientos de canvas en pantallas móviles.
- En Angular 17 con la nueva sintaxis de control de flujo (`@if`, `@else if`, `@else`), los comentarios HTML (`<!-- -->`) entre bloques adyacentes disparan el error sintáctico `NG5002`. Es crucial mantener la secuencia sin comentarios intermedios.
- Integración de Signals reactivas (`paths`, `currentPath`, `isLoading`, `error`) con `computed` en `PathsService`, proporcionando un manejo de estado limpio y reactivo sin necesidad de boilerplate adicional.

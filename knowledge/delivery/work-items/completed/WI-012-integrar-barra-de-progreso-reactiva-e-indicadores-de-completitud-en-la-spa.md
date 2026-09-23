---
type: feature
id: WI-012
title: Integrar barra de progreso reactiva e indicadores de completitud en la SPA
knowledge_level: K2
status: completed
phase: completed
initiative: Seguimiento de Progreso y Métricas de Completitud
domains:
  - Seguimiento de Aprendizaje (Learning Tracking)
code:
  - frontend/src/app/features/progress/**
  - frontend/src/app/features/paths/components/**
  - frontend/src/app/features/paths/paths.component.ts
  - frontend/src/app/features/paths/paths.component.spec.ts
created_at: 2026-09-18T00:00:00.000Z
completed_at: '2026-09-22'
source: roadmap
source_id: WI-012
source_initiative: RM-006
source_roadmap_initiative: RM-006
source_work_item_candidate: WI-012
source_title: Integrar barra de progreso reactiva e indicadores de completitud en la SPA
source_context: Materialized from roadmap candidate WI-012 under initiative RM-006.
source_initiative_title: Seguimiento de Progreso y Métricas de Completitud
related_domain: Seguimiento de Aprendizaje (Learning Tracking)
related_capabilities:
  - Seguimiento de Progreso y Métricas de Completitud
expected_value: >-
  Interfaz visual con progreso porcentual dinámico y checkboxes de curso
  completado.
risks:
  - Latencia perceptible si no se utiliza actualización optimista en la UI.
dependencies: []
summary: Integrar barra de progreso reactiva e indicadores de completitud en la SPA
ready_at: '2026-09-23'
---

# Integrar barra de progreso reactiva e indicadores de completitud en la SPA

> Type: feature · Level: K2

## Source

- Source: roadmap
- Roadmap Initiative: RM-006 — Seguimiento de Progreso y Métricas de Completitud
- Work Item Candidate: WI-012
- Related domain: Seguimiento de Aprendizaje (Learning Tracking)
- Related capabilities:
  - Seguimiento de Progreso y Métricas de Completitud

**Actor and outcome:**
El usuario o desarrollador interactúa con el sistema para lograr: Interfaz visual con progreso porcentual dinámico y checkboxes de curso completado.

**Current behavior:**
El estudiante no tiene controles visuales para marcar cursos completados ni ve una barra de progreso que refleje su avance.

**Target behavior:**
Checkbox interactivo en cada tarjeta de curso, barra de progreso global con animación de porcentaje y badge de Completado al alcanzar el 100%.

**Problem:**
El estudiante no tiene controles visuales para marcar cursos completados ni ve una barra de progreso que refleje su avance.

**Expected result:**
Interfaz visual con progreso porcentual dinámico y checkboxes de curso completado.

**Suggested Knowledge Level:** K2

## Acceptance Criteria

- [x] AC-1: Checkbox o botón toggle de completado en cada nodo del roadmap.
- [x] AC-2: Actualización reactiva de la barra de progreso general usando Signals de Angular.
- [x] AC-3: Retroalimentación visual inmediata con indicador de completado.
- [x] AC-4: Mensaje de felicitaciones al completar el 100% de la ruta.

## Out of scope

- Funcionalidades fuera del MVP del hackathon o no contempladas en esta unidad de trabajo.

## Validation

1. Marcar un curso en la interfaz y comprobar que la barra de progreso aumente de inmediato.
2. Recargar la página y verificar que el estado de completitud persista correctamente.
3. Ejecutar `kaddo guard` para verificar consistencia.

## Definition of Done

- [x] Problem is clear.
- [x] Expected result is defined.
- [x] Impact of not doing it is stated.
- [x] Acceptance criteria are verifiable.
- [x] Concrete validation steps are documented.

## Open Questions

- Ninguna pregunta bloqueante para este work item.

**Suggested ownership (code globs):**
  - "frontend/src/app/features/progress/**"
  - "frontend/src/app/features/paths/components/**"

**Related domain / capability:**
- Related domain: Seguimiento de Aprendizaje (Learning Tracking)
- Related capabilities: Seguimiento de Progreso y Métricas de Completitud

## Learning

- La implementación de actualización optimista en `ProgressService` (`completedCourseIds` y `metricsByPath`) elimina por completo la latencia percibida al interactuar con el botón de completar, asegurando una experiencia de usuario inmediata y fluida con reversión automática en caso de error de red.
- Los Signals de Angular permitieron coordinar de forma desacoplada y reactiva múltiples componentes visuales (`CourseCardComponent`, `PathRoadmapComponent` y `PathsComponent`) sin necesidad de emitter chains complejos ni gestión de estados pesada.
- La línea de tiempo de cursos se adapta dinámicamente sustituyendo los números de paso `#N` por checkmarks esmeralda e iluminando las rutas de conexión hacia la meta final.
- Se implementó un banner motivacional de celebración al alcanzar el 100% de completitud de la ruta formativa, reconociendo el logro del estudiante con cursos oficiales de DevTalles.

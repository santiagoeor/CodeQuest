---
type: feature
id: WI-012
title: "Integrar barra de progreso reactiva e indicadores de completitud en la SPA"
knowledge_level: K2
status: draft
phase: next
initiative: "Seguimiento de Progreso y Métricas de Completitud"
domains:
  - "Seguimiento de Aprendizaje (Learning Tracking)"
code:
  - "frontend/src/app/features/progress/**"
  - "frontend/src/app/features/paths/components/**"
created_at: 2026-09-18
source: roadmap
source_id: WI-012
source_initiative: RM-006
source_roadmap_initiative: RM-006
source_work_item_candidate: WI-012
source_title: "Integrar barra de progreso reactiva e indicadores de completitud en la SPA"
source_context: "Materialized from roadmap candidate WI-012 under initiative RM-006."
source_initiative_title: "Seguimiento de Progreso y Métricas de Completitud"
related_domain: "Seguimiento de Aprendizaje (Learning Tracking)"
related_capabilities:
  - "Seguimiento de Progreso y Métricas de Completitud"
expected_value: "Interfaz visual con progreso porcentual dinámico y checkboxes de curso completado."
risks:
  - "Latencia perceptible si no se utiliza actualización optimista en la UI."
dependencies: []
summary: "Integrar barra de progreso reactiva e indicadores de completitud en la SPA"
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

- [ ] AC-1: Checkbox o botón toggle de completado en cada nodo del roadmap.
- [ ] AC-2: Actualización reactiva de la barra de progreso general usando Signals de Angular.
- [ ] AC-3: Retroalimentación visual inmediata con indicador de completado.
- [ ] AC-4: Mensaje de felicitaciones al completar el 100% de la ruta.

## Out of scope

- Funcionalidades fuera del MVP del hackathon o no contempladas en esta unidad de trabajo.

## Validation

1. Marcar un curso en la interfaz y comprobar que la barra de progreso aumente de inmediato.
2. Recargar la página y verificar que el estado de completitud persista correctamente.
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
  - "frontend/src/app/features/progress/**"
  - "frontend/src/app/features/paths/components/**"

**Related domain / capability:**
- Related domain: Seguimiento de Aprendizaje (Learning Tracking)
- Related capabilities: Seguimiento de Progreso y Métricas de Completitud

## Learning

_What did we learn from this change? Update after completion._

---
type: feature
id: WI-011
title: "Desarrollar endpoints para registrar el progreso de cursos por usuario"
knowledge_level: K2
status: draft
phase: next
initiative: "Seguimiento de Progreso y Métricas de Completitud"
domains:
  - "Seguimiento de Aprendizaje (Learning Tracking)"
code:
  - "backend/app/Models/CourseProgress.php"
  - "backend/app/Http/Controllers/ProgressController.php"
  - "backend/routes/api.php"
created_at: 2026-09-18
source: roadmap
source_id: WI-011
source_initiative: RM-006
source_roadmap_initiative: RM-006
source_work_item_candidate: WI-011
source_title: "Desarrollar endpoints para registrar el progreso de cursos por usuario"
source_context: "Materialized from roadmap candidate WI-011 under initiative RM-006."
source_initiative_title: "Seguimiento de Progreso y Métricas de Completitud"
related_domain: "Seguimiento de Aprendizaje (Learning Tracking)"
related_capabilities:
  - "Seguimiento de Progreso y Métricas de Completitud"
expected_value: "Endpoint /api/progress para alternar estado de completitud de cursos y recalcular porcentaje."
risks:
  - "Inconsistencia en el cálculo del porcentaje al agregar o quitar cursos de una ruta."
dependencies: []
summary: "Desarrollar endpoints para registrar el progreso de cursos por usuario"
---

# Desarrollar endpoints para registrar el progreso de cursos por usuario

> Type: feature · Level: K2

## Source

- Source: roadmap
- Roadmap Initiative: RM-006 — Seguimiento de Progreso y Métricas de Completitud
- Work Item Candidate: WI-011
- Related domain: Seguimiento de Aprendizaje (Learning Tracking)
- Related capabilities:
  - Seguimiento de Progreso y Métricas de Completitud

**Actor and outcome:**
El usuario o desarrollador interactúa con el sistema para lograr: Endpoint /api/progress para alternar estado de completitud de cursos y recalcular porcentaje.

**Current behavior:**
No existe persistencia en base de datos para almacenar si un usuario ha completado o no un curso específico.

**Target behavior:**
Tabla course_progress y endpoint POST /api/progress/toggle para marcar/desmarcar curso completado, recalculando el porcentaje total de la ruta asociada.

**Problem:**
No existe persistencia en base de datos para almacenar si un usuario ha completado o no un curso específico.

**Expected result:**
Endpoint /api/progress para alternar estado de completitud de cursos y recalcular porcentaje.

**Suggested Knowledge Level:** K2

## Acceptance Criteria

- [ ] AC-1: Migración y modelo CourseProgress (user_id, course_id, is_completed, completed_at).
- [ ] AC-2: Endpoint POST /api/progress/toggle recibiendo course_id y learning_path_id.
- [ ] AC-3: Respuesta con el nuevo estado del curso y el porcentaje de completitud actualizado de la ruta.
- [ ] AC-4: Middleware auth:sanctum asegurando que cada usuario solo modifique su propio progreso.

## Out of scope

- Funcionalidades fuera del MVP del hackathon o no contempladas en esta unidad de trabajo.

## Validation

1. Consumir POST /api/progress/toggle y verificar que el estado cambie a completado.
2. Verificar que el porcentaje devuelto refleje exactamente (completados / total * 100).
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
  - "backend/app/Models/CourseProgress.php"
  - "backend/app/Http/Controllers/ProgressController.php"
  - "backend/routes/api.php"

**Related domain / capability:**
- Related domain: Seguimiento de Aprendizaje (Learning Tracking)
- Related capabilities: Seguimiento de Progreso y Métricas de Completitud

## Learning

_What did we learn from this change? Update after completion._

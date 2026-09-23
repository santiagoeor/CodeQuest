---
type: feature
id: WI-011
title: "Desarrollar endpoints para registrar el progreso de cursos por usuario"
knowledge_level: K2
status: completed
phase: completed
initiative: "Seguimiento de Progreso y Métricas de Completitud"
domains:
  - "Seguimiento de Aprendizaje (Learning Tracking)"
code:
  - "backend/app/Models/CourseProgress.php"
  - "backend/app/Models/User.php"
  - "backend/app/Models/Course.php"
  - "backend/app/Http/Controllers/ProgressController.php"
  - "backend/database/migrations/2026_09_22_000002_create_course_progress_table.php"
  - "backend/routes/api.php"
  - "backend/tests/Feature/ProgressTest.php"
created_at: 2026-09-18
completed_at: 2026-09-22
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

- [x] AC-1: Migración y modelo CourseProgress (user_id, course_id, is_completed, completed_at).
- [x] AC-2: Endpoint POST /api/progress/toggle recibiendo course_id y learning_path_id.
- [x] AC-3: Respuesta con el nuevo estado del curso y el porcentaje de completitud actualizado de la ruta.
- [x] AC-4: Middleware auth:sanctum asegurando que cada usuario solo modifique su propio progreso.

## Out of scope

- Funcionalidades fuera del MVP del hackathon o no contempladas en esta unidad de trabajo.

## Validation

1. Consumir POST /api/progress/toggle y verificar que el estado cambie a completado.
2. Verificar que el porcentaje devuelto refleje exactamente (completados / total * 100).
3. Verificar que al desmarcar un curso el porcentaje y estado reviertan correctamente.
4. Ejecutar suite de pruebas feature `ProgressTest` (8 pruebas pasando).
5. Ejecutar `kaddo guard` para verificar consistencia.

## Definition of Done

- [x] Problem is clear.
- [x] Expected result is defined.
- [x] Impact of not doing it is stated.
- [x] Acceptance criteria are verifiable.
- [x] Concrete validation steps are documented.

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

- La separación entre el progreso global por curso (`course_progress`) y la pertenencia a una ruta (`learning_path_course`) permite que un curso completado por un usuario se refleje automáticamente en cualquier itinerario formativo que lo contenga, sin duplicar registros de completitud.
- Se implementó sincronización bidireccional en el endpoint `POST /api/progress/toggle`: actualiza la tabla pivote de la ruta (`learning_path_course.status`) y recalcula el porcentaje exacto de completitud en una sola transacción atómica (`DB::transaction`).
- Se introdujo actualización dinámica del estado global de la ruta: cuando el progreso alcanza el 100% (`completed_courses_count === total_courses`), el estado de la ruta transiciona automáticamente a `'completed'`. Si se desmarca algún curso, revierte a `'active'`.
- El endpoint complementario `GET /api/progress` permite tanto consultar el progreso global del usuario como filtrar métricas específicas pasando `?learning_path_id={id}` para la futura vista de la SPA (WI-012).
- Se agregaron 8 pruebas automatizadas de integración en `backend/tests/Feature/ProgressTest.php` cubriendo validaciones, cálculo exacto de porcentajes, aislamiento multi-usuario y protección Sanctum (401/404/422).

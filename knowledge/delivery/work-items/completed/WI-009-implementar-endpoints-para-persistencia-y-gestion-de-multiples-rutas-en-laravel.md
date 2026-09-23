---
type: feature
id: WI-009
title: "Implementar endpoints para persistencia y gestión de múltiples rutas en Laravel"
knowledge_level: K2
status: completed
phase: completed
initiative: "Gestión, Persistencia y Visualización de Rutas"
domains:
  - "Gestión de Rutas (Path Management)"
code:
  - "backend/app/Models/LearningPath.php"
  - "backend/app/Models/LearningPathCourse.php"
  - "backend/app/Models/User.php"
  - "backend/app/Models/Course.php"
  - "backend/app/Http/Controllers/LearningPathController.php"
  - "backend/database/migrations/2026_09_22_000001_create_learning_paths_tables.php"
  - "backend/routes/api.php"
  - "backend/tests/Feature/LearningPathTest.php"
created_at: 2026-09-18
completed_at: 2026-09-22
source: roadmap
source_id: WI-009
source_initiative: RM-005
source_roadmap_initiative: RM-005
source_work_item_candidate: WI-009
source_title: "Implementar endpoints para persistencia y gestión de múltiples rutas en Laravel"
source_context: "Materialized from roadmap candidate WI-009 under initiative RM-005."
source_initiative_title: "Gestión, Persistencia y Visualización de Rutas"
related_domain: "Gestión de Rutas (Path Management)"
related_capabilities:
  - "Gestión y Persistencia de Múltiples Rutas por Usuario"
expected_value: "Endpoints REST bajo /api/learning-paths para guardar, listar, consultar detalle y eliminar rutas."
risks:
  - "Pérdida de integridad referencial al eliminar una ruta activa."
dependencies: []
summary: "Implementar endpoints para persistencia y gestión de múltiples rutas en Laravel"
---

# Implementar endpoints para persistencia y gestión de múltiples rutas en Laravel

> Type: feature · Level: K2

## Source

- Source: roadmap
- Roadmap Initiative: RM-005 — Gestión, Persistencia y Visualización de Rutas
- Work Item Candidate: WI-009
- Related domain: Gestión de Rutas (Path Management)
- Related capabilities:
  - Gestión y Persistencia de Múltiples Rutas por Usuario

**Actor and outcome:**
El usuario o desarrollador interactúa con el sistema para lograr: Endpoints REST bajo /api/learning-paths para guardar, listar, consultar detalle y eliminar rutas.

**Current behavior:**
Los usuarios autenticados no pueden guardar las rutas generadas para consultarlas en futuras sesiones.

**Target behavior:**
CRUD completo de rutas de aprendizaje: POST para guardar ruta, GET para listar rutas del usuario, GET para detalle de ruta con sus cursos ordenados y DELETE para descartar.

**Problem:**
Los usuarios autenticados no pueden guardar las rutas generadas para consultarlas en futuras sesiones.

**Expected result:**
Endpoints REST bajo /api/learning-paths para guardar, listar, consultar detalle y eliminar rutas.

**Suggested Knowledge Level:** K2

## Acceptance Criteria

- [x] AC-1: Migración y modelos LearningPath y LearningPathCourse con relación pivote de orden.
- [x] AC-2: Endpoint POST /api/learning-paths para persistir ruta asignada al auth()->user().
- [x] AC-3: Endpoint GET /api/learning-paths que lista los itinerarios del usuario autenticado.
- [x] AC-4: Endpoint GET /api/learning-paths/{id} con cursos, descripciones y enlaces.
- [x] AC-5: Endpoint DELETE /api/learning-paths/{id} protegido para que el usuario solo elimine sus propias rutas.

## Out of scope

- Funcionalidades fuera del MVP del hackathon o no contempladas en esta unidad de trabajo.

## Validation

1. Realizar POST con token de usuario y guardar una nueva ruta.
2. Consultar GET /api/learning-paths y verificar que solo aparezcan las rutas del usuario autenticado.
3. Consultar detalle y verificar orden secuencial de cursos.
4. Ejecutar suite de pruebas feature `LearningPathTest` (9 pruebas pasando).
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
  - "backend/app/Models/LearningPath.php"
  - "backend/app/Models/LearningPathCourse.php"
  - "backend/app/Http/Controllers/LearningPathController.php"
  - "backend/routes/api.php"

**Related domain / capability:**
- Related domain: Gestión de Rutas (Path Management)
- Related capabilities: Gestión y Persistencia de Múltiples Rutas por Usuario

## Learning

- Se estructuró la persistencia de itinerarios mediante la tabla `learning_paths` y la tabla pivote `learning_path_course` con orden (`order`) y estado individual por curso (`status`), permitiendo un seguimiento granular del progreso.
- El controlador `LearningPathController` maneja transacciones atómicas (`DB::transaction`) para asegurar consistencia al asociar múltiples cursos a la ruta, y admite tanto arreglos de IDs de curso simples (`course_ids: [1, 2]`) como estructuras enriquecidas (`courses: [{ course_id: 1, order: 1 }]`).
- La seguridad a nivel de datos aísla estrictamente las rutas por usuario: las operaciones de detalle (`show`) y eliminación (`destroy`) retornan 404 para rutas que no pertenecen al usuario autenticado, previniendo fuga de información o accesos no autorizados.
- Se implementaron 9 pruebas de integración en `backend/tests/Feature/LearningPathTest.php` validando autenticación Sanctum (401), aislamiento de datos entre usuarios, persistencia en orden secuencial y eliminación en cascada de pivotes.

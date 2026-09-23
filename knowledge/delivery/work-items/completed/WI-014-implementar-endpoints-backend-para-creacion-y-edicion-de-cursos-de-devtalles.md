---
type: feature
id: WI-014
title: "Implementar endpoints backend para creación y edición de cursos de DevTalles"
knowledge_level: K2
status: completed
phase: completed
initiative: "Administración del Catálogo de Cursos y Resiliencia de Autenticación"
domains:
  - "Catálogo Académico (Course Catalog)"
code:
  - "backend/app/Http/Controllers/CourseController.php"
  - "backend/app/Http/Requests/StoreCourseRequest.php"
  - "backend/app/Http/Requests/UpdateCourseRequest.php"
  - "backend/routes/api.php"
  - "backend/app/Models/Course.php"
  - "backend/tests/Feature/CourseAdminTest.php"
created_at: 2026-09-22
completed_at: 2026-09-22
source: roadmap
source_id: WI-014
source_initiative: RM-007
source_roadmap_initiative: RM-007
source_work_item_candidate: WI-014
source_title: "Implementar endpoints backend para creación y edición de cursos de DevTalles"
source_context: "Materialized from roadmap candidate WI-014 under initiative RM-007."
source_initiative_title: "Administración del Catálogo de Cursos y Resiliencia de Autenticación"
related_domain: "Catálogo Académico (Course Catalog)"
related_capabilities:
  - "Catálogo Estructurado de Cursos DevTalles"
expected_value: "Endpoints REST `POST /api/courses` y `PUT /api/courses/{id}` protegidos con validación de requests, asignación de tags y actualización en MySQL."
risks:
  - "Inyección de datos inconsistentes en los niveles o slugs duplicados en la base de datos."
dependencies: []
summary: "Implementar endpoints backend para creación y edición de cursos de DevTalles"
---

# Implementar endpoints backend para creación y edición de cursos de DevTalles

> Type: feature · Level: K2

## Source

- Source: roadmap
- Roadmap Initiative: RM-007 — Administración del Catálogo de Cursos y Resiliencia de Autenticación
- Work Item Candidate: WI-014
- Related domain: Catálogo Académico (Course Catalog)
- Related capabilities:
  - Catálogo Estructurado de Cursos DevTalles

**Actor and outcome:**
El usuario o desarrollador interactúa con el sistema para lograr: Endpoints REST `POST /api/courses` y `PUT /api/courses/{id}` protegidos con validación de requests, asignación de tags y actualización en MySQL.

**Current behavior:**
El catálogo de cursos únicamente cuenta con endpoints de lectura (`GET /api/courses`), lo que imposibilita crear nuevos cursos o editar los existentes desde el backend de forma programática o administrativa.

**Target behavior:**
Endpoints RESTful protegidos: `POST /api/courses` (crear curso y asociar tags) y `PUT /api/courses/{id}` (actualizar curso y sincronizar tags) con validaciones de Request (Form Requests de Laravel) y respuestas JSON estructuradas.

**Problem:**
El catálogo de cursos únicamente cuenta con endpoints de lectura (`GET /api/courses`), lo que imposibilita crear nuevos cursos o editar los existentes desde el backend de forma programática o administrativa.

**Expected result:**
Endpoints REST `POST /api/courses` y `PUT /api/courses/{id}` protegidos con validación de requests, asignación de tags y actualización en MySQL.

**Suggested Knowledge Level:** K2

## Acceptance Criteria

- [x] AC-1: Endpoint `POST /api/courses` protegido por `auth:sanctum` que valida y persiste nuevos cursos con sus tags.
- [x] AC-2: Endpoint `PUT /api/courses/{id}` protegido por `auth:sanctum` para editar campos de curso y sincronizar tags.
- [x] AC-3: Form Requests de Laravel (`StoreCourseRequest`, `UpdateCourseRequest`) con validaciones de campos obligatorios (title, slug único, description, level: beginner/intermediate/advanced, url, duration).
- [x] AC-4: Manejo adecuado de tags existentes o nuevos mediante relación Many-to-Many `course_tag`.

## Out of scope

- Funcionalidades fuera del MVP del hackathon o no contempladas en esta unidad de trabajo.

## Validation

1. Realizar POST a `/api/courses` con payload de prueba y token Bearer, verificando creación con código 201.
2. Realizar PUT a `/api/courses/{id}` y verificar persistencia de cambios en la base de datos MySQL.
3. Intentar crear curso con datos inválidos y validar que devuelva HTTP 422 con errores detallados.
4. Ejecutar suite de pruebas feature `CourseAdminTest` (10 pruebas pasando).
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
  - "backend/app/Http/Controllers/CourseController.php"
  - "backend/app/Http/Requests/**"
  - "backend/routes/api.php"
  - "backend/app/Models/Course.php"

**Related domain / capability:**
- Related domain: Catálogo Académico (Course Catalog)
- Related capabilities: Catálogo Estructurado de Cursos DevTalles

## Learning

- Se estructuró `CourseController` centralizando tanto las rutas de lectura pública (`index`, `show` admitiendo slug y numeric ID) como las operaciones administrativas de mutación (`store`, `update`) protegidas bajo Sanctum.
- Se implementaron Form Requests dedicados (`StoreCourseRequest`, `UpdateCourseRequest`) con normalización automática de slug derivado del título cuando este se omite y regla de unicidad ignorando el ID del propio curso durante actualizaciones.
- Se diseñó el método de resolución `resolveTagIds` que admite un arreglo heterogéneo de identificadores numéricos, nombres o slugs de tags, creando sobre la marcha aquellos que no existan previamente y sincronizándolos de forma atómica en la tabla pivote `course_tag`.
- Se añadieron 10 pruebas automatizadas en `backend/tests/Feature/CourseAdminTest.php` validando autenticación 401, códigos 201 y 200, validaciones 422 y sincronización de etiquetas, manteniendo 48/48 tests globales en verde.

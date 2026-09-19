---
type: chore
id: WI-003
title: "Modelar base de datos y crear migraciones y seeders para cursos de DevTalles"
knowledge_level: K2
status: completed
phase: now
initiative: "Catálogo Académico de DevTalles y Banco de Evaluación"
domains:
  - "Catálogo Académico (Course Catalog)"
code:
  - "backend/database/migrations/**"
  - "backend/database/seeders/**"
  - "backend/app/Models/Course.php"
  - "backend/app/Models/Tag.php"
  - "backend/routes/api.php"
created_at: 2026-09-18
source: roadmap
source_id: WI-003
source_initiative: RM-002
source_roadmap_initiative: RM-002
source_work_item_candidate: WI-003
source_title: "Modelar base de datos y crear migraciones y seeders para cursos de DevTalles"
source_context: "Materialized from roadmap candidate WI-003 under initiative RM-002."
source_initiative_title: "Catálogo Académico de DevTalles y Banco de Evaluación"
related_domain: "Catálogo Académico (Course Catalog)"
related_capabilities:
  - "Catálogo Estructurado de Cursos DevTalles"
expected_value: "Tablas de cursos y etiquetas con seeders completos basados en el catálogo oficial de DevTalles."
risks:
  - "Metadatos incompletos en la definición inicial de cursos."
dependencies: []
summary: "Modelar base de datos y crear migraciones y seeders para cursos de DevTalles"
ready_at: '2026-09-19'
---

# Modelar base de datos y crear migraciones y seeders para cursos de DevTalles

> Type: chore · Level: K2

## Source

- Source: roadmap
- Roadmap Initiative: RM-002 — Catálogo Académico de DevTalles y Banco de Evaluación
- Work Item Candidate: WI-003
- Related domain: Catálogo Académico (Course Catalog)
- Related capabilities:
  - Catálogo Estructurado de Cursos DevTalles

**Actor and outcome:**
El usuario o desarrollador interactúa con el sistema para lograr: Tablas de cursos y etiquetas con seeders completos basados en el catálogo oficial de DevTalles.

**Current behavior:**
No existían las tablas ni los registros iniciales de los cursos de DevTalles en la base de datos relacional.

**Target behavior:**
Migraciones y seeders en Laravel que crean las tablas courses, tags y cargan el catálogo representativo de cursos con URLs oficiales.

**Problem:**
No existían las tablas ni los registros iniciales de los cursos de DevTalles en la base de datos relacional.

**Expected result:**
Tablas de cursos y etiquetas con seeders completos basados en el catálogo oficial de DevTalles.

**Suggested Knowledge Level:** K2

## Acceptance Criteria

- [x] AC-1: Migración de tabla courses con columnas: id, title, slug, description, level, url, duration, image_url, timestamps.
- [x] AC-2: Tabla pivote o relación de etiquetas/tecnologías asociadas a cada curso.
- [x] AC-3: Seeder CourseSeeder con al menos 15-20 cursos reales del ecosistema DevTalles.
- [x] AC-4: Comando php artisan migrate --seed ejecuta sin errores.

## Out of scope

- Funcionalidades fuera del MVP del hackathon o no contempladas en esta unidad de trabajo.

## Validation

1. Ejecutar `docker compose exec backend php artisan migrate:fresh --seed`.
2. Verificar en base de datos que la tabla courses contiene los registros esperados (`curl http://localhost:8000/api/courses`).
3. Ejecutar pruebas automatizadas: `docker compose exec backend php artisan test`.

## Definition of Done

- [x] Problem is clear.
- [x] Expected result is defined.
- [x] Impact of not doing it is stated.
- [x] Acceptance criteria are verifiable.
- [x] Concrete validation steps are documented.

## Open Questions

- Ninguna pregunta bloqueante para este work item.

**Suggested ownership (code globs):**
  - "backend/database/migrations/**"
  - "backend/database/seeders/**"
  - "backend/app/Models/Course.php"
  - "backend/app/Models/Tag.php"
  - "backend/routes/api.php"

**Related domain / capability:**
- Related domain: Catálogo Académico (Course Catalog)
- Related capabilities: Catálogo Estructurado de Cursos DevTalles

## Learning

Se completó la instalación y configuración completa de Laravel 12 en el backend con PHP 8.2 y MySQL 8.0 sobre Docker. Se modelaron las entidades `Course` y `Tag` con relación muchos-a-muchos a través de la tabla pivote `course_tag`. Se implementó `CourseSeeder` con 20 cursos reales representativos del catálogo de DevTalles (cubriendo Frontend, Backend, Mobile, DevOps, Arquitectura y Base de Datos) con sus tags categorizados, y se expusieron los endpoints `GET /api/courses` y `GET /api/courses/{slug}` acompañados de pruebas automatizadas con PHPUnit/Pest.

---
type: feature
id: WI-004
title: "Diseñar estructura y exponer endpoint del cuestionario de habilidades e intereses"
knowledge_level: K2
status: draft
phase: next
initiative: "Catálogo Académico de DevTalles y Banco de Evaluación"
domains:
  - "Catálogo Académico (Course Catalog)"
code:
  - "backend/app/Http/Controllers/AssessmentController.php"
  - "backend/routes/api.php"
  - "backend/database/seeders/QuestionnaireSeeder.php"
created_at: 2026-09-18
source: roadmap
source_id: WI-004
source_initiative: RM-002
source_roadmap_initiative: RM-002
source_work_item_candidate: WI-004
source_title: "Diseñar estructura y exponer endpoint del cuestionario de habilidades e intereses"
source_context: "Materialized from roadmap candidate WI-004 under initiative RM-002."
source_initiative_title: "Catálogo Académico de DevTalles y Banco de Evaluación"
related_domain: "Catálogo Académico (Course Catalog)"
related_capabilities:
  - "Cuestionario Interactivo de Diagnóstico y Metas"
expected_value: "Endpoint /api/assessment/questions que proporciona las preguntas y opciones de diagnóstico."
risks:
  - "Respuestas ambiguas que dificulten la posterior recomendación."
dependencies: []
summary: "Diseñar estructura y exponer endpoint del cuestionario de habilidades e intereses"
---

# Diseñar estructura y exponer endpoint del cuestionario de habilidades e intereses

> Type: feature · Level: K2

## Source

- Source: roadmap
- Roadmap Initiative: RM-002 — Catálogo Académico de DevTalles y Banco de Evaluación
- Work Item Candidate: WI-004
- Related domain: Catálogo Académico (Course Catalog)
- Related capabilities:
  - Cuestionario Interactivo de Diagnóstico y Metas

**Actor and outcome:**
El usuario o desarrollador interactúa con el sistema para lograr: Endpoint /api/assessment/questions que proporciona las preguntas y opciones de diagnóstico.

**Current behavior:**
El cliente frontend no cuenta con un endpoint para obtener dinámicamente las preguntas y opciones del diagnóstico de habilidades.

**Target behavior:**
Endpoint GET /api/assessment/questions que retorna el árbol estructurado de preguntas, categorías (Frontend, Backend, DevOps, Fullstack) y niveles técnicos.

**Problem:**
El cliente frontend no cuenta con un endpoint para obtener dinámicamente las preguntas y opciones del diagnóstico de habilidades.

**Expected result:**
Endpoint /api/assessment/questions que proporciona las preguntas y opciones de diagnóstico.

**Suggested Knowledge Level:** K2

## Acceptance Criteria

- [ ] AC-1: Modelo y seeder para preguntas y opciones de diagnóstico.
- [ ] AC-2: Controlador AssessmentController con método index.
- [ ] AC-3: Ruta pública GET /api/assessment/questions retornando JSON estandarizado.
- [ ] AC-4: Respuesta HTTP 200 con listado ordenado de preguntas.

## Out of scope

- Funcionalidades fuera del MVP del hackathon o no contempladas en esta unidad de trabajo.

## Validation

1. Ejecutar `curl -s http://localhost:8000/api/assessment/questions` y validar estructura JSON.
2. Verificar que las opciones contengan identificadores y ponderaciones técnicas.
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
  - "backend/app/Http/Controllers/AssessmentController.php"
  - "backend/routes/api.php"
  - "backend/database/seeders/QuestionnaireSeeder.php"

**Related domain / capability:**
- Related domain: Catálogo Académico (Course Catalog)
- Related capabilities: Cuestionario Interactivo de Diagnóstico y Metas

## Learning

_What did we learn from this change? Update after completion._

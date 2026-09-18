---
type: feature
id: WI-008
title: "Construir interfaz paso a paso del cuestionario diagnóstico en Angular"
knowledge_level: K2
status: draft
phase: next
initiative: "Motor de Recomendación y Generación de Rutas"
domains:
  - "Motor de Recomendación (Recommendation Engine)"
code:
  - "frontend/src/app/features/assessment/**"
created_at: 2026-09-18
source: roadmap
source_id: WI-008
source_initiative: RM-004
source_roadmap_initiative: RM-004
source_work_item_candidate: WI-008
source_title: "Construir interfaz paso a paso del cuestionario diagnóstico en Angular"
source_context: "Materialized from roadmap candidate WI-008 under initiative RM-004."
source_initiative_title: "Motor de Recomendación y Generación de Rutas"
related_domain: "Motor de Recomendación (Recommendation Engine)"
related_capabilities:
  - "Cuestionario Interactivo de Diagnóstico y Metas"
expected_value: "Componente wizard interactivo, intuitivo y responsive para completar el cuestionario."
risks:
  - "Abandono del usuario si el cuestionario es confuso o demasiado largo."
dependencies: []
summary: "Construir interfaz paso a paso del cuestionario diagnóstico en Angular"
---

# Construir interfaz paso a paso del cuestionario diagnóstico en Angular

> Type: feature · Level: K2

## Source

- Source: roadmap
- Roadmap Initiative: RM-004 — Motor de Recomendación y Generación de Rutas
- Work Item Candidate: WI-008
- Related domain: Motor de Recomendación (Recommendation Engine)
- Related capabilities:
  - Cuestionario Interactivo de Diagnóstico y Metas

**Actor and outcome:**
El usuario o desarrollador interactúa con el sistema para lograr: Componente wizard interactivo, intuitivo y responsive para completar el cuestionario.

**Current behavior:**
Los estudiantes no disponen de una interfaz interactiva para responder las preguntas de diagnóstico y solicitar su ruta.

**Target behavior:**
Componente wizard tipo paso a paso (AssessmentComponent) que guía al estudiante, muestra barra de progreso y envía las respuestas al backend.

**Problem:**
Los estudiantes no disponen de una interfaz interactiva para responder las preguntas de diagnóstico y solicitar su ruta.

**Expected result:**
Componente wizard interactivo, intuitivo y responsive para completar el cuestionario.

**Suggested Knowledge Level:** K2

## Acceptance Criteria

- [ ] AC-1: Consumo del endpoint /api/assessment/questions para renderizar dinámicamente las preguntas.
- [ ] AC-2: Control de navegación entre pasos con validación de selección requerida.
- [ ] AC-3: Indicador visual de progreso del cuestionario.
- [ ] AC-4: Envío de respuestas a /api/recommendations/generate y redirección a la vista de resultados.

## Out of scope

- Funcionalidades fuera del MVP del hackathon o no contempladas en esta unidad de trabajo.

## Validation

1. Completar el cuestionario paso a paso en el navegador.
2. Verificar que al finalizar se invoque el servicio de recomendación y se reciban los cursos generados.
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
  - "frontend/src/app/features/assessment/**"

**Related domain / capability:**
- Related domain: Motor de Recomendación (Recommendation Engine)
- Related capabilities: Cuestionario Interactivo de Diagnóstico y Metas

## Learning

_What did we learn from this change? Update after completion._

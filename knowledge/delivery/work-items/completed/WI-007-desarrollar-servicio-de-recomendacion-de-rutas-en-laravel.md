---
type: feature
id: WI-007
title: "Desarrollar servicio de recomendación de rutas en Laravel"
knowledge_level: K3
status: completed
phase: completed
initiative: "Motor de Recomendación y Generación de Rutas"
domains:
  - "Motor de Recomendación (Recommendation Engine)"
code:
  - "backend/app/Services/LearningPathGeneratorService.php"
  - "backend/app/Http/Controllers/LearningPathController.php"
  - "backend/routes/api.php"
  - "backend/tests/Unit/LearningPathGeneratorServiceTest.php"
  - "backend/tests/Feature/RecommendationTest.php"
  - "knowledge/tech/decisions/ADR-002-dc-002-algoritmo-determinista-de-recomendacion-en-backend.md"
created_at: 2026-09-18
completed_at: 2026-09-20
source: roadmap
source_id: WI-007
source_initiative: RM-004
source_roadmap_initiative: RM-004
source_work_item_candidate: WI-007
source_title: "Desarrollar servicio de recomendación de rutas en Laravel"
source_context: "Materialized from roadmap candidate WI-007 under initiative RM-004."
source_initiative_title: "Motor de Recomendación y Generación de Rutas"
related_domain: "Motor de Recomendación (Recommendation Engine)"
related_capabilities:
  - "Motor de Generación y Recomendación de Rutas de Aprendizaje"
decisions:
  - ADR-002
expected_value: "LearningPathGeneratorService que filtra y ordena cursos en base a respuestas, tags y nivel técnico."
risks:
  - "Rutas vacías para combinaciones atípicas de respuestas."
dependencies: []
summary: "Desarrollar servicio de recomendación de rutas en Laravel"
---

# Desarrollar servicio de recomendación de rutas en Laravel

> Type: feature · Level: K3

## Source

- Source: roadmap
- Roadmap Initiative: RM-004 — Motor de Recomendación y Generación de Rutas
- Work Item Candidate: WI-007
- Related domain: Motor de Recomendación (Recommendation Engine)
- Related capabilities:
  - Motor de Generación y Recomendación de Rutas de Aprendizaje

**Actor and outcome:**
El usuario o desarrollador interactúa con el sistema para lograr: LearningPathGeneratorService que filtra y ordena cursos en base a respuestas, tags y nivel técnico.

**Current behavior:**
El sistema no cuenta con la lógica de negocio para transformar las respuestas del cuestionario en un itinerario ordenado de cursos.

**Target behavior:**
Servicio determinista LearningPathGeneratorService que pondera tags de especialidad y nivel del usuario para devolver una secuencia lógica de cursos de DevTalles.

**Problem:**
El sistema no cuenta con la lógica de negocio para transformar las respuestas del cuestionario en un itinerario ordenado de cursos.

**Expected result:**
LearningPathGeneratorService que filtra y ordena cursos en base a respuestas, tags y nivel técnico.

**Suggested Knowledge Level:** K3

## Acceptance Criteria

- [x] AC-1: Servicio LearningPathGeneratorService implementado con algoritmo de filtrado y ordenamiento por prerrequisitos.
- [x] AC-2: Endpoint POST /api/recommendations/generate que recibe respuestas del diagnóstico.
- [x] AC-3: Respuesta con la lista ordenada de cursos, título sugerido para la ruta y justificación pedagógica.
- [x] AC-4: Tiempo de respuesta menor a 300ms sin dependencias de APIs externas.

## Out of scope

- Funcionalidades fuera del MVP del hackathon o no contempladas en esta unidad de trabajo.

## Validation

1. Ejecutar pruebas unitarias de LearningPathGeneratorService con diferentes perfiles.
2. Validar que el orden respete la progresión de básico a intermedio/avanzado.
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
  - "backend/app/Services/LearningPathGeneratorService.php"
  - "backend/app/Http/Controllers/LearningPathController.php"

**Related domain / capability:**
- Related domain: Motor de Recomendación (Recommendation Engine)
- Related capabilities: Motor de Generación y Recomendación de Rutas de Aprendizaje

## Learning

- El enfoque determinista (formalizado en ADR-002) permite generar itinerarios formativos coherentes con tiempos de respuesta en torno a 30ms, eliminando costos y latencia de inferencia de LLMs en tiempo real.
- La combinación de pesos directos por tag de las opciones con modificadores de nivel (`beginner`: +15 para cursos básicos, penalización en avanzados) y reglas de precedencia conceptual (lenguajes base antes de frameworks) asegura un orden pedagógico óptimo.
- Se implementaron 3 tests unitarios y 4 tests de integración cubriendo validación de payloads, cálculo de tiempos y perfiles múltiples.

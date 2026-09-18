---
type: feature
id: WI-010
title: "Crear vista interactiva de Roadmap y tarjetas de cursos en Angular"
knowledge_level: K2
status: draft
phase: next
initiative: "Gestión, Persistencia y Visualización de Rutas"
domains:
  - "Gestión de Rutas (Path Management)"
code:
  - "frontend/src/app/features/paths/**"
created_at: 2026-09-18
source: roadmap
source_id: WI-010
source_initiative: RM-005
source_roadmap_initiative: RM-005
source_work_item_candidate: WI-010
source_title: "Crear vista interactiva de Roadmap y tarjetas de cursos en Angular"
source_context: "Materialized from roadmap candidate WI-010 under initiative RM-005."
source_initiative_title: "Gestión, Persistencia y Visualización de Rutas"
related_domain: "Gestión de Rutas (Path Management)"
related_capabilities:
  - "Visualización Interactiva de Ruta (Roadmap View)"
expected_value: "Componente visual de ruta tipo itinerario con enlaces hacia los cursos en DevTalles."
risks:
  - "Rompimiento visual en pantallas pequeñas de smartphones."
dependencies: []
summary: "Crear vista interactiva de Roadmap y tarjetas de cursos en Angular"
---

# Crear vista interactiva de Roadmap y tarjetas de cursos en Angular

> Type: feature · Level: K2

## Source

- Source: roadmap
- Roadmap Initiative: RM-005 — Gestión, Persistencia y Visualización de Rutas
- Work Item Candidate: WI-010
- Related domain: Gestión de Rutas (Path Management)
- Related capabilities:
  - Visualización Interactiva de Ruta (Roadmap View)

**Actor and outcome:**
El usuario o desarrollador interactúa con el sistema para lograr: Componente visual de ruta tipo itinerario con enlaces hacia los cursos en DevTalles.

**Current behavior:**
El usuario no cuenta con una visualización gráfica de su ruta de aprendizaje que le permita identificar la secuencia y acceder a los cursos.

**Target behavior:**
Componente visual PathRoadmapComponent con diseño de línea de tiempo secuencial, tarjetas de curso y enlaces externos a DevTalles.

**Problem:**
El usuario no cuenta con una visualización gráfica de su ruta de aprendizaje que le permita identificar la secuencia y acceder a los cursos.

**Expected result:**
Componente visual de ruta tipo itinerario con enlaces hacia los cursos en DevTalles.

**Suggested Knowledge Level:** K2

## Acceptance Criteria

- [ ] AC-1: Visualización tipo itinerario secuencial con nodos interconectados.
- [ ] AC-2: Tarjeta de curso con título, nivel, duración estimada, tecnologías y enlace directo a DevTalles.
- [ ] AC-3: Panel de mis rutas guardadas para alternar entre diferentes itinerarios.
- [ ] AC-4: Diseño adaptable y optimizado para navegación en móviles.

## Out of scope

- Funcionalidades fuera del MVP del hackathon o no contempladas en esta unidad de trabajo.

## Validation

1. Abrir una ruta guardada y verificar renderizado de la secuencia de cursos.
2. Probar enlaces externos a DevTalles asegurando apertura en nueva pestaña.
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
  - "frontend/src/app/features/paths/**"

**Related domain / capability:**
- Related domain: Gestión de Rutas (Path Management)
- Related capabilities: Visualización Interactiva de Ruta (Roadmap View)

## Learning

_What did we learn from this change? Update after completion._

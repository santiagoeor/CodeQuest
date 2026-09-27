---
type: feature
id: WI-019
title: "Integrar autollenado interactivo por URL en el formulario de cursos en Angular"
knowledge_level: K2
status: draft
phase: next
initiative: "Extracción de Metadatos y Autollenado de Cursos de DevTalles"
domains:
  - "Catálogo Académico (Course Catalog)"
code:
  - "frontend/src/app/features/courses/**"
  - "frontend/src/app/features/courses/services/**"
created_at: 2026-09-26
source: roadmap
source_id: WI-019
source_initiative: RM-009
source_roadmap_initiative: RM-009
source_work_item_candidate: WI-019
source_title: "Integrar autollenado interactivo por URL en el formulario de cursos en Angular"
source_context: "Materialized from roadmap candidate WI-019 under initiative RM-009."
source_initiative_title: "Extracción de Metadatos y Autollenado de Cursos de DevTalles"
related_domain: "Catálogo Académico (Course Catalog)"
related_capabilities:
  - "Catálogo Estructurado de Cursos DevTalles"
  - "Visualización Interactiva de Ruta (Roadmap View)"
expected_value: "Campo de URL con botón de extracción rápida que puebla los campos del formulario reactivo para posterior confirmación."
risks:
  - "Sobrescritura accidental de campos si el usuario ya había escrito datos personalizados antes de pulsar el botón."
dependencies: []
summary: "Integrar autollenado interactivo por URL en el formulario de cursos en Angular"
---

# Integrar autollenado interactivo por URL en el formulario de cursos en Angular

> Type: feature · Level: K2

## Source

- Source: roadmap
- Roadmap Initiative: RM-009 — Extracción de Metadatos y Autollenado de Cursos de DevTalles
- Work Item Candidate: WI-019
- Related domain: Catálogo Académico (Course Catalog)
- Related capabilities:
  - Catálogo Estructurado de Cursos DevTalles
  - Visualización Interactiva de Ruta (Roadmap View)

**Actor and outcome:**
El usuario o desarrollador interactúa con el sistema para lograr: Campo de URL con botón de extracción rápida que puebla los campos del formulario reactivo para posterior confirmación.

**Current behavior:**
El formulario de creación de cursos carece de una herramienta de autollenado por URL, forzando a rellenar cada campo a mano.

**Target behavior:**
Control interactivo en el formulario que permite ingresar la URL de DevTalles, solicitar los metadatos al backend, prellenar los campos reactivos de forma transparente y permitir al usuario revisarlos antes de presionar 'Guardar Curso'.

**Problem:**
El formulario de creación de cursos carece de una herramienta de autollenado por URL, forzando a rellenar cada campo a mano.

**Expected result:**
Campo de URL con botón de extracción rápida que puebla los campos del formulario reactivo para posterior confirmación.

**Suggested Knowledge Level:** K2

## Acceptance Criteria

- [ ] AC-1: Botón 'Autollenar desde DevTalles' junto al campo de URL con spinner de carga durante la consulta.
- [ ] AC-2: Prellenado automático de título, descripción, duración, imagen y tags en el formulario reactivo (`patchValue`).
- [ ] AC-3: Indicador de confirmación visual informando que los datos fueron cargados y están listos para revisión y confirmación del usuario.
- [ ] AC-4: El guardado final del curso únicamente se ejecuta cuando el usuario presiona el botón 'Guardar Curso' tras revisar la información.

## Out of scope

- Funcionalidades fuera del MVP del hackathon o no contempladas en esta unidad de trabajo.

## Validation

1. Pegar una URL de curso de DevTalles en el formulario y presionar 'Autollenar'.
2. Comprobar que los campos se rellenen automáticamente con los datos extraídos.
3. Editar un campo manualmente y presionar 'Guardar Curso' verificando la persistencia en base de datos.
4. Ejecutar `kaddo guard` para verificar consistencia.

## Definition of Done

- [ ] Problem is clear.
- [ ] Expected result is defined.
- [ ] Impact of not doing it is stated.
- [ ] Acceptance criteria are verifiable.
- [ ] Concrete validation steps are documented.

## Open Questions

- Ninguna pregunta bloqueante para este work item.

**Suggested ownership (code globs):**
  - "frontend/src/app/features/courses/**"
  - "frontend/src/app/features/courses/services/**"

**Related domain / capability:**
- Related domain: Catálogo Académico (Course Catalog)
- Related capabilities: Catálogo Estructurado de Cursos DevTalles, Visualización Interactiva de Ruta (Roadmap View)

## Learning

_What did we learn from this change? Update after completion._

---
type: feature
id: WI-015
title: "Construir interfaz de formulario para agregar y editar cursos en Angular"
knowledge_level: K2
status: draft
phase: next
initiative: "Administración del Catálogo de Cursos y Resiliencia de Autenticación"
domains:
  - "Catálogo Académico (Course Catalog)"
code:
  - "frontend/src/app/features/courses/**"
  - "frontend/src/app/app.routes.ts"
  - "frontend/src/app/shared/components/navbar/navbar.component.ts"
created_at: 2026-09-22
source: roadmap
source_id: WI-015
source_initiative: RM-007
source_roadmap_initiative: RM-007
source_work_item_candidate: WI-015
source_title: "Construir interfaz de formulario para agregar y editar cursos en Angular"
source_context: "Materialized from roadmap candidate WI-015 under initiative RM-007."
source_initiative_title: "Administración del Catálogo de Cursos y Resiliencia de Autenticación"
related_domain: "Catálogo Académico (Course Catalog)"
related_capabilities:
  - "Catálogo Estructurado de Cursos DevTalles"
  - "Visualización Interactiva de Ruta (Roadmap View)"
expected_value: "Vista/modal reactiva con formulario para crear y editar cursos con validación en vivo, gestión de tecnologías y refresco inmediato del catálogo."
risks:
  - "Complejidad de UI en móviles al gestionar selección dinámica de múltiples tecnologías."
dependencies: []
summary: "Construir interfaz de formulario para agregar y editar cursos en Angular"
---

# Construir interfaz de formulario para agregar y editar cursos en Angular

> Type: feature · Level: K2

## Source

- Source: roadmap
- Roadmap Initiative: RM-007 — Administración del Catálogo de Cursos y Resiliencia de Autenticación
- Work Item Candidate: WI-015
- Related domain: Catálogo Académico (Course Catalog)
- Related capabilities:
  - Catálogo Estructurado de Cursos DevTalles
  - Visualización Interactiva de Ruta (Roadmap View)

**Actor and outcome:**
El usuario o desarrollador interactúa con el sistema para lograr: Vista/modal reactiva con formulario para crear y editar cursos con validación en vivo, gestión de tecnologías y refresco inmediato del catálogo.

**Current behavior:**
Los administradores o usuarios autorizados no disponen de una interfaz gráfica en la SPA para dar de alta nuevos cursos de DevTalles o modificar la información de cursos existentes.

**Target behavior:**
Componente interactivo con formulario reactivo de Angular (`ReactiveFormsModule`) que permita crear nuevos cursos y editar los existentes con campos para título, nivel, duración, link a DevTalles, razón pedagógica y selección de tags.

**Problem:**
Los administradores o usuarios autorizados no disponen de una interfaz gráfica en la SPA para dar de alta nuevos cursos de DevTalles o modificar la información de cursos existentes.

**Expected result:**
Vista/modal reactiva con formulario para crear y editar cursos con validación en vivo, gestión de tecnologías y refresco inmediato del catálogo.

**Suggested Knowledge Level:** K2

## Acceptance Criteria

- [ ] AC-1: Formulario reactivo con validaciones de cliente en vivo (campos requeridos, patrón de URL, duración).
- [ ] AC-2: Soporte para modo creación (`Nuevo Curso`) y modo edición (`Editar Curso`) reutilizando la estructura del formulario.
- [ ] AC-3: Selector interactivo de etiquetas tecnológicas (tags) con badges dinámicos.
- [ ] AC-4: Mensajes de éxito/error y actualización reactiva inmediata en la vista del catálogo o rutas.

## Out of scope

- Funcionalidades fuera del MVP del hackathon o no contempladas en esta unidad de trabajo.

## Validation

1. Abrir el formulario, registrar un nuevo curso con tags y validar que aparezca en el catálogo.
2. Editar un curso existente cambiando su duración y título, verificando la actualización inmediata en la UI.
3. Probar validaciones de formulario (campos vacíos, URLs inválidas) asegurando bloqueo del botón de envío.
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
  - "frontend/src/app/app.routes.ts"
  - "frontend/src/app/shared/components/navbar/navbar.component.ts"

**Related domain / capability:**
- Related domain: Catálogo Académico (Course Catalog)
- Related capabilities: Catálogo Estructurado de Cursos DevTalles, Visualización Interactiva de Ruta (Roadmap View)

## Learning

_What did we learn from this change? Update after completion._

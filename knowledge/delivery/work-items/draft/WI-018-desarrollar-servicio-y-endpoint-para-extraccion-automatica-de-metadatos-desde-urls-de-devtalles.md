---
type: feature
id: WI-018
title: "Desarrollar servicio y endpoint para extracción automática de metadatos desde URLs de DevTalles"
knowledge_level: K2
status: draft
phase: next
initiative: "Extracción de Metadatos y Autollenado de Cursos de DevTalles"
domains:
  - "Catálogo Académico (Course Catalog)"
code:
  - "backend/app/Services/CourseMetadataExtractorService.php"
  - "backend/app/Http/Controllers/CourseController.php"
  - "backend/routes/api.php"
created_at: 2026-09-26
source: roadmap
source_id: WI-018
source_initiative: RM-009
source_roadmap_initiative: RM-009
source_work_item_candidate: WI-018
source_title: "Desarrollar servicio y endpoint para extracción automática de metadatos desde URLs de DevTalles"
source_context: "Materialized from roadmap candidate WI-018 under initiative RM-009."
source_initiative_title: "Extracción de Metadatos y Autollenado de Cursos de DevTalles"
related_domain: "Catálogo Académico (Course Catalog)"
related_capabilities:
  - "Catálogo Estructurado de Cursos DevTalles"
expected_value: "Endpoint REST `POST /api/courses/extract-metadata` que parsea Open Graph / metaetiquetas HTML de la URL y devuelve JSON estructurado."
risks:
  - "Respuestas HTTP lentas o cambios estructurales en las páginas de DevTalles."
dependencies: []
summary: "Desarrollar servicio y endpoint para extracción automática de metadatos desde URLs de DevTalles"
---

# Desarrollar servicio y endpoint para extracción automática de metadatos desde URLs de DevTalles

> Type: feature · Level: K2

## Source

- Source: roadmap
- Roadmap Initiative: RM-009 — Extracción de Metadatos y Autollenado de Cursos de DevTalles
- Work Item Candidate: WI-018
- Related domain: Catálogo Académico (Course Catalog)
- Related capabilities:
  - Catálogo Estructurado de Cursos DevTalles

**Actor and outcome:**
El usuario o desarrollador interactúa con el sistema para lograr: Endpoint REST `POST /api/courses/extract-metadata` que parsea Open Graph / metaetiquetas HTML de la URL y devuelve JSON estructurado.

**Current behavior:**
La adición de cursos requiere ingresar manualmente el título, descripción, duración, nivel e imagen, aumentando el esfuerzo del administrador y la probabilidad de errores tipográficos.

**Target behavior:**
Servicio `CourseMetadataExtractorService` y endpoint `POST /api/courses/extract-metadata` que consume la URL de DevTalles, extrae metaetiquetas `og:title`, `og:description`, `og:image`, duración y etiquetas, devolviendo un borrador JSON listo para rellenar el formulario.

**Problem:**
La adición de cursos requiere ingresar manualmente el título, descripción, duración, nivel e imagen, aumentando el esfuerzo del administrador y la probabilidad de errores tipográficos.

**Expected result:**
Endpoint REST `POST /api/courses/extract-metadata` que parsea Open Graph / metaetiquetas HTML de la URL y devuelve JSON estructurado.

**Suggested Knowledge Level:** K2

## Acceptance Criteria

- [ ] AC-1: Endpoint protegido `POST /api/courses/extract-metadata` validando que el campo `url` sea una URL válida y pertenezca al dominio de DevTalles o plataformas asociadas.
- [ ] AC-2: Extracción robusta de metadatos (título, descripción, imagen, tecnologías sugeridas) mediante parseo DOM / Open Graph.
- [ ] AC-3: Inferencia automática de duración estimada o nivel a partir del contenido o metadatos de la página.
- [ ] AC-4: Respuesta JSON estandarizada con código 200 y manejo de errores 422/400 si la URL no es accesible.

## Out of scope

- Funcionalidades fuera del MVP del hackathon o no contempladas en esta unidad de trabajo.

## Validation

1. Realizar POST a `/api/courses/extract-metadata` enviando una URL real de curso de DevTalles.
2. Validar que la respuesta contenga `title`, `description`, `image_url` y sugerencias de etiquetas.
3. Probar con URLs no válidas y validar respuesta de error controlada.
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
  - "backend/app/Services/CourseMetadataExtractorService.php"
  - "backend/app/Http/Controllers/CourseController.php"
  - "backend/routes/api.php"

**Related domain / capability:**
- Related domain: Catálogo Académico (Course Catalog)
- Related capabilities: Catálogo Estructurado de Cursos DevTalles

## Learning

_What did we learn from this change? Update after completion._

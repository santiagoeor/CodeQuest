---
type: decision-candidates
project_state: ai-assisted
generated_by: architecture-agent
template_version: 1
---

# Decision Candidates — CodeQuest

Candidatos a Architectural Decision Records (ADRs) identificados durante la evaluación de arquitectura para formalización posterior con `decision-agent` o `adr-agent`.

## DC-001: Autenticación API mediante Laravel Sanctum

- **Contexto:** Se requiere autenticar y mantener la sesión de usuarios federados vía Discord OAuth2 de manera simple y segura en la SPA de Angular.
- **Alternativas consideradas:** Laravel Passport (OAuth2 server completo, innecesariamente complejo para una API propia interna), JWT custom (`tymon/jwt-auth`), Laravel Sanctum con tokens personales.
- **Candidato preferido:** Laravel Sanctum por su ligereza y soporte nativo en Laravel 11.
- **Estado:** Propuesta / Candidato a ADR.

## DC-002: Algoritmo Determinista de Recomendación en Backend

- **Contexto:** La generación de rutas debe completarse de forma predecible, rápida y sin costos operativos por tokens de inferencia en tiempo real.
- **Alternativas consideradas:** Integración directa con LLM en tiempo real, motor determinista en backend por matriz de habilidades/tags con grafo de prerrequisitos, o cálculo en cliente (frontend).
- **Candidato preferido:** Motor determinista en backend en `LearningPathGeneratorService`.
- **Estado:** Propuesta / Candidato a ADR.

## DC-003: Renderizado de Rutas de Aprendizaje en Angular

- **Contexto:** La experiencia visual del estudiante debe ser ágil, reactiva y responsive (móvil y desktop).
- **Alternativas consideradas:** Librerías de grafos pesadas (D3.js / Cytoscape), componentes nativos en Angular con TailwindCSS / Flexbox / Grid.
- **Candidato preferido:** Componentes nativos modulares en Angular con CSS Flex/Grid y SVG ligero para conectar nodos.
- **Estado:** Propuesta / Candidato a ADR.

---
type: adr
id: ADR-003
title: "Renderizado de Rutas de Aprendizaje en Angular"
status: accepted
date: 2026-09-22
created_from: knowledge/tech/discovery/decision-candidates.md
candidate_id: DC-003
governed_paths:
  - "frontend/src/app/features/paths/**"
related_capabilities:
  - "Visualización Interactiva de Ruta (Roadmap View)"
related_work_items:
  - WI-010
  - WI-012
---

# ADR-003: Renderizado de Rutas de Aprendizaje en Angular

## Contexto

La visualización de rutas de aprendizaje (Roadmap View) es el núcleo de la experiencia de usuario en CodeQuest. Debe presentar de manera intuitiva y atractiva la secuencia pedagógica de cursos que el estudiante debe seguir, permitiendo acceder a los detalles y enlaces directos a la plataforma DevTalles.

Requisitos críticos del MVP del hackathon:
- Diseño 100% responsivo y adaptado tanto a pantallas móviles de smartphones como a monitores de escritorio.
- Rendimiento ágil con carga instantánea y sin incremento excesivo en el peso del bundle JavaScript.
- Accesibilidad en el DOM (texto seleccionable, enlaces semánticos `<a>` con atributos seguros, lectores de pantalla).
- Facilidad de estilización consistente con el sistema de diseño oscuro de CodeQuest basado en TailwindCSS.

## Opciones Consideradas

1. **Librerías de Grafos y Canvas Pesadas (D3.js, Cytoscape.js, GoJS)**:
   - *Pros*: Gran versatilidad para grafos matemáticos arbitrarios con force-directed layouts y zoom/pan infinito.
   - *Contras*: Curva de aprendizaje y complejidad de integración en Angular; peso considerable en el bundle (+150-300 KB); difícil adaptación responsive en pantallas pequeñas de smartphones donde el canvas suele truncarse o resultar incómodo de navegar mediante gestos táctiles; manipulación directa del canvas que dificulta la accesibilidad y el SEO.

2. **Librerías de Diagramas Basadas en SVG (Mermaid.js)**:
   - *Pros*: Sintaxis declarativa tipo texto.
   - *Contras*: Limitada interactividad para componentes complejos (tarjetas con múltiples botones, modales, etiquetas dinámicas y enlaces con estados de hover); dependencia externa pesada innecesaria.

3. **Componentes Nativos Modulares en Angular con CSS Flexbox/Grid y SVG Ligero**:
   - *Pros*: Cero dependencias externas adicionales; tamaño de bundle mínimo; total compatibilidad con TailwindCSS; diseño de línea de tiempo secuencial vertical que se adapta de forma natural y elegante tanto a dispositivos móviles como a pantallas grandes; accesibilidad nativa mediante elementos HTML estándar; animaciones fluidas con transiciones CSS nativas.
   - *Contras*: Si en el futuro se requiriera una topología de grafo bidimensional compleja con múltiples bifurcaciones circulares simultáneas, se necesitaría cálculo adicional de coordenadas. Para el MVP secuencial y estructurado de DevTalles, una línea de tiempo secuencial interactiva es pedagógica y técnicamente superior.

## Decisión

Adoptar **componentes nativos modulares en Angular** (`PathRoadmapComponent` y `CourseCardComponent`) estructurados con **HTML semántico, CSS Flexbox/Grid (TailwindCSS) y conectores SVG vectoriales ligeros**.

La interfaz estructurará cada ruta como una línea de tiempo secuencial con:
1. Nodos numerados (`#1`, `#2`, `#3...`) con indicadores de nivel (`beginner`, `intermediate`, `advanced`).
2. Líneas conectores visuales con efectos de gradiente acordes a la paleta de CodeQuest (`cq-primary` y `cq-accent`).
3. Tarjetas de curso ricas en información (duración, tags, descripción, justificación pedagógica y botón directo a DevTalles).
4. Panel lateral/pestañas de itinerarios para alternar entre diferentes rutas guardadas.

## Consecuencias

### Positivas:
- Cero dependencias npm adicionales en el frontend.
- Carga y renderizado ultra rápidos sin demoras de inicialización de canvas.
- Experiencia móvil impecable y verticalmente navegable sin desbordamientos de pantalla.
- Enlaces accesibles con atributos estándar `target="_blank"` y `rel="noopener noreferrer"`.

### Negativas / Compromisos:
- Diseñado específicamente para progresiones secuenciales y jerárquicas lineales, que coincide exactamente con los requerimientos pedagógicos del roadmap de DevTalles.

## Related Capabilities

- Visualización Interactiva de Ruta (Roadmap View)

## Related Work Items

- WI-010: Crear vista interactiva de Roadmap y tarjetas de cursos en Angular
- WI-012: Integrar barra de progreso reactiva e indicadores de completitud en la SPA

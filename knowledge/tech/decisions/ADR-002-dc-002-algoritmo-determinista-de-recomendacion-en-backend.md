---
type: adr
id: ADR-002
title: "Algoritmo Determinista de Recomendación en Backend"
status: accepted
date: 2026-09-20
created_from: knowledge/tech/discovery/decision-candidates.md
candidate_id: DC-002
governed_paths:
  - "backend/app/Services/LearningPathGeneratorService.php"
  - "backend/app/Http/Controllers/LearningPathController.php"
  - "backend/routes/api.php"
related_capabilities:
  - "Motor de Generación y Recomendación de Rutas de Aprendizaje"
related_work_items:
  - WI-007
  - WI-008
  - WI-009
---

# ADR-002: Algoritmo Determinista de Recomendación en Backend

## Contexto

El objetivo principal de CodeQuest es orientar a los estudiantes de la comunidad DevTalles recomendando rutas de aprendizaje personalizadas y estructuradas a partir de sus respuestas al cuestionario diagnóstico.

Para satisfacer los requisitos de usabilidad y rendimiento del MVP del hackathon, el proceso de generación de rutas debe cumplir con:
- Latencia extremadamente baja (< 300 ms) para mantener la fluidez de la experiencia de usuario.
- Alta coherencia pedagógica: secuenciación lógica donde los fundamentos preceden a los frameworks y arquitecturas avanzadas.
- Reproducibilidad y predictibilidad en pruebas automatizadas y demostraciones a jueces.
- Cero costos operativos recurrentes o dependencia de cuotas de tokens de servicios de IA generativa de terceros.

## Opciones Consideradas

1. **Inferencia en Tiempo Real mediante Modelos de Lenguaje (LLMs / OpenAI / Gemini)**:
   - *Pros*: Gran capacidad de redacción de justificaciones personalizadas y flexibilidad contextual abierta.
   - *Contras*: Latencia impredecible (frecuentemente superior a 1.5 - 3 segundos), riesgo de alucinación de cursos inexistentes fuera del catálogo curado de DevTalles, necesidad de API keys con costo por llamada y posible fallo por rate-limits durante la evaluación del hackathon.

2. **Cálculo en el Cliente (Frontend SPA en Angular)**:
   - *Pros*: Cero carga computacional en el servidor.
   - *Contras*: Exposición de la lógica de negocio y ponderaciones en el cliente, mayor peso del bundle JavaScript, dificultad para reutilizar la lógica en endpoints futuros o procesos en segundo plano, y falta de validación centralizada.

3. **Motor Determinista en Backend (`LearningPathGeneratorService`)**:
   - *Pros*: Ejecución ultra rápida (< 50 ms), coste de infraestructura nulo, total determinismo y facilidad de testeo unitario/integración. Se apoya en la matriz de ponderaciones por etiqueta (`weight` JSON) del modelo relacional ya implementado en WI-004 y en el catálogo estandarizado de DevTalles (WI-003). Permite una secuenciación pedagógica estricta por niveles y prerrequisitos.
   - *Contras*: Las reglas y pesos deben estar bien calibrados en los seeders y servicio para evitar sesgos o rutas redundantes.

## Decisión

Adoptar un **motor determinista en el backend** encapsulado en `LearningPathGeneratorService` dentro de Laravel.

El algoritmo:
1. Recibe los identificadores o valores de las opciones seleccionadas en el diagnóstico.
2. Agrega las ponderaciones temáticas (`weight` JSON) asociadas a cada opción.
3. Evalúa el catálogo de cursos aplicando puntuación por afinidad de etiquetas combinada con bonificaciones y penalizaciones según el nivel de experiencia del estudiante (`beginner`, `intermediate`, `advanced`).
4. Aplica reglas de precedencia pedagógica: ordena primero por nivel formativo y posteriormente por prerrequisitos conceptuales (lenguajes base como JavaScript/TypeScript/Dart/Docker preceden a frameworks como React/Angular/NestJS/Kubernetes).
5. Retorna la lista seleccionada con título contextual, justificación pedagógica y cálculo de duración estimada.

## Consecuencias

### Positivas:
- Tiempo de respuesta inmediato (< 50 ms), superando ampliamente la meta de 300 ms de AC-4.
- Totalmente autónomo: no depende de internet ni de credenciales de APIs de terceros durante la demo o evaluación.
- Alta testabilidad con cobertura unitaria completa para múltiples perfiles.
- Catálogo 100% fiel a los cursos reales de DevTalles.

### Negativas / Compromisos:
- La lógica de precedencia entre cursos está codificada en reglas declarativas en el backend; añadir nuevos cursos al catálogo requiere asociarles tags consistentes.

## Related Capabilities

- Motor de Generación y Recomendación de Rutas de Aprendizaje

## Related Work Items

- WI-007: Desarrollar servicio de recomendación de rutas en Laravel
- WI-008: Construir interfaz paso a paso del cuestionario diagnóstico en Angular
- WI-009: Implementar endpoints para persistencia y gestión de múltiples rutas en Laravel

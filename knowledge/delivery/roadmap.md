---
type: roadmap
id: roadmap
status: draft
project_state: ai-assisted
generated_by: roadmap-agent
refined_by: roadmap-agent
template_version: 1
knowledge_level: K3
---

> Idioma del proyecto: **español**. Escribe este conocimiento en español. Mantén en inglés el código, los nombres de archivo, los comandos y las claves de configuración.

# Roadmap

Generated with Kaddo Roadmap Agent. Initiatives and work items below are **candidates** for human review — not final commitments.

## Summary

Este roadmap establece la secuencia de entrega para el proyecto CodeQuest de cara al hackathon Code Quest 2026 (fecha límite: 28 de septiembre). Organiza las capacidades planificadas y la arquitectura base en 6 iniciativas secuenciales, priorizando la infraestructura mínima viable, la autenticación federada con Discord y el motor determinista de recomendación para garantizar una demo pública funcional y evaluable.

## Assumptions

- Se asume que el inicio de sesión vía Discord OAuth2 será el único método de autenticación requerido para el MVP.
- Se asume que el catálogo de cursos de DevTalles se poblará estáticamente a través de seeders en Laravel con datos públicos oficiales.
- Se asume que la generación de rutas empleará un motor determinista en backend basado en etiquetas y niveles sin invocar servicios de pago de LLMs en tiempo de ejecución.
- Se asume que el marcado de progreso será autogestionado por el usuario sin requerir sincronización por webhooks con la plataforma DevTalles en esta fase.

## Roadmap Principles

1. **Fundamentos primero:** Asegurar el monorepo y el pipeline de Docker antes de desarrollar componentes visuales.
2. **Prioridad al MVP evaluable:** Construir el flujo principal de punta a punta (Auth Discord → Cuestionario → Ruta recomendada → Guardar → Progreso).
3. **Determinismo y rendimiento:** Evitar latencias o dependencias costosas en la generación de rutas.
4. **Claridad en la trazabilidad:** Cada Work Item se deriva de una capacidad planificada y una necesidad de negocio.

## Initiatives

### RM-001: Configuración de Infraestructura y Monorepo

**Status:** candidate

**Priority:** high

**Suggested Knowledge Level:** K2

**Related domain:** Experiencia de Usuario (User Experience)

**Related capabilities:**
- Visualización Interactiva de Ruta (Roadmap View)

**Source signals:**
- Business Goal: Cumplir con los estándares de entrega del hackathon Code Quest 2026 (código funcional, repositorio público y demo desplegada).
- Tech Decision Candidate: Contenedorización para desarrollo y despliegue mediante Docker Compose.

**Problem / opportunity:**
Se requiere establecer el andamiaje inicial del monorepo para que el frontend en Angular, el backend en Laravel y la base de datos MySQL funcionen de manera integrada y reproducible.

**Expected value:**
Ambiente de desarrollo local operativo en un solo comando y base lista para el despliegue de la demo.

**Risks:**
Problemas de configuración de red interna o CORS entre los contenedores de frontend y backend.

**Dependencies:**
Ninguna.

**Suggested Work Items:**
- WI-001: Inicializar estructura del monorepo con Docker Compose para Laravel, Angular y MySQL
  - type: chore
  - suggested knowledge level: K2
  - expected value: Servicios backend, frontend y db levantando simultáneamente con variables de entorno segregadas.
  - notes: Configurar docker-compose.yml, Dockerfiles y scripts de inicio en package.json/Makefile.
- WI-002: Configurar sistema de diseño base y layout responsive en Angular
  - type: chore
  - suggested knowledge level: K2
  - expected value: Framework de estilos (TailwindCSS) y estructura de componentes shell (header, navegación, footer).
  - notes: Aplicar estilo acorde a la identidad de la comunidad DevTalles.

**Not now:**
Configuración de clusters Kubernetes o pipelines complejos de multi-staging.

---

### RM-002: Catálogo Académico de DevTalles y Banco de Evaluación

**Status:** candidate

**Priority:** high

**Suggested Knowledge Level:** K2

**Related domain:** Catálogo Académico (Course Catalog)

**Related capabilities:**
- Catálogo Estructurado de Cursos DevTalles
- Cuestionario Interactivo de Diagnóstico y Metas

**Source signals:**
- Business Goal: Facilitar el descubrimiento guiado y personalizado del catálogo de cursos de DevTalles.
- Capability Gap: Ausencia de esquema de datos y catálogo de cursos cargado en base de datos.

**Problem / opportunity:**
El sistema necesita almacenar la información estructurada de los cursos de DevTalles (niveles, tecnologías, URLs oficiales) y el banco de preguntas del diagnóstico.

**Expected value:**
Base de datos relacional poblada con cursos reales y endpoints para consultar el catálogo y las preguntas de perfil.

**Risks:**
Metadatos incompletos en la definición inicial de cursos.

**Dependencies:**
RM-001

**Suggested Work Items:**
- WI-003: Modelar base de datos y crear migraciones y seeders para cursos de DevTalles
  - type: chore
  - suggested knowledge level: K2
  - expected value: Tablas de cursos y etiquetas con seeders completos basados en el catálogo oficial de DevTalles.
  - notes: Incluir título, descripción, tecnología, nivel, prerrequisitos y URL externa.
- WI-004: Diseñar estructura y exponer endpoint del cuestionario de habilidades e intereses
  - type: feature
  - suggested knowledge level: K2
  - expected value: Endpoint `/api/assessment/questions` que proporciona las preguntas y opciones de diagnóstico.
  - notes: Categorías de backend, frontend, devops y nivel de experiencia (principiante, intermedio, avanzado).

**Not now:**
Panel administrativo CMS para que administradores editen cursos en vivo.

---

### RM-003: Autenticación e Identidad con Discord OAuth2

**Status:** candidate

**Priority:** high

**Suggested Knowledge Level:** K3

**Related domain:** Identidad y Acceso (Identity & Access)

**Related capabilities:**
- Autenticación e Identidad vía Discord OAuth2

**Source signals:**
- Business Goal: Autenticación obligatoria soportada mediante Discord OAuth2.
- Tech Decision Candidate: DC-001 Autenticación API mediante Laravel Sanctum.

**Problem / opportunity:**
Los estudiantes y evaluadores deben poder autenticarse con su cuenta de Discord para asociar sus itinerarios y progreso personal.

**Expected value:**
Inicio de sesión seguro mediante Discord OAuth2 con emisión de tokens Bearer protegidos por Laravel Sanctum.

**Risks:**
Gestión de redirecciones y tokens en el cliente SPA ante fallos de conectividad con la API de Discord.

**Dependencies:**
RM-001

**Suggested Work Items:**
- WI-005: Implementar flujo backend para Discord OAuth2 y emisión de tokens Sanctum
  - type: feature
  - suggested knowledge level: K3
  - expected value: Endpoints de redirección y callback que validan el token de Discord y crean/actualizan el usuario local.
  - notes: Almacenar discord_id, username, email y avatar. Proteger rutas con middleware `auth:sanctum`.
- WI-006: Integrar botón de inicio de sesión con Discord y guards de autenticación en Angular
  - type: feature
  - suggested knowledge level: K2
  - expected value: Interfaz de login con Discord, almacenamiento seguro del token Bearer y AuthService reactivo con `AuthGuard`.
  - notes: Manejo de estados de carga, error y redirección post-autenticación.

**Not now:**
Inicio de sesión con Google, GitHub o correo con contraseña tradicional.

---

### RM-004: Motor de Recomendación y Generación de Rutas

**Status:** candidate

**Priority:** high

**Suggested Knowledge Level:** K3

**Related domain:** Motor de Recomendación (Recommendation Engine)

**Related capabilities:**
- Motor de Generación y Recomendación de Rutas de Aprendizaje
- Cuestionario Interactivo de Diagnóstico y Metas

**Source signals:**
- Business Goal: Proporcionar recomendaciones dinámicas y personalizadas según perfil y metas laborales.
- Tech Decision Candidate: DC-002 Algoritmo Determinista de Recomendación en Backend.

**Problem / opportunity:**
Transformar las respuestas del cuestionario en una ruta de estudio coherente, ordenada pedagógicamente según el nivel y la meta elegida.

**Expected value:**
Servicio de negocio que calcula la secuencia óptima de cursos de DevTalles en milisegundos sin costos externos.

**Risks:**
Reglas de ponderación que generen rutas desbalanceadas para combinaciones inusuales de respuestas.

**Dependencies:**
RM-002

**Suggested Work Items:**
- WI-007: Desarrollar servicio de recomendación de rutas en Laravel
  - type: feature
  - suggested knowledge level: K3
  - expected value: `LearningPathGeneratorService` que filtra y ordena cursos en base a respuestas, tags y nivel técnico.
  - notes: Endpoint `/api/recommendations/generate` que recibe respuestas y retorna la ruta sugerida.
- WI-008: Construir interfaz paso a paso del cuestionario diagnóstico en Angular
  - type: feature
  - suggested knowledge level: K2
  - expected value: Componente wizard interactivo, intuitivo y responsive para completar el cuestionario.
  - notes: Validación en tiempo real y transiciones fluidas entre preguntas.

**Not now:**
Integración con modelos de IA generativa para generación de texto libre sobre la ruta.

---

### RM-005: Gestión, Persistencia y Visualización de Rutas

**Status:** candidate

**Priority:** high

**Suggested Knowledge Level:** K2

**Related domain:** Gestión de Rutas (Path Management)

**Related capabilities:**
- Gestión y Persistencia de Múltiples Rutas por Usuario
- Visualización Interactiva de Ruta (Roadmap View)

**Source signals:**
- Business Goal: Permitir al estudiante guardar múltiples rutas e itinerarios personalizados.
- Tech Decision Candidate: DC-003 Renderizado de Rutas de Aprendizaje en Angular.

**Problem / opportunity:**
El usuario debe poder almacenar sus rutas generadas, visualizarlas en un mapa visual tipo roadmap, renombrarlas o alternar entre varias rutas activas.

**Expected value:**
Panel de control de itinerarios con visualización gráfica interactiva y redirección a cursos oficiales de DevTalles.

**Risks:**
Dificultades en la adaptabilidad responsive de la vista de grafo o árbol en pantallas pequeñas.

**Dependencies:**
RM-003, RM-004

**Suggested Work Items:**
- WI-009: Implementar endpoints para persistencia y gestión de múltiples rutas en Laravel
  - type: feature
  - suggested knowledge level: K2
  - expected value: Endpoints REST bajo `/api/learning-paths` para guardar, listar, consultar detalle y eliminar rutas.
  - notes: Vincular rutas al usuario autenticado mediante relaciones Eloquent.
- WI-010: Crear vista interactiva de Roadmap y tarjetas de cursos en Angular
  - type: feature
  - suggested knowledge level: K2
  - expected value: Componente visual de ruta tipo itinerario con enlaces hacia los cursos en DevTalles.
  - notes: Diseño accesible y responsive con TailwindCSS.

**Not now:**
Compartición pública de rutas en redes sociales o exportación en PDF.

---

### RM-006: Seguimiento de Progreso y Métricas de Completitud

**Status:** candidate

**Priority:** medium

**Suggested Knowledge Level:** K2

**Related domain:** Seguimiento de Aprendizaje (Learning Tracking)

**Related capabilities:**
- Seguimiento de Progreso y Métricas de Completitud

**Source signals:**
- Business Goal: Aumentar el compromiso del estudiante midiendo su avance por curso e itinerario.

**Problem / opportunity:**
Los estudiantes necesitan registrar qué cursos van completando para visualizar su progreso porcentual acumulado.

**Expected value:**
Métricas claras de avance por ruta y marcado ágil de cursos terminados.

**Risks:**
Complejidad si el usuario completa un curso que pertenece simultáneamente a múltiples itinerarios guardados.

**Dependencies:**
RM-005

**Suggested Work Items:**
- WI-011: Desarrollar endpoints para registrar el progreso de cursos por usuario
  - type: feature
  - suggested knowledge level: K2
  - expected value: Endpoint `/api/progress` para alternar estado de completitud de cursos y recalcular porcentaje.
  - notes: Actualización atómica en la tabla `course_progress`.
- WI-012: Integrar barra de progreso reactiva e indicadores de completitud en la SPA
  - type: feature
  - suggested knowledge level: K2
  - expected value: Interfaz visual con progreso porcentual dinámico y checkboxes de curso completado.
  - notes: Actualización en tiempo real usando Signals en Angular.

**Not now:**
Gamificación avanzada (medallas, insignias, tablas de clasificación entre usuarios).

---

## Suggested Execution Order

1. **RM-001 (Configuración de Infraestructura y Monorepo):** Establece el entorno de trabajo, Docker y la base de los frameworks.
2. **RM-002 (Catálogo Académico de DevTalles y Banco de Evaluación):** Proporciona los datos y modelos que alimentarán la lógica de negocio.
3. **RM-003 (Autenticación e Identidad con Discord OAuth2):** Habilita la identidad de usuarios antes de procesar persistencia individual.
4. **RM-004 (Motor de Recomendación y Generación de Rutas):** Desarrolla el núcleo funcional de evaluación y algoritmo de sugerencias.
5. **RM-005 (Gestión, Persistencia y Visualización de Rutas):** Permite guardar las rutas generadas y presentarlas visualmente como roadmaps.
6. **RM-006 (Seguimiento de Progreso y Métricas de Completitud):** Añade la funcionalidad de tracking de avance y completitud de cursos.

## Risks and Constraints

- **Ventana de entrega estricta:** 28 de septiembre a las 10:00 AM (GMT-6). El alcance de los Work Items está acotado estrictamente a lo esencial para el MVP.
- **Disponibilidad de servicios externos:** Discord OAuth2 es obligatorio; se recomienda implementar un modo de prueba local o mock durante el desarrollo.
- **Calidad de datos iniciales:** La curación del catálogo inicial de cursos debe ser precisa y fiel a DevTalles para asegurar recomendaciones realistas.

## Not Now

- Pasarela de pagos o suscripciones de compra de cursos.
- Reproductor de video propio dentro de la plataforma.
- Edición y administración dinámica de catálogo desde la interfaz web.
- Proveedores de autenticación adicionales (GitHub, Google, Email/Password).
- Red social interna o sistema de comentarios entre estudiantes.
- Generación de certificados o diplomas de finalización.

## Next Recommended Work Item

- **WI-001:** Inicializar estructura del monorepo con Docker Compose para Laravel, Angular y MySQL

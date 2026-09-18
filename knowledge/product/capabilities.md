---
type: capabilities
project_state: ai-assisted
generated_by: kaddo-bootstrap
refined_by: capability-agent
template_version: 1
---

> Idioma del proyecto: **español**. Escribe este conocimiento en español. Mantén en inglés el código, los nombres de archivo, los comandos y las claves de configuración.

# Capabilities

Generated from Kaddo Context Pack.

## Summary

CodeQuest proporciona un entorno integral para orientar a los estudiantes de la comunidad DevTalles en la selección y seguimiento de cursos adaptados a sus objetivos técnicos. Al estar en fase inicial (`project.state: new`), las capacidades descritas representan la definición planificada (`[planned]`) del sistema para la entrega del hackathon Code Quest 2026.

## Planned capabilities

- [planned] Autenticación e Identidad vía Discord OAuth2
- [planned] Cuestionario Interactivo de Diagnóstico y Metas
- [planned] Catálogo Estructurado de Cursos DevTalles
- [planned] Motor de Generación y Recomendación de Rutas de Aprendizaje
- [planned] Gestión y Persistencia de Múltiples Rutas por Usuario
- [planned] Seguimiento de Progreso y Métricas de Completitud
- [planned] Visualización Interactiva de Ruta (Roadmap View)

---

## Capability Map

### Autenticación e Identidad vía Discord OAuth2

**Description:** Permite a los estudiantes y evaluadores autenticarse de manera segura utilizando su cuenta de Discord (OAuth2), obteniendo su perfil básico y gestionando sesiones seguras mediante tokens.

**Evidence:** `[planned]` Sin código implementado aún. Definido en los requisitos de negocio y producto.

**Related folders or modules:** `backend/app/Http/Controllers/Auth/`, `backend/routes/api.php`, `frontend/src/app/core/auth/`, `frontend/src/app/core/guards/`.

**Possible domain:** Identidad y Acceso (Identity & Access)

**Confidence:** High

**Open questions:** ¿Se requerirá soporte para usuarios invitados antes de obligar al inicio de sesión con Discord?

**Candidate ownership:** Backend / Frontend (Fullstack)

**Suggested code globs:** `backend/app/**/Auth/**`, `frontend/src/app/core/auth/**`

---

### Cuestionario Interactivo de Diagnóstico y Metas

**Description:** Interfaz guiada paso a paso que recopila el nivel técnico actual del estudiante, sus áreas de interés (frontend, backend, devops, fullstack, etc.) y sus objetivos profesionales o laborales.

**Evidence:** `[planned]` Sin código implementado aún. Documentado en user journeys y scope de `knowledge/product/product.md`.

**Related folders or modules:** `frontend/src/app/features/assessment/`, `backend/app/Http/Controllers/AssessmentController.php`, `backend/database/seeders/QuestionnaireSeeder.php`.

**Possible domain:** Evaluación y Diagnóstico (Assessment & Profiling)

**Confidence:** High

**Open questions:** ¿Las preguntas del cuestionario se obtendrán dinámicamente desde el backend o estarán configuradas estáticamente en el frontend?

**Candidate ownership:** Frontend / Backend

**Suggested code globs:** `frontend/src/app/features/assessment/**`, `backend/app/**/Assessment/**`

---

### Catálogo Estructurado de Cursos DevTalles

**Description:** Modelo y almacenamiento relacional de los cursos disponibles en DevTalles, incluyendo información como título, descripción, tecnología, nivel (básico, intermedio, avanzado), duración estimada, prerrequisitos y URL externa al curso.

**Evidence:** `[planned]` Sin código implementado aún. Mapeado en `knowledge/tech/codebase.md` (`database/seeders`).

**Related folders or modules:** `backend/app/Models/Course.php`, `backend/database/migrations/`, `backend/database/seeders/CourseSeeder.php`, `backend/app/Http/Controllers/CourseController.php`.

**Possible domain:** Catálogo Académico (Course Catalog)

**Confidence:** High

**Open questions:** ¿Cómo se poblará y mantendrá actualizada la lista de cursos oficiales de DevTalles en esta fase inicial?

**Candidate ownership:** Backend

**Suggested code globs:** `backend/app/Models/Course.php`, `backend/database/seeders/CourseSeeder.php`

---

### Motor de Generación y Recomendación de Rutas de Aprendizaje

**Description:** Servicio de lógica de negocio que procesa las respuestas del cuestionario y genera una secuencia coherente y ordenada de cursos de DevTalles, optimizando la curva de aprendizaje según el perfil del usuario.

**Evidence:** `[planned]` Sin código implementado aún. Núcleo funcional definido en la visión del producto.

**Related folders or modules:** `backend/app/Services/LearningPathGeneratorService.php`, `backend/app/Http/Controllers/LearningPathController.php`.

**Possible domain:** Motor de Recomendación (Recommendation Engine)

**Confidence:** High

**Open questions:** ¿El algoritmo empleará una matriz de reglas y etiquetas de tecnologías o un grafo dirigido de dependencias de cursos?

**Candidate ownership:** Backend

**Suggested code globs:** `backend/app/Services/LearningPath*.php`

---

### Gestión y Persistencia de Múltiples Rutas por Usuario

**Description:** Permite a los usuarios autenticados guardar una o más rutas generadas, visualizarlas en un panel personal, asignarles nombres personalizados, reiniciarlas o eliminarlas.

**Evidence:** `[planned]` Sin código implementado aún. Identificado en journeys de usuario y objetivos de negocio.

**Related folders or modules:** `backend/app/Models/LearningPath.php`, `backend/app/Http/Controllers/LearningPathController.php`, `frontend/src/app/features/paths/`.

**Possible domain:** Gestión de Rutas (Path Management)

**Confidence:** High

**Open questions:** ¿Existe un límite máximo de rutas guardadas simultáneas por usuario?

**Candidate ownership:** Backend / Frontend

**Suggested code globs:** `backend/app/Models/LearningPath.php`, `frontend/src/app/features/paths/**`

---

### Seguimiento de Progreso y Métricas de Completitud

**Description:** Habilita el marcado individual de cursos o módulos completados dentro de una ruta activa, calculando automáticamente el porcentaje de avance global y reflejando el progreso en la interfaz.

**Evidence:** `[planned]` Sin código implementado aún. Requisito explícito de compromiso estudiantil.

**Related folders or modules:** `backend/app/Models/CourseProgress.php`, `backend/app/Http/Controllers/ProgressController.php`, `frontend/src/app/features/progress/`.

**Possible domain:** Seguimiento de Aprendizaje (Learning Tracking)

**Confidence:** High

**Open questions:** ¿El progreso de un curso se comparte entre diferentes rutas del mismo usuario si el curso se repite?

**Candidate ownership:** Fullstack

**Suggested code globs:** `backend/app/Models/*Progress*.php`, `frontend/src/app/features/progress/**`

---

### Visualización Interactiva de Ruta (Roadmap View)

**Description:** Componente visual interactivo (vista tipo itinerario o árbol de pasos) que muestra la secuencia de cursos sugeridos, estado de cada uno, enlaces hacia la plataforma DevTalles y detalles pedagógicos clave.

**Evidence:** `[planned]` Sin código implementado aún. Necesario para cumplir con el estándar de diseño y usabilidad.

**Related folders or modules:** `frontend/src/app/features/paths/components/path-roadmap/`, `frontend/src/app/features/paths/components/course-card/`.

**Possible domain:** Experiencia de Usuario (User Experience)

**Confidence:** Medium

**Open questions:** ¿Se utilizará una librería de visualización de grafos (e.g., Mermaid, D3, SVG interactivo) o un diseño secuencial en CSS/HTML puro?

**Candidate ownership:** Frontend

**Suggested code globs:** `frontend/src/app/features/paths/components/**`

---

## Cross-cutting Concerns

- **Seguridad y Autorización:** Validación de tokens OAuth2 de Discord y protección de endpoints en la API REST de Laravel.
- **Manejo de Estado en Frontend:** Gestión reactiva del estado del usuario, cuestionario y rutas en Angular.
- **Rendimiento y Persistencia:** Esquema relacional optimizado en MySQL para usuarios, cursos, rutas y progreso.
- **Diseño Responsivo:** Compatibilidad multidispositivo (desktop y mobile) con enfoque accesible para estudiantes y jueces.

## Risks

- **Dependencia de servicios externos:** Disponibilidad de la API de Discord para autenticación durante las pruebas y evaluación.
- **Tiempo límite de entrega:** El hackathon finaliza el 28 de septiembre a las 10:00 AM (GMT-6); la lógica de recomendación debe mantenerse simple y robusta sin sobreingeniería.
- **Curación del catálogo de cursos:** Al no disponer de una API oficial abierta de DevTalles, los datos deberán suministrarse mediante seeders estáticos bien estructurados.

## Open Questions

- [open] ¿Se permitirá a un usuario no autenticado completar el cuestionario y ver la ruta generada antes de exigir autenticación con Discord para guardarla?
- [open] ¿El avance de un curso completado debe propagarse automáticamente si ese mismo curso aparece en otra ruta del mismo usuario?
- [open] ¿Qué nivel de granularidad tendrá el seguimiento (a nivel de curso completo o por secciones/lecciones)?

## Suggested Next Step

- Utilizar el `roadmap-agent` para transformar estas capacidades planificadas en iniciativas y entregables estructurados en los horizontes Now, Next y Later en `knowledge/delivery/roadmap.md`.

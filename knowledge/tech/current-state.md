---
type: current-state
project_state: ai-assisted
generated_by: kaddo-bootstrap
refined_by: architecture-agent
template_version: 1
---

> Idioma del proyecto: **español**. Escribe este conocimiento en español. Mantén en inglés el código, los nombres de archivo, los comandos y las claves de configuración.

# Current State

Generated from Kaddo Context Pack.

## System Overview

CodeQuest es una plataforma web orientada al aprendizaje guiado para la comunidad de DevTalles. El sistema adopta una arquitectura desacoplada estructurada como monorepo, compuesta por un cliente SPA en Angular, un servicio API REST en Laravel y persistencia relacional en MySQL. Su propósito técnico central es procesar perfiles de usuario, generar rutas dinámicas de cursos y realizar el seguimiento de avance con autenticación federada vía Discord OAuth2.

## Initial technical direction

- **Arquitectura Cliente-Servidor Desacoplada:** Frontend y backend comunicados exclusivamente mediante endpoints JSON RESTful bajo `/api`.
- **Autenticación sin estado:** Autenticación de usuarios vía Discord OAuth2 delegando la validación inicial y gestionando tokens de acceso API en Laravel con Sanctum.
- **Contenedorización para desarrollo y despliegue:** Uso de Docker y Docker Compose para garantizar reproducibilidad local y preparación para producción.

## Modules

### Backend (Laravel)
- **Http/Controllers:** Exposición de recursos REST para autenticación (`AuthController`), catálogo de cursos (`CourseController`), cuestionarios (`AssessmentController`), rutas de aprendizaje (`LearningPathController`) y progreso (`ProgressController`).
- **Services:** Lógica de negocio encapsulada para la recomendación (`LearningPathGeneratorService`) e integración externa (`DiscordOAuthService`).
- **Models:** Entidades Eloquent (`User`, `Course`, `LearningPath`, `LearningPathItem`, `CourseProgress`).
- **Database:** Migraciones de esquema relacional y seeders iniciales para el catálogo de cursos de DevTalles y preguntas de diagnóstico.

### Frontend (Angular SPA)
- **Core:** Servicios singleton transversales, interceptores HTTP para tokens de sesión y guards de navegación (`AuthGuard`).
- **Features:** Módulos funcionales organizados por dominio: autenticación (`auth`), cuestionario de diagnóstico (`assessment`), explorador y detalle de rutas (`paths`), y panel de progreso (`progress`).
- **Shared:** Componentes visuales reutilizables (tarjetas de curso, barras de progreso, botones accesibles) y modelos TypeScript compartidos.

## Dependencies and Integrations

- **Discord API (OAuth2):** Integración obligatoria para autenticación de usuarios de la comunidad DevTalles y obtención de perfil básico (Discord ID, avatar, username).
- **Catálogo DevTalles:** Enlaces directos a los cursos oficiales alojados en la plataforma DevTalles (sin reproductor interno de video).
- **Nginx / Web Server:** Servidor HTTP inverso para servir el frontend estático compilado y canalizar peticiones API hacia PHP-FPM en entorno de despliegue.

## Data Stores

- **MySQL 8.0:** Base de datos relacional principal para persistencia de usuarios, cursos, cuestionarios, rutas de aprendizaje e historial de progreso del estudiante.

## Infrastructure

- **Docker Compose:** Orquestación de tres servicios principales: backend (Laravel / PHP 8.2), frontend (Angular / Node / Nginx) y base de datos (MySQL 8.0).
- **Entorno de producción:** Preparado para despliegue en servidor VPS o servicio cloud mediante contenedores Docker con variables de entorno segregadas.

## Known constraints

- **Plazo límite de entrega:** 28 de septiembre a las 10:00 AM (GMT-6). La arquitectura debe evitar sobreingeniería (como microservicios o arquitecturas event-driven complejas).
- **Autenticación obligatoria Discord OAuth2:** No se cuenta con autenticación por contraseña tradicional por defecto, requiriendo conexión a internet para login.
- **Licencia:** Código liberado bajo licencia MIT con repositorio público y demo funcional.

## Implicit Decisions (candidates)

- [candidate-decision] **Autenticación API:** Usar Laravel Sanctum para la emisión y validación de tokens Bearer derivados del flujo Discord OAuth2.
- [candidate-decision] **Motor de Recomendación:** Implementar el algoritmo de generación en el backend (PHP) como servicio determinista basado en matrices de ponderación de habilidades y tags de cursos.
- [candidate-decision] **Visualización de Rutas:** Emplear maquetación visual interactiva en Angular basada en TailwindCSS y layouts CSS Flex/Grid.

## Open Questions

- [open] ¿Se habilitará un mecanismo de mock o bypass local para la autenticación de Discord para facilitar pruebas de desarrollo cuando no haya conexión a la API externa?
- [open] ¿La persistencia del catálogo de cursos se realizará exclusivamente mediante migraciones y seeders o se expondrá algún endpoint administrativo protegido?
- [open] ¿El cálculo de progreso debe actualizarse automáticamente mediante webhooks de DevTalles o será autogestionado por el estudiante marcando casillas?

## Areas Requiring Human Validation

- Confirmación de las credenciales de la aplicación en el Discord Developer Portal (Client ID, Client Secret, Redirect URI).
- Validación de la estructura y formato de los datos de los cursos de DevTalles para diseñar el seeder inicial.

---
type: chore
id: WI-001
title: >-
  Inicializar estructura del monorepo con Docker Compose para Laravel, Angular y
  MySQL
knowledge_level: K2
status: completed
phase: now
initiative: Configuración de Infraestructura y Monorepo
domains:
  - Experiencia de Usuario (User Experience)
code:
  - docker-compose.yml
  - backend/**
  - frontend/**
  - Makefile
  - README.md
created_at: 2026-09-18T00:00:00.000Z
source: roadmap
source_id: WI-001
source_initiative: RM-001
source_roadmap_initiative: RM-001
source_work_item_candidate: WI-001
source_title: >-
  Inicializar estructura del monorepo con Docker Compose para Laravel, Angular y
  MySQL
source_context: Materialized from roadmap candidate WI-001 under initiative RM-001.
source_initiative_title: Configuración de Infraestructura y Monorepo
related_domain: Experiencia de Usuario (User Experience)
related_capabilities:
  - Visualización Interactiva de Ruta (Roadmap View)
expected_value: >-
  Servicios backend, frontend y db levantando simultáneamente con variables de
  entorno segregadas.
risks:
  - >-
    Problemas de configuración de red interna o CORS entre los contenedores de
    frontend y backend.
dependencies: []
source_signals:
  - >-
    Business Goal: Cumplir con los estándares de entrega del hackathon Code
    Quest 2026 (código funcional, repositorio público y demo desplegada).
  - >-
    Tech Decision Candidate: Contenedorización para desarrollo y despliegue
    mediante Docker Compose.
summary: >-
  Inicializar estructura del monorepo con Docker Compose para Laravel, Angular y
  MySQL
ready_at: '2026-09-18'
---

# Inicializar estructura del monorepo con Docker Compose para Laravel, Angular y MySQL

> Type: chore · Level: K2

## Source

- Source: roadmap
- Roadmap Initiative: RM-001 — Configuración de Infraestructura y Monorepo
- Work Item Candidate: WI-001
- Related domain: Experiencia de Usuario (User Experience)
- Related capabilities:
  - Visualización Interactiva de Ruta (Roadmap View)

**Actor and outcome:**
El desarrollador o evaluador del proyecto ejecuta un comando único (`docker compose up`) y obtiene todo el stack (Laravel 11 API, Angular 17+ SPA y base de datos MySQL 8.0) levantado, comunicado y listo para el desarrollo y validación.

**Current behavior:**
El repositorio solo cuenta con la documentación de conocimiento en `knowledge/` y configuraciones de Kaddo. No existen las carpetas `backend/`, `frontend/`, ni el archivo `docker-compose.yml`.

**Target behavior:**
Existe la estructura básica del monorepo con:
1. `docker-compose.yml` orquestando los 3 servicios con red compartida y variables de entorno (`.env.example`).
2. Directorio `backend/` con el scaffolding inicial de Laravel 11 y Dockerfile configurado con PHP 8.2+ y extensiones requeridas.
3. Directorio `frontend/` con el scaffolding inicial de Angular y Dockerfile para desarrollo.
4. Contenedor de MySQL 8.0 con volumen persistente y credenciales configurables.
5. Archivo `README.md` actualizado con instrucciones claras de levantamiento local.

**Entry points:**
- Terminal: `docker compose up -d` / `docker compose ps`
- Navegador web (Frontend): `http://localhost:4200`
- API REST (Backend): `http://localhost:8000/api`
- MySQL: `localhost:3306`

**End-to-end flow:**
1. El usuario clona el repositorio y copia el archivo de entorno (`cp .env.example .env`).
2. Ejecuta `docker compose up -d --build`.
3. Docker descarga las imágenes base, compila los contenedores de backend y frontend, y arranca la base de datos MySQL.
4. El backend responde exitosamente a una petición GET en `/api/health` o `/api`.
5. El frontend responde con la vista inicial en `http://localhost:4200`.

**Problem:**
No existe un entorno de desarrollo local reproducible ni la estructura de directorios del monorepo, lo cual impide comenzar el desarrollo de las funcionalidades planificadas.

**Expected result:**
Servicios backend, frontend y db levantando simultáneamente con variables de entorno segregadas y comunicación funcional entre contenedores.

**Suggested Knowledge Level:** K2

**Impact analysis:**
- Frontend: `affected` (scaffolding inicial de la aplicación cliente y Dockerfile de desarrollo).
- Backend: `affected` (scaffolding inicial de la API en Laravel y Dockerfile con PHP 8.2).
- Database: `affected` (servicio MySQL 8.0 configurado en docker-compose con volumen persistente).
- Configuration: `affected` (`docker-compose.yml`, `.env.example`, `.gitignore`).
- Operations: `affected` (proceso de levantamiento de entorno local).
- Documentation: `affected` (instrucciones en `README.md`).

**Module coverage:**
- `not-applicable` (monorepo unificado).

**Scope unknowns:**
- Ninguno crítico; tecnologías y puertos estándar.

**Scope confidence:** high
- La configuración de Docker Compose para Laravel + Angular + MySQL es una práctica estándar y bien probada.

## Acceptance Criteria

- [x] AC-1: `docker-compose.yml` define los servicios `backend`, `frontend` y `db` conectados a una misma red Docker interna.
- [x] AC-2: El backend en `backend/` ejecuta Laravel con PHP 8.2+, tiene extensiones PDO MySQL habilitadas y responde HTTP 200 en `http://localhost:8000/api`.
- [x] AC-3: El frontend en `frontend/` ejecuta Angular y es accesible desde `http://localhost:4200`.
- [x] AC-4: El servicio de base de datos inicializa MySQL 8.0 y permite la conexión exitosa desde el backend mediante credenciales de entorno.
- [x] AC-5: Existe un archivo `.env.example` con variables de entorno para DB, backend y frontend.
- [x] AC-6: `README.md` incluye los pasos para clonar, configurar variables y ejecutar el proyecto con Docker.

## Out of scope

- Implementación de rutas de negocio (auth Discord, cuestionario, catálogo, progreso).
- Configuración de certificados SSL en desarrollo.
- Despliegue en servidores cloud o CI/CD externo.

## Validation

1. Ejecutar:
   ```bash
   cp .env.example .env && docker compose up -d --build
   ```
2. Validar estado de contenedores:
   ```bash
   docker compose ps
   ```
   (Todos los servicios deben mostrar estado `running` / `Up`).
3. Probar respuesta backend:
   ```bash
   curl -I http://localhost:8000/api
   ```
4. Probar frontend:
   ```bash
   curl -I http://localhost:4200
   ```
5. Ejecutar `kaddo guard` para asegurar coherencia en el repositorio.

## Definition of Done

- [x] Problem is clear.
- [x] Expected result is defined.
- [x] Impact of not doing it is stated.
- [x] Acceptance criteria are verifiable.
- [x] Concrete validation steps are documented.

## Open Questions

- Ninguna pregunta bloqueante para este work item.

**Suggested ownership (code globs):**
- `docker-compose.yml`
- `backend/**`
- `frontend/**`
- `README.md`

**Related domain / capability:**
- Related domain: Experiencia de Usuario (User Experience)
- Related capability: Visualización Interactiva de Ruta (Roadmap View)

**Related decisions:**
- Afectado por la decisión de contenedorización y arquitectura desacoplada documentada en `knowledge/tech/current-state.md`.

## Learning

Se estructuró el monorepo desacoplado con Docker Compose, orquestando el backend Laravel (PHP 8.2), el frontend Angular y la base de datos MySQL 8.0 en una red bridge aislada (`codequest-network`). Se establecieron entrypoints compatibles con contenedores y ejecución local, junto con variables de entorno segregadas y un Makefile para simplificar la productividad del equipo y la evaluación del hackathon.

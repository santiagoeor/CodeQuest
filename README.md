# CodeQuest 2026 — DevTalles Hackathon

Plataforma web interactiva para la comunidad de DevTalles que genera rutas de aprendizaje dinámicas y personalizadas según el perfil técnico y metas del estudiante, permitiendo autenticación vía Discord OAuth2, gestión de múltiples itinerarios y seguimiento de progreso.

---

## Estructura del Monorepo

```text
.
├── backend/            # API REST en Laravel 11 (PHP 8.2+)
│   ├── app/            # Controladores, Modelos y Servicios de negocio
│   ├── database/       # Migraciones y Seeders (Cursos DevTalles y Cuestionario)
│   ├── routes/api.php  # Endpoints de la API
│   └── Dockerfile      # Imagen PHP 8.2 con extensiones PDO MySQL
├── frontend/           # Aplicación SPA en Angular 17+
│   ├── src/app/        # Componentes, servicios, guards y modelos
│   └── Dockerfile      # Entorno de desarrollo para Angular
├── docker-compose.yml  # Orquestación de backend, frontend y MySQL 8.0
├── Makefile            # Atajos de desarrollo
└── knowledge/          # Conocimiento del proyecto gestionado con Kaddo (KDD)
```

---

## Requisitos Previos

- [Docker](https://docs.docker.com/get-docker/) y Docker Compose v2.
- (Opcional para ejecución local sin Docker) Node.js 20+, PHP 8.2+ y Composer.

---

## Inicio Rápido con Docker

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/<tu-usuario>/CodeQuest.git
   cd CodeQuest
   ```

2. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   ```

3. **Levantar los servicios:**
   ```bash
   make up
   # o alternativamente: docker compose up -d --build
   ```

4. **Verificar estado de los contenedores:**
   ```bash
   make ps
   ```

---

## Puntos de Acceso

- **Frontend (Angular):** [http://localhost:4200](http://localhost:4200)
- **Backend API (Laravel):** [http://localhost:8000/api](http://localhost:8000/api)
- **API Health Check:** [http://localhost:8000/api/health](http://localhost:8000/api/health)
- **Base de Datos (MySQL):** `localhost:3306` (Base de datos: `codequest`, Usuario: `codequest`)

---

## Metodología y Gobernanza

Este proyecto utiliza **[Kaddo](https://github.com/kaddo-org)** para el Desarrollo Guiado por Conocimiento (KDD).
Antes de realizar cambios arquitectónicos o agregar Work Items, consulta la carpeta [`knowledge/`](knowledge/).

Comandos útiles de Kaddo:
```bash
kaddo status
kaddo understand
kaddo guard
```

---

## Licencia

Este proyecto está bajo la Licencia **MIT** — consulta el archivo LICENSE para más detalles.

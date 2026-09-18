---
type: codebase
project_state: ai-assisted
generated_by: kaddo-bootstrap
refined_by: architecture-agent
template_version: 1
---

> Idioma del proyecto: **español**. Escribe este conocimiento en español. Mantén en inglés el código, los nombres de archivo, los comandos y las claves de configuración.

# Codebase Map

## Repository structure

Monorepo organizado en frontend, backend y configuración de entorno:

```text
/
├── backend/            # API REST construida con Laravel
│   ├── app/            # Modelos, Controllers, Servicios
│   ├── routes/api.php  # Endpoints REST
│   └── database/       # Migraciones y seeders (cursos, cuestionarios)
├── frontend/           # SPA construida con Angular
│   ├── src/app/        # Componentes, servicios, guards, modelos
│   └── src/assets/     # Recursos estáticos
├── docker-compose.yml  # Orquestación de backend, frontend y MySQL
└── README.md           # Guía de instalación, ejecución y variables de entorno
```

## Environment and Tooling

- **Backend runtime:** PHP 8.2 gestionado con Composer y framework Laravel para servicios RESTful.
- **Frontend runtime:** Node.js 20 con framework Angular y TypeScript para la aplicación cliente SPA.
- **Persistencia local:** Contenedor oficial de MySQL 8.0 orquestado mediante Docker Compose.
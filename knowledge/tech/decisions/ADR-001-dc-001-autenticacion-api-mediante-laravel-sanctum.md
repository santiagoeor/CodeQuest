---
type: adr
id: ADR-001
title: "Autenticación API mediante Laravel Sanctum"
status: draft
date: 2026-09-19
created_from: knowledge/tech/discovery/decision-candidates.md
candidate_id: DC-001
governed_paths:
  - "backend/app/Http/Controllers/Auth/**"
  - "backend/routes/api.php"
  - "backend/config/sanctum.php"
related_capabilities:
  - "Autenticación e Identidad vía Discord OAuth2"
related_work_items:
  - WI-005
  - WI-006
---

# ADR-001: Autenticación API mediante Laravel Sanctum

## Contexto

Se requiere autenticar y mantener la sesión de usuarios federados vía Discord OAuth2 de manera simple, ligera y segura para el consumo desde la Single Page Application (SPA) en Angular. La API de CodeQuest actúa como backend decoupled y debe emitir tokens de autenticación Bearer para las rutas protegidas del usuario (perfil, rutas guardadas y registro de progreso).

## Opciones Consideradas

1. **Laravel Passport (OAuth2 server completo)**:
   - *Pros*: Soporte estándar completo de especificación OAuth2 (RFC 6749) con grants avanzados.
   - *Contras*: Excesivamente pesado y complejo para una API interna donde la autenticación federada la provee un tercero (Discord) y no se requiere que CodeQuest sea un servidor OAuth2 para clientes externos. Requiere claves criptográficas RSA, múltiples tablas y configuración densa.

2. **JWT Custom (`tymon/jwt-auth`)**:
   - *Pros*: Tokens stateless estándar.
   - *Contras*: Paquete de terceros con mantenimiento variable en versiones recientes de Laravel (Laravel 11), mayor sobrecarga en gestión de rotación y revocación manual.

3. **Laravel Sanctum (Tokens personales de API)**:
   - *Pros*: Ligero, mantenido oficialmente por el core de Laravel, integrado de forma nativa en Laravel 11. Permite emisión inmediata de tokens Bearer (`createToken`) asociados al modelo `User`, fácil revocación (`tokens()->delete()`) y protección simple mediante middleware `auth:sanctum`.
   - *Contras*: Los tokens se almacenan en la base de datos (tabla `personal_access_tokens`), lo que implica una consulta indexada por petición autenticada (despreciable para el tráfico del MVP del hackathon).

## Decisión

Adoptar **Laravel Sanctum** como mecanismo de autenticación para la API REST de CodeQuest. El backend recibirá el callback de Discord OAuth2, buscará o creará al usuario local, y generará un token personal de acceso con Sanctum que será retornado a la SPA de Angular para su almacenamiento seguro y envío en cabeceras `Authorization: Bearer <token>`.

## Consecuencias

### Positivas:
- Cero dependencias externas complejas fuera del ecosistema nativo de Laravel 11.
- Middleware estándar `auth:sanctum` aplicable de inmediato en `routes/api.php`.
- Capacidad de revocar tokens individualmente al cerrar sesión.
- Trazabilidad y simplicidad alineada con los tiempos del hackathon.

### Negativas / Compromisos:
- Requiere asegurar la migración de la tabla `personal_access_tokens` en la base de datos.
- Las consultas autenticadas verifican el token contra la base de datos.

## Related Capabilities

- Autenticación e Identidad vía Discord OAuth2

## Related Work Items

- WI-005: Implementar flujo backend para Discord OAuth2 y emisión de tokens Sanctum
- WI-006: Integrar botón de inicio de sesión con Discord y guards de autenticación en Angular

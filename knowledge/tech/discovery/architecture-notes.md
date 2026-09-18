---
type: discovery-notes
project_state: ai-assisted
generated_by: architecture-agent
template_version: 1
---

# Architecture Notes — CodeQuest

## Summary

Notas de soporte arquitectónico generadas para la fase de refinamiento técnico de CodeQuest.

## Component Communication Flow

1. **Client Request:** La SPA en Angular emite peticiones HTTP asíncronas con cabecera `Authorization: Bearer <token>` cuando el usuario está autenticado.
2. **Gateway / Web Server:** Nginx recibe la petición en el puerto 80/443; los prefijos `/api/*` son delegados a PHP-FPM (Laravel).
3. **Backend Processing:**
   - Middleware de autenticación (Sanctum) verifica la validez del token.
   - Los controladores interactúan con los servicios de dominio (`LearningPathGeneratorService`, `DiscordOAuthService`).
   - Los modelos Eloquent consultan y persisten el estado en MySQL 8.0.
4. **Client Response:** La API devuelve respuestas estandarizadas en formato JSON estructurado.

## State Management Strategy (Frontend)

- Uso de Signals y RxJS en Angular para gestión de reactividad fina en componentes de UI.
- Servicio de sesión (`AuthService`) que conserva el token JWT / Sanctum en almacenamiento seguro local (`localStorage` / cookies HttpOnly según convenga).
- Store ligero para el estado del cuestionario antes del guardado definitivo de la ruta.

---
type: product
project_state: new
generated_by: kaddo-bootstrap
template_version: 1
---

> Idioma del proyecto: **español**. Escribe este conocimiento en español. Mantén en inglés el código, los nombres de archivo, los comandos y las claves de configuración.

# Product Context

## Product vision

Una aplicación web interactiva que genera y gestiona rutas de aprendizaje dinámicas y personalizadas basadas en un cuestionario de habilidades e intereses, permitiendo al usuario registrarse vía Discord, guardar múltiples itinerarios y medir su avance por curso.

## User journeys

1. **Ingreso y autenticación**: El usuario ingresa a la plataforma y se autentica mediante Discord OAuth2 (o registro manual).
2. **Evaluación de perfil**: El estudiante completa un cuestionario sobre su nivel actual, intereses tecnológicos y metas laborales.
3. **Generación de ruta**: El sistema procesa las respuestas y genera una ruta de aprendizaje dinámica compuesta por cursos ordenados de DevTalles.
4. **Gestión y seguimiento**: El usuario guarda la ruta generada, explora los detalles de cada curso y marca su progreso a medida que avanza.
5. **Múltiples rutas**: El usuario puede reiniciar la evaluación o crear itinerarios adicionales para explorar otras especialidades.

## Scope

### In Scope
- Autenticación con Discord (OAuth2) y sesión de usuario.
- Cuestionario interactivo de intereses, nivel técnico y objetivos.
- Motor de recomendación/generación dinámica de rutas con cursos de DevTalles.
- Persistencia de múltiples rutas por usuario en base de datos.
- Seguimiento de progreso (marcar cursos/pasos completados).
- Interfaz de usuario responsiva y accesible.

### Out of Scope
- Integración con pasarelas de pago o compra directa de cursos.
- Reproductor de video nativo para los cursos (se redirige o vincula a la plataforma oficial).
- Gestión administrativa masiva de contenidos en esta primera entrega.

## Success criteria

- Inicio de sesión funcional con Discord ID.
- Generación de rutas coherentes a partir de las respuestas del cuestionario.
- Persistencia correcta de rutas y porcentaje de avance por usuario en MySQL.
- Aplicación completamente funcional en entorno local y desplegada en producción.
# Informe técnico - Plataforma de Micro-credenciales Corporativas

## 1. Descripción general

La solución implementa una plataforma EdTech empresarial orientada a la gestión de micro-credenciales corporativas. Permite registrar usuarios, iniciar sesión con JWT, consultar rutas de capacitación, inscribirse en micro-credenciales y emitir una credencial verificable cuando el colaborador finaliza una formación.

## 2. Cumplimiento de requisitos

| Requisito | Implementación |
| --- | --- |
| Backend Spring Boot | Proyecto Maven en `backend/` con Spring Boot, Spring Web, Spring Security, JPA y H2. |
| JWT Login y Registro | Endpoints `/api/auth/register` y `/api/auth/login`, firma JWT, filtro Bearer y roles. |
| Dos servicios según tema | `MicroCredentialService` y `EnrollmentService`. |
| Frontend Angular 21 | Proyecto en `frontend/` con rutas, componentes, formularios reactivos e interceptor JWT. |
| Consumo Backend | Servicios Angular usan `HttpClient` hacia `/api`. |
| Dockerización Backend | `backend/Dockerfile` multi-stage y `docker-compose.yml`. |
| Variables y red Docker | Compose define `edtech-net`, volumen y variables como `JWT_SECRET`, `PORT`, `CORS_ALLOWED_ORIGINS`. |
| Cloud permitido | Script `deploy/gcp-cloud-run.sh` para Google Cloud Run. |

## 3. Arquitectura

```text
Angular 21 SPA
   │ HTTP + JWT Bearer
   ▼
Spring Boot REST API
   │
   ├── AuthService: registro, login, emisión de JWT
   ├── MicroCredentialService: CRUD de credenciales
   ├── EnrollmentService: inscripción y emisión
   └── DashboardService: métricas resumen
   │
   ▼
H2 file database
```

## 4. Modelo de datos

### AppUser

Representa usuarios de la plataforma. Maneja nombre, email, password cifrado y rol.

### MicroCredential

Representa una micro-credencial corporativa: título, área empresarial, descripción, nivel, duración, emisor, habilidades y estado activo.

### Enrollment

Representa la inscripción de un usuario a una micro-credencial. Puede estar en progreso o emitida. Incluye código de verificación y fechas de emisión/vencimiento.

## 5. Seguridad

- `BCryptPasswordEncoder` para almacenar contraseñas.
- Tokens JWT firmados con clave secreta Base64.
- `JwtAuthenticationFilter` valida el token en cada petición protegida.
- `SecurityFilterChain` define rutas públicas y protegidas.
- `@PreAuthorize("hasRole('ADMIN')")` protege acciones administrativas.

## 6. Despliegue

Se propone Google Cloud Run porque ejecuta contenedores HTTP y permite escalar a cero. El script de despliegue construye la imagen con Cloud Build, la sube a Artifact Registry y despliega el servicio en Cloud Run.

## 7. Pruebas recomendadas

1. Levantar backend con Docker.
2. Verificar health check.
3. Iniciar frontend.
4. Entrar como `admin@empresa.com` / `Admin123*`.
5. Crear una micro-credencial.
6. Entrar como `colaborador@empresa.com` / `User123*`.
7. Inscribirse y completar credencial.
8. Revisar dashboard.

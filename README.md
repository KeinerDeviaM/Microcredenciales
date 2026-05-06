# EdTech - Plataforma de Micro-credenciales Corporativas

Proyecto fullstack listo para entregar: **Angular 21 + Spring Boot + JWT + Docker + despliegue Cloud en Google Cloud Run**.

## 1. Alcance funcional

Tema empresarial: una plataforma EdTech para que empresas creen micro-credenciales internas, permitan inscripción de colaboradores y emitan constancias verificables.

Incluye:

- Backend en Spring Boot con API REST.
- Autenticación JWT con registro y login funcional.
- Dos servicios de negocio:
  1. Servicio de micro-credenciales corporativas.
  2. Servicio de inscripciones/emisión de credenciales.
- Frontend Angular 21 que consume el backend.
- Dockerfile multi-stage para el backend.
- Docker Compose con red, variables de entorno y volumen de datos.
- Script de despliegue del backend dockerizado en Google Cloud Run.
- Datos semilla para probar de inmediato.

## 2. Credenciales de prueba

Al iniciar el backend se crean estos usuarios:

| Rol | Email | Password |
| --- | --- | --- |
| ADMIN | admin@empresa.com | Admin123* |
| USER | colaborador@empresa.com | User123* |

## 3. Ejecutar backend con Docker

Desde la raíz del proyecto:

```bash
docker compose up --build
```

Health check:

```bash
curl http://localhost:8080/actuator/health
```

API base:

```text
http://localhost:8080/api
```

## 4. Ejecutar frontend Angular 21 en local

```bash
cd frontend
npm install
npm start
```

Abrir:

```text
http://localhost:4200
```

## 5. Ejecutar backend sin Docker, solo para desarrollo

Requiere Java 21 y Maven instalado:

```bash
cd backend
mvn spring-boot:run
```

## 6. Endpoints principales

### Auth

```http
POST /api/auth/register
POST /api/auth/login
```

### Micro-credenciales

```http
GET    /api/credentials
GET    /api/credentials/{id}
POST   /api/credentials        # ADMIN
PUT    /api/credentials/{id}   # ADMIN
DELETE /api/credentials/{id}   # ADMIN
```

### Inscripciones / emisión

```http
GET   /api/enrollments/me
POST  /api/enrollments
PATCH /api/enrollments/{id}/complete
```

### Dashboard

```http
GET /api/dashboard/summary
```

## 7. Despliegue Cloud permitido: Google Cloud Run

El backend se despliega como contenedor Docker en Google Cloud Run.

### Requisitos en tu máquina

Instalar por consola:

```bash
# Google Cloud CLI
# https://cloud.google.com/sdk/docs/install

gcloud auth login
gcloud auth application-default login
```

### Desplegar

Edita el proyecto si lo necesitas y luego ejecuta:

```bash
chmod +x deploy/gcp-cloud-run.sh
./deploy/gcp-cloud-run.sh TU_PROJECT_ID us-central1
```

Al final el script imprime la URL pública del backend. Después puedes poner esa URL en:

```text
frontend/src/environments/environment.ts
```

Ejemplo:

```ts
export const environment = {
  production: false,
  apiUrl: 'https://TU-SERVICIO.run.app/api'
};
```

## 8. Variables de entorno importantes

| Variable | Uso |
| --- | --- |
| `PORT` | Puerto usado por Cloud Run o Docker. Default: 8080 |
| `JWT_SECRET` | Llave secreta Base64 para firmar JWT |
| `JWT_EXPIRATION_MS` | Duración del token. Default: 86400000 |
| `CORS_ALLOWED_ORIGINS` | Orígenes permitidos para Angular |
| `SPRING_DATASOURCE_URL` | URL JDBC. Default: H2 en archivo |

Generar una llave segura:

```bash
openssl rand -base64 64
```

## 9. Estructura del proyecto

```text
edtech-microcredenciales-corporativas/
├── backend/
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/...
├── frontend/
│   ├── angular.json
│   ├── package.json
│   └── src/...
├── deploy/
│   └── gcp-cloud-run.sh
├── docs/
│   └── INFORME_PROYECTO.md
├── docker-compose.yml
└── README.md
```

## 10. Notas para sustentación

- La seguridad es stateless con Spring Security y JWT.
- Las rutas `/api/auth/**` y `/actuator/health` son públicas.
- Las demás rutas requieren token Bearer.
- Las operaciones de administración sobre micro-credenciales requieren rol `ADMIN`.
- El frontend guarda el token en `localStorage` y lo envía automáticamente con un interceptor HTTP.
- El backend usa H2 en archivo para facilitar pruebas y despliegue gratuito sin pagar una base de datos externa.

# Checklist de validación

## Backend

- [ ] `docker compose up --build` inicia el contenedor backend.
- [ ] `GET http://localhost:8080/actuator/health` responde `UP`.
- [ ] `POST /api/auth/login` entrega token JWT.
- [ ] `POST /api/auth/register` crea usuarios nuevos con rol `USER`.
- [ ] `GET /api/credentials` funciona con token Bearer.
- [ ] `POST /api/credentials` solo funciona con usuario `ADMIN`.
- [ ] `POST /api/enrollments` inscribe un usuario en una micro-credencial.
- [ ] `PATCH /api/enrollments/{id}/complete` emite código verificable.

## Frontend

- [ ] `npm install` instala dependencias Angular 21.
- [ ] `npm start` sirve la app en `http://localhost:4200`.
- [ ] Login admin funciona con `admin@empresa.com / Admin123*`.
- [ ] Login colaborador funciona con `colaborador@empresa.com / User123*`.
- [ ] El interceptor agrega `Authorization: Bearer <token>`.
- [ ] El catálogo consume `/api/credentials`.
- [ ] Mis credenciales consume `/api/enrollments/me`.

## Docker y Cloud

- [ ] El backend compila desde `backend/Dockerfile`.
- [ ] `docker-compose.yml` usa red `edtech-net`.
- [ ] Las variables `JWT_SECRET`, `PORT`, `CORS_ALLOWED_ORIGINS` están configuradas.
- [ ] `deploy/gcp-cloud-run.sh` despliega el contenedor en Google Cloud Run.

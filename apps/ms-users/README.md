# MS-Users — Microservicio de Usuarios

Microservicio construido con **NestJS + TypeScript + TypeORM**. Gestiona el registro, autenticación y administración de usuarios sobre **PostgreSQL**.

- **Puerto:** `3001`
- **Swagger UI:** `http://localhost:3001/api`
- **Prefijo global:** `/api`
- **Base de datos:** PostgreSQL (puerto `5432`)

---

## Instalación

```bash
# Desde la raíz del monorepo
npm install

# O directamente en esta carpeta
cd apps/ms-users
npm install
```

---

## Configuración de base de datos

Crea o edita el archivo `.env` en `apps/ms-users/`:

```env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USER=users_user
DB_PASSWORD=users_password
DB_NAME=smartlogix_users
```

| Variable      | Descripción                            |
|---------------|----------------------------------------|
| `PORT`        | Puerto en que escucha el microservicio |
| `DB_HOST`     | Host del servidor PostgreSQL           |
| `DB_PORT`     | Puerto de PostgreSQL                   |
| `DB_USER`     | Usuario de la base de datos            |
| `DB_PASSWORD` | Contraseña del usuario                 |
| `DB_NAME`     | Nombre de la base de datos             |

> El esquema inicial se crea automáticamente desde `apps/ms-users/db/init.sql` al levantar el contenedor Docker del proyecto. Si usas una instancia PostgreSQL externa, ejecuta ese script manualmente.

Para levantar la base de datos con Docker:

```bash
# Desde la raíz del monorepo
docker-compose up -d
```

---

## Ejecución

```bash
# Desde la raíz del monorepo (recomendado)
npm run dev:users

# Directamente en esta carpeta
npm run start:dev   # modo watch
npm run start       # modo producción
```

---

## Pruebas unitarias

Este servicio usa **Jest** con **ts-jest**.

```bash
# Ejecutar todos los tests
npm run test

# Modo watch (re-ejecuta al guardar cambios)
npm run test:watch

# Reporte de cobertura de código
npm run test:cov

# Tests e2e
npm run test:e2e
```

### Ver métricas de cobertura

Luego de ejecutar `npm run test:cov`, se genera la carpeta `coverage/` con un reporte HTML:

```
apps/ms-users/coverage/lcov-report/index.html
```

Abre ese archivo en el navegador para ver el porcentaje de cobertura por archivo, línea y rama.

El archivo de test principal es `src/users/users.service.spec.ts`.

---

## Endpoints principales

> Este servicio es de uso **interno** — el BFF actúa como proxy. No expone autenticación JWT propia.

| Método   | Ruta                      | Descripción                              |
|----------|---------------------------|------------------------------------------|
| `GET`    | `/api/users`              | Listar todos los usuarios                |
| `GET`    | `/api/users/:id`          | Obtener usuario por ID (UUID)            |
| `POST`   | `/api/users/login`        | Validar credenciales (uso interno BFF)   |
| `POST`   | `/api/users/register`     | Registrar un nuevo usuario               |
| `PATCH`  | `/api/users/:id`          | Actualizar datos de un usuario           |
| `DELETE` | `/api/users/:id`          | Eliminar un usuario                      |

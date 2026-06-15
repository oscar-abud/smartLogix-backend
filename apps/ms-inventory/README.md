# MS-Inventory — Microservicio de Inventario

Microservicio construido con **NestJS + TypeScript + TypeORM**. Gestiona almacenes, tipos de inventario, ítems/productos y la relación usuario-almacén sobre **PostgreSQL**.

- **Puerto:** `3002`
- **Swagger UI:** `http://localhost:3002/api`
- **Prefijo global:** `/api`
- **Base de datos:** PostgreSQL (puerto `5433`)

---

## Instalación

```bash
# Desde la raíz del monorepo
npm install

# O directamente en esta carpeta
cd apps/ms-inventory
npm install
```

---

## Configuración de base de datos

Crea o edita el archivo `.env` en `apps/ms-inventory/`:

```env
PORT=3002
DB_HOST=localhost
DB_PORT=5433
DB_USER=inventory_user
DB_PASSWORD=inventory_password
DB_NAME=smartlogix_inventory
```

| Variable      | Descripción                            |
|---------------|----------------------------------------|
| `PORT`        | Puerto en que escucha el microservicio |
| `DB_HOST`     | Host del servidor PostgreSQL           |
| `DB_PORT`     | Puerto de PostgreSQL                   |
| `DB_USER`     | Usuario de la base de datos            |
| `DB_PASSWORD` | Contraseña del usuario                 |
| `DB_NAME`     | Nombre de la base de datos             |

> El esquema inicial se crea automáticamente desde `apps/ms-inventory/db/init.sql` al levantar el contenedor Docker del proyecto. Si usas una instancia PostgreSQL externa, ejecuta ese script manualmente.

Para levantar la base de datos con Docker:

```bash
# Desde la raíz del monorepo
docker-compose up -d
```

---

## Ejecución

```bash
# Desde la raíz del monorepo (recomendado)
npm run dev:inventory

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
apps/ms-inventory/coverage/lcov-report/index.html
```

Abre ese archivo en el navegador para ver el porcentaje de cobertura por archivo, línea y rama.

El archivo de test principal es `src/inventory/inventory.controller.spec.ts`.

---

## Endpoints principales

> Este servicio es de uso **interno** — el BFF actúa como proxy. Algunas rutas reciben el ID del usuario mediante el header `x-user-id` en lugar del body.

### Almacenes

| Método   | Ruta                                          | Descripción                                        |
|----------|-----------------------------------------------|----------------------------------------------------|
| `GET`    | `/api/inventory`                              | Listar todos los almacenes                         |
| `GET`    | `/api/inventory/:id`                          | Obtener almacén por ID                             |
| `POST`   | `/api/inventory`                              | Crear nuevo almacén (`x-user-id` en header)        |
| `DELETE` | `/api/inventory/:id`                          | Eliminar almacén                                   |

### Tipos de inventario

| Método   | Ruta                          | Descripción                          |
|----------|-------------------------------|--------------------------------------|
| `GET`    | `/api/inventory/types`        | Listar todos los tipos               |
| `POST`   | `/api/inventory/types`        | Crear nuevo tipo de inventario       |

### Ítems / Productos

| Método   | Ruta                                     | Descripción                                    |
|----------|------------------------------------------|------------------------------------------------|
| `GET`    | `/api/inventory/items`                   | Listar todos los ítems                         |
| `GET`    | `/api/inventory/items/:itemId`           | Obtener ítem por ID                            |
| `POST`   | `/api/inventory/:id/items`               | Agregar ítem a un almacén                      |
| `PATCH`  | `/api/inventory/items/:itemId/stock`     | Actualizar stock (suma o resta)                |

### Relación usuario-almacén

| Método   | Ruta                                             | Descripción                                        |
|----------|--------------------------------------------------|----------------------------------------------------|
| `POST`   | `/api/inventory/:inventoryId/users`              | Vincular usuario a almacén (`x-user-id` en header) |
| `PATCH`  | `/api/inventory/:inventoryId/users`              | Actualizar relación usuario-almacén                |
| `DELETE` | `/api/inventory/:inventoryId/users/:userId`      | Desvincular usuario de almacén                     |

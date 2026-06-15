# MS-Orders — Microservicio de Órdenes

Microservicio construido con **NestJS + TypeScript + TypeORM**. Gestiona la creación, consulta y actualización de órdenes de compra sobre **PostgreSQL**.

- **Puerto:** `3003`
- **Swagger UI:** `http://localhost:3003/api`
- **Prefijo global:** `/api`
- **Base de datos:** PostgreSQL (puerto `5434`)

---

## Instalación

```bash
# Desde la raíz del monorepo
npm install

# O directamente en esta carpeta
cd apps/ms-orders
npm install
```

---

## Configuración de base de datos

Crea o edita el archivo `.env` en `apps/ms-orders/`:

```env
PORT=3003
DB_HOST=localhost
DB_PORT=5434
DB_USER=orders_user
DB_PASSWORD=orders_password
DB_NAME=smartlogix_orders
```

| Variable      | Descripción                            |
|---------------|----------------------------------------|
| `PORT`        | Puerto en que escucha el microservicio |
| `DB_HOST`     | Host del servidor PostgreSQL           |
| `DB_PORT`     | Puerto de PostgreSQL                   |
| `DB_USER`     | Usuario de la base de datos            |
| `DB_PASSWORD` | Contraseña del usuario                 |
| `DB_NAME`     | Nombre de la base de datos             |

> El esquema inicial se crea automáticamente desde `apps/ms-orders/db/init.sql` al levantar el contenedor Docker del proyecto. Si usas una instancia PostgreSQL externa, ejecuta ese script manualmente.

Para levantar la base de datos con Docker:

```bash
# Desde la raíz del monorepo
docker-compose up -d
```

---

## Ejecución

```bash
# Desde la raíz del monorepo (recomendado)
npm run dev:orders

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
apps/ms-orders/coverage/lcov-report/index.html
```

Abre ese archivo en el navegador para ver el porcentaje de cobertura por archivo, línea y rama.

El archivo de test principal es `src/orders/orders.service.spec.ts`.

---

## Endpoints principales

> Este servicio es de uso **interno** — el BFF actúa como proxy. Al crear una orden, el microservicio consulta `ms-inventory` vía Axios para validar y descontar stock.

| Método   | Ruta                          | Descripción                                           |
|----------|-------------------------------|-------------------------------------------------------|
| `GET`    | `/api/orders`                 | Listar historial completo de órdenes                  |
| `GET`    | `/api/orders/:id`             | Obtener orden por ID numérico                         |
| `POST`   | `/api/orders`                 | Crear nueva orden (valida stock en ms-inventory)      |
| `PATCH`  | `/api/orders/:id/status`      | Actualizar estado de una orden                        |
| `DELETE` | `/api/orders/:id`             | Eliminar una orden                                    |

### Estados válidos de una orden

`PENDING` → `PROCESSING` → `SHIPPED` → `DELIVERED` / `CANCELLED`

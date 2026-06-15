# BFF — SmartLogix Gateway

Capa intermedia (Backend For Frontend) construida con **NestJS + TypeScript**. Actúa como punto de entrada único para el frontend React, centralizando autenticación JWT, orquestación de microservicios y documentación Swagger.

- **Puerto:** `3000`
- **Swagger UI:** `http://localhost:3000/docs`
- **Prefijo global:** `/api`

---

## Instalación

```bash
# Desde la raíz del monorepo
npm install

# O directamente en esta carpeta
cd apps/bff
npm install
```

---

## Ejecución

```bash
# Desde la raíz del monorepo (recomendado)
npm run dev:bff

# Directamente en esta carpeta
npm run start:dev   # modo watch
npm run start       # modo producción
```

> Los microservicios deben estar corriendo antes de iniciar el BFF. El orden recomendado es: `ms-users` → `ms-inventory` → `ms-orders` → `ms-shipping` → `bff`.

---

## Configuración de variables de entorno

Crea un archivo `.env` en `apps/bff/` con el siguiente contenido:

```env
JWT_SECRET=TU_FIRMA_SECRETA_SUPER_SEGURA
```

| Variable     | Descripción                                         | Default                            |
|--------------|-----------------------------------------------------|------------------------------------|
| `JWT_SECRET` | Clave secreta para firmar y verificar tokens JWT    | `TU_FIRMA_SECRETA_SUPER_SEGURA`    |

> Las URLs de los microservicios (`http://localhost:3001`, `3002`, `3003`, `3004`) están definidas directamente en los servicios del BFF. Si cambian de puerto, actualiza los archivos `auth.service.ts`, `inventory.service.ts`, `orders.service.ts` y `shipping.service.ts`.

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

Luego de ejecutar `npm run test:cov`, se genera la carpeta `coverage/` con un reporte HTML interactivo:

```
apps/bff/coverage/lcov-report/index.html
```

Abre ese archivo en el navegador para ver el porcentaje de cobertura por archivo, línea y rama.

---

## Endpoints principales

Todos los endpoints requieren el prefijo `/api`. Los marcados con 🔒 requieren `Authorization: Bearer <token>`.

### Auth (`/api/auth`)

| Método   | Ruta                  | Descripción                              | Auth |
|----------|-----------------------|------------------------------------------|------|
| `POST`   | `/api/auth/login`     | Autenticar usuario y obtener JWT         | —    |
| `POST`   | `/api/auth/register`  | Registrar nuevo usuario                  | 🔒   |
| `GET`    | `/api/auth/user`      | Listar todos los usuarios                | 🔒   |
| `GET`    | `/api/auth/user/:id`  | Obtener usuario por ID (UUID)            | 🔒   |
| `PATCH`  | `/api/auth/user/:id`  | Actualizar datos de un usuario           | 🔒   |
| `DELETE` | `/api/auth/user/:id`  | Eliminar un usuario                      | 🔒   |

### Inventory (`/api/inventory`)

| Método   | Ruta                                          | Descripción                              | Auth |
|----------|-----------------------------------------------|------------------------------------------|------|
| `GET`    | `/api/inventory`                              | Listar almacenes                         | 🔒   |
| `GET`    | `/api/inventory/types`                        | Listar tipos de inventario               | 🔒   |
| `GET`    | `/api/inventory/items`                        | Listar todos los ítems                   | 🔒   |
| `GET`    | `/api/inventory/items/:itemId`                | Obtener ítem por ID                      | 🔒   |
| `GET`    | `/api/inventory/:id`                          | Obtener almacén por ID                   | 🔒   |
| `POST`   | `/api/inventory`                              | Crear almacén                            | 🔒   |
| `POST`   | `/api/inventory/types`                        | Crear tipo de inventario                 | 🔒   |
| `POST`   | `/api/inventory/:id/items`                    | Agregar ítem a un almacén                | 🔒   |
| `PATCH`  | `/api/inventory/items/:itemId/stock`          | Actualizar stock de un ítem              | 🔒   |
| `DELETE` | `/api/inventory/:inventoryId/users/:userId`   | Desvincular usuario de almacén           | 🔒   |
| `DELETE` | `/api/inventory/:id`                          | Eliminar almacén                         | 🔒   |

### Orders (`/api/orders`)

| Método   | Ruta                        | Descripción                              | Auth |
|----------|-----------------------------|------------------------------------------|------|
| `GET`    | `/api/orders`               | Listar historial de órdenes              | 🔒   |
| `GET`    | `/api/orders/:id`           | Obtener orden por ID                     | 🔒   |
| `POST`   | `/api/orders`               | Crear nueva orden                        | 🔒   |
| `PATCH`  | `/api/orders/:id/status`    | Actualizar estado de una orden           | 🔒   |
| `DELETE` | `/api/orders/:id`           | Eliminar orden                           | 🔒   |

### Shipping (`/api/shipping`)

| Método   | Ruta                              | Descripción                                    | Auth |
|----------|-----------------------------------|------------------------------------------------|------|
| `GET`    | `/api/shipping`                   | Listar todos los despachos                     | 🔒   |
| `GET`    | `/api/shipping/:orderId`          | Obtener despacho por ID de orden               | 🔒   |
| `POST`   | `/api/shipping`                   | Crear registro de despacho                     | 🔒   |
| `PATCH`  | `/api/shipping/:orderId/status`   | Actualizar estado logístico de un despacho     | 🔒   |
| `DELETE` | `/api/shipping/:id`               | Eliminar despacho por ID nativo de MongoDB     | 🔒   |

> La documentación completa e interactiva está disponible en `http://localhost:3000/docs` (Swagger UI).

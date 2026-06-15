# MS-Shipping — Microservicio de Despachos

Microservicio construido con **Express.js + Mongoose** (Node.js puro, sin NestJS). Gestiona el ciclo de vida de los despachos logísticos sobre **MongoDB Atlas**.

- **Puerto:** `3004`
- **Base de datos:** MongoDB Atlas (cloud)
- **Prefijo de rutas:** `/api/shipping`

---

## Instalación

```bash
# Desde la raíz del monorepo
npm install

# O directamente en esta carpeta
cd apps/ms-shipping
npm install
```

---

## Configuración de base de datos (MongoDB Atlas)

La cadena de conexión está definida directamente en `apps/ms-shipping/api.js`. Reemplaza la variable `url` con tu propia cadena de conexión de MongoDB Atlas:

```js
// api.js
const url = "mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority"
```

Para obtener tu cadena de conexión:
1. Ingresa a [MongoDB Atlas](https://cloud.mongodb.com)
2. Selecciona tu cluster → **Connect** → **Drivers**
3. Copia la cadena `mongodb+srv://...` y reemplaza `<password>` con tu contraseña real

> Asegúrate de haber añadido la IP del servidor en la lista de acceso de tu cluster Atlas (**Network Access → Add IP Address**).

---

## Ejecución

```bash
# Desde la raíz del monorepo (recomendado)
npm run dev:shipping

# Directamente en esta carpeta
npm run dev     # modo watch con nodemon
npm run start   # modo producción
```

---

## Pruebas unitarias

Este microservicio no incluye configuración de tests. Al estar construido con Express.js puro, puedes agregar **Jest** o **Mocha** si se requiere cobertura.

Para verificar manualmente el funcionamiento, usa la colección de Postman incluida en el proyecto o el Swagger del BFF en `http://localhost:3000/docs`.

---

## Endpoints principales

> Este servicio es de uso **interno** — el BFF actúa como proxy hacia `http://localhost:3004/api/shipping`.

| Método   | Ruta                                   | Descripción                                               |
|----------|----------------------------------------|-----------------------------------------------------------|
| `GET`    | `/api/shipping`                        | Listar historial completo de despachos                    |
| `GET`    | `/api/shipping/order/:orderId`         | Obtener despacho por ID numérico de orden                 |
| `GET`    | `/api/shipping/id/:id`                 | Obtener despacho por ID nativo de MongoDB (hash hex)      |
| `POST`   | `/api/shipping`                        | Crear registro de despacho                                |
| `PATCH`  | `/api/shipping/:orderId/status`        | Actualizar estado logístico del despacho                  |
| `DELETE` | `/api/shipping/:id`                    | Eliminar despacho por ID nativo de MongoDB                |

### Estados válidos de un despacho

`PREPARING` → `IN_TRANSIT` → `DELIVERED` / `FAILED`

### Estructura del body para `POST /api/shipping`

```json
{
  "order": {
    "id": 1,
    "items": [{ "quantity": 3 }],
    "createdAt": "2025-01-01T00:00:00.000Z"
  },
  "formManualData": {
    "recipientName": "Juan Pérez",
    "shippingAddress": "Av. Siempre Viva 742",
    "shippingDistrict": "Las Condes",
    "shippingCity": "Santiago"
  }
}
```

```markdown
# 🚀 SmartLogix - Backend Ecosystem

Este repositorio contiene el ecosistema de backend basado en una arquitectura de **Microservicios** y un **BFF (Backend For Frontend)** utilizando **NestJS**. El sistema gestiona flujos operativos de usuarios, inventarios, órdenes de compra y despachos comerciales utilizando comunicación HTTP y resiliencia mediante patrones de estabilidad como *Circuit Breaker*.

---

## 📂 Estructura del Proyecto

El repositorio está organizado utilizando una estructura limpia de aplicaciones:

```text
├── apps/
│   ├── bff/             # API Gateway / Backend For Frontend (Puerto 3000)
│   ├── ms-inventory/    # Microservicio de Inventario y Catálogo (Puerto 3002)
│   ├── ms-orders/       # Microservicio de Procesamiento de Órdenes (Puerto 3003)
│   ├── ms-shipping/     # Microservicio de Despachos y Logística (Puerto 3004)
│   └── ms-users/        # Microservicio de Autenticación y Usuarios (Puerto 3001)
├── database/            # Scripts de respaldo de base de datos
└── docker/
    └── docker-compose.yml # Orquestación de infraestructura local

```

---

## 🛠️ Prerrequisitos

Antes de iniciar, asegúrate de tener instalado y activo en tu computadora:

* [Docker Desktop](https://www.docker.com/products/docker-desktop/)
* [Node.js (v18 o superior)](https://nodejs.org/)
* [Git](https://git-scm.com/)

---

## 🐳 Paso 1: Infraestructura de Base de Datos (Docker)

El proyecto utiliza un entorno multi-base de datos contenerizado con **Docker**. Esto levanta tres instancias independientes de **PostgreSQL** con esquemas y datos semilla (`init.sql`) precargados de forma automática.

### Comandos de Inicialización

1. **Posicionarse en la Raíz del Proyecto:**
Abre una terminal y colócate en la carpeta raíz del repositorio clonado (donde se encuentra el archivo `package.json`).
```bash
cd /ruta/hacia/tu/proyecto-clonado

```


2. **Levantar los Contenedores:**
Ejecuta el siguiente comando. Se utiliza el flag `-f` debido a que las rutas relativas de los scripts de inicialización `init.sql` requieren ejecutarse con respecto a la raíz:
```bash
docker compose -f docker/docker-compose.yml up -d

```


> 💡 *Nota: El parámetro `-d` (detached mode) ejecuta los contenedores en segundo plano, liberando tu terminal inmediatamente.*


3. **Verificar el Estado de las Bases de Datos:**
Comprueba que los tres motores se crearon y están escuchando peticiones ejecutando:
```bash
docker ps

```



### Comandos de Utilidad para Docker (Siempre desde la raíz)

* **Apagar el entorno temporalmente (Sin borrar datos):**
```bash
docker compose -f docker/docker-compose.yml stop

```


* **Destruir los contenedores (Manteniendo los datos guardados en volúmenes):**
```bash
docker compose -f docker/docker-compose.yml down

```


* **Reset Total (Limpiar bases de datos y recargar datos semilla de fábrica):**
Si modificaste registros y deseas restaurar el catálogo original limpio para pruebas, destruye los volúmenes físicos e inicializa de nuevo:
```bash
docker compose -f docker/docker-compose.yml down -v
docker compose -f docker/docker-compose.yml up -d

```



---

## 🏃‍♂️ Paso 2: Despliegue de las Aplicaciones (NestJS)

Una vez que los contenedores de Docker estén activos, puedes proceder a instalar las dependencias locales e iniciar los servicios de Node.js.

### 1. Instalar Dependencias de Node

Ejecuta el siguiente comando en la raíz del proyecto para instalar todos los módulos necesarios del monorepo:

```bash
npm install

```

### 2. Levantar los Servicios en Modo Desarrollo (Watch)

Abre terminales separadas para cada servicio e inicialízalos en el siguiente orden recomendado:

* **Microservicio de Usuarios (ms-users):**
```bash
npm run start:dev ms-users

```


* **Microservicio de Inventario (ms-inventory):**
```bash
npm run start:dev ms-inventory

```


* **Microservicio de Órdenes (ms-orders):**
```bash
npm run start:dev ms-orders

```

* **Microservicio de Envios (ms-shipping):**
```bash
npm run start:dev shipping

```


* **Backend For Frontend (bff):**
```bash
npm run start:dev bff

```



---

## 🔐 Credenciales y Puertos del Entorno Local

| Componente / Servicio | Tipo | Puerto Local | Base de Datos | Usuario | Contraseña |
| --- | --- | --- | --- | --- | --- |
| **BFF (Gateway)** | Aplicación | **3000** | N/A | N/A | N/A |
| **MS Users** | Aplicación / DB | **5432** | `smartlogix_users` | `users_user` | `users_password` |
| **MS Inventory** | Aplicación / DB | **5433** | `smartlogix_inventory` | `inventory_user` | `inventory_password` |
| **MS Orders** | Aplicación / DB | **5434** | `smartlogix_orders` | `orders_user` | `orders_password` |
| **MS Shipping** | Aplicación / DB | **null** | `MongoDbAtlas` | `null` | `null` |

---

## 📝 Notas de Desarrollo y Seguridad

> ⚠️ **Aviso Académico:** Las credenciales y archivos de inicialización de base de datos se encuentran versionados de forma explícita en este repositorio con fines estrictamente educativos y de agilidad de despliegue en equipos de trabajo. **No reutilizar esta configuración en entornos de producción.**

```
***

### Qué mejoras incluye:
1. **Instalación de Node (`npm install`):** Esencial para que otra máquina reconstruya la carpeta `node_modules` en cada carpeta (bff, ms-users, ms-inventory, ms-orders y ms-shipping).
2. **Arranque de NestJS (`npm run start:dev ...`):** Añadí los comandos típicos de arquitectura NestJS monorepo para que sepan exactamente cómo levantar cada app tras encender Docker.

```
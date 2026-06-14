-- =============================================================================
-- SCRIPT DE INICIALIZACIÓN REAL: smartlogix_inventory
-- =============================================================================

-- 1. Crear tabla de Almacenes / Bodegas (Estructura real del diagrama)
CREATE TABLE IF NOT EXISTS inventories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Crear tabla de Tipos de Inventario / Categorías
CREATE TABLE IF NOT EXISTS inventory_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Crear tabla de Productos / Items del Inventario
CREATE TABLE IF NOT EXISTS inventory_items (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock_available INT NOT NULL DEFAULT 0,
    stock_reserved INT NOT NULL DEFAULT 0,
    inventory_type_id INT NOT NULL,
    inventory_id INT NOT NULL,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_inventory_items_type 
        FOREIGN KEY (inventory_type_id) REFERENCES inventory_types(id) ON DELETE RESTRICT,
        
    CONSTRAINT fk_inventory_items_inventory 
        FOREIGN KEY (inventory_id) REFERENCES inventories(id) ON DELETE CASCADE
);

-- 4. Crear tabla intermedia de Permisos Lógicos (Usuarios asignados a Bodegas)
CREATE TABLE IF NOT EXISTS user_inventories (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL, -- UUIDs de tus usuarios reales
    inventory_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_user_inventories_inventory 
        FOREIGN KEY (inventory_id) REFERENCES inventories(id) ON DELETE CASCADE,
        
    CONSTRAINT uq_user_inventory UNIQUE (user_id, inventory_id)
);

-- =============================================================================
-- SECCIÓN DE ÍNDICES
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_inventory_items_sku ON inventory_items(sku);
CREATE INDEX IF NOT EXISTS idx_user_inventories_user ON user_inventories(user_id);

-- =============================================================================
-- DATOS SEMILLA REALES (Extraídos de tus capturas de pantalla)
-- =============================================================================

-- Insertar tus dos almacenes reales tal cual los tienes hoy
INSERT INTO inventories (id, name, description, created_at) VALUES
(1, 'Almacén Central Inicial', 'Almacén creado automáticamente para migrar los productos existentes', '2026-06-08 11:16:23.566'),
(2, 'Almacén Central Norte', 'Bodega principal destinada a productos de alta tecnología y servidores.', '2026-06-08 16:01:21.889')
ON CONFLICT (id) DO NOTHING;

-- Insertar Categoría base
INSERT INTO inventory_types (id, name, description)
VALUES (1, 'General / Tecnología', 'Categoría raíz para productos estándar sin clasificación específica.')
ON CONFLICT (id) DO NOTHING;

-- Insertar las asignaciones de tus usuarios reales de ms-users a las bodegas (Tu tabla intermedia)
INSERT INTO user_inventories (id, user_id, inventory_id, assigned_at) VALUES
(1, 'fb7d4acf-0a5a-4dc1-8957-c4b921b34416', 2, '2026-06-08 16:01:21.889'), -- Oscar en Almacén Norte
(2, '23cd207b-209a-48b2-8a6b-1fe6d2700f58', 2, '2026-06-08 17:07:26.301'), -- Prueba en Almacén Norte
(3, '8e5d3016-1c03-48e4-8ca5-534bed945fbe', 1, '2026-06-08 17:09:28.526')  -- Alex en Almacén Inicial
ON CONFLICT (id) DO NOTHING;

-- Sincronizar las secuencias de Postgres
SELECT setval('inventories_id_seq', COALESCE((SELECT MAX(id) FROM inventories), 2));
SELECT setval('inventory_types_id_seq', COALESCE((SELECT MAX(id) FROM inventory_types), 1));
SELECT setval('user_inventories_id_seq', COALESCE((SELECT MAX(id) FROM user_inventories), 3));
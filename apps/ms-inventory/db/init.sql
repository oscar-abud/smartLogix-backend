-- =============================================================================
-- SCRIPT DE INICIALIZACIÓN: smartlogix_inventory
-- DB per Service Pattern - ms-inventory
-- =============================================================================

-- 1. Crear tabla de Almacenes / Bodegas
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
    
    -- Restricciones de Llave Foránea (FK)
    CONSTRAINT fk_inventory_items_type 
        FOREIGN KEY (inventory_type_id) 
        REFERENCES inventory_types(id) 
        ON DELETE RESTRICT,
        
    CONSTRAINT fk_inventory_items_inventory 
        FOREIGN KEY (inventory_id) 
        REFERENCES inventories(id) 
        ON DELETE CASCADE
);

-- 4. Crear tabla intermedia de Permisos Lógicos (Usuarios externos - Almacenes locales)
CREATE TABLE IF NOT EXISTS user_inventories (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL, -- UUID plano que viene desde el ms-users
    inventory_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Llave foránea local
    CONSTRAINT fk_user_inventories_inventory 
        FOREIGN KEY (inventory_id) 
        REFERENCES inventories(id) 
        ON DELETE CASCADE,
        
    -- Constraint Unique exacto al de tu diagrama para evitar duplicados lógicos
    CONSTRAINT uq_user_inventory UNIQUE (user_id, inventory_id)
);

-- =============================================================================
-- SECCIÓN DE ÍNDICES (Optimización de consultas frecuentes)
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_inventory_items_sku ON inventory_items(sku);
CREATE INDEX IF NOT EXISTS idx_user_inventories_user ON user_inventories(user_id);

-- =============================================================================
-- DATOS SEMILLA (SEEDS OBLIGATORIOS)
-- =============================================================================

-- Insertar un Almacén comodín inicial por defecto (ID 1)
INSERT INTO inventories (id, name, description)
VALUES (1, 'Almacén Central Principal', 'Bodega por defecto creada automáticamente por el sistema.')
ON CONFLICT (id) DO NOTHING;

-- Insertar una Categoría/Tipo por defecto inicial (ID 1)
INSERT INTO inventory_types (id, name, description)
VALUES (1, 'General / Tecnología', 'Categoría raíz para productos estándar sin clasificación específica.')
ON CONFLICT (id) DO NOTHING;

-- Sincronizar las secuencias de PostgreSQL (Evita errores de IDs duplicados al hacer inserts manuales)
SELECT setval('inventories_id_seq', COALESCE((SELECT MAX(id) FROM inventories), 1));
SELECT setval('inventory_types_id_seq', COALESCE((SELECT MAX(id) FROM inventory_types), 1));
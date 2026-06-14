-- =============================================================================
-- SCRIPT DE INICIALIZACIÓN REAL: smartlogix_inventory
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
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_inventory_items_type 
        FOREIGN KEY (inventory_type_id) REFERENCES inventory_types(id) ON DELETE RESTRICT,
        
    CONSTRAINT fk_inventory_items_inventory 
        FOREIGN KEY (inventory_id) REFERENCES inventories(id) ON DELETE CASCADE
);

-- 4. Crear tabla intermedia de Permisos Lógicos (Usuarios asignados a Bodegas)
CREATE TABLE IF NOT EXISTS user_inventories (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
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
-- DATOS SEMILLA REALES
-- =============================================================================

-- Insertar almacenes
INSERT INTO inventories (id, name, description, created_at) VALUES
(1, 'Almacén Central Inicial', 'Almacén creado automáticamente para migrar los productos existentes', '2026-06-08 11:16:23.566'),
(2, 'Almacén Central Norte', 'Bodega principal destinada a productos de alta tecnología y servidores.', '2026-06-08 16:01:21.889')
ON CONFLICT (id) DO NOTHING;

-- Insertar Categorías
INSERT INTO inventory_types (id, name, description) VALUES
(1, 'Alimentos y Abarrotes', 'Categoría para productos alimenticios perecederos y no perecederos.'),
(2, 'Insumos Médicos / Salud', 'Artículos de protección personal, desinfectantes y asistencia médica.'),
(3, 'Hardware y Electrónica', 'Componentes de computadoras, servidores y tecnología de alta fidelidad.')
ON CONFLICT (id) DO NOTHING;

-- Insertar asignaciones de usuarios
INSERT INTO user_inventories (id, user_id, inventory_id, assigned_at) VALUES
(1, 'fb7d4acf-0a5a-4dc1-8957-c4b921b34416', 2, '2026-06-08 16:01:21.889'),
(2, '23cd207b-209a-48b2-8a6b-1fe6d2700f58', 2, '2026-06-08 17:07:26.301'),
(3, '8e5d3016-1c03-48e4-8ca5-534bed945fbe', 1, '2026-06-08 17:09:28.526')
ON CONFLICT (id) DO NOTHING;

-- Insertar productos reales
INSERT INTO inventory_items (id, sku, name, price, stock_available, stock_reserved, inventory_type_id, "createdAt", inventory_id) VALUES
(1, 'SUPER-ARROZ-01', 'Arroz Grado 1 Extra Largo 1kg', 1490.00, 130, 0, 1, '2026-06-07 14:28:49.879', 1),
(2, 'SUPER-LECHE-02', 'Leche Entera Caja 1L', 1050.00, 128, 0, 1, '2026-06-07 14:28:49.879', 1),
(3, 'MED-MASC-01', 'Mascarillas Quirúrgicas (Caja 50 und)', 4500.00, 197, 0, 2, '2026-06-07 14:28:49.879', 1),
(4, 'MED-ALCO-02', 'Alcohol Gel 70% 500ml', 2990.00, 38, 0, 2, '2026-06-07 14:28:49.879', 1),
(5, 'SUPER-ARROZ-01-02', 'Arroz Grado 1 Extra Largo 1kg', 1490.00, 144, 0, 1, '2026-06-10 19:49:19.607', 2),
(6, 'SUPER-ARROZ-01-04', 'Arroz Grado 1 Extra Largo 1kg', 1490.00, 150, 0, 1, '2026-06-10 19:51:29.441', 2),
(7, 'HW-99-DL', 'Memoria Ram 32GB', 260000.00, 100, 0, 3, '2026-06-10 21:05:12.283', 2)
ON CONFLICT (id) DO NOTHING;

-- Sincronizar secuencias
SELECT setval('inventories_id_seq', COALESCE((SELECT MAX(id) FROM inventories), 2));
SELECT setval('inventory_types_id_seq', COALESCE((SELECT MAX(id) FROM inventory_types), 3));
SELECT setval('user_inventories_id_seq', COALESCE((SELECT MAX(id) FROM user_inventories), 3));
SELECT setval('inventory_items_id_seq', COALESCE((SELECT MAX(id) FROM inventory_items), 7));
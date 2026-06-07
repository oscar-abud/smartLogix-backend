-- 1. Crear la tabla de Tipos de Inventario (Bodegas)
CREATE TABLE IF NOT EXISTS inventory_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 2. Insertar los tipos por defecto si no existen
INSERT INTO inventory_types (id, name, description) VALUES 
(1, 'Inventario A (Supermercado)', 'Abarrotes, alimentos perecederos y productos de consumo masivo'),
(2, 'Inventario B (Médico)', 'Insumos clínicos, medicamentos autorizados y herramientas de salud')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- 3. Crear la tabla de Productos / Ítems
CREATE TABLE IF NOT EXISTS inventory_items (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    stock_available INT NOT NULL DEFAULT 0,
    stock_reserved INT NOT NULL DEFAULT 0,
    inventory_type_id INT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    
    CONSTRAINT fk_items_inventory_types 
    FOREIGN KEY (inventory_type_id) REFERENCES inventory_types(id) ON DELETE RESTRICT
);

-- 4. Insertar datos de prueba iniciales
INSERT INTO inventory_items (sku, name, price, stock_available, inventory_type_id) VALUES 
('SUPER-ARROZ-01', 'Arroz Grado 1 Extra Largo 1kg', 1490.00, 150, 1),
('SUPER-LECHE-02', 'Leche Entera Caja 1L', 1050.00, 80, 1),
('MED-MASC-01', 'Mascarillas Quirúrgicas (Caja 50 und)', 4500.00, 200, 2),
('MED-ALCO-02', 'Alcohol Gel 70% 500ml', 2990.00, 45, 2)
ON CONFLICT (sku) DO NOTHING;
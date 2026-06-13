-- =============================================================================
-- SCRIPT DE INICIALIZACIÓN REAL: smartlogix_orders
-- =============================================================================

-- 1. Tabla Principal de Órdenes (Cabecera basada en el diagrama de DBeaver)
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00, -- "total_amount" exacto de tu captura
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()        -- CamelCase exacto "createdAt" de tu diagrama
);

-- 2. Tabla de Detalles de la Órden (Items)
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price NUMERIC(10, 2) NOT NULL,
    
    CONSTRAINT fk_items_orders 
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- =============================================================================
-- DATOS SEMILLA REALES (Extraídos exactamente de tus registros)
-- =============================================================================

-- Insertar tus órdenes reales vigentes (IDs: 1, 3, 4, 5)
INSERT INTO orders (id, status, total_amount, "createdAt") VALUES 
(1, 'PROCESSED', 4030.00, '2026-06-07 15:11:02.911'),
(3, 'PROCESSED', 14900.00, '2026-06-10 22:14:45.562'),
(4, 'PENDING', 14020.00, '2026-06-12 05:04:55.479'),
(5, 'PENDING', 55430.00, '2026-06-12 05:45:36.944')
ON CONFLICT (id) DO NOTHING;

-- Insertar el desglose exacto de tus ítems asociados
INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES 
(1, 1, 1, 2, 1490.00), -- Fila 1
(2, 1, 2, 1, 1050.00), -- Fila 2
(4, 3, 1, 10, 1490.00),-- Fila 4 (Asociada a orden 3)
(5, 4, 5, 3, 1490.00), -- Fila 5
(6, 4, 1, 5, 1490.00), -- Fila 6
(7, 4, 2, 2, 1050.00), -- Fila 7
(8, 5, 3, 3, 4500.00), -- Fila 8
(9, 5, 2, 20, 1050.00),-- Fila 9
(10, 5, 4, 7, 2990.00) -- Fila 10
ON CONFLICT (id) DO NOTHING;

-- Sincronizar el secuenciador de IDs basado en el valor máximo real de cada tabla
SELECT setval('orders_id_seq', COALESCE((SELECT MAX(id) FROM orders), 5));
SELECT setval('order_items_id_seq', COALESCE((SELECT MAX(id) FROM order_items), 10));
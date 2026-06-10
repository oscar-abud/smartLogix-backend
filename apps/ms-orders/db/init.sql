-- 1. Tabla Principal de Órdenes (Cabecera limpia sin user_id)
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00, -- Snake case real de tu DBeaver
    createdAt TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 2. Tabla de Detalles de la Órden (Items)
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,                        -- Snake case real de tu DBeaver
    product_id INT NOT NULL,                      -- Snake case real de tu DBeaver
    quantity INT NOT NULL DEFAULT 1,
    price NUMERIC(10, 2) NOT NULL,
    
    CONSTRAINT fk_items_orders 
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- 3. Insertar datos semilla idénticos a los que tienes en tu DBeaver
INSERT INTO orders (id, status, total_amount, createdAt) 
VALUES 
(1, 'PENDING', 4030.00, '2026-06-07 15:11:02.911'),
(2, 'PENDING', 4470.00, '2026-06-10 22:12:24.290'),
(3, 'PENDING', 14900.00, '2026-06-10 22:14:45.562')
ON CONFLICT (id) DO NOTHING;

INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES 
(1, 1, 1, 2, 1490.00), -- Tu fila 1 en DBeaver
(2, 1, 2, 1, 1050.00)  -- Tu fila 2 en DBeaver
ON CONFLICT (id) DO NOTHING;

-- Sincronizar el secuenciador de IDs en PostgreSQL para evitar colisiones
SELECT setval(pg_get_serial_sequence('orders', 'id'), COALESCE(MAX(id), 1)) FROM orders;
SELECT setval(pg_get_serial_sequence('order_items', 'id'), COALESCE(MAX(id), 1)) FROM order_items;
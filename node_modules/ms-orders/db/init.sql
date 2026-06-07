-- 1. Tabla Principal de Órdenes (Cabecera)
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,                         -- ID del usuario (UUID de ms-users)
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'PAID', 'CANCELLED'
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 2. Tabla de Detalles de la Órden (Items)
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,                        -- Llave foránea interna
    product_id INT NOT NULL,                      -- ID del producto de ms-inventory
    quantity INT NOT NULL DEFAULT 1,
    price NUMERIC(10, 2) NOT NULL,                -- Precio histórico al momento de comprar
    
    CONSTRAINT fk_items_orders 
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- 3. Insertar una orden de prueba simulada (Para el usuario oscar@smartlogix.com)
-- Nota: Dejamos el user_id genérico o puedes actualizarlo con un UUID real después
INSERT INTO orders (id, user_id, status, total_amount) 
VALUES (1, '00000000-0000-0000-0000-000000000000', 'PENDING', 4030.00)
ON CONFLICT (id) DO NOTHING;

INSERT INTO order_items (order_id, product_id, quantity, price) VALUES 
(1, 1, 2, 1490.00), -- 2 Arroz
(1, 2, 1, 1050.00)  -- 1 Leche
ON CONFLICT DO NOTHING;
-- 1. Crear la tabla de roles (Por si acaso NestJS no levanta antes)
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- 2. Insertar los roles por defecto del sistema
-- El "ON CONFLICT" evita que el script falle si Docker se reinicia y los datos ya existen
INSERT INTO roles (id, name) 
VALUES (1, 'ADMIN'), (2, 'OPERATOR'), (3, 'CLIENT')
ON CONFLICT (name) DO NOTHING;
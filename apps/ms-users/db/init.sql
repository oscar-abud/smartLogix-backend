-- 1. Crear tabla de roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- 2. Insertar los roles del sistema
INSERT INTO roles (id, name) VALUES (1, 'ADMIN'), (2, 'OPERATOR'), (3, 'CLIENT');

-- 3. Modificar la tabla users para agregar la llave foránea
ALTER TABLE users ADD COLUMN role_id INT;

ALTER TABLE users 
ADD CONSTRAINT fk_users_roles 
FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL;

-- 4. Si creas usuarios nuevos, ponles el role_id correspondiente (ej: 1 para tu admin)
-- Borramos la columna de texto vieja en caso de que TypeORM la haya creado
ALTER TABLE users DROP COLUMN IF EXISTS role;
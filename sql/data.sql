-- Usar la base de datos correcta
USE inventario_task_manager;

-- ==========================================
-- 1. POBLAR USERS
-- ==========================================
INSERT INTO users (id, name, email, document, password_hash, role) VALUES -- Todas las password corresponden a "contraseña"
(1, 'Jose Carlos', 'juan.perez@example.com', "10001", "$2b$10$WfvS1ezsrgtfAIa2mOyWquOq1Q.MouisXVN7rFg6E.ZhnE960qwJy", 'user'),
(2, 'María Gómez', 'maria.gomez@example.com', "10002", "$2b$10$WfvS1ezsrgtfAIa2mOyWquOq1Q.MouisXVN7rFg6E.ZhnE960qwJy", 'user'),
(3, 'Jhon Bueno', 'jhonbuenoa@example.com', "10003", "$2b$10$WfvS1ezsrgtfAIa2mOyWquOq1Q.MouisXVN7rFg6E.ZhnE960qwJy", 'user'),
(4, 'Ana Torres', 'ana.torres@example.com', "10004", "$2b$10$WfvS1ezsrgtfAIa2mOyWquOq1Q.MouisXVN7rFg6E.ZhnE960qwJy", 'user'),
(5, 'Nombre De Prueba Uno', 'luis.fernandez@example.com', "10005", "$2b$10$WfvS1ezsrgtfAIa2mOyWquOq1Q.MouisXVN7rFg6E.ZhnE960qwJy", 'user'),
(6, 'Sofía Martínez', 'sofia.martinez@example.com', "10006", "$2b$10$WfvS1ezsrgtfAIa2mOyWquOq1Q.MouisXVN7rFg6E.ZhnE960qwJy", 'user'),
(7, 'Pedro López', 'pedro.lopez@example.com', "10007", "$2b$10$WfvS1ezsrgtfAIa2mOyWquOq1Q.MouisXVN7rFg6E.ZhnE960qwJy", 'user'),
(8, 'Laura Castillo', 'laura.castillo@example.com', "10008", "$2b$10$WfvS1ezsrgtfAIa2mOyWquOq1Q.MouisXVN7rFg6E.ZhnE960qwJy", 'user'),
(9, 'Andrés Herrera', 'andres.herrera@example.com', "10009", "$2b$10$WfvS1ezsrgtfAIa2mOyWquOq1Q.MouisXVN7rFg6E.ZhnE960qwJy", 'user'),
(10, 'Valentina Ríos', 'valentina.rios@example.comm', "10010", "$2b$10$WfvS1ezsrgtfAIa2mOyWquOq1Q.MouisXVN7rFg6E.ZhnE960qwJy", 'user'),
(11, 'Admin Principal', 'admin.uno@example.com', "10011", "$2b$10$WfvS1ezsrgtfAIa2mOyWquOq1Q.MouisXVN7rFg6E.ZhnE960qwJy", 'admin'),
(12, 'Admin Secundario', 'admin.dos@example.com', "10012", "$2b$10$WfvS1ezsrgtfAIa2mOyWquOq1Q.MouisXVN7rFg6E.ZhnE960qwJy", 'admin'),
(13, 'Don Admin', 'donAdmin@example.com', "10013", "$2b$10$WfvS1ezsrgtfAIa2mOyWquOq1Q.MouisXVN7rFg6E.ZhnE960qwJy", 'admin');

-- ==========================================
-- 2. POBLAR TASKS
-- ==========================================
INSERT INTO tasks (title, description, status, created_by, user_id) VALUES
('Tarea de prueba', 'Asignada a 2 usuarios', 'completada', 'admin', 1),
('Tarea de prueba', 'Asignada a 2 usuarios', 'completada', 'admin', 2);
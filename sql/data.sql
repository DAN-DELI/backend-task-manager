-- Usar la base de datos correcta
USE inventario_task_manager;

-- ==========================================
-- 1. POBLAR USERS
-- ==========================================
INSERT INTO users (id, name, email, document, role) VALUES
(1, 'Juan Pérez', 'juan.perez@example.com', 1, 'user'),
(2, 'María Gómez', 'maria.gomez@example.com', 2, 'user'),
(3, 'Jhon Bueno', 'jhonbuenoa@example.com', 3, 'user'),
(4, 'Ana Torres', 'ana.torres@example.com', 4, 'user'),
(5, 'Nombre De Prueba Uno', 'luis.fernandez@example.com', 5, 'user'),
(6, 'Sofía Martínez', 'sofia.martinez@example.com', 6, 'user'),
(7, 'Pedro López', 'pedro.lopez@example.com', 7, 'user'),
(8, 'Laura Castillo', 'laura.castillo@example.com', 8, 'user'),
(9, 'Andrés Herrera', 'andres.herrera@example.com', 9, 'user'),
(10, 'Valentina Ríos', 'valentina.rios@example.comm', 10, 'user'),
(11, 'Admin Principal', 'admin.uno@example.com', 100, 'admin'),
(12, 'Admin Secundario', 'admin.dos@example.com', 101, 'admin'),
(13, 'Don Admin', 'donAdmin@example.com', 12, 'admin');

-- ==========================================
-- 1. POBLAR TASKS
-- ==========================================
INSERT INTO tasks (title, description, status, created_by, user_id) VALUES
('Tarea de prueba', 'Asignada a 2 usuarios', 'completada', 'admin', 1),
('Tarea de prueba', 'Asignada a 2 usuarios', 'completada', 'admin', 2);
-- Usar la base de datos correcta
USE inventario_task_manager;

-- ==========================================
-- 1. POBLAR USERS
-- ==========================================
/*
    NOTA TÉCNICA CRÍTICA: 
    Para garantizar la integridad del sistema de autenticación, los usuarios base deben crearse a través de la API (Postman).

    Debido al uso de bcrypt, cada hash se genera con un salt (semilla aleatoria) único en el servidor.
    Insertar hashes manualmente en la base de datos puede causar fallos de validación por diferencias de codificación o 
    falta de sincronía con la lógica de comparación del backend.
*/

-- Cuerpo de Administrador (Super Usuario)
{
    "name": "Administrador",
    "email": "administrador@admin.com",
    "document": "10000",
    "password" : "contraseña"
}

-- Cuerpo de Evaluador
{
    "name": "Evaluador",
    "email": "evaluador@evaluador.com",
    "document": "10001",
    "password" : "contraseña"
}

-- Cuerpo de Aprendiz
{
    "name": "Aprendiz",
    "email": "aprendiz@aprendiz.com",
    "document": "10002",
    "password" : "contraseña"
}

-- ==========================================
-- 2. POBLAR TASKS
-- ==========================================
INSERT INTO tasks (title, description, status, user_id) VALUES -- Confirma que la tarea se creara a un rol "usuario"
('Tarea 1 de prueba', 'Descripcion 1', 'completada', 3), 
('Tarea 2 de prueba', 'Descripcion 2', 'pendiente', 3);
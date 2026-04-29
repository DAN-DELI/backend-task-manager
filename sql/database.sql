-- ==========================================
-- SECCIÓN 1: CONFIGURACIÓN (EJECUTAR COMO ROOT)
-- ==========================================

-- Crear usuario
CREATE USER IF NOT EXISTS 'app_user_3233198'@'localhost' IDENTIFIED BY '#ADSO_3233198';

-- Permisos (puedes dejar ALL si no te han restringido)
GRANT ALL PRIVILEGES ON *.* TO 'app_user_3233198'@'localhost';

FLUSH PRIVILEGES;


-- ==========================================
-- SECCIÓN 2: ESTRUCTURA (EJECUTAR COMO app_user)
-- ==========================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS inventario_task_manager;

-- Usar la base
USE inventario_task_manager;

-- ==========================================
-- TABLA USERS
-- ==========================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    document VARCHAR(20) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    refresh_token VARCHAR (500) NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ==========================================
-- TABLA TASKS
-- ==========================================
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('pendiente', 'en-progreso', 'completada') DEFAULT 'pendiente',
    created_by ENUM('admin', 'user') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_task_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);
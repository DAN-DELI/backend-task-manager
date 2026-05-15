-- ==========================================
-- SECCIÓN 1: CONFIGURACIÓN (EJECUTAR COMO ROOT)
-- ==========================================

-- Crear usuario
CREATE USER IF NOT EXISTS 'app_user_3233198'@'localhost' IDENTIFIED BY '#ADSO_3233198';

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS inventario_task_manager;

-- Permisos
GRANT ALL PRIVILEGES ON inventario_task_manager.* TO 'app_user_3233198'@'localhost';

FLUSH PRIVILEGES;


-- ==========================================
-- SECCIÓN 2: ESTRUCTURA (EJECUTAR COMO user)
-- ==========================================
-- Usar la base
USE inventario_task_manager;

-- ------------------------------------------
-- TABLA users
-- ------------------------------------------
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    document VARCHAR(20) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    refresh_token VARCHAR (500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ------------------------------------------
-- TABLA tasks
-- ------------------------------------------
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('pendiente', 'en-progreso', 'completada') DEFAULT 'pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_task_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

-- ------------------------------------------
-- ------------ TABLAS RBAC -----------------
-- ------------------------------------------

-- ------------------------------------------
-- TABLA roles
-- ------------------------------------------
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ------------------------------------------
-- TABLA permissions
-- ------------------------------------------
CREATE TABLE permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ------------------------------------------
-- TABLA role_permissions (pivote: roles <-> permissions)
-- ------------------------------------------
CREATE TABLE role_permissions (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_rp_role 
        FOREIGN KEY (role_id) REFERENCES roles(id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_rp_permission 
        FOREIGN KEY (permission_id) REFERENCES permissions(id) 
        ON DELETE CASCADE
);

-- ------------------------------------------
-- TABLA user_roles (Pivote: Usuarios <-> Roles)
-- ------------------------------------------
CREATE TABLE user_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_ur_user 
        FOREIGN KEY (user_id) REFERENCES users(id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_ur_role 
        FOREIGN KEY (role_id) REFERENCES roles(id) 
        ON DELETE CASCADE
);

-- ------------------------------------------
-- TABLA password_reset_tokens
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT NOT NULL,
    token      VARCHAR(64) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    used       TINYINT(1) DEFAULT 0,  -- 0 = no usado, 1 = ya usado
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_prt_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);

-- ------------------------------------------
-- TABLA password_history
-- ------------------------------------------
CREATE TABLE password_history (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    user_id       INT          NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ph_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);
-- Antes debemos crear los usuarios en el sistema y los ids deben ser validados ejemplo
-- Admin id:1
-- Editor id:2
-- Auditor id:3
-- Caso contrario se deben ajustar a las consultas

-- ==========================================
-- 1. INSERTAR ROLES
-- ==========================================
INSERT INTO roles (name, description) VALUES
('Administrador', 'Superusuario del sistema. Posee todos los permisos atómicos sin restricción.'),
('Evaluador', 'Gestiona el ciclo de vida de las tareas y supervisa el desempeño de los aprendices. 
Tiene acceso completo al CRUD de tareas y permiso de solo lectura sobre el listado de usuarios.'),
('Aprendiz', 'Posee permisos para visualizar las tareas y editarlas.');


-- ==========================================
-- 2. INSERTAR PERMISOS ATOMICOS
-- ==========================================
-- 2.1. Permisos de tareas
INSERT INTO permissions (name, code, description) VALUES 
('Ver Tareas', 'tasks.view', 'Permite consultar la lista y el detalle de tareas'),
('Crear Tareas', 'tasks.create', 'Permite registrar nuevas tareas en el sistema'),
('Actualizar Tareas', 'tasks.update', 'Permite modificar tareas existentes'),
('Eliminar Tareas', 'tasks.delete', 'Permite dar de baja tareas del sistema');

-- 2.2. Permisos de usuarios
INSERT INTO permissions (name, code, description) VALUES 
('Ver Usuarios', 'users.view', 'Permite listar y consultar el detalle de los usuarios'),
('Crear Usuarios', 'users.create', 'Permite registrar nuevos usuarios en el sistema'),
('Actualizar Usuarios', 'users.update', 'Permite modificar la información de usuarios existentes'),
('Eliminar Usuarios', 'users.delete', 'Permite eliminar usuarios del sistema');

-- 2.3. Permisos de gestión de roles
INSERT INTO permissions (name, code, description) VALUES 
('Ver Roles', 'roles.view', 'Permite listar y ver el detalle de los roles existentes'),
('Crear Roles', 'roles.create', 'Permite registrar nuevos roles en el sistema'),
('Actualizar Roles', 'roles.update', 'Permite modificar el nombre o descripción de un rol'),
('Eliminar Roles', 'roles.delete', 'Permite eliminar roles del sistema'),
('Asignar Permisos a Roles', 'roles.assign', 'Permite sincronizar los permisos asociados a un rol (Tabla role_permissions)');

-- 2.4. Permisos de gestión de permisos y asignaciones
INSERT INTO permissions (name, code, description) VALUES 
('Ver Permisos', 'permissions.view', 'Permite listar todos los permisos atómicos del sistema'),
('Asignar Roles a Usuarios', 'user-roles.assign', 'Permite sincronizar los roles asignados a un usuario (Tabla user_roles)');


-- ==========================================
-- 3. ASIGNAR PERMISOS A ROLES
-- ==========================================
-- 3.1. Administrador (ID 1): Todos los permisos
INSERT INTO role_permissions (role_id, permission_id) 
SELECT 1, id FROM permissions;

-- 3.2. Evaluador (ID 2): CRUD de tareas + lectura de usuarios
INSERT INTO role_permissions (role_id, permission_id)
SELECT 2, id FROM permissions WHERE code IN (
    'tasks.view', 'tasks.create', 'tasks.update', 'tasks.delete',
    'users.view'
);

-- 3.3. Aprendiz (ID 3): Ver y actualizar tareas
INSERT INTO role_permissions (role_id, permission_id)
SELECT 3, id FROM permissions WHERE code IN (
    'tasks.view', 'tasks.update'
);

-- ==========================================
-- 4. ASIGNAR ROLES A USUARIOS
-- ==========================================
-- Ajusta los user_id según los usuarios que ya tengas creados en tu tabla users.
-- Ejemplo: Usuario 1 = Admin, Usuario 2 = Evaluador, Usuario 3 = Aprendiz

INSERT INTO user_roles (user_id, role_id) VALUES (1, 1); -- Asignar rol administrador
INSERT INTO user_roles (user_id, role_id) VALUES (2, 2); -- Asignar rol evaluador
INSERT INTO user_roles (user_id, role_id) VALUES (3, 3); -- Asignar rol aprendiz
# RBAC — Task Manager

Sistema de control de acceso basado en roles (RBAC) implementado en el proyecto **Task Manager**.

---
<br>

# 1. Roles del Sistema

| Rol | Descripción |
|:--|:--|
| **Administrador** | Tiene control total del sistema. Gestiona usuarios, roles, permisos y tareas sin restricciones. |
| **Evaluador** | Supervisa el desempeño de los aprendices. Cuenta con CRUD completo de tareas y permisos de lectura sobre usuarios. |
| **Aprendiz** | Gestiona únicamente las tareas que tiene asignadas. Puede consultar y actualizar tareas donde figure como responsable. |

---
<br>

# 2. Matriz RBAC

## Rol: Administrador

| Permiso | Acción | Descripción |
|:--|:--|:--|
| `tasks.view` | `GET /api/tasks` | Listar todas las tareas |
| `tasks.create` | `POST /api/tasks` | Crear nuevas tareas |
| `tasks.update` | `PUT /api/tasks/:id` | Actualizar cualquier tarea |
| `tasks.delete` | `DELETE /api/tasks/:id` | Eliminar cualquier tarea |
| `users.view` | `GET /api/users` | Listar usuarios |
| `users.create` | `POST /api/users` | Crear usuarios |
| `users.update` | `PUT /api/users/:id` | Actualizar usuarios |
| `users.delete` | `DELETE /api/users/:id` | Eliminar usuarios |
| `roles.view` | `GET /api/roles` | Listar roles |
| `roles.create` | `POST /api/roles` | Crear roles |
| `roles.update` | `PUT /api/roles/:id` | Actualizar roles |
| `roles.delete` | `DELETE /api/roles/:id` | Eliminar roles |
| `roles.assign` | `POST /api/roles/:id/permissions` | Asignar permisos a roles |
| `permissions.view` | `GET /api/permissions` | Listar permisos atómicos |
| `user-roles.assign` | `POST /api/userRoles/assign` | Asignar roles a usuarios |

---

## Rol: Evaluador

| Permiso | Acción | Descripción |
|:--|:--|:--|
| `tasks.view` | `GET /api/tasks` | Listar todas las tareas |
| `tasks.create` | `POST /api/tasks` | Crear nuevas tareas |
| `tasks.update` | `PUT /api/tasks/:id` | Actualizar cualquier tarea |
| `tasks.delete` | `DELETE /api/tasks/:id` | Eliminar cualquier tarea |
| `users.view` | `GET /api/users` | Listar usuarios |

---

## Rol: Aprendiz

| Permiso | Acción | Descripción |
|:--|:--|:--|
| `tasks.view` | `GET /api/tasks` | Listar tareas filtradas por usuario desde el controlador |
| `tasks.update` | `PUT /api/tasks/:id` | Actualizar únicamente tareas propias |

---
<br>

# 3. Permisos Atómicos

| Código | Nombre | Descripción |
|:--|:--|:--|
| `tasks.view` | Ver Tareas | Consultar listado y detalle de tareas |
| `tasks.create` | Crear Tareas | Registrar nuevas tareas |
| `tasks.update` | Actualizar Tareas | Modificar tareas existentes |
| `tasks.delete` | Eliminar Tareas | Eliminar tareas del sistema |
| `users.view` | Ver Usuarios | Consultar usuarios registrados |
| `users.create` | Crear Usuarios | Registrar nuevos usuarios |
| `users.update` | Actualizar Usuarios | Modificar usuarios existentes |
| `users.delete` | Eliminar Usuarios | Eliminar usuarios del sistema |
| `roles.view` | Ver Roles | Consultar roles registrados |
| `roles.create` | Crear Roles | Registrar nuevos roles |
| `roles.update` | Actualizar Roles | Modificar roles existentes |
| `roles.delete` | Eliminar Roles | Eliminar roles del sistema |
| `roles.assign` | Asignar Permisos a Roles | Sincronizar permisos de un rol |
| `permissions.view` | Ver Permisos | Consultar permisos atómicos |
| `user-roles.assign` | Asignar Roles a Usuarios | Sincronizar roles de un usuario |

---
<br>

# 4. Modelo de Datos

Las relaciones entre usuarios, roles y permisos se implementan mediante tablas pivote con integridad referencial y eliminación en cascada.

## Tablas

| Tabla | Propósito |
|:--|:--|
| `users` | Almacena los usuarios del sistema |
| `roles` | Define los roles disponibles |
| `permissions` | Contiene los permisos atómicos |
| `user_roles` | Relaciona usuarios y roles (M:N) |
| `role_permissions` | Relaciona roles y permisos (M:N) |
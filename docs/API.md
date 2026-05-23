# API Documentation — Task Manager

Documentación completa de la API REST del Backend Task Manager.

---

## Tabla de Contenidos

1. [Autenticación](#autenticación)
2. [Usuarios](#usuarios)
3. [Tareas](#tareas)
4. [Roles](#roles)
5. [Permisos](#permisos)
6. [Asignación de Roles](#asignación-de-roles)
7. [Recuperación de Contraseña](#recuperación-de-contraseña)
8. [Códigos de Estado](#códigos-de-estado)
9. [Formato de Respuestas](#formato-de-respuestas)

---

## Autenticación

Estos endpoints son públicos y no requieren autenticación.

### Registro de Usuario

```http
POST /api/auth/register
```

**Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "document": "123456789",
  "password": "contraseña_segura"
}
```

**Respuesta Exitosa (201):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "document": "123456789"
  }
}
```

---

### Login

```http
POST /api/auth/login
```

**Body:**
```json
{
  "email": "juan@example.com",
  "password": "contraseña_segura"
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4..."
  }
}
```

---

### Refresh Token

```http
POST /api/auth/refresh
```

**Body:**
```json
{
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4..."
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Token refrescado exitosamente",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## Usuarios

Estos endpoints requieren autenticación (token JWT en header `Authorization: Bearer <token>`).

### Obtener Todos los Usuarios

```http
GET /api/users
```

**Permiso requerido:** `users.view`

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Usuarios listados exitosamente",
  "data": [
    {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "document": "123456789",
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### Obtener Usuario por ID

```http
GET /api/users/:id
```

**Permiso requerido:** `users.view`

---

### Crear Usuario

```http
POST /api/users
```

**Permiso requerido:** `users.create`

**Body:**
```json
{
  "name": "María García",
  "email": "maria@example.com",
  "document": "987654321",
  "password": "contraseña_segura"
}
```

---

### Actualizar Usuario (Completo)

```http
PUT /api/users/:id
```

**Permiso requerido:** `users.update`

---

### Actualizar Usuario (Parcial)

```http
PATCH /api/users/:id
```

**Permiso requerido:** `users.update`

**Body (campos opcionales):**
```json
{
  "name": "Juan Carlos Pérez",
  "email": "juancarlos@example.com"
}
```

---

### Actualizar Perfil Propio

```http
PATCH /api/users/:id/profile
```

**Permiso:** Solo el propio usuario puede actualizar su perfil.

---

### Eliminar Usuario

```http
DELETE /api/users/:id
```

**Permiso requerido:** `users.delete`

---

### Obtener Roles de un Usuario

```http
GET /api/users/:id/roles
```

**Permiso requerido:** `roles.view`

---

### Obtener Permisos de un Usuario

```http
GET /api/users/:id/permissions
```

**Permiso requerido:** `permissions.view`

---

### Cambiar Contraseña

```http
POST /api/users/:id/change-password
```

**Body:**
```json
{
  "currentPassword": "contraseña_actual",
  "newPassword": "nueva_contraseña_segura"
}
```

---

## Tareas

Estos endpoints requieren autenticación.

### Obtener Todas las Tareas

```http
GET /api/tasks
```

**Permiso requerido:** `tasks.view`

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Tareas listadas exitosamente",
  "data": [
    {
      "id": 1,
      "title": "Crear API",
      "description": "Desarrollar endpoints de la API",
      "status": "en-progreso",
      "created_by": 1,
      "created_by_document": "123456789",
      "created_by_name": "Juan Pérez",
      "assigned_users": [
        {
          "id": 2,
          "name": "María García",
          "document": "987654321"
        }
      ],
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### Obtener Tareas Propias

```http
GET /api/tasks/my-tasks
```

**Permiso requerido:** `tasks.view.own`

**Descripción:** Retorna únicamente las tareas asignadas al usuario autenticado.

---

### Obtener Tarea por ID

```http
GET /api/tasks/:id
```

**Permiso requerido:** `tasks.view`

---

### Crear Tarea

```http
POST /api/tasks
```

**Permiso requerido:** `tasks.create`

**Body:**
```json
{
  "title": "Nueva Tarea",
  "description": "Descripción de la tarea",
  "status": "pendiente",
  "assigned_user_ids": [1, 2, 3]
}
```

---

### Actualizar Tarea (Completo)

```http
PUT /api/tasks/:id
```

**Permiso requerido:** `tasks.update`

**Body:**
```json
{
  "title": "Tarea Actualizada",
  "description": "Nueva descripción",
  "status": "completada",
  "assigned_user_ids": [1, 2]
}
```

---

### Actualizar Tarea (Parcial)

```http
PATCH /api/tasks/:id
```

**Permiso requerido:** `tasks.update`

**Body (campos opcionales):**
```json
{
  "title": "Título actualizado",
  "status": "en-progreso"
}
```

---

### Eliminar Tarea

```http
DELETE /api/tasks/:id
```

**Permiso requerido:** `tasks.delete`

---

## Roles

### Obtener Todos los Roles

```http
GET /api/roles
```

**Permiso requerido:** `roles.view`

---

### Obtener Rol por ID

```http
GET /api/roles/:id
```

**Permiso requerido:** `roles.view`

---

### Crear Rol

```http
POST /api/roles
```

**Permiso requerido:** `roles.create`

**Body:**
```json
{
  "name": "Supervisor",
  "description": "Rol para supervisores del proyecto"
}
```

---

### Actualizar Rol

```http
PUT /api/roles/:id
```

**Permiso requerido:** `roles.update`

---

### Eliminar Rol

```http
DELETE /api/roles/:id
```

**Permiso requerido:** `roles.delete`

---

### Asignar Permisos a Rol

```http
POST /api/roles/:id/permissions
```

**Permiso requerido:** `roles.assign`

**Body:**
```json
{
  "permission_ids": [1, 2, 3, 4]
}
```

---

## Permisos

### Obtener Todos los Permisos

```http
GET /api/permissions
```

**Permiso requerido:** `permissions.view`

---

## Asignación de Roles

### Asignar Rol a Usuario

```http
POST /api/userRoles/assign
```

**Permiso requerido:** `user-roles.assign`

**Body:**
```json
{
  "user_id": 1,
  "role_ids": [1, 2]
}
```

---

## Recuperación de Contraseña

### Solicitar Recuperación

```http
POST /api/auth/forgot-password
```

**Body:**
```json
{
  "email": "juan@example.com"
}
```

---

### Restablecer Contraseña

```http
POST /api/auth/reset-password
```

**Body:**
```json
{
  "token": "token_de_recuperacion",
  "newPassword": "nueva_contraseña_segura"
}
```

---

## Códigos de Estado

| Código | Descripción |
|--------|-------------|
| 200 | Éxito - La solicitud fue procesada correctamente |
| 201 | Creado - Recurso creado exitosamente |
| 400 | Bad Request - Datos inválidos en la solicitud |
| 401 | No autorizado - Token faltante o inválido |
| 403 | Prohibido - Permiso insuficiente |
| 404 | No encontrado - Recurso no existe |
| 500 | Error interno del servidor |

---

## Formato de Respuestas

### Respuesta Exitosa

```json
{
  "success": true,
  "message": "Descripción del resultado",
  "data": { /* datos del recurso */ }
}
```

### Respuesta de Error

```json
{
  "success": false,
  "error": {
    "message": "Descripción del error",
    "details": [ /* errores específicos */ ]
  }
}
```

---

## Rate Limiting

Algunos endpoints tienen límites de tasa para prevenir abuso:

- `/api/auth/register`: Máximo 5 solicitudes por minuto
- `/api/auth/login`: Máximo 10 solicitudes por minuto
- `/api/users/:id/profile`: Máximo 3 solicitudes por minuto
- `/api/users/:id/change-password`: Máximo 3 solicitudes por minuto

Cuando se excede el límite, se devuelve un error 429 (Too Many Requests).
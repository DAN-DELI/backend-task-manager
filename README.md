# Backend Task Manager

API REST para la gestión de tareas con sistema de control de acceso basado en roles (RBAC), desarrollada con Express.js y MySQL.

---

## Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Inicio Rápido](#-inicio-rápido)
- [Documentación](#-documentación)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Sistema de Roles (RBAC)](#-sistema-de-roles-rbac)
- [Endpoints Principales](#-endpoints-principales)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

---

## Características

- **Autenticación JWT** con refresh tokens
- **Sistema RBAC** (Role-Based Access Control) con permisos granulares
- **CRUD** de tareas y usuarios
- **Gestión de Usuarios** con roles y permisos
- **Validación de datos** con Zod
- **Recuperación de contraseña** vía email
- **Rate limiting** para prevenir abuso
- **Pool de conexiones** MySQL para alto rendimiento

---

## Tecnologías

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| [Node.js](https://nodejs.org/) | 18.x | Entorno de ejecución JavaScript |
| [Express](https://expressjs.com/) | 5.2.1 | Framework web para Node.js |
| [MySQL](https://www.mysql.com/) | 8.0 | Sistema de gestión de base de datos |
| [mysql2](https://www.npmjs.com/package/mysql2) | 3.20.0 | Cliente MySQL con promesas |
| [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) | 9.0.3 | Implementación JWT |
| [bcrypt](https://www.npmjs.com/package/bcrypt) | 6.0.0 | Hash de contraseñas |
| [Zod](https://zod.dev/) | 4.3.6 | Validación de esquemas |
| [Nodemailer](https://nodemailer.com/) | 8.0.7 | Envío de correos |
| [CORS](https://www.npmjs.com/package/cors) | 2.8.6 | Cross-Origin Resource Sharing |
| [dotenv](https://www.npmjs.com/package/dotenv) | 17.3.1 | Variables de entorno |

---

## Inicio Rápido

### Prerrequisitos

- Node.js 18+ instalado
- MySQL 8.0+ corriendo
- npm o yarn

### Instalación

```bash
# 1. Clona el repositorio
git clone https://github.com/DAN-DELI/backend-task-manager.git
cd backend-task-manager

# 2. Instala dependencias
npm install

# 3. Copia y configura variables de entorno
cp .env.example .env
# Edita .env con tus credenciales de MySQL

# 4. Configura la base de datos
mysql -u root -p < sql/database.sql

# Lee atentamente el archivo sql/data.sql antes del siguiente paso
mysql -u root -p inventario_task_manager < sql/security.sql

# 5. Inicia el servidor
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

> Para instrucciones detalladas, consulta la [Guía de Instalación](docs/INSTALL.md)

---

## Documentación

| Documento | Descripción |
|-----------|-------------|
| [API Documentation](docs/API.md) | Referencia completa de todos los endpoints |
| [RBAC Documentation](docs/RBAC.md) | Matriz de roles y permisos |
| [Installation Guide](docs/INSTALL.md) | Guía paso a paso de instalación |

---

## Estructura del Proyecto

```
backend-task-manager/
├── src/
│   ├── app.js                     # Configuración principal de Express
│   ├── config/
│   │   └── db.js                  # Pool de conexiones MySQL
│   ├── controller/                # Lógica de negocio
│   │   ├── auth.controller.js     # Login, registro, refresh token
│   │   ├── tasks.controller.js    # CRUD de tareas
│   │   ├── users.controller.js    # Gestión de usuarios
│   │   ├── role.controller.js     # Gestión de roles
│   │   ├── permission.controller.js
│   │   ├── user-role.controller.js
│   │   └── forgot-password.controller.js
│   ├── middlewares/               # Middleware de Express
│   │   ├── auth.middleware.js     # Verificación JWT
│   │   ├── permissions.middleware.js  # Verificación RBAC
│   │   ├── validator.middleware.js    # Validación con Zod
│   │   ├── error.middleware.js        # Manejo de errores
│   │   └── rateLimit.middleware.js    # Rate limiting
│   ├── models/                    # Acceso a datos
│   │   ├── user.model.js
│   │   ├── task.model.js
│   │   ├── role.model.js
│   │   ├── permission.model.js
│   │   ├── user-role.model.js
│   │   └── password-reset.model.js
│   ├── routes/                    # Definición de rutas
│   │   ├── auth.routes.js
│   │   ├── tasks.routes.js
│   │   ├── users.routes.js
│   │   ├── role.routes.js
│   │   ├── permissions.routes.js
│   │   ├── userRoles.routes.js
│   │   └── forgot-password.routes.js
│   ├── schemas/                   # Esquemas de validación
│   └── utils/                     # Funciones utilitarias
├── sql/
│   ├── database.sql               # Creación de BD y tablas
│   ├── security.sql               # Configuración RBAC
│   └── data.sql                   # Datos de prueba
├── docs/                          # Documentación
├── .env.example                   # Ejemplo de configuración
├── package.json
└── server.js                      # Punto de entrada
```

---

## Sistema de Roles (RBAC)

El sistema implementa tres roles con permisos diferenciados:

| Rol | Descripción | Permisos de Tareas |
|-----|-------------|-------------------|
| **Administrador** | Control total del sistema | Todos |
| **Evaluador** | Supervisa aprendices y gestiona tareas | CRUD completo (`tasks.view`, `tasks.create`, `tasks.update`, `tasks.delete`) |
| **Aprendiz** | Gestiona solo sus tareas asignadas | Solo propias (`tasks.view.own`, `tasks.update`) |

### Permisos Atómicos

Los permisos son granulares y se asignan por rol:

- **Tareas:** `tasks.view`, `tasks.view.own`, `tasks.create`, `tasks.update`, `tasks.delete`
- **Usuarios:** `users.view`, `users.create`, `users.update`, `users.delete`
- **Roles:** `roles.view`, `roles.create`, `roles.update`, `roles.delete`, `roles.assign`
- **Permisos:** `permissions.view`, `user-roles.assign`

> Consulta la [Documentación RBAC](docs/RBAC.md) para detalles completos.

---

## Endpoints Principales

### Autenticación (Público)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registro de usuario |
| POST | `/api/auth/login` | Inicio de sesión |
| POST | `/api/auth/refresh` | Refrescar token |
| POST | `/api/auth/forgot-password` | Solicitar recuperación |
| POST | `/api/auth/reset-password` | Restablecer contraseña |

### Tareas (Requiere Auth)

| Método | Endpoint | Permiso | Descripción |
|--------|----------|---------|-------------|
| GET | `/api/tasks` | `tasks.view` | Listar todas las tareas |
| GET | `/api/tasks/my-tasks` | `tasks.view.own` | Listar tareas propias |
| GET | `/api/tasks/:id` | `tasks.view` | Obtener tarea por ID |
| POST | `/api/tasks` | `tasks.create` | Crear nueva tarea |
| PUT | `/api/tasks/:id` | `tasks.update` | Actualizar tarea (completo) |
| PATCH | `/api/tasks/:id` | `tasks.update` | Actualizar tarea (parcial) |
| DELETE | `/api/tasks/:id` | `tasks.delete` | Eliminar tarea |

### Usuarios (Requiere Auth)

| Método | Endpoint | Permiso | Descripción |
|--------|----------|---------|-------------|
| GET | `/api/users` | `users.view` | Listar usuarios |
| GET | `/api/users/:id` | `users.view` | Obtener usuario por ID |
| POST | `/api/users` | `users.create` | Crear usuario |
| PUT | `/api/users/:id` | `users.update` | Actualizar usuario |
| PATCH | `/api/users/:id` | `users.update` | Actualizar parcialmente |
| DELETE | `/api/users/:id` | `users.delete` | Eliminar usuario |

> Consulta la [Documentación de API](docs/API.md) para todos los endpoints y ejemplos.

---

## Contribución

1. Haz fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

Por favor, sigue los acuerdos del equipo documentados en [TEAM_AGREEMENT.md](TEAM_AGREEMENT.md).


---

## Equipo

| Nombre | Rol | GitHub |
|--------|-----|--------|
| Jhon Freddy Bueno Arenales | Líder (Arquitecto) | [@DAN-DELI](https://github.com/DAN-DELI) |
| Manuel Enrique Serrano Barajas | Desarrollador | [@Serranomanuel](https://github.com/Serranomanuel) |
| Wilmer Ferney Ardila Ordoñez | Desarrollador | [@Tachobo](https://github.com/Tachobo) |


---

<div align="center">

**Backend Task Manager**

</div>
# Instalación y Configuración — Task Manager

Guía paso a paso para instalar y configurar el Backend Task Manager en tu entorno local o de desarrollo.

---

## Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Clonar el Repositorio](#clonar-el-repositorio)
3. [Instalación de Dependencias](#instalación-de-dependencias)
4. [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
5. [Configuración de la Base de Datos](#configuración-de-la-base-de-datos)
6. [Ejecutar el Servidor](#ejecutar-el-servidor)
7. [Verificación de la Instalación](#verificación-de-la-instalación)
8. [Solución de Problemas](#solución-de-problemas)

---

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalados los siguientes componentes:

| Software | Versión Mínima | Descripción |
|----------|---------------|-------------|
| [Node.js](https://nodejs.org/) | 18.x | Entorno de ejecución JavaScript |
| [npm](https://www.npmjs.com/) | 9.x | Gestor de paquetes (incluido con Node.js) |
| [MySQL](https://www.mysql.com/) | 8.0 | Sistema de gestión de base de datos |

---

## Clonar el Repositorio

```bash
# Clona el repositorio
git clone https://github.com/DAN-DELI/backend-task-manager.git

# Navega al directorio del proyecto
cd backend-task-manager
```

---

## Instalación de Dependencias

```bash
# Instala todas las dependencias del proyecto
npm install
```

---

## Configuración de Variables de Entorno

1. Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

2. Edita el archivo `.env` con tus configuraciones:

```env
# Configuración del Servidor
PORT=3000

# Configuración de la Base de Datos MySQL
DB_HOST=localhost
DB_USER=app_user_3233198
DB_PASSWORD=#ADSO_3233198
DB_NAME=inventario_task_manager
DB_PORT=3306

# Configuración de llaves JWT
JWT_SECRET=tu_secreto_super_seguro_para_jwt_cambia_esto
JWT_REFRESH_SECRET=tu_secreto_super_seguro_para_refresh_token_cambia_esto

# Configuración de Mailtrap (para envío de correos)
MAILTRAP_USER=tu_usuario_de_mailtrap
MAILTRAP_PASS=tu_contraseña_de_mailtrap

MAIL_FROM=noreply@taskmanager.com
FRONTEND_URL=http://localhost:5173
```

> **⚠️ Importante:** Cambia las claves secretas JWT por valores únicos y seguros en producción.

---

## Configuración de la Base de Datos

### Paso 1: Crear la Base de Datos y Usuario

Ejecuta el script `sql/database.sql` en tu servidor MySQL:

```sql
-- Crear usuario
CREATE USER IF NOT EXISTS 'app_user_3233198'@'localhost' IDENTIFIED BY '#ADSO_3233198';

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS inventario_task_manager;

-- Permisos
GRANT ALL PRIVILEGES ON inventario_task_manager.* TO 'app_user_3233198'@'localhost';
GRANT ALL PRIVILEGES ON inventario_task_manager.* TO 'app_user_3233198'@'%';

FLUSH PRIVILEGES;
```

### Paso 2: Crear las Tablas

Conecta a la base de datos y ejecuta el script `sql/database.sql` completo (incluye la creación de tablas):

```bash
# Desde la línea de comandos
mysql -u root -p < sql/database.sql
```

O ejecuta el contenido del archivo directamente en MySQL Workbench o phpMyAdmin.

### Paso 3: Configurar el Sistema RBAC

Ejecuta el script `sql/security.sql` para insertar roles, permisos y asignaciones:

```bash
mysql -u root -p inventario_task_manager < sql/security.sql
```

### Paso 4: Insertar Datos de Prueba (Opcional)

Si deseas datos de prueba, ejecuta:

```bash
mysql -u root -p inventario_task_manager < sql/data.sql
```

---

## Ejecutar el Servidor

### Modo Desarrollo

```bash
# Inicia el servidor con nodemon (reinicia automáticamente con cambios)
npm run dev
```

El servidor se iniciará en `http://localhost:3000`

### Modo Producción

```bash
# Inicia el servidor sin nodemon
node server.js
```

---

## Verificación de la Instalación

### 1. Verificar que el servidor está corriendo

Abre tu navegador y navega a `http://localhost:3000`. Deberías ver:

```json
{
  "success": true,
  "message": "Hola, esto es un servidor express (Endpoint raiz funcionando)"
}
```

### 2. Verificar conexión a la base de datos

Al iniciar el servidor, deberías ver en la consola:

```
Conexión a la base de datos MySQL establecida con éxito
```

### 3. Probar registro de usuario

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "document": "123456789",
    "password": "password123"
  }'
```

---

## Solución de Problemas

### Error: "ECONNREFUSED" o no se puede conectar a MySQL

**Causa:** El servidor MySQL no está corriendo o las credenciales son incorrectas.

**Solución:**
1. Verifica que MySQL esté ejecutándose: `sudo systemctl status mysql`
2. Revisa las credenciales en el archivo `.env`
3. Asegúrate de que la base de datos `inventario_task_manager` exista

### Error: "ER_ACCESS_DENIED_ERROR"

**Causa:** El usuario de la base de datos no tiene permisos suficientes.

**Solución:**
```sql
-- Reconecta como root y verifica permisos
GRANT ALL PRIVILEGES ON inventario_task_manager.* TO 'app_user_3233198'@'localhost';
FLUSH PRIVILEGES;
```

### Error: "Port 3000 already in use"

**Causa:** Otro proceso está usando el puerto 3000.

**Solución:**
1. Cambia el puerto en `.env`: `PORT=3001`
2. O mata el proceso que usa el puerto: `lsof -ti:3000 | xargs kill -9`

### Error: "JWT_SECRET no está definido"

**Causa:** Las variables de entorno no se están cargando correctamente.

**Solución:**
1. Asegúrate de que el archivo `.env` esté en la raíz del proyecto
2. Verifica que no haya espacios alrededor del signo `=` en las variables
3. Reinicia el servidor después de cambios en `.env`

### Error: "Cannot find module"

**Causa:** Las dependencias no están instaladas o hay un problema con los imports.

**Solución:**
```bash
# Elimina node_modules y reinstala
rm -rf node_modules package-lock.json
npm install
```

---

## Estructura de Carpetas

```
backend-task-manager/
├── src/
│   ├── app.js                     # Archivo principal de Express
│   ├── config/
│   │   └── db.js                  # Configuración de conexión a MySQL
│   ├── controller/                # Controladores de la API
│   │   ├── auth.controller.js
│   │   ├── tasks.controller.js
│   │   ├── users.controller.js
│   │   ├── role.controller.js
│   │   ├── permission.controller.js
│   │   ├── user-role.controller.js
│   │   └── forgot-password.controller.js
│   ├── middlewares/               # Middlewares
│   │   ├── auth.middleware.js     # Verificación de token JWT
│   │   ├── permissions.middleware.js  # Verificación de permisos RBAC
│   │   ├── validator.middleware.js    # Validación con Zod
│   │   ├── error.middleware.js        # Manejo de errores
│   │   └── rateLimit.middleware.js    # Límite de tasa
│   ├── models/                    # Modelos de datos
│   │   ├── user.model.js
│   │   ├── task.model.js
│   │   ├── role.model.js
│   │   ├── permission.model.js
│   │   ├── user-role.model.js
│   │   └── password-reset.model.js
│   ├── routes/                    # Enrutadores
│   │   ├── auth.routes.js
│   │   ├── tasks.routes.js
│   │   ├── users.routes.js
│   │   ├── role.routes.js
│   │   ├── permissions.routes.js
│   │   ├── userRoles.routes.js
│   │   └── forgot-password.routes.js
│   ├── schemas/                   # Esquemas de validación (Zod)
│   └── utils/                     # Utilidades
│       ├── response.handler.js    # Manejo de respuestas
│       └── catchAsync.js          # Wrapper para funciones async
├── sql/
│   ├── database.sql               # Creación de BD y tablas
│   ├── security.sql               # Configuración RBAC
│   └── data.sql                   # Datos de prueba
├── docs/
│   ├── API.md                     # Documentación de API
│   ├── RBAC.md                    # Documentación RBAC
│   └── INSTALL.md                 # Esta guía
├── .env.example                   # Ejemplo de variables de entorno
├── package.json                   # Dependencias
└── server.js                      # Punto de entrada
```

---

## Comandos Útiles

| Comando | Descripción |
|---------|-------------|
| `npm install` | Instala dependencias |
| `npm run dev` | Inicia servidor en modo desarrollo |
| `npm run build` | Compila el proyecto (si aplica) |
| `node server.js` | Inicia servidor en modo producción |

---

## Soporte

Si encuentras problemas no documentados aquí:

1. Revisa los logs de la consola
2. Verifica que todas las dependencias estén instaladas
3. Consulta la documentación en `docs/`
4. Abre un issue en el repositorio de GitHub
# Backend Task Manager

## Propósito del proyecto

Este proyecto corresponde a la implementación inicial del backend para un sistema de gestión de tareas.
El objetivo es construir la base de una API utilizando Node.js y Express, la cual permitirá posteriormente gestionar usuarios y tareas.

En esta etapa se desarrolla:

* Configuración inicial del entorno backend
* Creación de un servidor con Express
* Organización del proyecto en módulos
* Implementación de rutas básicas para usuarios y tareas

Este repositorio funcionará como la base para futuras funcionalidades como controladores, conexión a base de datos y validaciones.

---

## Estructura del proyecto

El proyecto se encuentra organizado de la siguiente forma:

```
backend-task-manager
│
├── node_modules
├── package.json
├── package-lock.json
│
├── src
│   ├── routes
│   │   ├── users.routes.js
│   │   └── tasks.routes.js
│   │
│   └── app.js
│
└── README.md
```

**Descripción de la estructura:**

* **src/** → Contiene el código principal del backend.
* **routes/** → Define las rutas de la API separadas por módulos.
* **users.routes.js** → Maneja las rutas relacionadas con usuarios.
* **tasks.routes.js** → Maneja las rutas relacionadas con tareas.
* **app.js** → Archivo principal donde se configura el servidor Express.
* **package.json** → Archivo de configuración del proyecto y dependencias.

---

## Cómo ejecutar el servidor

1. Clonar el repositorio

```
git clone https://github.com/DAN-DELI/backend-task-manager.git
```

2. Entrar en la carpeta del proyecto

```
cd backend-task-manager
```

3. Instalar dependencias

```
npm install
```

4. Ejecutar el servidor

```
npm run dev
```

5. Abrir el navegador y acceder a:

```
http://localhost:3000
```

Rutas disponibles de prueba:

```
GET /users
POST /users
GET /tasks
POST /tasks
```

Estas rutas permiten verificar que la estructura inicial del backend funciona correctamente.

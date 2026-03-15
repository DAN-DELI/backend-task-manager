# Backend Rutas

## Propósito del Proyecto

Backend Rutas es una API REST desarrollada con Express.js que proporciona funcionalidades para la gestión de tareas y usuarios. El servidor está diseñado para servir como backend para aplicaciones frontend, permitiendo operaciones CRUD en recursos de tareas y usuarios.

## Estructura del Proyecto

```
backend-rutas/
├── src/
│   ├── app.js                 # Archivo principal de la aplicación
    ├── controllers/
│   │   ├── task.controller.js      # Controladores relacionadas con tareas
│   │   └── user.controller.js      # Controladores relacionadas con usuarios
│   └── routes/
│       ├── taskRoutes.js      # Rutas relacionadas con tareas
│       └── userRoutes.js      # Rutas relacionadas con usuarios
├── package.json               # Dependencias y configuración del proyecto
└── README.md                  # Este archivo
```

### Descripción de Carpetas

- **src/**: Contiene el código fuente principal de la aplicación
- **src/routes/**: Contiene los enrutadores para diferentes recursos (tareas y usuarios)

## Cómo Ejecutar el Servidor

### Requisitos Previos

- Node.js (versión 14 o superior)
- npm (incluido con Node.js)

### Instalación

1. Navega al directorio del proyecto:
   ```bash
   cd backend-rutas
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

### Iniciar el Servidor

Para ejecutar el servidor en modo desarrollo:

```bash
npm run dev:backend
```

El servidor se iniciará en `http://localhost:3000`

### Endpoints Disponibles

- **GET /**: Punto de acceso raíz que devuelve un mensaje de saludo
- **/tasks**: Rutas relacionadas con tareas
- **/users**: Rutas relacionadas con usuarios

## Dependencias

- **express**: Framework web para Node.js
- **cors**: Middleware para manejar Cross-Origin Resource Sharing

## Notas Adicionales

El servidor está configurado para:
- Aceptar solicitudes JSON
- Manejar datos URL-encoded
- Permitir solicitudes desde diferentes orígenes (CORS habilitado)

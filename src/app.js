import express from "express";
import cors from "cors";
import tasksRouter from './routes/task.routes.js'
import usersRouter from './routes/user.routes.js'
import authRouter from "./routes/auth.routes.js";
import { successResponse } from "./utils/response.handler.js";
import { globalErrorHandler } from "./middlewares/error.middleware.js"
import roleRouter from "./routes/role.routes.js";
import permissionsRouter from "./routes/permissions.routes.js";
import userRolesRouter from "./routes/userRoles.routes.js";

const app = express();

/** * Configuración de Middlewares globales 
 */
// Habilita el intercambio de recursos de origen cruzado (CORS)
app.use(cors());
// Middleware para parsear cuerpos de peticiones en formato JSON
app.use(express.json());
// Middleware para parsear cuerpos de peticiones codificados en URL (formularios)
app.use(express.urlencoded({ extended: true }));

/** @type {number} Puerto en el que escuchará el servidor */
const port = 3000;

/**
 * @route   GET /
 * @desc    Endpoint raíz para verificar la disponibilidad del servidor.
 */
app.get('/', (req, res) => {
    successResponse(res, 200, "Hola, esto es un servidor express (Endpoint raiz funcionando)")
});


/** * Registro de rutas modulares del sistema 
 */
app.use("/api/auth", authRouter); // Prefijo para rutas de autenticacion
app.use('/tasks', tasksRouter); // Prefijo para rutas de tareas
app.use('/users', usersRouter); // Prefijo para rutas de usuarios

// Rutas RBCA
app.use('/api/roles', roleRouter); // Prefijo para ruta de roles
app.use('/api/permissions', permissionsRouter); // Prefijo para ruta de de permisos
app.use('/api/userRoles', userRolesRouter); // Prefijo para ruta de asignacion de roles

/**
 * Middleware central de manejo de errores.
 * Debe ser el último app.use() para capturar errores de todas las rutas previas.
 */
app.use(globalErrorHandler);

/**
 * Inicia el servidor y lo pone a la escucha de peticiones.
 */
app.listen(port, () => {
    console.log(`example app listening on port ${port}`);
})
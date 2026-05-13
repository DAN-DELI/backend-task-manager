import express from "express";
import cors from "cors";
import tasksRouter from './routes/task.Routes.js'
import usersRouter from './routes/user.Routes.js'
import authRouter from "./routes/auth.route.js";
import forgotRouter       from "./routes/forgot-password.route.js";
import { successResponse } from "./utils/response.handler.js";
import { globalErrorHandler } from "./middlewares/error.middleware.js"

const app = express();

/** * Configuración de Middlewares globales 
 */
// Habilita el intercambio de recursos de origen cruzado (CORS)
app.use(cors({
    origin: 'http://localhost:5173'
}));
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
app.use("/api/auth", forgotRouter);
app.use('/tasks', tasksRouter); // Prefijo para rutas de tareas
app.use('/users', usersRouter); // Prefijo para rutas de usuarios

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
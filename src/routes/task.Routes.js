import express from 'express';
import { verifyToken } from "../middlewares/auth.middleware.js" // Validador de token
import {
    getTask,
    updateTask,
    createTask,
    deleteTask,
    getTaskById,
    updateTaskPartial
} from "../controller/tasks.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { taskSchema, taskPartialSchema } from "../schemas/task.schema.js";
import { checkPermission } from '../middlewares/permissions.middleware.js';

/**
 * Enrutador de tareas (Tasks).
 * Define las rutas para el CRUD de tareas y aplica middlewares de validación
 * mediante Zod antes de alcanzar los controladores.
 */
const tasksRouter = express.Router();

// Todas las rutas son protegidas con la verificacion del token
tasksRouter.use(verifyToken);

/**
 * @route   GET /api/tasks
 * @desc    Obtener todas las tareas
 * @access  Privado
 */
tasksRouter.get('/', checkPermission("tasks.view"), getTask);

/**
 * @route   GET /api/tasks/:id
 * @desc    Obtener una tarea por su ID
 * @access  Privado
 */
tasksRouter.get('/:id', checkPermission("tasks.view"), getTaskById);

/**
 * @route   POST /api/tasks
 * @desc    Crear una nueva tarea
 * @access  Privado
 */
tasksRouter.post('/', checkPermission("tasks.create"), validateSchema(taskSchema), createTask);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Actualizar totalmente una tarea (Reemplazo)
 * @access  Privado
 */
tasksRouter.put('/:id', checkPermission("tasks.update"), validateSchema(taskSchema), updateTask);

/**
 * @route   PATCH /api/tasks/:id
 * @desc    Actualizar parcialmente una tarea
 * @access  Privado
 */
tasksRouter.patch('/:id', checkPermission("tasks.update"), validateSchema(taskPartialSchema), updateTaskPartial);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Eliminar una tarea del sistema
 * @access  Privado
 */
tasksRouter.delete('/:id', checkPermission("tasks.delete"), deleteTask);

export default tasksRouter;
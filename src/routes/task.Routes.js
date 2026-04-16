import express from 'express';
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

/**
 * Enrutador de tareas (Tasks).
 * Define las rutas para el CRUD de tareas y aplica middlewares de validación
 * mediante Zod antes de alcanzar los controladores.
 */
const tasksRouter = express.Router();

/**
 * @route   GET /api/tasks
 * @desc    Obtener todas las tareas
 * @access  Público
 */
tasksRouter.get('/', getTask);

/**
 * @route   GET /api/tasks/:id
 * @desc    Obtener una tarea por su ID
 * @access  Público
 */
tasksRouter.get('/:id', getTaskById);

/**
 * @route   POST /api/tasks
 * @desc    Crear una nueva tarea
 * @middleware validateSchema - Valida que el body cumpla con el esquema completo de tareas.
 */
tasksRouter.post('/', validateSchema(taskSchema), createTask);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Actualizar totalmente una tarea (Reemplazo)
 * @middleware validateSchema - Requiere todos los campos obligatorios del esquema.
 */
tasksRouter.put('/:id', validateSchema(taskSchema), updateTask);

/**
 * @route   PATCH /api/tasks/:id
 * @desc    Actualizar parcialmente una tarea
 * @middleware validateSchema - Usa un esquema flexible donde los campos son opcionales.
 */
tasksRouter.patch('/:id', validateSchema(taskPartialSchema), updateTaskPartial);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Eliminar una tarea del sistema
 */
tasksRouter.delete('/:id', deleteTask);

export default tasksRouter;
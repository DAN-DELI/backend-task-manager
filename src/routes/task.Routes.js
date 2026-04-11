import express from 'express';
import { getTask, updateTask, createTask, deleteTask, getTaskById, updateTaskPartial } from "../controller/tasks.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js"; // Importación del middleware
import { taskSchema, taskPartialSchema } from "../schemas/task.schema.js"; // Importación de esquemas

const tasksRouter = express.Router();

tasksRouter.get('/', getTask);
tasksRouter.get('/:id',getTaskById);
tasksRouter.post('/', validateSchema(taskSchema),createTask);
tasksRouter.put('/:id',validateSchema(taskSchema), updateTask);
tasksRouter.patch('/:id',validateSchema(taskPartialSchema), updateTaskPartial);
tasksRouter.delete('/:id', deleteTask);

export default tasksRouter;
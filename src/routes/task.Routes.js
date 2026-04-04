import express from 'express';
import { getTask, updateTask, createTask, deleteTask, getTaskById, updateTaskPartial } from "../controller/tasks.controller.js";

const tasksRouter = express.Router();

tasksRouter.get('/', getTask);
tasksRouter.get('/:id', getTaskById);
tasksRouter.post('/', createTask);
tasksRouter.put('/:id', updateTask);
tasksRouter.patch('/:id', updateTaskPartial);
tasksRouter.delete('/:id', deleteTask);

export default tasksRouter;
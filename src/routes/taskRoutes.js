import express from 'express';
import {getTask, updateTask, createTask, deleteTask} from "../controller/tasks.controller.js"
const taskRoutes = express.Router();

taskRoutes.get('/', getTask)
taskRoutes.post('/',createTask);
taskRoutes.patch('/:id', updateTask);
taskRoutes.delete('/:id',deleteTask);

export default taskRoutes;
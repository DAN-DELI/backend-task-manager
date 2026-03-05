import express from 'express';
import {getTask, updateTask, createTask, deleteTask} from "../controller/tasks.controller.js"
const tasksRouter = express.Router();

tasksRouter.get('/', getTask)
tasksRouter.post('/',createTask);
tasksRouter.put('/', updateTask);
tasksRouter.delete('/',deleteTask);

export default tasksRouter;
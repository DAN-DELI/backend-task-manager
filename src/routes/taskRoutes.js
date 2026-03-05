import express from 'express';

const tasksRouter = express.Router();

tasksRouter.get('/', (req, res) =>{
    res
        .status(200)
        .json({msn : "Lista de tareas"})
});
tasksRouter.post('/', (req, res) =>{
    res
        .status(201)
        .json({msn : "Tarea creada"})
});
tasksRouter.put('/', (req, res) =>{
    res
        .status(204)
        .json({msn : "Tarea actualizada"})
});
tasksRouter.delete('/', (req, res) =>{
    res
        .status(204)
        .json({msn : "Tarea eliminada"})
});

export default tasksRouter;
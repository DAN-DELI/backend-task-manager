import express from 'express';

const usersRouter = express.Router();

usersRouter.get('/', (req, res) =>{
    res
        .status(200)
        .json({msn : "Lista de usuarios"})
});
usersRouter.post('/', (req, res) =>{
    res
        .status(201)
        .json({msn : "Usuario creado"})
});
usersRouter.put('/', (req, res) =>{
    res
        .status(204)
        .json({msn : "Usuario actualizado"})
});
usersRouter.delete('/', (req, res) =>{
    res
        .status(204)
        .json({msn : "Usuario eliminado"})
});

export default usersRouter;
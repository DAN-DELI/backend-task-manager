import express from 'express';
import { getUsers, createUser, updateUser, updateUserPartial, deleteUser } from '../controller/users.controller.js';

const usersRouter = express.Router();

usersRouter.get('/', getUsers);
usersRouter.get('/:id', getUsers);
usersRouter.post('/', createUser);
usersRouter.put('/:id', updateUser);
usersRouter.patch('/:id', updateUserPartial);
usersRouter.delete('/:id', deleteUser);

export default usersRouter;
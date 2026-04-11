import express from 'express';
import { getUsers, createUser, updateUser, updateUserPartial, deleteUser } from '../controller/users.controller.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import { userSchema, userPartialSchema } from '../schemas/user.schema.js';

const usersRouter = express.Router();

usersRouter.get('/', getUsers);
usersRouter.get('/:id', getUsers);
usersRouter.post('/', validateSchema(userSchema), createUser);
usersRouter.put('/:id', validateSchema(userPartialSchema), updateUser);
usersRouter.patch('/:id', validateSchema(userPartialSchema), updateUserPartial);
usersRouter.delete('/:id', deleteUser);

export default usersRouter;
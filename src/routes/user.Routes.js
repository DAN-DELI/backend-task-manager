import express from 'express';
import { verifyToken } from "../middlewares/auth.middleware.js" // Validador de token
import { getUsers, createUser, updateUser, updateUserPartial, deleteUser } from '../controller/users.controller.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import { userSchema, userPartialSchema } from '../schemas/user.schema.js';

/**
 * Enrutador de Usuarios (Users).
 * Gestiona los endpoints de la API relacionados con la entidad de usuario,
 * incluyendo la validación de esquemas mediante Zod.
 */
const usersRouter = express.Router();

// Todas las rutas son protegidas con la verificacion del token
usersRouter.use(verifyToken)

/**
 * @route   GET /api/users
 * @desc    Obtener listado de todos los usuarios o filtrar por query (?document=...)
 */
usersRouter.get('/', getUsers);


/**
 * @route   GET /api/users/:id
 * @desc    Obtener un usuario específico por su ID
 * @access  Privado
 */
usersRouter.get('/:id', getUsers);

/**
 * @route   POST /api/users
 * @desc    Registrar un nuevo usuario
 * @access  Privado
 */
usersRouter.post('/', validateSchema(userSchema), createUser);

/**
 * @route   PUT /api/users/:id
 * @desc    Actualización completa de un usuario
 * @access  Privado
 */
usersRouter.put('/:id', validateSchema(userPartialSchema), updateUser);

/**
 * @route   PATCH /api/users/:id
 * @desc    Actualización parcial de un usuario
 * @access  Privado
 */
usersRouter.patch('/:id', validateSchema(userPartialSchema), updateUserPartial);

/**
 * @route   DELETE /api/users/:id
 * @desc    Eliminar un usuario del sistema
 * @access  Privado
 */
usersRouter.delete('/:id', deleteUser);

export default usersRouter;
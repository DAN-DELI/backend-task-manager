import express from 'express';
import { getUsers, createUser, updateUser, updateUserPartial, deleteUser } from '../controller/users.controller.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import { userSchema, userPartialSchema } from '../schemas/user.schema.js';

/**
 * Enrutador de Usuarios (Users).
 * Gestiona los endpoints de la API relacionados con la entidad de usuario,
 * incluyendo la validación de esquemas mediante Zod.
 */
const usersRouter = express.Router();

/**
 * @route   GET /api/users
 * @desc    Obtener listado de todos los usuarios o filtrar por query (?document=...)
 */
usersRouter.get('/', getUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Obtener un usuario específico por su ID
 */
usersRouter.get('/:id', getUsers);

/**
 * @route   POST /api/users
 * @desc    Registrar un nuevo usuario
 * @middleware validateSchema(userSchema) - Valida campos obligatorios (nombre, email, documento).
 */
usersRouter.post('/', validateSchema(userSchema), createUser);

/**
 * @route   PUT /api/users/:id
 * @desc    Actualización completa de un usuario
 * @middleware validateSchema(userPartialSchema) - Nota: Aquí usas el parcial para permitir flexibilidad.
 */
usersRouter.put('/:id', validateSchema(userPartialSchema), updateUser);

/**
 * @route   PATCH /api/users/:id
 * @desc    Actualización parcial de un usuario
 * @middleware validateSchema(userPartialSchema) - Solo valida los campos enviados.
 */
usersRouter.patch('/:id', validateSchema(userPartialSchema), updateUserPartial);

/**
 * @route   DELETE /api/users/:id
 * @desc    Eliminar un usuario del sistema
 */
usersRouter.delete('/:id', deleteUser);

export default usersRouter;
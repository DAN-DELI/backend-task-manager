import express from 'express';
import { verifyToken } from "../middlewares/auth.middleware.js" // Validador de token
import { getUsers, createUser, updateUser, updateUserPartial, deleteUser, getUserRoles, getUserPermissions, getUserRolesWithPermissions } from '../controller/users.controller.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import { userSchema, userPartialSchema } from '../schemas/user.schema.js';
import { checkPermission } from '../middlewares/permissions.middleware.js';
import { idParamSchema } from '../schemas/role.schema.js';

/**
 * Enrutador de Usuarios (Users).
 * Gestiona los endpoints de la API relacionados con la entidad de usuario,
 * incluyendo la validación de esquemas mediante Zod.
 */
const usersRouter = express.Router();

// Todas las rutas son protegidas con la verificacion del token
usersRouter.use(verifyToken);

/**
 * @route   GET /users
 * @desc    Obtener listado de todos los usuarios o filtrar por query (?document=...)
 * @access  Privado
 */
usersRouter.get('/', checkPermission("users.view"), getUsers);

/**
 * @route   GET /users/:id
 * @desc    Obtener un usuario específico por su ID
 * @access  Privado
 */
usersRouter.get('/:id', checkPermission("users.view"), validateSchema(idParamSchema, "params"), getUsers);

/**
 * @route   GET /users/:id/roles
 * @desc    Obtener roles de un usuario
 * @access  Privado
 */
usersRouter.get("/:id/roles", checkPermission("roles.view"), validateSchema(idParamSchema, "params"), getUserRoles);

/**
 * @route   GET /users/:id/permissions
 * @desc    Obtener permisos de un usuario
 * @access  Privado
 */
usersRouter.get("/:id/permissions", checkPermission("permissions.view"), validateSchema(idParamSchema, "params"), getUserPermissions);

/**
 * @route   GET /users/:id/roles-with-permissions
 * @desc    Obtener roles y permisos de un usuario
 * @access  Privado
 */
usersRouter.get("/:id/roles-with-permissions", checkPermission("roles.view"), validateSchema(idParamSchema, "params"), getUserRolesWithPermissions);

/**
 * @route   POST /users
 * @desc    Registrar un nuevo usuario
 * @access  Privado
 */
usersRouter.post('/', checkPermission("users.create"), validateSchema(userSchema), createUser);

/**
 * @route   PUT /users/:id
 * @desc    Actualización completa de un usuario
 * @access  Privado
 */
usersRouter.put('/:id', checkPermission("users.update"), validateSchema(userPartialSchema), updateUser);

/**
 * @route   PATCH /users/:id
 * @desc    Actualización parcial de un usuario
 * @access  Privado
 */
usersRouter.patch('/:id', checkPermission("users.update"), validateSchema(userPartialSchema), updateUserPartial);

/**
 * @route   DELETE /users/:id
 * @desc    Eliminar un usuario del sistema
 * @access  Privado
 */
usersRouter.delete('/:id', checkPermission("users.delete"), validateSchema(idParamSchema, "params"), deleteUser);

export default usersRouter;
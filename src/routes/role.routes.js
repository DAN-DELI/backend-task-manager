import express from 'express';

import {
    assignRolePermissions,
    createRole,
    deleteRole,
    getAllRoles,
    getRoleById,
    getRolePermissions,
    patchRole,
    updateRole
} from '../controller/role.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { checkPermission } from '../middlewares/permissions.middleware.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import { assignPermissionsSchema, idParamSchema, patchRoleSchema, roleSchema } from '../schemas/role.schema.js';


/**
 * Enrutador de Rol (role).
 * Define las rutas para el CRUD de role
 */
const roleRouter = express.Router();

// Todas las rutas son protegidas con la verificacion del token
roleRouter.use(verifyToken);

/**
 * @route   GET /api/roles
 * @desc    Listar todos los roles
 * @access  Privado
 */
roleRouter.get("/", checkPermission("roles.view"), getAllRoles);

/**
 * @route   GET /api/roles/:id/permissions
 * @desc    Listar permisos de un rol especifico
 * @access  Privado
 */
roleRouter.get("/:id/permissions", checkPermission("permissions.view"), validateSchema(idParamSchema, "params"), getRolePermissions);

/**
 * @route   POST /api/roles/:id/permissions
 * @desc    Sincroniza los permisos de un rol
 * @access  Privado
 */
roleRouter.post("/:id/permissions", checkPermission("roles.assign"), validateSchema(idParamSchema, "params"), validateSchema(assignPermissionsSchema), assignRolePermissions);

/**
 * @route   GET /api/roles/:id
 * @desc    Listar rol por id
 * @access  Privado
 */
roleRouter.get("/:id", checkPermission("roles.view"), validateSchema(idParamSchema, "params"), getRoleById);

/**
 * @route   POST /api/roles
 * @desc    Crea un rol 
 * @access  Privado
 */
roleRouter.post("/", checkPermission("roles.create"), validateSchema(roleSchema), createRole);

/**
 * @route   PUT /api/roles/:id
 * @desc    Actualizar cuerpo del rol en su totalidad
 * @access  Privado
 */
roleRouter.put("/:id", checkPermission("roles.update"), validateSchema(roleSchema), updateRole);

/**
 * @route   PATCH /api/roles/:id
 * @desc    Actualizar cuerpo del rol parcialmente
 * @access  Privado
 */
roleRouter.patch("/:id", checkPermission("roles.update"), validateSchema(patchRoleSchema), patchRole);

/**
 * @route   DELETE /api/roles/:id
 * @desc    Eliminar rol
 * @access  Privado
 */
roleRouter.delete("/:id", checkPermission("roles.delete"), validateSchema(idParamSchema, "params"), deleteRole);


export default roleRouter;
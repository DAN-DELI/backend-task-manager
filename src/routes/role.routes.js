import express from 'express';

import { assignRolePermissions,
    createRole,
    deleteRole,
    getAllRoles,
    getRoleById,
    getRolePermissions,
    patchRole,
    updateRole 
} from '../controller/role.controller.js';


/**
 * Enrutador de Rol (role).
 * Define las rutas para el CRUD de role
 */
const roleRouter = express.Router();

/**
 * @route   GET /api/roles
 * @desc    Listar todos los roles
 * @access  Publico
 */
roleRouter.get("/", getAllRoles);

/**
 * @route   GET /api/roles/:id/permissions
 * @desc    Listar permisos de un rol especifico
 * @access  Publico
 */
roleRouter.get("/:id/permissions", getRolePermissions);

/**
 * @route   POST /api/roles/:id/permissions
 * @desc    Sincroniza los permisos de un rol
 * @access  Publico
 */
roleRouter.post("/:id/permissions", assignRolePermissions);

/**
 * @route   GET /api/roles/:id
 * @desc    Listar rol por id
 * @access  Publico
 */
roleRouter.get("/:id", getRoleById);

/**
 * @route   POST /api/roles
 * @desc    Crea un rol 
 * @access  Publico
 */
roleRouter.post("/", createRole);

/**
 * @route   PUT /api/roles/:id
 * @desc    Actualizar cuerpo del rol en su totalidad
 * @access  Publico
 */
roleRouter.put("/:id", updateRole);

/**
 * @route   PATCH /api/roles/:id
 * @desc    Actualizar cuerpo del rol parcialmente
 * @access  Publico
 */
roleRouter.patch("/:id", patchRole);

/**
 * @route   DELETE /api/roles/:id
 * @desc    Eliminar rol
 * @access  Publico
 */
roleRouter.delete("/:id", deleteRole);


export default roleRouter;
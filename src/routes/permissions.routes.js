import express from 'express';
import { getAllPermissions } from '../controller/permission.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { checkPermission } from '../middlewares/permissions.middleware.js';


/**
 * Enrutador de permisos (permissions).
 */
const permissionsRouter = express.Router();

// Todas las rutas son protegidas con la verificacion del token
permissionsRouter.use(verifyToken);


/**
 * @route   GET /api/permissions
 * @desc    Listar todos los roles disponibles del sistema
 * @access  Privado
 */
permissionsRouter.get("/", checkPermission("roles.view"), getAllPermissions);


export default permissionsRouter;
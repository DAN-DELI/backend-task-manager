import express from 'express';
import { assignRolesToUser } from '../controller/user-role.controller.js';
import { checkPermission } from '../middlewares/permissions.middleware.js';
import { verifyToken } from '../middlewares/auth.middleware.js';


/**
 * Enrutador de relacion user <-> roles
 */
const userRolesRouter = express.Router();

// Todas las rutas son protegidas con la verificacion del token
userRolesRouter.use(verifyToken);

/**
 * @route   POST /api/userRoles
 * @desc    Sincroniza los roles de un usuario
 * @access  Privado
 */
userRolesRouter.post("/assign", checkPermission("user-roles.assign"), assignRolesToUser)


export default userRolesRouter;
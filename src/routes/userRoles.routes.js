import express from 'express';
import { assignRolesToUser } from '../controller/user-role.controller.js';


/**
 * Enrutador de relacion user <-> roles
 */
const userRolesRouter = express.Router();


/**
 * @route   POST /api/userRoles
 * @desc    Sincroniza los roles de un usuario
 * @access  Publico
 */
userRolesRouter.post("/assign", assignRolesToUser)


export default userRolesRouter;
import express from 'express';
import { getAllPermissions } from '../controller/permission.controller.js';


/**
 * Enrutador de permisos (permissions).
 */
const permissionsRouter = express.Router();

/**
 * @route   GET /api/permissions
 * @desc    Listar todos los roles disponibles del sistema
 * @access  Publico
 */
permissionsRouter.get("/", getAllPermissions);


export default permissionsRouter;
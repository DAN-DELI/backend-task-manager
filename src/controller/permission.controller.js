import { PermissionModel } from '../models/permission.model.js';
import { successResponse, createError } from '../utils/response.handler.js';
import { catchAsync } from '../utils/catchAsync.js';

/**
 * @module PermissionController
 * @description Controlador encargado de la gestión y consulta de los permisos atómicos del sistema.
 */

/**
 * Lista todos los permisos predefinidos del sistema.
 * Ideal para construir interfaces de asignación de permisos a roles en el frontend.
 * 
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para delegar errores al middleware global.
 * @returns {Promise<void>} Responde con la lista de permisos (id, code, name, description) y status 200.
 */
export const getAllPermissions = catchAsync(async (req, res, next) => {
    // Lógica clave: Consultar todos los permisos atómicos a través del modelo
    const permissions = await PermissionModel.findAll();

    if (!permissions || permissions.length === 0) {
        return next(createError("No se encontraron permisos", 404, ["La tabla de permisos está vacía o no existe"]));
    }

    return successResponse(res, 200, "Permisos listados exitosamente", permissions);
});
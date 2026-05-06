import { PermissionModel } from '../models/permission.model.js';
import { successResponse } from '../utils/response.handler.js';
import { catchAsync } from '../utils/catchAsync.js';

/**
 * Lista todos los permisos atómicos predefinidos del sistema.
 * Estos permisos son utilizados por el frontend para construir
 * las interfaces de asignación de permisos a roles.
 * @route GET /api/permissions
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para delegar errores al middleware global.
 * @returns {Promise<void>} Responde con el listado completo de permisos y status 200.
 */
export const getAllPermissions = catchAsync(async (req, res, next) => {
    // Consultar todos los permisos atómicos desde el modelo
    const permissions = await PermissionModel.findAll();

    return successResponse(res, 200, "Permisos listados exitosamente", permissions);
});
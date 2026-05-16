import { UserModel } from '../models/user.model.js';
import { successResponse, createError } from '../utils/response.handler.js';
import { catchAsync } from '../utils/catchAsync.js';

/**
 * @module UserRoleController
 * @description Controlador para la gestión de asignaciones de roles a usuarios en el sistema.
 */

/**
 * Sincroniza los roles asignados a un usuario específico.
 * Elimina las asignaciones previas en la tabla 'user_roles' e inserta las nuevas.
 * * @param {Object} req - Objeto de solicitud de Express. Contiene userId y roleIds en el body.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para delegar el control al middleware de errores.
 * @returns {Promise<void>} Responde con un mensaje de éxito y status 200.
 */
export const assignRolesToUser = catchAsync(async (req, res, next) => {
    const { userId, roleIds } = req.body;

    // Lógica clave: Validar primero la existencia del usuario antes de proceder
    const userExists = await UserModel.findById(userId);

    if (!userExists) {
        return next(createError("Usuario no encontrado", 404, [`El ID de usuario ${userId} no existe en el sistema`]));
    }

    // Lógica clave: Sincronizar roles invocando el método del modelo
    // Este método debe encargarse de la transacción (DELETE e INSERT) en la tabla pivote
    await UserModel.syncRoles(userId, roleIds);

    // Verificar que si se asignaron los roles
    const roles = await UserModel.getRoles(userId);

    return successResponse(res, 200, "Roles asignados al usuario exitosamente", roles);
});
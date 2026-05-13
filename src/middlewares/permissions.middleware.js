import { UserModel } from "../models/user.model.js";
import { createError } from "../utils/response.handler.js";

export const checkPermission = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return next(createError("No autenticado", 401))
            }

            // 1. Obtenemos la estructura compleja: [{ id, name, permissions: [] }, ...]
            const userRoles = await UserModel.getRolesWithPermissions(req.user.id);

            // 2. Buscamos el permiso en CUALQUIERA de los roles que tenga el usuario
            // .some() devuelve true si al menos un rol cumple la condición
            const hasPermission = userRoles.some(role =>
                role.permissions.includes(requiredPermission)
            );

            if (!hasPermission) {
                return next(createError("No tienes los permisos necesarios para esta acción", 403));
            }

            next();
        } catch (err) {
            next(err);
        }
    };
};
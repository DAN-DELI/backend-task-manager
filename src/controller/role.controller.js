import { RoleModel } from '../models/role.model.js';
import { successResponse, createError } from '../utils/response.handler.js';
import { catchAsync } from '../utils/catchAsync.js';

/**
 * @module roleController
 * @description Controlador encargado de gestionar el ciclo de vida completo de los roles
 * del sistema y la sincronización de permisos asociados a cada rol.
 */

/**
 * Lista todos los roles registrados en el sistema.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para delegar errores al middleware global.
 * @returns {Promise<void>} Responde con el array de roles y status 200.
 */
export const getAllRoles = catchAsync(async (req, res, next) => {
    const roles = await RoleModel.findAll();
    if (!roles || roles.length === 0) {
        return next(createError("No se encontraron roles", 404, ["La tabla de roles está vacía"]));
    }
    return successResponse(res, 200, "Roles listados exitosamente", roles);
});

/**
 * Consulta un rol específico por su identificador único.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {string} req.params.id - ID del rol a consultar.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para delegar errores al middleware global.
 * @returns {Promise<void>} Responde con el objeto del rol y status 200, o error 404 si no existe.
 */
export const getRoleById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const role = await RoleModel.findById(id);
    if (!role) {
        return next(createError("Rol no encontrado", 404, [`No se encontró ningún rol con el ID ${id}`]));
    }
    return successResponse(res, 200, "Rol encontrado exitosamente", role);
});

/**
 * Crea un nuevo rol en el sistema.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} req.body - Datos del rol (name, description).
 * @param {string} req.body.name - Nombre único del rol.
 * @param {string} [req.body.description] - Descripción opcional del rol.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para delegar errores al middleware global.
 * @returns {Promise<void>} Responde con el rol creado y status 201.
 */
export const createRole = catchAsync(async (req, res, next) => {
    const { name, description } = req.body;
    // Lógica clave: Verificar que no exista un rol con el mismo nombre antes de insertar
    const existingRole = await RoleModel.findByName(name);
    if (existingRole) {
        return next(createError("El rol ya existe", 400, [
            { field: "name", message: `Ya existe un rol con el nombre '${name}'` }
        ]));
    }
    const newRole = await RoleModel.create({ name, description });
    return successResponse(res, 201, "Rol creado exitosamente", newRole);
});

/**
 * Reemplaza completamente la información de un rol existente (actualización total).
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {string} req.params.id - ID del rol a actualizar.
 * @param {Object} req.body - Objeto con todos los campos del rol (name, description).
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para delegar errores al middleware global.
 * @returns {Promise<void>} Responde con el rol actualizado y status 200.
 */
export const updateRole = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { name, description } = req.body;
    // Lógica clave: Confirmar que el rol exista antes de intentar reemplazarlo
    const roleExists = await RoleModel.findById(id);
    if (!roleExists) {
        return next(createError("Rol no encontrado", 404, [`No se encontró el rol con el ID ${id}`]));
    }
    const updatedRole = await RoleModel.update(id, { name, description });
    return successResponse(res, 200, "Rol actualizado exitosamente", updatedRole);
});

/**
 * Actualiza campos específicos de un rol existente (actualización parcial).
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {string} req.params.id - ID del rol a modificar.
 * @param {Object} req.body - Campos específicos que se desean actualizar.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para delegar errores al middleware global.
 * @returns {Promise<void>} Responde con el rol modificado y status 200.
 */
export const patchRole = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const roleData = req.body;
    const roleExists = await RoleModel.findById(id);
    if (!roleExists) {
        return next(createError("Rol no encontrado", 404, [`No se encontró el rol con el ID ${id}`]));
    }
    // Lógica clave: Rechazar la petición si no se envía ningún campo a actualizar
    if (Object.keys(roleData).length === 0) {
        return next(createError("Error al editar el rol", 400, ["Debes enviar al menos un campo para actualizar"]));
    }
    const patchedRole = await RoleModel.patch(id, roleData);
    return successResponse(res, 200, "Rol actualizado parcialmente exitosamente", patchedRole);
});

/**
 * Elimina un rol del sistema por su identificador.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {string} req.params.id - ID del rol a eliminar.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para delegar errores al middleware global.
 * @returns {Promise<void>} Responde con mensaje de éxito y status 200.
 */
export const deleteRole = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const isDeleted = await RoleModel.delete(id);
    if (!isDeleted) {
        return next(createError("Error al eliminar el rol", 404, [`No se encontró el rol con el ID ${id}`]));
    }
    return successResponse(res, 200, "Rol eliminado exitosamente");
});

/**
 * Consulta todos los permisos asignados a un rol específico.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {string} req.params.id - ID del rol cuyas permisos se desean consultar.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para delegar errores al middleware global.
 * @returns {Promise<void>} Responde con el array de permisos del rol y status 200.
 */
export const getRolePermissions = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    // Lógica clave: Validar la existencia del rol antes de consultar sus permisos
    const roleExists = await RoleModel.findById(id);
    if (!roleExists) {
        return next(createError("Rol no encontrado", 404, [`No se encontró el rol con el ID ${id}`]));
    }
    const permissions = await RoleModel.getPermissionsByRoleId(id);
    return successResponse(res, 200, "Permisos del rol obtenidos exitosamente", permissions);
});

/**
 * Sincroniza los permisos de un rol: elimina los actuales e inserta los nuevos.
 * Opera sobre la tabla pivote `role_permissions`.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {string} req.params.id - ID del rol al que se le sincronizarán los permisos.
 * @param {Object} req.body - Cuerpo de la petición.
 * @param {number[]} req.body.permissionIds - Array con los IDs de los permisos a asignar.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para delegar errores al middleware global.
 * @returns {Promise<void>} Responde con mensaje de éxito y status 200.
 */
export const assignRolePermissions = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { permissionIds } = req.body;

    // Lógica clave: Confirmar que el rol exista antes de sincronizar sus permisos
    const roleExists = await RoleModel.findById(id);
    if (!roleExists) {
        return next(createError("Rol no encontrado", 404, [`El ID de rol ${id} no existe en el sistema`]));
    }

    // Lógica clave: Sincronizar permisos (DELETE + INSERT) en la tabla pivote role_permissions
    await RoleModel.syncPermissions(id, permissionIds);
    return successResponse(res, 200, "Permisos del rol sincronizados exitosamente");
});
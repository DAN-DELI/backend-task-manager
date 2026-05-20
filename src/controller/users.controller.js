import { UserModel } from '../models/user.model.js';
import { UserRoleModel } from '../models/user-role.model.js';
import { PasswordResetModel } from '../models/password-reset.model.js';
import { createError, successResponse } from '../utils/response.handler.js';
import { catchAsync } from '../utils/catchAsync.js';
import bcrypt from 'bcrypt'; // bcrypt para encriptar contraseña

/**
 * Consulta usuarios basándose en diferentes criterios (ID, Documento o todos).
 * @route GET /users/:id?
 * @param {Object} req.params - Parámetros de ruta.
 * @param {string} [req.params.id] - (Opcional) ID del usuario.
 * @param {Object} req.query - Parámetros de consulta.
 * @param {string} [req.query.document] - (Opcional) Número de documento.
 * @returns {Promise<void>} Envía en la respuesta HTTP un array de usuarios encontrados..
 * @throws {Error} 404 - Si no se encuentra el usuario por ID o documento.
 */
export const getUsers = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { document } = req.query;
    let result;

    if (id) {
        const user = await UserModel.findById(id);
        if (!user) {
            return next(createError("Usuario no encontrado", 404));
        }
        result = [user];
    } else if (document) {
        result = await UserModel.findByDocument(document);
        if (result.length === 0) {
            return next(createError("Usuario no encontrado", 404));
        }
    } else {
        result = await UserModel.findAll();
    }

    return successResponse(res, 200, "Usuarios consultados con éxito", result);
});

/**
 * Registra un nuevo usuario en el sistema.
 * @route POST /users
 * @returns {Promise<void>} Responde con el usuario creado y status 201.
 */
export const createUser = catchAsync(async (req, res, next) => {
    const { name, email, document, password, roleId } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const newUser = await UserModel.create({ name, email, document, password_hash });
        
        if (roleId) {
            await UserRoleModel.assignRole(newUser.id, roleId);
        }

        await PasswordResetModel.saveToHistory(newUser.id, password_hash);
        
        return successResponse(res, 201, "Usuario creado con éxito", newUser);

    } catch (error) {
        // Capturamos el error específico de duplicado de MySQL
        if (error.code === 'ER_DUP_ENTRY') {
            return next(createError("El número de documento ya está registrado", 400));
        }
        
        // Si es cualquier otro error, lo pasamos al middleware global
        return next(error);
    }
});

/**
 * Actualización completa de un usuario (Reemplazo).
 * @route PUT /users/:id
 * @param {string} req.params.id - ID del usuario a actualizar.
 * @param {Object} req.body - Debe incluir name, email, document y role.
 * @returns {Promise<void>} Responde con el usuario actualizado.
 * @throws {Error} 400 - Si faltan datos o el usuario no existe.
 */
export const updateUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { name, email, document, role } = req.body;

    if (!name || !email || !document || !role) {
        return next(createError("Faltan datos obligatorios", 400, ["name, email, document y role son requeridos"]));
    }

    const userExists = await UserModel.findById(id);
    if (!userExists) {
        return next(createError("Usuario no encontrado", 400, [`Usuario con id ${id} no encontrado`]));
    }

    const updatedUser = await UserModel.update(id, { name, email, document, role });

    return successResponse(res, 200, `Usuario actualizado correctamente`, updatedUser);
});

export const updateUserPartial = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { roleId, ...userData } = req.body;

    const userExists = await UserModel.findById(id);
    if (!userExists) {
        return next(createError("Usuario no encontrado", 404));
    }

    // 🔒 CANDADO DE SEGURIDAD: Evitar quitar el rol al último Admin
    // Si el usuario actual es Admin (1) y le están enviando un rol distinto (!= 1)
    if (roleId && userExists.roleId === 1 && Number(roleId) !== 1) {
        const adminCount = await UserRoleModel.countUsersWithRole(1);
        if (adminCount <= 1) {
            return next(createError("Operación denegada: El sistema debe tener al menos un Administrador.", 403));
        }
    }

    if (Object.keys(userData).length === 0 && !roleId) {
        return next(createError("Debes enviar al menos un campo para actualizar", 400));
    }

    let updatedUser = userExists;

    if (Object.keys(userData).length > 0) {
        updatedUser = await UserModel.updatePartial(id, userData);
    }

    if (roleId) {
        const roleResult = await UserRoleModel.updateUserRole(id, roleId);
        if (roleResult.affectedRows === 0) {
            await UserRoleModel.assignRole(id, roleId);
        }
    }

    return successResponse(res, 200, `Usuario actualizado exitosamente`, [updatedUser]);
});

export const deleteUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    // Primero buscamos al usuario para saber qué rol tiene
    const userExists = await UserModel.findById(id);
    if (!userExists) {
        return next(createError("Usuario no encontrado", 404));
    }

    // 🔒 CANDADO DE SEGURIDAD: Evitar borrar al último Admin
    if (userExists.roleId === 1) {
        const adminCount = await UserRoleModel.countUsersWithRole(1);
        if (adminCount <= 1) {
            return next(createError("Operación denegada: No puedes eliminar al último Administrador del sistema.", 403));
        }
    }

    const isDeleted = await UserModel.delete(id);
    if (!isDeleted) {
        return next(createError("No se pudo eliminar el usuario", 400));
    }

    return successResponse(res, 200, `Usuario eliminado correctamente`);
});


/**
 * Obtiene los roles asignados a un usuario específico.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para delegar errores.
 * @returns {Promise<void>} Arreglo con la información de los roles asignados.
 */
export const getUserRoles = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    // Lógica clave: Validar la existencia del usuario antes de consultar sus roles
    const userExists = await UserModel.findById(id);
    if (!userExists) {
        return next(createError("Usuario no encontrado", 404, [`No se encontró al usuario con id ${id}`]));
    }

    const roles = await UserModel.getRoles(id);
    return successResponse(res, 200, "Roles del usuario obtenidos con éxito", roles);
});

/**
 * Obtiene los permisos efectivos (únicos) de un usuario aplicando DISTINCT.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para delegar errores.
 * @returns {Promise<void>} Arreglo plano con los códigos de los permisos.
 */
export const getUserPermissions = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const userExists = await UserModel.findById(id);
    if (!userExists) {
        return next(createError("Usuario no encontrado", 404, [`No se encontró al usuario con id ${id}`]));
    }

    // Lógica clave: Obtener lista plana de permisos sin duplicados
    const permissions = await UserModel.getPermissions(id);
    return successResponse(res, 200, "Permisos del usuario obtenidos con éxito", permissions);
});

/**
 * Obtiene un resumen estructurado combinando los roles de un usuario con sus respectivos permisos.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para delegar errores.
 * @returns {Promise<void>} Arreglo de objetos (rol y su lista de permisos).
 */
export const getUserRolesWithPermissions = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const userExists = await UserModel.findById(id);
    if (!userExists) {
        return next(createError("Usuario no encontrado", 404, [`No se encontró al usuario con id ${id}`]));
    }

    // Lógica clave: Obtener estructura anidada de roles con permisos asociados
    const rolesWithPermissions = await UserModel.getRolesWithPermissions(id);
    return successResponse(res, 200, "Roles y permisos del usuario obtenidos con éxito", rolesWithPermissions);

});



/**
 * Cambia la contraseña de un usuario autenticado desde settings.
 * Verifica la contraseña actual, valida que la nueva no esté en el historial
 * y actualiza el hash en la base de datos.
 * @route POST /api/users/:id/change-password
 * @param {string} req.params.id       - ID del usuario.
 * @param {string} req.body.currentPassword - Contraseña actual para verificar identidad.
 * @param {string} req.body.newPassword     - Nueva contraseña a establecer.
 * @returns {Promise<void>} Responde con mensaje de éxito o error.
 */
export const changePassword = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    // Paso 1: Verificar que el usuario existe
    const user = await UserModel.findById(id);
    if (!user) {
        return next(createError("Usuario no encontrado", 404));
    }

    // Paso 2: Obtener el hash actual y verificar la contraseña actual
    const currentHash = await PasswordResetModel.getCurrentPasswordHash(id);
    const isCurrentValid = await bcrypt.compare(currentPassword, currentHash);
    if (!isCurrentValid) {
        return next(createError("La contraseña actual es incorrecta", 400, [
            { field: "currentPassword", message: "La contraseña actual no coincide con la registrada" }
        ]));
    }

    // Paso 3: Verificar que la nueva contraseña no sea igual a la actual
    const isSameAsCurrent = await bcrypt.compare(newPassword, currentHash);
    if (isSameAsCurrent) {
        return next(createError("La nueva contraseña no puede ser igual a la actual", 400, [
            { field: "newPassword", message: "Elige una contraseña diferente a la actual" }
        ]));
    }

    // Paso 4: Verificar que la nueva contraseña no esté en el historial
    const history = await PasswordResetModel.getPasswordHistory(id);
    for (const entry of history) {
        const isInHistory = await bcrypt.compare(newPassword, entry.password_hash);
        if (isInHistory) {
            return next(createError("Contraseña ya utilizada anteriormente", 400, [
                { field: "newPassword", message: "No puedes reutilizar una contraseña reciente" }
            ]));
        }
    }

    // Paso 5: Guardar la contraseña actual en el historial antes de reemplazarla
    await PasswordResetModel.saveToHistory(id, currentHash);

    // Paso 6: Hashear la nueva contraseña y actualizarla
    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);
    await PasswordResetModel.updatePassword(id, newHash);

    // Paso 7: Limpiar el historial para no acumular entradas infinitas
    await PasswordResetModel.pruneHistory(id);

    return successResponse(res, 200, "Contraseña actualizada exitosamente");
});

/**
 * Permite a un usuario autenticado actualizar su propio nombre y/o email.
 * No requiere permiso administrativo — solo valida que el id del token
 * coincida con el id del parámetro de ruta.
 * @route PATCH /users/:id/profile
 */
export const updateOwnProfile = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    // Solo el propio usuario puede editar su perfil
    if (String(req.user.id) !== String(id)) {
        return next(createError("No puedes editar el perfil de otro usuario", 403));
    }

    const { name, email } = req.body;

    if (!name && !email) {
        return next(createError("Debes enviar al menos un campo para actualizar", 400));
    }

    const userData = {};
    if (name)  userData.name  = name;
    if (email) userData.email = email;

    const updatedUser = await UserModel.updatePartial(id, userData);

    return successResponse(res, 200, "Perfil actualizado exitosamente", [updatedUser]);
});
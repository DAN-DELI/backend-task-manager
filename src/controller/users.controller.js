import { UserModel } from '../models/user.model.js';
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
    const { name, email, document, password, role } = req.body;

    // Hash de contraseña
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Construcción del objeto limpio
    const userData = {
        name,
        email,
        document,
        role,
        password_hash
    };

    // Creación en DB
    const newUser = await UserModel.create(userData);

    return successResponse(res, 201, "Usuario creado con exito", newUser);
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

/**
 * Actualización parcial de un usuario (PATCH).
 * @route PATCH /users/:id
 * @param {string} req.params.id - ID del usuario.
 * @param {Object} req.body - Campos a modificar.
 * @returns {Promise<void>} Responde con un array que contiene al usuario actualizado.
 * @throws {Error} 404 - Si el usuario no existe.
 * @throws {Error} 400 - Si no se envían campos para actualizar.
 */
export const updateUserPartial = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const userData = req.body;

    const userExists = await UserModel.findById(id);
    if (!userExists) {
        return next(createError("Usuario no encontrado", 404, [`No se encontro al usuario con id ${id}`]));
    }

    if (Object.keys(userData).length === 0) {
        return next(createError("Debes enviar al menos un campo para actualizar", 400));
    }

    const updatedUser = await UserModel.updatePartial(id, userData);

    return successResponse(res, 200, `Usuario actualizado exitosamente`, [updatedUser]);
});

/**
 * Elimina de forma definitiva a un usuario.
 * @route DELETE /users/:id
 * @param {string} req.params.id - ID del usuario a eliminar.
 * @returns {Promise<void>} Responde con mensaje de éxito.
 * @throws {Error} 404 - Si el ID no corresponde a ningún usuario.
 */
export const deleteUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const isDeleted = await UserModel.delete(id);
    if (!isDeleted) {
        return next(createError("No se pudo eliminar el usuario", 404, [`Usuario con id ${id} no encontrado`]));
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
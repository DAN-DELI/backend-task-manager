import { UserModel } from '../models/user.model.js';
// Ya no importamos errorResponse, solo successResponse
import { successResponse } from '../utils/response.handler.js';

// Función auxiliar para crear errores operacionales rápidamente
const createError = (message, statusCode, details = []) => {
    const err = new Error(message);
    err.statusCode = statusCode;
    err.isOperational = true;
    err.errors = details.length ? details : [message];
    return err;
};

export const getUsers = async (req, res, next) => {
    try {
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

        return successResponse(res, 200, "Usuarios consultados con éxito", result)
    } catch (error) {
        next(error); // Enviamos el error inesperado al middleware
    }
};

export const createUser = async (req, res, next) => {
    try {
        const { name, email, document } = req.body;

        if (!name || !email || !document) {
            return next(createError("Faltan datos obligatorios", 400, ["name, email y document son requeridos"]));
        }

        const newUser = await UserModel.create(req.body);
        return successResponse(res, 201, "Usuario creado con exito", newUser)
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req, res, next) => {
    try {
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
        return successResponse(res, 200, `Usuario con ID ${id} actualizado correctamente (PUT)`, updatedUser)

    } catch (error) {
        next(error);
    }
};

export const updateUserPartial = async (req, res, next) => {
    try {
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
        return successResponse(res, 200, `Usuario actualizado exitosamente (PATCH)`, [updatedUser])

    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const isDeleted = await UserModel.delete(id);

        if (!isDeleted) {
            return next(createError("No se pudo eliminar el usuario", 404, [`Usuario con id ${id} no encontrado`]));
        }

        return successResponse(res, 200, `Usuario con ID ${id} eliminado correctamente`)
    } catch (error) {
        next(error);
    }
};
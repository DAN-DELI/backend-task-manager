import { UserModel } from '../models/user.model.js';
import { errorResponse, successResponse } from '../utils/response.handler.js';

export const getUsers = async (req, res) => {
    try {
        const { id } = req.params;
        const { document } = req.query;

        let result;

        if (id) {
            const user = await UserModel.findById(id);
            // Si es un solo usuario, lo metemos en un array para consistencia
            if (!user) {
                return errorResponse(res, 404, "Usuario no encontrado", error.message)
            }
            result = [user];

        } else if (document) {
            result = await UserModel.findByDocument(document);

            if (result.length === 0) {
                return errorResponse(res, 404, "Usuario no encontrado", error.message)
            }

        } else {
            result = await UserModel.findAll();
        }

        return successResponse(res, 200, "Usuarios consultados con éxito", result)
    } catch (error) {
        errorResponse(res, 500, "Error al obtener usuarios", error.message)
    }
};

export const createUser = async (req, res) => {
    try {
        const { name, email, document } = req.body;

        // Validación básica
        if (!name || !email || !document) {
            return errorResponse(res, 400, "Faltan datos obligatorios", ["name, email y document son requeridos"]);
        }

        const newUser = await UserModel.create(req.body);
        return successResponse(res, 201, "Usuario creado con exito", newUser)
    } catch (error) {
        return errorResponse(res, 500, "Error al crear usuario", error.message)
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, document, role } = req.body;

        // PUT exige TODO
        if (!name || !email || !document || !role) {
            return errorResponse(res, 400, "Faltan datos obligatorios", ["name, email, document y role son requeridos"]);
        }

        const userExists = await UserModel.findById(id);

        if (!userExists) {
            return errorResponse(res, 400, "Usuario no encontrado", [`Usurio con id ${id} no encontrado`]);
        }

        const updatedUser = await UserModel.update(id, {
            name,
            email,
            document,
            role
        });

        return successResponse(res, 200, `Usuario con ID ${id} actualizado correctamente (PUT)`, updatedUser)

    } catch (error) {
        errorResponse(res, 500, "Error al actualizar usuario", [error.message])
    }
};

export const updateUserPartial = async (req, res) => {
    try {
        const { id } = req.params;
        const userData = req.body;

        const userExists = await UserModel.findById(id);

        if (!userExists) {
            return errorResponse(res, 404, "Usuario no encontrado", [`No se encontro al usuario con id ${id}`])
        }

        if (Object.keys(userData).length === 0) {
            return errorResponse(res, 400, "Debes enviar al menos un campo para actualizar", [])
        }

        const updatedUser = await UserModel.updatePartial(id, userData);

        return successResponse(res, 200, `Usuario actualizado exitosamente (PATCH)`, [updatedUser])

    } catch (error) {
        errorResponse(res, 500, "Error al actualizar parcialmente", [error.message])
    }
};


export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const isDeleted = await UserModel.delete(id);

        if (!isDeleted) {
            return errorResponse(res, 404, "No se pudo eliminar el usuario", [`Usuario con id ${id} no encontrado`])
        }

        return successResponse(res, 200, `Usuario con ID ${id} eliminado correctamente`)
    } catch (error) {
        errorResponse(res, 500, "No se pudo eliminar el usuario", [error.message])
    }
};
import { TaskModel } from '../models/task.model.js';
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

export const getTask = async (req, res, next) => {
    try {
        const tasks = await TaskModel.findAll();
        return successResponse(res, 200, "Tareas listadas exitosamente", tasks);
    } catch (error) {
        next(error); // Enviamos el error inesperado al middleware
    }
};

export const getTaskById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const task = await TaskModel.findById(id);

        if (!task) {
            return next(createError("Tarea no encontrada", 404, [`No se encontró ninguna tarea con el ID ${id}`]));
        }

        return successResponse(res, 200, "Tarea encontrada exitosamente", task);
    } catch (error) {
        next(error);
    }
};

export const createTask = async (req, res, next) => {
    try {
        const newTask = await TaskModel.create(req.body);

        return successResponse(res, 201, "Tarea creada exitosamente", newTask);
    } catch (error) {
        next(error);
    }
};

export const updateTask = async (req, res, next) => {
    const { id } = req.params;
    const { user_id, title, description, status } = req.body;

    try {
        const updatedTask = await TaskModel.update(id, {
            user_id,
            title,
            description,
            status
        });

        if (!updatedTask) {
            return next(createError("Error al actualizar la tarea", 404, [`No se encontró la tarea con el ID ${id}`]));
        }

        return successResponse(res, 200, "Tarea actualizada exitosamente (PUT)", updatedTask);
    } catch (error) {
        next(error);
    }
};

export const updateTaskPartial = async (req, res, next) => {
    try {
        const { id } = req.params;
        const taskData = req.body;

        const taskExists = await TaskModel.findById(id);

        if (!taskExists) {
            return next(createError("Tarea no encontrada", 404, [`No se encontró la tarea con id ${id}`]));
        }

        if (Object.keys(taskData).length === 0) {
            return next(createError("Error al editar tarea", 400, ["Debes enviar al menos un campo para actualizar"]));
        }

        const updatedTask = await TaskModel.updatePartial(id, taskData);

        return successResponse(res, 200, `Tarea actualizada exitosamente (PATCH)`, updatedTask);

    } catch (error) {
        next(error);
    }
};

export const deleteTask = async (req, res, next) => {
    const { id } = req.params;
    try {
        const isDeleted = await TaskModel.delete(id);

        if (!isDeleted) {
            return next(createError("Error al eliminar la tarea", 404, [`No se encontró la tarea con id ${id}`]));
        }

        return successResponse(res, 200, "Tarea eliminada exitosamente");
    } catch (error) {
        next(error);
    }
};
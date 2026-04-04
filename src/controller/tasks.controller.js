import { TaskModel } from '../models/task.model.js';
import { errorResponse, successResponse } from '../utils/response.handler.js';

export const getTask = async (req, res) => {
    try {
        const tasks = await TaskModel.findAll();
        return successResponse(res, 200, "Tareas listadas exitosamente", tasks);
    } catch (error) {
        return errorResponse(res, 500, "Error al obtener la lista de tareas", [error.message]);
    }
};

export const getTaskById = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await TaskModel.findById(id);

        if (!task) {
            return errorResponse(res, 404, "Tarea no encontrada", [`No se encontró ninguna tarea con el ID ${id}`]);
        }

        return successResponse(res, 200, "Tarea encontrada exitosamente", task);
    } catch (error) {
        return errorResponse(res, 500, "Error al obtener la tarea", [error.message]);
    }
};

export const createTask = async (req, res) => {
    try {
        const newTask = await TaskModel.create(req.body);

        return successResponse(res, 201, "Tarea creada exitosamente", newTask);
    } catch (error) {
        return errorResponse(res, 500, "Error al crear la tarea", [error.message]);
    }
};

export const updateTask = async (req, res) => {
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
            return errorResponse(res, 404, "Error al actualizar la tarea", [`No se encontró la tarea con el ID ${id}`]);
        }

        return successResponse(res, 200, "Tarea actualizada exitosamente (PUT)", updatedTask);
    } catch (error) {
        return errorResponse(res, 500, "Error al actualizar la tarea", [error.message]);
    }
};

export const updateTaskPartial = async (req, res) => {
    try {
        const { id } = req.params;
        const taskData = req.body;

        const taskExists = await TaskModel.findById(id);

        if (!taskExists) {
            return errorResponse(res, 404, "Tarea no encontrada", [`No se encontró la tarea con id ${id}`]);
        }

        if (Object.keys(taskData).length === 0) {
            return errorResponse(res, 400, "Error al editar tarea", ["Debes enviar al menos un campo para actualizar"]);
        }

        const updatedTask = await TaskModel.updatePartial(id, taskData);

        return successResponse(res, 200, `Tarea actualizada exitosamente (PATCH)`, updatedTask);

    } catch (error) {
        return errorResponse(res, 500, "Error al actualizar tarea", [error.message]);
    }
};

export const deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        const isDeleted = await TaskModel.delete(id);

        if (!isDeleted) {
            return errorResponse(res, 404, "Error al eliminar la tarea", [`No se encontró la tarea con id ${id}`]);
        }

        return successResponse(res, 200, "Tarea eliminada exitosamente");
    } catch (error) {
        return errorResponse(res, 500, "Error al eliminar la tarea", [error.message]);
    }
};
import { TaskModel } from '../models/task.model.js';
import { createError, successResponse } from '../utils/response.handler.js';
import { catchAsync } from '../utils/catchAsync.js';


export const getTask = catchAsync(async (req, res, next) => {
    const tasks = await TaskModel.findAll();
    return successResponse(res, 200, "Tareas listadas exitosamente", tasks);
});

export const getTaskById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const task = await TaskModel.findById(id);

    if (!task) {
        return next(createError("Tarea no encontrada", 404, [`No se encontró ninguna tarea con el ID ${id}`]));
    }

    return successResponse(res, 200, "Tarea encontrada exitosamente", task);
});

export const createTask = catchAsync(async (req, res, next) => {
    const newTask = await TaskModel.create(req.body);
    return successResponse(res, 201, "Tarea creada exitosamente", newTask);
});

export const updateTask = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { user_id, title, description, status } = req.body;

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
});

export const updateTaskPartial = catchAsync(async (req, res, next) => {
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
});

export const deleteTask = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const isDeleted = await TaskModel.delete(id);

    if (!isDeleted) {
        return next(createError("Error al eliminar la tarea", 404, [`No se encontró la tarea con id ${id}`]));
    }

    return successResponse(res, 200, "Tarea eliminada exitosamente");
});
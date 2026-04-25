import { TaskModel } from '../models/task.model.js';
import { createError, successResponse } from '../utils/response.handler.js';
import { catchAsync } from '../utils/catchAsync.js';

/**
 * Obtiene el listado completo de tareas.
 * @route GET /tasks
 * @returns {Promise<void>} Responde con un array de todas las tareas encontradas.
 */
export const getTask = catchAsync(async (req, res, next) => {
    const tasks = await TaskModel.findAll();
    return successResponse(res, 200, "Tareas listadas exitosamente", tasks);
});

/**
 * Busca una tarea específica por su ID único.
 * @route GET /tasks/:id
 * @param {string} req.params.id - ID de la tarea a buscar.
 * @returns {Promise<void>} Responde con el objeto de la tarea o un error 404 si no existe.
 */
export const getTaskById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const task = await TaskModel.findById(id);

    if (!task) {
        return next(createError("Tarea no encontrada", 404, [`No se encontró ninguna tarea con el ID ${id}`]));
    }

    return successResponse(res, 200, "Tarea encontrada exitosamente", task);
});

/**
 * Crea una nueva tarea en la base de datos.
 * @route POST /tasks
 * @param {Object} req.body - Datos de la tarea (user_id, title, description, estado).
 * @returns {Promise<void>} Responde con la tarea recién creada y un status 201.
 */
export const createTask = catchAsync(async (req, res, next) => {
    const newTask = await TaskModel.create(req.body);
    return successResponse(res, 201, "Tarea creada exitosamente", newTask);
});

/**
 * Actualiza de forma total una tarea existente, a la que se le remplazaron todos los campos.
 * @route PUT /tasks/:id
 * @param {string} req.params.id - ID de la tarea a modificar.
 * @param {Object} req.body - Objeto con todos los campos necesarios de la tarea.
 * @returns {Promise<void>} Responde con la tarea actualizada.
 */
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

    return successResponse(res, 200, "Tarea actualizada exitosamente", updatedTask);
});

/**
 * Actualiza de forma parcial una tarea, despues de aplicarsele uno o mas cambios.
 * @route PATCH /tasks/:id
 * @param {string} req.params.id - ID de la tarea a modificar.
 * @param {Object} req.body - Campos específicos que se desean actualizar.
 * @returns {Promise<void>} Responde con la tarea modificada.
 * @throws {Error} 400 si el cuerpo de la petición está vacío.
 */
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

    return successResponse(res, 200, `Tarea actualizada exitosamente`, updatedTask);
});

/**
 * Elimina una tarea de la base de datos de forma lógica o física.
 * @route DELETE /tasks/:id
 * @param {string} req.params.id - ID de la tarea a eliminar.
 * @returns {Promise<void>} Responde con un mensaje de éxito confirmando la eliminación.
 */
export const deleteTask = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const isDeleted = await TaskModel.delete(id);

    if (!isDeleted) {
        return next(createError("Error al eliminar la tarea", 404, [`No se encontró la tarea con id ${id}`]));
    }

    return successResponse(res, 200, "Tarea eliminada exitosamente");
});
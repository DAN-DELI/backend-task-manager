import pool from '../config/db.js';
/**
 * Modelo de datos para gestionar la tabla 'tasks' en la base de datos.
 * Contiene métodos estáticos para realizar operaciones CRUD.
 */
export const TaskModel = {

    /**
     * Recupera todas las tareas registradas.
     * @returns {Promise<Array>} Lista de objetos de tareas.
     */
    findAll: async () => {
        const [rows] = await pool.query('SELECT * FROM tasks');
        return rows;
    },

    /**
     * Busca una tarea única por su ID.
     * @param {number|string} id - ID de la tarea.
     * @returns {Promise<Object|null>} El objeto de la tarea o null si no existe.
     */
    findById: async (id) => {
        const [rows] = await pool.query(
            'SELECT * FROM tasks WHERE id = ?',
            [id]
        );
        return rows[0] || null;
    },

    /**
     * Inserta una nueva tarea y retorna el registro creado.
     * @param {Object} taskData - Datos de la tarea (user_id, title, description, status, created_at).
     * @returns {Promise<Object>} El objeto de la tarea recién creada.
     */
    create: async (taskData) => {
        const { user_id, title, description, status } = taskData;

        const [result] = await pool.query(
            `INSERT INTO tasks (user_id, title, description, status)
             VALUES (?, ?, ?, ?)`,
            [user_id, title, description, status]
        );

        const [rows] = await pool.query(
            'SELECT * FROM tasks WHERE id = ?',
            [result.insertId]
        );

        return rows[0];
    },

    /**
     * Actualización total de una tarea (Reemplazo de campos).
     * @param {number|string} id - ID de la tarea a modificar.
     * @param {Object} taskData - Nuevos datos para los campos.
     * @returns {Promise<Object|null>} Tarea actualizada o null si no se encontró.
     */
    update: async (id, taskData) => {
        const { user_id, title, description, status } = taskData;

        const [result] = await pool.query(
            `UPDATE tasks 
             SET user_id = ?, title = ?, description = ?, status = ?
             WHERE id = ?`,
            [user_id, title, description, status, id]
        );

        if (result.affectedRows === 0) return null;

        const [rows] = await pool.query(
            'SELECT * FROM tasks WHERE id = ?',
            [id]
        );

        return rows[0];
    },

    /**
     * Actualización parcial dinámica (Solo campos presentes en taskData).
     * Construye la consulta SQL dinámicamente según las propiedades enviadas.
     * @param {number|string} id - ID de la tarea.
     * @param {Object} taskData - Objeto con campos opcionales.
     * @returns {Promise<Object>} Tarea con los cambios aplicados.
     * @throws {Error} Si no se envían campos válidos.
     */
    updatePartial: async (id, taskData) => {
        const fields = [];
        const values = [];

        if (taskData.user_id !== undefined) {
            fields.push("user_id = ?");
            values.push(taskData.user_id);
        }

        if (taskData.title !== undefined) {
            fields.push("title = ?");
            values.push(taskData.title);
        }

        if (taskData.description !== undefined) {
            fields.push("description = ?");
            values.push(taskData.description);
        }

        if (taskData.status !== undefined) {
            fields.push("status = ?");
            values.push(taskData.status);
        }

        if (fields.length === 0) {
            throw new Error("No hay campos para actualizar");
        }

        values.push(id);

        await pool.query(
            `UPDATE tasks SET ${fields.join(", ")} WHERE id = ?`,
            values
        );

        const [rows] = await pool.query(
            "SELECT * FROM tasks WHERE id = ?",
            [id]
        );

        return rows[0];
    },

    /**
     * Elimina una tarea de la base de datos de forma física.
     * @param {number|string} id - ID de la tarea.
     * @returns {Promise<boolean>} True si se eliminó, false si no existía.
     */
    delete: async (id) => {
        const [result] = await pool.query(
            'DELETE FROM tasks WHERE id = ?',
            [id]
        );

        return result.affectedRows > 0;
    }
};
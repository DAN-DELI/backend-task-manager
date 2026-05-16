import pool from '../config/db.js';

/**
 * Modelo de datos para gestionar la tabla 'tasks'.
 * Incluye los campos: submission_url (URL de entrega del estudiante)
 * y grade (calificación asignada por el evaluador).
 */
export const TaskModel = {

    /**
     * Recupera todas las tareas con el nombre del usuario asignado.
     */
    findAll: async () => {
        const [rows] = await pool.query(
            `SELECT t.*, u.name AS user_name, u.document AS user_document
            FROM tasks t
            INNER JOIN users u ON t.user_id = u.id
            ORDER BY t.created_at DESC`
        );
        return rows;
    },

    /**
     * Busca una tarea por su ID.
     */
    findById: async (id) => {
        const [rows] = await pool.query(
            `SELECT t.*, u.name AS user_name, u.document AS user_document
            FROM tasks t
            INNER JOIN users u ON t.user_id = u.id
            WHERE t.id = ?`,
            [id]
        );
        return rows[0] || null;
    },

    /**
     * Busca todas las tareas asignadas a un usuario específico.
     * Usado por el estudiante para ver sus propias tareas.
     */
    findByUserId: async (userId) => {
        const [rows] = await pool.query(
            `SELECT t.*, u.name AS user_name
            FROM tasks t
            INNER JOIN users u ON t.user_id = u.id
            WHERE t.user_id = ?
            ORDER BY t.created_at DESC`,
            [userId]
        );
        return rows;
    },

    /**
     * Inserta una nueva tarea.
     */
    create: async (taskData) => {
        const { user_id, title, description, status = 'pendiente', submission_url = null, grade = null } = taskData;

        const [result] = await pool.query(
            `INSERT INTO tasks (user_id, title, description, status, submission_url, grade)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [user_id, title, description, status, submission_url, grade]
        );

        const [rows] = await pool.query(
            `SELECT t.*, u.name AS user_name FROM tasks t
            INNER JOIN users u ON t.user_id = u.id
            WHERE t.id = ?`,
            [result.insertId]
        );
        return rows[0];
    },

    /**
     * Actualización total de una tarea (PUT).
     */
    update: async (id, taskData) => {
        const { user_id, title, description, status, submission_url = null, grade = null } = taskData;

        const [result] = await pool.query(
            `UPDATE tasks
            SET user_id = ?, title = ?, description = ?, status = ?,
                submission_url = ?, grade = ?
            WHERE id = ?`,
            [user_id, title, description, status, submission_url, grade, id]
        );

        if (result.affectedRows === 0) return null;

        const [rows] = await pool.query(
            `SELECT t.*, u.name AS user_name FROM tasks t
            INNER JOIN users u ON t.user_id = u.id
            WHERE t.id = ?`,
            [id]
        );
        return rows[0];
    },

    /**
     * Actualización parcial dinámica (PATCH).
     * Solo modifica los campos presentes en taskData.
     */
    updatePartial: async (id, taskData) => {
        const fields = [];
        const values = [];

        if (taskData.user_id !== undefined) {
            fields.push('user_id = ?');
            values.push(taskData.user_id);
        }
        if (taskData.title !== undefined) {
            fields.push('title = ?');
            values.push(taskData.title);
        }
        if (taskData.description !== undefined) {
            fields.push('description = ?');
            values.push(taskData.description);
        }
        if (taskData.status !== undefined) {
            fields.push('status = ?');
            values.push(taskData.status);
        }
        if (taskData.submission_url !== undefined) {
            fields.push('submission_url = ?');
            values.push(taskData.submission_url);
        }
        if (taskData.grade !== undefined) {
            fields.push('grade = ?');
            values.push(taskData.grade);
        }

        if (fields.length === 0) throw new Error('No hay campos para actualizar');

        values.push(id);

        await pool.query(
            `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`,
            values
        );

        const [rows] = await pool.query(
            `SELECT t.*, u.name AS user_name FROM tasks t
            INNER JOIN users u ON t.user_id = u.id
            WHERE t.id = ?`,
            [id]
        );
        return rows[0];
    },

    /**
     * Elimina una tarea físicamente.
     */
    delete: async (id) => {
        const [result] = await pool.query('DELETE FROM tasks WHERE id = ?', [id]);
        return result.affectedRows > 0;
    },
};
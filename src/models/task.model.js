import pool from '../config/db.js';

export const TaskModel = {

    findAll: async () => {
        const [rows] = await pool.query('SELECT * FROM tasks');
        return rows;
    },

    findById: async (id) => {
        const [rows] = await pool.query(
            'SELECT * FROM tasks WHERE id = ?',
            [id]
        );
        return rows[0] || null;
    },

    create: async (taskData) => {
        const { user_id, title, description, status, created_by } = taskData;

        const [result] = await pool.query(
            `INSERT INTO tasks (user_id, title, description, status, created_by)
             VALUES (?, ?, ?, ?, ?)`,
            [user_id, title, description, status, created_by]
        );

        const [rows] = await pool.query(
            'SELECT * FROM tasks WHERE id = ?',
            [result.insertId]
        );

        return rows[0];
    },

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

    delete: async (id) => {
        const [result] = await pool.query(
            'DELETE FROM tasks WHERE id = ?',
            [id]
        );

        return result.affectedRows > 0;
    }
};
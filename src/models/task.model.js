import { pool } from '../db/database.js'; 

export const getAllTasksFromDB = async () => {
    const [rows] = await pool.query('SELECT * FROM tasks');
    return rows;
};

export const getTaskByIdFromDB = async (id) => {
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
    return rows[0];
};

export const createTaskInDB = async (user_id, title, description, status) => {
    const [result] = await pool.query(
        'INSERT INTO tasks (user_id, title, description, status) VALUES (?, ?, ?, ?)',
        [user_id, title, description, status]
    );
    return result;
};

export const updateTaskInDB = async (id, user_id, title, description, status) => {
    // Actualizamos description y status, usando el id en la condición WHERE
    const [result] = await pool.query(
        'UPDATE tasks SET user_id = ?, title = ?, description = ?, status = ? WHERE id = ?',
        [user_id, title, description, status, id]
    );
    return result;
};

export const deleteTaskInDB = async (id) => {
    const [result] = await pool.query('DELETE FROM tasks WHERE id = ?', [id]);
    return result;
};
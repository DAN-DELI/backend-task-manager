// src/models/task.model.js
import pool from '../config/db.js';

/**
 * Modelo de datos para gestionar la tabla 'tasks'.
 * Ahora soporta asignación múltiple mediante la tabla pivote 'task_assignments'.
 * Cada tarea puede asignarse a N usuarios (muchos a muchos).
 */
export const TaskModel = {

    /**
     * Devuelve todas las tareas con el creador y el array de usuarios asignados.
     */
    findAll: async () => {
        // 1. Tareas con datos del creador
        const [tasks] = await pool.query(`
            SELECT  t.*,
                    u.document AS created_by_document,
                    u.name     AS created_by_name
            FROM    tasks t
            LEFT JOIN users u ON t.created_by = u.id
            ORDER BY t.id DESC
        `);

        if (tasks.length === 0) return [];

        // 2. Asignados de todas las tareas en una sola consulta
        const taskIds = tasks.map(t => t.id);
        const [assignments] = await pool.query(`
            SELECT  ta.task_id,
                    u.id       AS user_id,
                    u.name     AS user_name,
                    u.document AS user_document
            FROM    task_assignments ta
            INNER JOIN users u ON ta.user_id = u.id
            WHERE   ta.task_id IN (?)
        `, [taskIds]);

        // 3. Agrupar asignados por tarea
        const assignedMap = {};
        for (const a of assignments) {
            if (!assignedMap[a.task_id]) assignedMap[a.task_id] = [];
            assignedMap[a.task_id].push({
                id: a.user_id,
                name: a.user_name,
                document: a.user_document
            });
        }

        return tasks.map(t => ({
            ...t,
            assigned_users: assignedMap[t.id] ?? []
        }));
    },

    findByUserId: async (userId) => {
    const [tasks] = await pool.query(`
        SELECT  t.*,
                u.document AS created_by_document,
                u.name     AS created_by_name
        FROM    tasks t
        LEFT JOIN users u ON t.created_by = u.id
        INNER JOIN task_assignments ta ON ta.task_id = t.id
        WHERE   ta.user_id = ?
        ORDER BY t.id DESC
    `, [userId]);

    if (tasks.length === 0) return [];

    const taskIds = tasks.map(t => t.id);
    const [assignments] = await pool.query(`
        SELECT  ta.task_id,
                u.id       AS user_id,
                u.name     AS user_name,
                u.document AS user_document
        FROM    task_assignments ta
        INNER JOIN users u ON ta.user_id = u.id
        WHERE   ta.task_id IN (?)
    `, [taskIds]);

    const assignedMap = {};
    for (const a of assignments) {
        if (!assignedMap[a.task_id]) assignedMap[a.task_id] = [];
        assignedMap[a.task_id].push({
            id: a.user_id,
            name: a.user_name,
            document: a.user_document
        });
    }

    return tasks.map(t => ({
        ...t,
        assigned_users: assignedMap[t.id] ?? []
    }));
    },

    /**
     * Devuelve una tarea por su ID con el creador y los usuarios asignados.
     */
    findById: async (id) => {
        const [rows] = await pool.query(`
            SELECT  t.*,
                    u.document AS created_by_document,
                    u.name     AS created_by_name
            FROM    tasks t
            LEFT JOIN users u ON t.created_by = u.id
            WHERE   t.id = ?
        `, [id]);

        if (!rows[0]) return null;

        const task = rows[0];
        const [assignments] = await pool.query(`
            SELECT  u.id, u.name, u.document
            FROM    task_assignments ta
            INNER JOIN users u ON ta.user_id = u.id
            WHERE   ta.task_id = ?
        `, [id]);

        return { ...task, assigned_users: assignments };
    },

    /**
     * Crea una nueva tarea y registra los usuarios asignados en la tabla pivote.
     * @param {Object} taskData - { created_by, title, description, status, assigned_user_ids[] }
     */
    create: async (taskData) => {
        const { created_by, title, description, status, assigned_user_ids = [] } = taskData;

        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            const [result] = await conn.query(
                `INSERT INTO tasks (created_by, title, description, status)
                VALUES (?, ?, ?, ?)`,
                [created_by, title, description, status ?? 'pendiente']
            );

            const taskId = result.insertId;

            // Insertar asignaciones
            if (assigned_user_ids.length > 0) {
                const values = assigned_user_ids.map(uid => [taskId, uid]);
                await conn.query(
                    `INSERT IGNORE INTO task_assignments (task_id, user_id) VALUES ?`,
                    [values]
                );
            }

            await conn.commit();
            return await TaskModel.findById(taskId);

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    },

    /**
     * Actualización total de una tarea (reemplaza también las asignaciones).
     * @param {number} id
     * @param {Object} taskData - { created_by, title, description, status, assigned_user_ids[] }
     */
    update: async (id, taskData) => {
        const { created_by, title, description, status, assigned_user_ids = [] } = taskData;

        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            const [result] = await conn.query(
                `UPDATE tasks
                SET created_by = ?, title = ?, description = ?, status = ?
                WHERE id = ?`,
                [created_by, title, description, status, id]
            );

            if (result.affectedRows === 0) {
                await conn.rollback();
                return null;
            }

            // Reemplazar asignaciones completamente
            await conn.query(`DELETE FROM task_assignments WHERE task_id = ?`, [id]);
            if (assigned_user_ids.length > 0) {
                const values = assigned_user_ids.map(uid => [id, uid]);
                await conn.query(
                    `INSERT IGNORE INTO task_assignments (task_id, user_id) VALUES ?`,
                    [values]
                );
            }

            await conn.commit();
            return await TaskModel.findById(id);

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    },

    /**
     * Actualización parcial de una tarea.
     * Si se envía assigned_user_ids, reemplaza completamente las asignaciones.
     */
    updatePartial: async (id, taskData) => {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            // Actualizar campos básicos si vienen
            const fields = [];
            const values = [];
            if (taskData.created_by  !== undefined) { fields.push('created_by = ?');  values.push(taskData.created_by); }
            if (taskData.title       !== undefined) { fields.push('title = ?');        values.push(taskData.title); }
            if (taskData.description !== undefined) { fields.push('description = ?');  values.push(taskData.description); }
            if (taskData.status      !== undefined) { fields.push('status = ?');       values.push(taskData.status); }

            if (fields.length > 0) {
                values.push(id);
                await conn.query(
                    `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`,
                    values
                );
            }

            // Reemplazar asignaciones si se enviaron
            if (Array.isArray(taskData.assigned_user_ids)) {
                await conn.query(`DELETE FROM task_assignments WHERE task_id = ?`, [id]);
                if (taskData.assigned_user_ids.length > 0) {
                    const rows = taskData.assigned_user_ids.map(uid => [id, uid]);
                    await conn.query(
                        `INSERT IGNORE INTO task_assignments (task_id, user_id) VALUES ?`,
                        [rows]
                    );
                }
            }

            await conn.commit();
            return await TaskModel.findById(id);

        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    },

    delete: async (id) => {
        // task_assignments se borra en cascada por FK
        const [result] = await pool.query('DELETE FROM tasks WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
};
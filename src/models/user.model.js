import pool from '../config/db.js';

/**
 * Modelo de datos para gestionar la tabla 'users'.
 * Centraliza las consultas SQL y la lógica de persistencia de usuarios.
 */
export const UserModel = {

    /**
     * Obtiene todos los usuarios registrados sin filtros.
     * @returns {Promise<Array>} Lista de usuarios (sin password_hash ni refresh_token).
     */
    findAll: async () => {
        const [rows] = await pool.query(
            'SELECT id, name, email, document, role, created_at, updated_at FROM users'
        );
        return rows;
    },

    /**
     * Busca un usuario por su ID.
     * @param {number|string} id - ID único del usuario.
     * @returns {Promise<Object|null>} Usuario o null si no existe.
     */
    findById: async (id) => {
        const [rows] = await pool.query(
            'SELECT id, name, email, document, role, refresh_token, password_hash, created_at, updated_at FROM users WHERE id = ?',
            [id]
        );
        return rows[0] || null;
    },

    /**
     * Busca un usuario por su número de documento.
     * @param {string} document - Documento de identidad.
     * @returns {Promise<Object|null>} Usuario o null si no existe.
     */
    findByDocument: async (document) => {
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE document = ?',
            [document]
        );
        return rows[0] || null;
    },

    /**
     * Registra un nuevo usuario y devuelve el objeto creado (sin datos sensibles).
     * @param {Object} userData - Datos del usuario.
     * @returns {Promise<Object>} Usuario recién creado.
     */
    create: async (userData) => {
        const { name, email, document, password_hash, role = 'user' } = userData;

        const [result] = await pool.query(
            'INSERT INTO users (name, email, document, password_hash, role) VALUES (?, ?, ?, ?, ?)',
            [name, email, document, password_hash, role]
        );

        const [createdUser] = await pool.query(
            'SELECT id, name, email, document, role FROM users WHERE id = ?',
            [result.insertId]
        );

        return createdUser[0];
    },

    /**
     * Actualiza todos los campos de un usuario existente (PUT).
     * @param {number|string} id - ID del usuario.
     * @param {Object} userData - Objeto con name, email, document, role.
     * @returns {Promise<Object|null>} Usuario actualizado o null si no existía.
     */
    update: async (id, userData) => {
        const { name, email, document, role } = userData;

        const [result] = await pool.query(
            'UPDATE users SET name = ?, email = ?, document = ?, role = ? WHERE id = ?',
            [name, email, document, role ?? 'user', id]
        );

        if (result.affectedRows === 0) return null;

        const [updatedUser] = await pool.query(
            'SELECT id, name, email, document, role, created_at, updated_at FROM users WHERE id = ?',
            [id]
        );
        return updatedUser[0];
    },

    /**
     * Actualiza parcialmente un usuario (PATCH).
     * Solo modifica los campos presentes en userData.
     * @param {number|string} id - ID del usuario.
     * @param {Object} userData - Campos opcionales a actualizar.
     * @returns {Promise<Object>} Usuario con los cambios aplicados.
     */
    updatePartial: async (id, userData) => {
        const fields = [];
        const values = [];

        if (userData.name !== undefined) {
            fields.push('name = ?');
            values.push(userData.name);
        }
        if (userData.email !== undefined) {
            fields.push('email = ?');
            values.push(userData.email);
        }
        if (userData.document !== undefined) {
            fields.push('document = ?');
            values.push(userData.document);
        }
        if (userData.role !== undefined) {
            fields.push('role = ?');
            values.push(userData.role);
        }
        // Permitir actualizar el hash de contraseña (usado por reset-password)
        if (userData.password_hash !== undefined) {
            fields.push('password_hash = ?');
            values.push(userData.password_hash);
        }

        if (fields.length === 0) {
            throw new Error('No hay campos para actualizar');
        }

        values.push(id);

        await pool.query(
            `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
            values
        );

        const [updatedUser] = await pool.query(
            'SELECT id, name, email, document, role, created_at, updated_at FROM users WHERE id = ?',
            [id]
        );
        return updatedUser[0];
    },

    /**
     * Elimina un usuario por su ID.
     * @param {number|string} id - ID del usuario.
     * @returns {Promise<boolean>} True si fue eliminado.
     */
    delete: async (id) => {
        const [result] = await pool.query(
            'DELETE FROM users WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    },

    /**
     * Actualiza el refresh token de sesión del usuario.
     * @param {number|string} userId
     * @param {string} refresh_token
     */
    updateRefreshToken: async (userId, refresh_token) => {
        await pool.query(
            'UPDATE users SET refresh_token = ? WHERE id = ?',
            [refresh_token, userId]
        );
    },

    // ─── MÉTODOS RBAC ────────────────────────────────────────────────────────

    /**
     * Obtiene todos los roles asignados a un usuario.
     */
    getRoles: async (userId) => {
        const [rows] = await pool.query(
            `SELECT r.id, r.name, r.description
            FROM user_roles ur
            INNER JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = ?`,
            [userId]
        );
        return rows;
    },

    /**
     * Obtiene la lista plana de permisos efectivos de un usuario (sin duplicados).
     */
    getPermissions: async (userId) => {
        const [rows] = await pool.query(
            `SELECT DISTINCT p.id, p.name, p.code, p.description
            FROM user_roles ur
            INNER JOIN role_permissions rp ON ur.role_id = rp.role_id
            INNER JOIN permissions p ON rp.permission_id = p.id
            WHERE ur.user_id = ?`,
            [userId]
        );
        return rows;
    },

    /**
     * Obtiene roles con sus permisos anidados para el middleware de autorización.
     * @returns {Promise<Array>} Array de { id, name, permissions: [code, ...] }
     */
    getRolesWithPermissions: async (userId) => {
        const [rows] = await pool.query(
            `SELECT r.id, r.name, p.code
            FROM user_roles ur
            INNER JOIN roles r ON ur.role_id = r.id
            LEFT JOIN role_permissions rp ON r.id = rp.role_id
            LEFT JOIN permissions p ON rp.permission_id = p.id
            WHERE ur.user_id = ?
            ORDER BY r.id`,
            [userId]
        );

        const rolesMap = new Map();
        for (const row of rows) {
            if (!rolesMap.has(row.id)) {
                rolesMap.set(row.id, { id: row.id, name: row.name, permissions: [] });
            }
            if (row.code) rolesMap.get(row.id).permissions.push(row.code);
        }
        return Array.from(rolesMap.values());
    },

    /**
     * Sincroniza los roles de un usuario en una transacción atómica.
     * Elimina todas las asignaciones actuales e inserta las nuevas.
     */
    syncRoles: async (userId, roleIds) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            await connection.query(
                'DELETE FROM user_roles WHERE user_id = ?',
                [userId]
            );

            if (roleIds.length > 0) {
                const rows = roleIds.map(roleId => [userId, roleId]);
                await connection.query(
                    'INSERT INTO user_roles (user_id, role_id) VALUES ?',
                    [rows]
                );
            }

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },
};
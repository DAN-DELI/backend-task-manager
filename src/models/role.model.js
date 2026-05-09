import pool from '../config/db.js';

/**
 * Modelo de datos para gestionar la tabla 'roles' y su relación con 'role_permissions'.
 * Centraliza las consultas SQL y la lógica de persistencia de roles y sus permisos atómicos.
 */
export const RoleModel = {

    /**
     * Recupera todos los roles registrados en el sistema.
     * @returns {Promise<Array>} Lista de objetos de roles.
     */
    findAll: async () => {
        const [rows] = await pool.query('SELECT * FROM roles');
        return rows;
    },

    /**
     * Busca un rol único por su ID.
     * @param {number|string} id La ID del rol.
     * @returns {Promise<Object|null>} Retorna el objeto del rol o null si no existe.
     */
    findById: async (id) => {
        const [rows] = await pool.query(
            'SELECT * FROM roles WHERE id = ?',
            [id]
        );
        return rows[0] || null;
    },

    /**
     * Inserta un nuevo rol y retorna el registro creado.
     * @param {Object} data Datos del rol.
     * @param {string} data.name  Nombre del rol (único).
     * @param {string} [data.description] Descripción opcional del rol.
     * @returns {Promise<Object>} El objeto del rol recién creado.
     */
    create: async (data) => {
        const { name, description } = data;

        const [result] = await pool.query(
            'INSERT INTO roles (name, description) VALUES (?, ?)',
            [name, description ?? null]
        );

        const [rows] = await pool.query(
            'SELECT * FROM roles WHERE id = ?',
            [result.insertId]
        );

        return rows[0];
    },

    /**
     * Actualización total de un rol (se remplaza todos los campos).
     * @param {number|string} id ID del rol a modificar.
     * @param {Object} data Nuevos datos del rol.
     * @param {string} data.name Nuevo nombre del rol.
     * @param {string} [data.description] Nueva descripción del rol.
     * @returns {Promise<Object|null>} Rol actualizado o null si no se encontró.
     */
    update: async (id, data) => {
        const { name, description } = data;

        const [result] = await pool.query(
            'UPDATE roles SET name = ?, description = ? WHERE id = ?',
            [name, description ?? null, id]
        );

        if (result.affectedRows === 0) return null;

        const [rows] = await pool.query(
            'SELECT * FROM roles WHERE id = ?',
            [id]
        );

        return rows[0];
    },

    /**
     * Actualización parcial dinámica de un rol (solo los campos presentes en data).
     * Construye la consulta SQL dinámicamente según las propiedades enviadas.
     * @param {number|string} id ID del rol.
     * @param {Object} data Objeto con campos opcionales a actualizar.
     * @param {string} [data.name] Nuevo nombre del rol.
     * @param {string} [data.description] Nueva descripción del rol.
     * @returns {Promise<Object>} Rol con los cambios aplicados.
     * @throws {Error} Si no se envían campos válidos.
     */
    patch: async (id, data) => {
        const fields = [];
        const values = [];

        if (data.name !== undefined) {
            fields.push('name = ?');
            values.push(data.name);
        }

        if (data.description !== undefined) {
            fields.push('description = ?');
            values.push(data.description);
        }

        if (fields.length === 0) {
            throw new Error('No hay campos para actualizar');
        }

        values.push(id);

        await pool.query(
            `UPDATE roles SET ${fields.join(', ')} WHERE id = ?`,
            values
        );

        const [rows] = await pool.query(
            'SELECT * FROM roles WHERE id = ?',
            [id]
        );

        return rows[0];
    },

    /**
     * Elimina un rol de la base de datos de forma física.
     * La base de datos gestiona el CASCADE en role_permissions.
     * @param {number|string} id ID del rol a eliminar.
     * @returns {Promise<boolean>} True si se eliminó, false si no existía.
     */
    delete: async (id) => {
        const [result] = await pool.query(
            'DELETE FROM roles WHERE id = ?',
            [id]
        );

        return result.affectedRows > 0;
    },

    /**
     * Consulta todos los permisos atómicos asignados a un rol específico.
     * Realiza un JOIN entre role_permissions y permissions para retornar
     * el detalle completo de cada permiso.
     * @param {number|string} roleId ID del rol.
     * @returns {Promise<Array>} Lista de permisos asociados al rol.
     */
    getPermissionsByRoleId: async (roleId) => {
        const [rows] = await pool.query(
            `SELECT p.id, p.name, p.code, p.description
            FROM role_permissions rp
            INNER JOIN permissions p ON rp.permission_id = p.id
            WHERE rp.role_id = ?`,
            [roleId]
        );

        return rows;
    },

    /**
     * Sincroniza los permisos de un rol en una sola transacción atómica.
     * Elimina todos los permisos actuales del rol e inserta los nuevos.
     * @param {number|string} roleId ID del rol a sincronizar.
     * @param {number[]} permissionIds Array de IDs de permisos a asignar.
     * @returns {Promise<void>}
     * @throws {Error} Si la transacción falla, se realiza rollback automático.
     */
    syncPermissions: async (roleId, permissionIds) => {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            // Paso 1: Eliminar todos los permisos actuales del rol
            await connection.query(
                'DELETE FROM role_permissions WHERE role_id = ?',
                [roleId]
            );

            // Paso 2: Insertar los nuevos permisos (si hay alguno)
            if (permissionIds.length > 0) {
                const rows = permissionIds.map((permissionId) => [roleId, permissionId]);

                await connection.query(
                    'INSERT INTO role_permissions (role_id, permission_id) VALUES ?',
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
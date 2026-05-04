import pool from '../config/db.js';

/**
 * Modelo de datos para gestionar la tabla 'users'.
 * Centraliza las consultas SQL y la lógica de persistencia de usuarios.
 */
export const UserModel = {

    /**
     * Obtiene todos los usuarios registrados sin filtros.
     * @returns {Promise<Array>} Lista de usuarios.
     */
    findAll: async () => {
        const [rows] = await pool.query("SELECT * FROM users");
        return rows;
    },

    /**
     * Busca un usuario por su ID e inicializa su lista de tareas.
     * @param {number|string} id - ID único del usuario.
     * @returns {Promise<Object|null>} Usuario con propiedad 'tasks' vacía o null.
     */
    findById: async (id) => {
        const [rows] = await pool.query(
            "SELECT * FROM users WHERE id = ?",
            [id]
        );

        if (!rows[0]) return null;

        return rows[0];
    },
    /**
     * Busca usuarios por su número de documento.
     * @param {string} document - Documento de identidad.
     * @returns {Promise<Array>} Lista de usuarios que coinciden con el documento.
     */
    findByDocument: async (document) => {
        const [rows] = await pool.query(
            "SELECT * FROM users WHERE document = ?",
            [document]
        );

        return rows[0];
    },

    /**
     * Registra un nuevo usuario y devuelve el objeto creado.
     * @param {Object} userData - Datos del usuario.
     * @returns {Promise<Object>} Datos relevantes del usuario recién insertado.
     */
    create: async (userData) => {
        const { name, email, document, password_hash, role } = userData;

        // Ejecutar el INSERT
        const [result] = await pool.query(
            "INSERT INTO users (name, email, document, password_hash, role) VALUES (?, ?, ?, ?, ?)",
            [name, email, document, password_hash, role || "user"]
        );

        // Consultar el usuario recién creado
        const [createdUser] = await pool.query(
            "SELECT id, name, email, document, role FROM users WHERE id = ?",
            [result.insertId]
        );

        return createdUser[0];
    },
    /**
     * Actualiza todos los campos de un usuario existente.
     * @param {number|string} id - ID del usuario.
     * @param {Object} userData - Objeto con name, email, document y role.
     * @returns {Promise<Object|null>} Usuario actualizado o null si no existía.
     */
    update: async (id, userData) => {
        const { name, email, document, role } = userData;

        // Ejecutar el UPDATE
        const [result] = await pool.query(
            "UPDATE users SET name = ?, email = ?, document = ?, role = ? WHERE id = ?",
            [name, email, document, role, id]
        );

        // Si no se afectó ninguna fila, significa que el usuario no existe
        if (result.affectedRows === 0) return null;

        // Consultar el usuario actualizado
        const [updatedUser] = await pool.query(
            "SELECT * FROM users WHERE id = ?",
            [id]
        );

        return updatedUser[0];
    },

    /**
     * Actualiza todos los campos de un usuario existente.
     * @param {number|string} id - ID del usuario.
     * @param {Object} userData - Objeto con name, email, document y role.
     * @returns {Promise<Object|null>} Usuario actualizado o null si no existía.
     */
    updatePartial: async (id, userData) => {
        const fields = [];
        const values = [];

        if (userData.name !== undefined) {
            fields.push("name = ?");
            values.push(userData.name);
        }

        if (userData.email !== undefined) {
            fields.push("email = ?");
            values.push(userData.email);
        }

        if (userData.document !== undefined) {
            fields.push("document = ?");
            values.push(userData.document);
        }

        if (userData.role !== undefined) {
            fields.push("role = ?");
            values.push(userData.role);
        }

        if (fields.length === 0) {
            throw new Error("No hay campos para actualizar");
        }

        values.push(id);

        await pool.query(
            `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
            values
        );

        const [updatedUser] = await pool.query(
            "SELECT * FROM users WHERE id = ?",
            [id]
        );
        return updatedUser[0];
    },

    /**
     * Elimina un usuario por su ID.
     * @param {number|string} id - ID del usuario.
     * @returns {Promise<boolean>} True si el usuario fue eliminado, false de lo contrario.
     */
    delete: async (id) => {
        const [result] = await pool.query(
            "DELETE FROM users WHERE id = ?",
            [id]
        );

        return result.affectedRows > 0;
    },

    /**
     * Actualiza el token de refresco de un usuario.
     * @param {number|string} userId - ID del usuario.
     * @param {number|string}refresh_token - Token de refresco del usuario.
     * @returns {Promise<void>}
     */
    updateRefreshToken: async (userId, refresh_token) => {
        await pool.query("UPDATE users SET refresh_token = ? WHERE id = ?",
            [refresh_token, userId]
        );
    },

    // MÉTODOS DE ROLES Y PERMISOS (RBAC)

    /**
     * Obtiene todos los roles asignados a un usuario.
     * Realiza un JOIN entre user_roles y roles para retornar el detalle completo de cada rol.
     * @param {number|string} userId ID del usuario.
     * @returns {Promise<Array>} Lista de roles asignados al usuario.
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
     * Obtiene la lista plana de permisos efectivos de un usuario aplicando DISTINCT
     * sobre los códigos de permiso para evitar duplicados entre roles.
     * Une las tablas user_roles, role_permissions y permissions.
     * @param {number|string} userId ID del usuario.
     * @returns {Promise<Array>} Lista de permisos únicos del usuario.
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
     * Obtiene los roles de un usuario junto con los códigos de permisos de cada rol,
     * formateado como arreglo de objetos { id, name, permissions: [...códigos] }.
     * @param {number|string} userId ID del usuario.
     * @returns {Promise<Array>} Arreglo de roles con sus permisos anidados.
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

        // Agrupar los códigos de permisos por rol
        const rolesMap = new Map();

        for (const row of rows) {
            if (!rolesMap.has(row.id)) {
                rolesMap.set(row.id, {
                    id: row.id,
                    name: row.name,
                    permissions: [],
                });
            }

            if (row.code) {
                rolesMap.get(row.id).permissions.push(row.code);
            }
        }

        return Array.from(rolesMap.values());
    },

    /**
     * Sincroniza los roles de un usuario en una sola transacción atómica.
     * Elimina todas las asignaciones actuales en user_roles e inserta las nuevas.
     * @param {number|string} userId ID del usuario a sincronizar.
     * @param {number[]} roleIds Array de IDs de roles a asignar.
     * @returns {Promise<void>}
     * @throws {Error} Si la transacción falla, se realiza rollback automático.
     */
    syncRoles: async (userId, roleIds) => {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            // Paso 1: Eliminar todas las asignaciones actuales del usuario
            await connection.query(
                'DELETE FROM user_roles WHERE user_id = ?',
                [userId]
            );

            // Paso 2: Insertar las nuevas asignaciones (si es que hay alguna)
            if (roleIds.length > 0) {
                const rows = roleIds.map((roleId) => [userId, roleId]);

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
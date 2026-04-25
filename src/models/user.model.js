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
     * @param {Object} userData - Datos del usuario (name, email, document, role).
     * @returns {Promise<Object>} Datos del usuario recién insertado.
     */
    create: async (userData) => {
        const { name, email, document, role } = userData;

        // Ejecutar el INSERT
        const [result] = await pool.query(
            "INSERT INTO users (name, email, document, role) VALUES (?, ?, ?, ?)",
            [name, email, document, role || "user"]
        );

        // Consultar el usuario recién creado
        const [createdUser] = await pool.query(
            "SELECT * FROM users WHERE id = ?",
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
    }
};
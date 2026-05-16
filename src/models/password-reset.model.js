import pool from '../config/db.js';

/**
 * Modelo de datos para gestionar el flujo de recuperación de contraseña.
 * Centraliza las consultas SQL sobre las tablas `users`, `password_reset_tokens`
 * y `password_history`.
 */

// Cantidad de contraseñas anteriores que no se pueden reutilizar
const PASSWORD_HISTORY_LIMIT = 2;

export const PasswordResetModel = {

    /**
     * Busca un usuario por su correo electrónico.
     * @param {string} email - Correo electrónico del usuario.
     * @returns {Promise<Object|null>} El objeto del usuario o null si no existe.
     */
    findUserByEmail: async (email) => {
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0] || null;
    },

    /**
     * Obtiene el hash de contraseña actual de un usuario.
     * Usado para guardar la contraseña vigente en el historial antes de reemplazarla.
     * @param {number} userId - ID del usuario.
     * @returns {Promise<string|null>} El hash actual o null si no existe.
     */
    getCurrentPasswordHash: async (userId) => {
        const [rows] = await pool.query(
            'SELECT password_hash FROM users WHERE id = ?',
            [userId]
        );
        return rows[0]?.password_hash || null;
    },

    /**
     * Invalida todos los tokens de recuperación activos de un usuario.
     * Evita que existan múltiples tokens válidos al mismo tiempo.
     * @param {number} userId - ID del usuario.
     * @returns {Promise<void>}
     */
    invalidatePreviousTokens: async (userId) => {
        await pool.query(
            'UPDATE password_reset_tokens SET used = 1 WHERE user_id = ? AND used = 0',
            [userId]
        );
    },

    /**
     * Guarda un nuevo token de recuperación en la base de datos.
     * @param {number} userId    - ID del usuario.
     * @param {string} token     - Token criptográfico generado.
     * @param {string} expiresAt - Fecha de expiración en formato MySQL DATETIME.
     * @returns {Promise<void>}
     */
    saveToken: async (userId, token, expiresAt) => {
        await pool.query(
            'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
            [userId, token, expiresAt]
        );
    },

    /**
     * Busca un token válido: que exista, no haya expirado y no haya sido usado.
     * @param {string} token - Token recibido desde el enlace del email.
     * @returns {Promise<Object|null>} El registro del token o null si no es válido.
     */
    findValidToken: async (token) => {
        const [rows] = await pool.query(
            'SELECT * FROM password_reset_tokens WHERE token = ? AND used = 0 AND expires_at > NOW()',
            [token]
        );
        return rows[0] || null;
    },

    /**
     * Actualiza el hash de contraseña de un usuario.
     * @param {number} userId       - ID del usuario.
     * @param {string} passwordHash - Nueva contraseña ya hasheada con bcrypt.
     * @returns {Promise<void>}
     */
    updatePassword: async (userId, passwordHash) => {
        await pool.query(
            'UPDATE users SET password_hash = ? WHERE id = ?',
            [passwordHash, userId]
        );
    },

    /**
     * Marca un token como usado para que no pueda reutilizarse.
     * @param {number} tokenId - ID del registro en password_reset_tokens.
     * @returns {Promise<void>}
     */
    markTokenAsUsed: async (tokenId) => {
        await pool.query(
            'UPDATE password_reset_tokens SET used = 1 WHERE id = ?',
            [tokenId]
        );
    },

    // ─── HISTORIAL DE CONTRASEÑAS ────────────────────────────────────────────

    /**
     * Recupera los hashes previos del historial para verificar reutilización.
     * Usa PASSWORD_HISTORY_LIMIT internamente; el controlador no decide el límite.
     * @param {number} userId - ID del usuario.
     * @returns {Promise<Array>} Lista de objetos con el campo password_hash.
     */
    getPasswordHistory: async (userId) => {
        const [rows] = await pool.query(
            `SELECT password_hash FROM password_history
            WHERE user_id = ? ORDER BY created_at DESC LIMIT ?`,
            [userId, PASSWORD_HISTORY_LIMIT - 1]
        );
        return rows;
    },

    /**
     * Guarda un hash en el historial de contraseñas del usuario.
     * Debe llamarse con la contraseña anterior antes de aplicar el cambio.
     * @param {number} userId       - ID del usuario.
     * @param {string} passwordHash - Hash a registrar en el historial.
     * @returns {Promise<void>}
     */
    saveToHistory: async (userId, passwordHash) => {
        await pool.query(
            'INSERT INTO password_history (user_id, password_hash) VALUES (?, ?)',
            [userId, passwordHash]
        );
    },

    /**
     * Elimina registros antiguos del historial, conservando solo los últimos según PASSWORD_HISTORY_LIMIT.
     * Evita que la tabla crezca indefinidamente.
     * @param {number} userId - ID del usuario.
     * @returns {Promise<void>}
     */
    pruneHistory: async (userId) => {
        await pool.query(
            `DELETE FROM password_history
            WHERE user_id = ? AND id NOT IN (
                SELECT id FROM (
                    SELECT id FROM password_history
                    WHERE user_id = ? ORDER BY created_at DESC LIMIT ?
                ) AS recent
            )`,
            [userId, userId, PASSWORD_HISTORY_LIMIT]
        );
    },
};
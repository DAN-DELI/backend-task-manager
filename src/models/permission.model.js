import pool from '../config/db.js';

/**
 * Modelo de datos para gestionar la tabla 'permissions'.
 * Centraliza las consultas SQL relacionadas con los permisos atómicos del sistema.
 */
export const PermissionModel = {

    /**
     * Recupera todos los permisos atómicos registrados en el sistema.
     * @returns {Promise<Array>} Lista de permisos con id, code, name y description.
     */
    findAll: async () => {
        const [rows] = await pool.query(
            'SELECT id, code, name, description FROM permissions'
        );
        return rows;
    },
};
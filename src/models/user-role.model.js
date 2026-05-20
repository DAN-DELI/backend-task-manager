import  pool  from '../config/db.js';

export const UserRoleModel = {
    // Método para asignar un rol a un usuario
    assignRole: async (userId, roleId) => {
        const query = 'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)';
        const [result] = await pool.execute(query, [userId, roleId]);
        return result;
    },

    // Opcional: útil si necesitas actualizar un rol existente
    updateUserRole: async (userId, newRoleId) => {
        const query = 'UPDATE user_roles SET role_id = ? WHERE user_id = ?';
        const [result] = await pool.execute(query, [newRoleId, userId]);
        return result;
    },
    // Cuenta cuántos usuarios tienen asignado un rol específico
    countUsersWithRole: async (roleId) => {
        const query = 'SELECT COUNT(*) as total FROM user_roles WHERE role_id = ?';
        const [rows] = await pool.execute(query, [roleId]);
        return rows[0].total;
    }
};
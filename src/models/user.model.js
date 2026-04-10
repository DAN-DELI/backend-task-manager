import pool from '../config/db.js';

export const UserModel = {

    findAll: async () => {
        const [rows] = await pool.query("SELECT * FROM users");
        return rows;
    },

    findById: async (id) => {
        const [rows] = await pool.query(
            "SELECT * FROM users WHERE id = ?",
            [id]
        );

        if (!rows[0]) return null;

        return { ...rows[0], tasks: [] };
    },

    findByDocument: async (document) => {
        const [rows] = await pool.query(
            "SELECT * FROM users WHERE document = ?",
            [document]
        );

        return rows.map(user => ({
            ...user,
            tasks: []
        }));
    },

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

    delete: async (id) => {
        const [result] = await pool.query(
            "DELETE FROM users WHERE id = ?",
            [id]
        );

        return result.affectedRows > 0;
    }
};
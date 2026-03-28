import { pool } from '../config/db.js';

export const UserModel = {

    findAll: async () => {
        const [rows] = await pool.query("SELECT * FROM users");

        return rows.map(user => ({
            ...user,
            tasks: []
        }));
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

        const [result] = await pool.query(
            "INSERT INTO users (name, email, document, role) VALUES (?, ?, ?, ?)",
            [name, email, document, role || 'user']
        );

        return {
            id: result.insertId,
            name,
            email,
            document,
            role: role || 'user',
            tasks: []
        };
    },
    //tu no has visto nada- comentario para poder hacer pr
    update: async (id, userData) => {
        const { name, email, document, role } = userData;

        await pool.query(
            "UPDATE users SET name = ?, email = ?, document = ?, role = ? WHERE id = ?",
            [name, email, document, role, id]
        );

        return {
            id,
            name,
            email,
            document,
            role,
            tasks: []
        };
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

        return {
            id,
            ...userData,
            tasks: []
        };
    },

    delete: async (id) => {
        const [result] = await pool.query(
            "DELETE FROM users WHERE id = ?", 
            [id]
        );

        return result.affectedRows > 0;
    }
};
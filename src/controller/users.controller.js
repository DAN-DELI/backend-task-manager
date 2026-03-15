// src/controller/users.controller.js
import fs from 'fs';
import path from 'path';

export const validateUser = (req, res) => {
    try {
        const dbPath = path.join(process.cwd(), 'db.json');
        const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

        const { id } = req.params;
        const user = db.users.find(u => u.id == id);

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ msn: "Usuario no encontrado" });
        }
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ msn: "Error interno del servidor" });
    }
};
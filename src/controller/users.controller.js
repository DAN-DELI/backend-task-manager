import { UserModel } from '../models/user.model.js';

export const getUsers = async (req, res) => {
    try {
        const { id } = req.params; 
        const { document } = req.query;

        let result;

        if (id) {
            const user = await UserModel.findById(id);
            // Si es un solo usuario, lo metemos en un array para consistencia
            if (!user) {
                return res.status(404).json({ msn: "Usuario no encontrado" });
            }

            result = [user];

        } else if (document) {
            result = await UserModel.findByDocument(document);

            if (result.length === 0) {
                return res.status(404).json({ msn: "Usuario no encontrado" });
            }

        } else {
            result = await UserModel.findAll();
        }

        // MAQUEO CLAVE: Si el resultado es un array, nos aseguramos de que
        // cada usuario tenga una propiedad 'tasks' aunque sea vacía.
        const usersWithTasks = result.map(user => ({
            ...user,
            tasks: [] // Esto evita el error del .forEach en el admin.js
        }));

        if (document && usersWithTasks.length === 0) {
            return res.status(404).json({ msn: "Usuario no encontrado" });
        }

        res.status(200).json(usersWithTasks); 
    } catch (error) {
        res.status(500).json({ msn: "Error al obtener usuarios" });
    }
};

export const createUser = async (req, res) => {
    try {
        const { name, email, document} = req.body;
        
        // Validación básica
        if (!name || !email || !document) {
            return res.status(400).json({ msn: "Faltan datos obligatorios" });
        }

        const newUser = await UserModel.create(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ msn: "Error al crear el usuario" });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, document, role } = req.body;

        // PUT exige TODO
        if (!name || !email || !document || !role) {
            return res.status(400).json({ 
                msn: "Todos los campos son obligatorios para PUT" 
            });
        }

        const userExists = await UserModel.findById(id);

        if (!userExists) {
            return res.status(404).json({ msn: "Usuario no encontrado" });
        }

        const updatedUser = await UserModel.update(id, {
            name,
            email,
            document,
            role
        });

        res.status(200).json({
            msn: `Usuario con ID ${id} actualizado correctamente (PUT)`,
            data: updatedUser
        });

    } catch (error) {
        res.status(500).json({ msn: "Error al actualizar usuario" });
    }
};

export const updateUserPartial = async (req, res) => {
    try {
        const { id } = req.params;
        const userData = req.body;

        const userExists = await UserModel.findById(id);

        if (!userExists) {
            return res.status(404).json({ msn: "Usuario no encontrado" });
        }

        if (Object.keys(userData).length === 0) {
            return res.status(400).json({ 
                msn: "Debes enviar al menos un campo para actualizar" 
            });
        }

        const updatedUser = await UserModel.updatePartial(id, userData);

        res.status(200).json({
            msn: `Usuario con ID ${id} actualizado parcialmente (PATCH)`,
            data: updatedUser
        });

    } catch (error) {
        res.status(500).json({ msn: "Error al actualizar parcialmente" });
    }
};


export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const isDeleted = await UserModel.delete(id);

        if (!isDeleted) {
            return res.status(404).json({ msn: "Usuario no encontrado" });
        }

        res.status(200).json({ msn: `Usuario con ID ${id} eliminado correctamente` });
    } catch (error) {
        res.status(500).json({ msn: "Error al eliminar" });
    }
};
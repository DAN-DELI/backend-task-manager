import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db.json');

const getTask = (req, res) => {
    try {
        const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
        
        // Capturamos el userId si viene en la URL (ej: /tasks?userId=1)
        const { userId } = req.query; 

        if (userId) {
            // Filtramos las tareas que le pertenecen a ese usuario
            const userTasks = db.tasks.filter(t => t.userId == userId);
            return res.status(200).json(userTasks);
        }

        // Si no hay userId, mandamos todas (útil para el admin)
        res.status(200).json(db.tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msn: "Error al obtener tareas" });
    }
};

const createTask = (req, res) => {
    try {
        const dbPath = path.join(process.cwd(), 'db.json');
        const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

        // 1. Extraemos los datos que vienen del Frontend (main.js línea 110)
        const { userId, title, description, status, createdAt } = req.body;

        // 2. Creamos el nuevo objeto de tarea con un ID único
        const newTask = {
            id: Math.random().toString(36).substr(2, 4), // Genera un ID aleatorio corto
            userId,
            title,
            description,
            status,
            createdAt
        };

        // 3. Lo agregamos al array de tareas
        db.tasks.push(newTask);

        // 4. Guardamos el archivo db.json actualizado
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

        // 5. Respondemos al Frontend con la tarea creada
        res.status(201).json(newTask); 

    } catch (error) {
        console.error("Error al crear tarea:", error);
        res.status(500).json({ msn: "Error interno al guardar la tarea" });
    }
};

const updateTask = (req, res) => {
    try {
        const { id } = req.params;
        const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
        const index = db.tasks.findIndex(t => t.id == id);

        if (index !== -1) {
            db.tasks[index] = { ...db.tasks[index], ...req.body };
            fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
            res.status(200).json(db.tasks[index]);
        } else {
            res.status(404).json({ msn: "Tarea no encontrada" });
        }
    } catch (error) {
        res.status(500).json({ msn: "Error al actualizar" });
    }
};

const deleteTask = (req, res) => {
    try {
        const { id } = req.params;
        const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
        db.tasks = db.tasks.filter(t => t.id != id);
        
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
        res.status(200).json({ msn: "Tarea eliminada" });
    } catch (error) {
        res.status(500).json({ msn: "Error al eliminar" });
    }
};

export { getTask, createTask, updateTask, deleteTask };
import { 
    getAllTasksFromDB, 
    createTaskInDB, 
    updateTaskInDB, 
    deleteTaskInDB,
    getTaskByIdFromDB
} from '../models/task.model.js';

const getTask = async (req, res) => {
    try {
        const tasks = await getAllTasksFromDB();
        res.status(200).json({ msn: "Tareas listadas exitosamente", data: tasks });
    } catch (error) {
        res.status(500).json({ msn: "Error al obtener las tareas", error: error.message });
    }
};

const getTaskById = async (req, res) => {
    const { id } = req.params; 
    
    try {
        const task = await getTaskByIdFromDB(id);
        
        if (!task) {
            return res.status(404).json({ msn: `No se encontró ninguna tarea con el ID ${id}` });
        }
        res.status(200).json({ 
            msn: "Tarea encontrada exitosamente", 
            data: task 
        });
    } catch (error) {
        res.status(500).json({ msn: "Error al obtener la tarea", error: error.message });
    }
};

// const createTask = async (req, res) => {
//     const { user_id, title, body } = req.body;
//     try {
//         const result = await createTaskInDB(user_id, title, body);
//         res.status(201).json({
//             msn: "Tarea creada exitosamente",
//             data: { id: result.insertId, user_id, title, body }
//         });
//     } catch (error) {
//         res.status(500).json({ msn: "Error al crear la tarea", error: error.message });
//     }
// };

const createTask = async (req, res) => {
    // Cambiamos 'body' por 'description' y agregamos 'status'
    const { user_id, title, description, status } = req.body; 
    
    try {
        const result = await createTaskInDB(user_id, title, description, status);
        
        res.status(201).json({
            msn: "Tarea creada exitosamente",
            data: { id: result.insertId, user_id, title, description, status }
        });
    } catch (error) {
        res.status(500).json({ msn: "Error al crear la tarea", error: error.message });
    }
};

const updateTask = async (req, res) => {
    const { id } = req.params; 
    const { user_id, title, description, status } = req.body;
    
    try {
        const result = await updateTaskInDB(id, user_id, title, description, status);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ msn: `No se encontró la tarea con el ID ${id} para actualizar` });
        }
        res.status(200).json({
            msn: `Tarea ${id} actualizada exitosamente`,
            data: { id, user_id, title, description, status }
        });
    } catch (error) {
        res.status(500).json({ msn: "Error al actualizar la tarea", error: error.message });
    }
};

const deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await deleteTaskInDB(id);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ msn: `No se encontró la tarea con el ID ${id} para eliminar` });
        }

        res.status(200).json({ msn: "Tarea eliminada exitosamente" });
    } catch (error) {
        res.status(500).json({ msn: "Error al eliminar la tarea", error: error.message });
    }
};

export {
    getTask,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};
const getTask = (req, res) => {
    res
        .status(200)
        .json({msn : "Lista de tareas"})
};

const createTask = (req, res ) => {
    const {user_id, title, body} = req.body;
    res
        .status(201)
        .json({msn:"Tarea creada",
            data:{
                user_id, title, body
            }
        })
};
const updateTask = (req, res ) => {
    const {id} = req.params;
    console.log(`Actualizamos recurso por id: ${id}`);
    
};
const deleteTask = (req, res ) => {
    res
        .status(201)
        .json({msn:"Tarea eliminada"})
};

export {
    getTask,
    createTask,
    updateTask,
    deleteTask
} 
const getTask = (req, res) => {
    res
        .status(200)
        .json({msn : "Aquí se listarán las tareas (Endpoint GET funcionando)"})
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
    const {user_id, title, body} = req.body;
    res
        .status(200)
        .json({
            msn : `tarea ${id} actualizada`,
            data : {user_id, title, body}
        })
    
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
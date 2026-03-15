const getUsers = (req, res) => {
    res
        .status(200)
        .json({ 
            msn: "Aquí se listarán los usuarios (Endpoint GET funcionando)" 
    });
};

const createUser = (req, res) => {
  // Asegúrate de enviar exactamente estas llaves en Postman, sin espacios extra
    const { name, email, document } = req.body;

    res
        .status(201)
        .json({ 
            msn: "Usuario creado exitosamente",
            data: {
                name, 
                email, 
                document
            }
    });
};

const updateUser = (req, res) => {
    const { id } = req.params;
    const { name, email, document } = req.body;

    res
        .status(200)
        .json({ 
            msn: `Usuario con ID ${id} actualizado correctamente`,
            data: { name, email, document }
    });
};

const deleteUser = (req, res) => {
    const { id } = req.params;

    res
        .status(200)
        .json({ 
            msn: `Usuario con ID ${id} eliminado correctamente`
    });
};

export {
    getUsers,
    createUser,
    updateUser,
    deleteUser
};
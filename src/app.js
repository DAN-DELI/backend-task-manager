const express = require("express");

const app = express();
const PORT = 3000;

// importar rutas
const userRoutes = require("./routes/users.routes");
const taskRoutes = require("./routes/tasks.routes");

app.use(express.json());

// usar rutas
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);

// ruta base
app.get("/", (req, res) => {
    res.send("API del sistema de gestion de tareas funcionando");
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
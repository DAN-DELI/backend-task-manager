import express from "express";
import cors from "cors";
import tasksRouter from './routes/task.Routes.js'
import usersRouter from './routes/user.Routes.js'
import { successResponse } from "./utils/response.handler.js";
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = 3000;

app.get('/', (req, res) => {
    successResponse(res, 200, "Hola, esto es un servidor express (Endpoint raiz funcionando)")
});

//conexion de rutas
app.use('/tasks', tasksRouter);
app.use('/users', usersRouter);

app.listen(port, () => {
    console.log(`example app listening on port ${port}`);
})
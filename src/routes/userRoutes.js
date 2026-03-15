import express from 'express';
import { validateUser } from "../controller/users.controller.js";

const userRoutes = express.Router();

// Ruta para validar usuario usando el ID de la URL
userRoutes.get('/validate/:id', validateUser);

export default userRoutes;
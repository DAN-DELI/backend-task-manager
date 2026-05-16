import express from 'express';
import { login, refreshToken, register } from '../controller/auth.controller.js'; // Funciones del controlador
import { registerSchema, loginSchema, refreshTokenSchema } from "../schemas/auth.schema.js" // Esquemas 
import { validateSchema } from '../middlewares/validator.middleware.js'; // Middleware validador de esquemas


/**
 * Enrutador de autenticacion (auth).
 */
const authRouter = express.Router();


/**
 * @route   GET /api/auth/register
 * @desc    Registrar un nuevo usuario en el sistema
 * @access  Público
 */
authRouter.post("/register", validateSchema(registerSchema), register);

/**
 * @route   GET /api/auth/login
 * @desc    Realiza login 
 * @access  Público
 */
authRouter.post("/login", validateSchema(loginSchema), login);

/**
 * @route   GET /api/auth/refreshToken
 * @desc    Refresca toquen de acceso
 * @access  Público
 */
authRouter.post("/refresh", validateSchema(refreshTokenSchema), refreshToken);

export default authRouter;
import express from 'express';
import { login, refreshToken, register } from '../controller/auth.controller.js';

/**
 * Enrutador de autenticacion (auth).
 */
const authRouter = express.Router();

/**
 * @route   GET /api/auth
 * @desc    Registrar un nuevo usuario en el sistema
 * @access  Público
 */
authRouter.post("/register", register);

/**
 * @route   GET /api/auth
 * @desc    Realiza login 
 * @access  Público
 */
authRouter.post("/login", login);

/**
 * @route   GET /api/auth
 * @desc    Refresca toquen de acceso
 * @access  Público
 */
authRouter.post("/refresh", refreshToken);

export default authRouter;
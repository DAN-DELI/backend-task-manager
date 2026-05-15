import express from 'express';
import { forgotPassword, resetPassword } from '../controller/forgot-password.controller.js';

/**
 * @module forgot-password.route
 * @description Define las rutas del flujo de recuperación de contraseña.
 * La lógica de negocio está en forgot-password.controller.js.
 */

const forgotRouter = express.Router();

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Genera token y envía email de recuperación vía Mailtrap.
 * @access  Público
 */
forgotRouter.post('/forgot-password', forgotPassword);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Valida token y actualiza la contraseña del usuario.
 * @access  Público
 */
forgotRouter.post('/reset-password', resetPassword);

export default forgotRouter;
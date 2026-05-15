import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { PasswordResetModel } from '../models/password-reset.model.js';
import transporter from '../config/mailer.js';
import { resetPasswordEmail } from '../utils/email-templates.js';
import { successResponse, createError } from '../utils/response.handler.js';
import { catchAsync } from '../utils/catchAsync.js';
import 'dotenv/config';

/**
 * @module forgot-password.controller
 * @description Controlador para el flujo completo de recuperación de contraseña.
 * Delega las operaciones de BD a PasswordResetModel y el HTML a email-templates.
 */

/**
 * Solicita el enlace de recuperación de contraseña.
 * Genera un token seguro, lo guarda en BD e invalida tokens anteriores.
 * Envía el enlace al email del usuario vía Mailtrap.
 *
 * @route   POST /api/auth/forgot-password
 * @access  Público
 *
 * @param {Object} req.body
 * @param {string} req.body.email - Correo electrónico del usuario.
 *
 * @returns {200} Mensaje genérico (no revela si el email existe o no).
 * @returns {400} Si no se envía el campo email.
 */
export const forgotPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(createError('El email es requerido', 400));
    }

    // Mensaje genérico para ambos casos — buena práctica: no revelar si el email existe
    const msg = 'Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.';

    const user = await PasswordResetModel.findUserByEmail(email);

    if (!user) {
        return successResponse(res, 200, msg);
    }

    const token = crypto.randomBytes(32).toString('hex');

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ');

    // Lógica clave: Invalidar tokens previos antes de guardar el nuevo
    await PasswordResetModel.invalidatePreviousTokens(user.id);
    await PasswordResetModel.saveToken(user.id, token, expiresAt);

    const resetLink = `${process.env.FRONTEND_URL}/#/reset-password?token=${token}`;

    await transporter.sendMail({
        from:    `"Task Manager" <${process.env.MAIL_FROM}>`,
        to:      user.email,
        subject: 'Recuperación de contraseña',
        html:    resetPasswordEmail(user.name, resetLink),
    });

    return successResponse(res, 200, msg);
});

/**
 * Valida el token desde la BD y actualiza la contraseña del usuario.
 * Verifica que la nueva contraseña no coincida con las últimas utilizadas.
 * El token debe existir, no haber expirado y no haber sido usado previamente.
 *
 * @route   POST /api/auth/reset-password
 * @access  Público (requiere token válido obtenido desde el email)
 *
 * @param {Object} req.body
 * @param {string} req.body.token       - Token recibido en el enlace del email.
 * @param {string} req.body.newPassword - Nueva contraseña en texto plano.
 *
 * @returns {200} Contraseña actualizada exitosamente.
 * @returns {400} Si faltan campos, el token es inválido o la contraseña fue usada recientemente.
 */
export const resetPassword = catchAsync(async (req, res, next) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return next(createError('Token y nueva contraseña son requeridos', 400));
    }

    // Lógica clave: Verificar que el token sea válido, vigente y no usado
    const record = await PasswordResetModel.findValidToken(token);

    if (!record) {
        return next(createError('El enlace ha expirado o ya fue utilizado. Solicita uno nuevo.', 400));
    }

    // Lógica clave: Comparar la nueva contraseña contra la actual y el historial previo
    const currentHash = await PasswordResetModel.getCurrentPasswordHash(record.user_id);
    const history     = await PasswordResetModel.getPasswordHistory(record.user_id);

    const hashesToCheck = [
        ...(currentHash ? [{ password_hash: currentHash }] : []),
        ...history,
    ];

    for (const entry of hashesToCheck) {
        const isReused = await bcrypt.compare(newPassword, entry.password_hash);
        if (isReused) {
            return next(createError('Por favor elige una contraseña diferente.', 400));
        }
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    // Lógica clave: Guardar la contraseña actual en historial antes de reemplazarla
    if (currentHash) {
        await PasswordResetModel.saveToHistory(record.user_id, currentHash);
        await PasswordResetModel.pruneHistory(record.user_id);
    }

    await PasswordResetModel.updatePassword(record.user_id, hash);
    await PasswordResetModel.markTokenAsUsed(record.id);

    return successResponse(res, 200, 'Contraseña actualizada exitosamente. Ya puedes iniciar sesión.');
});
import express from 'express';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import pool from '../config/db.js';
import transporter from '../config/mailer.js';
import { successResponse } from '../utils/response.handler.js';
import { catchAsync } from '../utils/catchAsync.js';
import 'dotenv/config';

/**
 * @module forgot-password.route
 * @description Gestiona el flujo completo de recuperación de contraseña en dos pasos:
 *
 *  1. El usuario solicita el enlace → POST /api/auth/forgot-password
 *     - Recibe el email del usuario.
 *     - Genera un token seguro de un solo uso (válido 1 hora).
 *     - Invalida tokens anteriores del mismo usuario.
 *     - Guarda el token en la tabla password_reset_tokens de la BD.
 *     - Envía un email con el enlace de restablecimiento vía Mailtrap.
 *
 *  2. El usuario usa el enlace para cambiar su contraseña → POST /api/auth/reset-password
 *     - Recibe el token y la nueva contraseña.
 *     - Valida en BD que el token exista, no haya expirado y no haya sido usado.
 *     - Hashea la nueva contraseña y la guarda en la BD.
 *     - Marca el token como usado (used = 1) para que no pueda reutilizarse.
 */

const forgotRouter = express.Router();

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Genera un token de recuperación y envía el email con el enlace de restablecimiento.
 * @access  Público
 *
 * @param {Object} req.body
 * @param {string} req.body.email - Correo electrónico del usuario.
 *
 * @returns {200} Mensaje genérico (independiente de si el email existe o no).
 *                Buena práctica de seguridad: no revelar si un email está registrado.
 * @returns {400} Si no se envía el campo email.
 */
forgotRouter.post('/forgot-password', catchAsync(async (req, res) => {
    const { email } = req.body;

    // Validar que se haya enviado el email
    if (!email) {
        return res.status(400).json({ success: false, message: 'El email es requerido.' });
    }

    // Buscar el usuario en la BD por su correo electrónico
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    // Mensaje genérico para ambos casos (usuario encontrado o no)
    // Buena práctica de seguridad: no revelar si el email está registrado
    const msg = 'Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.';

    // Si el usuario no existe, respondemos igual para no dar pistas al atacante
    if (!user) {
        return successResponse(res, 200, msg);
    }

    // Generar token criptográficamente seguro (32 bytes = 64 caracteres hex)
    const token = crypto.randomBytes(32).toString('hex');

    // Calcular fecha de expiración (1 hora desde ahora) en formato MySQL DATETIME
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ');

    // Invalidar tokens anteriores del mismo usuario que no hayan sido usados
    // Evita que haya múltiples tokens válidos al mismo tiempo para el mismo usuario
    await pool.query(
        'UPDATE password_reset_tokens SET used = 1 WHERE user_id = ? AND used = 0',
        [user.id]
    );

    // Guardar el nuevo token en la base de datos
    await pool.query(
        'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
        [user.id, token, expiresAt]
    );

    // Construir el enlace que irá en el email
    // El frontend leerá el token desde la URL: /#/reset-password?token=xxxx
    const resetLink = `${process.env.FRONTEND_URL}/#/reset-password?token=${token}`;

    // Enviar el email con el enlace de recuperación vía Mailtrap
    await transporter.sendMail({
        from:    `"Task Manager" <${process.env.MAIL_FROM}>`,
        to:      user.email,
        subject: 'Recuperación de contraseña',
        html: `
        <div style="font-family:'Segoe UI',sans-serif; background:#f4f7f6; padding:40px;">
            <div style="background:#fff; border-radius:12px; padding:2.5rem;
                        max-width:520px; margin:0 auto; box-shadow:0 4px 12px rgba(0,0,0,.08);">
            <h2 style="color:#0056b3; border-bottom:2px solid #e0e0e0; padding-bottom:1rem;">
                Recuperar contraseña
            </h2>
            <p style="color:#555; line-height:1.6;">
                Hola <strong>${user.name}</strong>, recibimos una solicitud para restablecer
                tu contraseña. Haz clic en el botón (válido por <strong>1 hora</strong>):
            </p>
            <a href="${resetLink}"
                style="display:inline-block; padding:0.8rem 2rem; background:#0056b3;
                        color:#fff; text-decoration:none; border-radius:6px; margin-top:1.5rem;">
                Restablecer contraseña
            </a>
            <p style="color:#999; font-size:0.8rem; margin-top:2rem;
                        border-top:1px solid #e0e0e0; padding-top:1rem;">
                Si no solicitaste esto, ignora este mensaje. Tu contraseña no cambiará.
            </p>
            </div>
        </div>
        `,
    });

    return successResponse(res, 200, msg);
}));

/**
 * @route   POST /api/auth/reset-password
 * @desc    Valida el token desde la BD y actualiza la contraseña del usuario.
 * @access  Público (requiere token válido obtenido desde el email)
 *
 * @param {Object} req.body
 * @param {string} req.body.token       - Token recibido en el enlace del email.
 * @param {string} req.body.newPassword - Nueva contraseña en texto plano.
 *
 * @returns {200} Contraseña actualizada exitosamente.
 * @returns {400} Si faltan campos, el token expiró, no existe o ya fue usado.
 */
forgotRouter.post('/reset-password', catchAsync(async (req, res) => {
    const { token, newPassword } = req.body;

    // Validar que se enviaron ambos campos
    if (!token || !newPassword) {
        return res.status(400).json({ success: false, message: 'Token y nueva contraseña son requeridos.' });
    }

    // Buscar el token en la BD verificando que:
    //  - Exista
    //  - No haya expirado (expires_at > ahora)
    //  - No haya sido usado (used = 0)
    const [rows] = await pool.query(
        'SELECT * FROM password_reset_tokens WHERE token = ? AND used = 0 AND expires_at > NOW()',
        [token]
    );

    const record = rows[0];

    // Si no se encontró un token válido, rechazar la petición
    if (!record) {
        return res.status(400).json({
            success: false,
            message: 'El enlace ha expirado o ya fue utilizado. Solicita uno nuevo.'
        });
    }

    // Hashear la nueva contraseña antes de guardarla (nunca guardar texto plano)
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    // Actualizar el password_hash en la tabla users
    await pool.query(
        'UPDATE users SET password_hash = ? WHERE id = ?',
        [hash, record.user_id]
    );

    // Marcar el token como usado (used = 1) — de un solo uso
    await pool.query(
        'UPDATE password_reset_tokens SET used = 1 WHERE id = ?',
        [record.id]
    );

    return successResponse(res, 200, 'Contraseña actualizada exitosamente. Ya puedes iniciar sesión.');
}));

export default forgotRouter;
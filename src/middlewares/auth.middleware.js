import jwt from 'jsonwebtoken';
import { createError } from '../utils/response.handler.js';

/**
 * @module auth.middleware
 * @description Middleware para la autenticación y protección de rutas.
 * Actúa como guardián interceptando las peticiones, verificando la 
 * validez del token de acceso e inyectando la identidad del usuario.
 */

/**
 * @function verifyToken
 * @description Verifica el token JWT enviado en la cabecera Authorization (formato Bearer).
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar el control al siguiente middleware.
 * @returns {void} Llama a next() si es exitoso, o next(error) si falla la validación.
 */
export const verifyToken = (req, res, next) => {
    // Paso 1 y 2: Localización y validación del estándar Bearer
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(
            createError("Acceso denegado", 401, ["Token no proporcionado o formato inválido"])
        );
    }

    // Paso 3: Extracción de la cadena del token
    const token = authHeader.split(' ')[1];

    try {
        // Verificación criptográfica utilizando la llave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Paso 4: Inyección de Identidad (Payload) en la petición
        req.user = decoded;

        // Paso 5: Autorización de flujo hacia el siguiente controlador
        next();

    } catch (error) {
        // Paso 6: Control de errores y traducción
        let mensajeError = "Token inválido o corrupto";
        
        if (error.name === 'TokenExpiredError') {
            mensajeError = "El tiempo de sesión se agotó, por favor inicie sesión nuevamente";
        }

        return next(
            createError("Acceso denegado", 401, [mensajeError])
        );
    }
};
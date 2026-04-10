/**
 * Utilidad para estandarizar las respuestas exitosas de la API
 */
export const successResponse = (res, statusCode, message, data = []) => {
    return res.status(statusCode).json({
        success: true,
        message: message,
        data: data,
        errors: [],
    });
};

/**
 * Utilidad para estandarizar las respuestas de error de la API
 */
export const errorResponse = (res, statusCode, message, errors = []) => {
    // Nos aseguramos de que errors siempre sea un arreglo
    const formattedErrors = Array.isArray(errors) ? errors : [errors];

    return res.status(statusCode).json({
        success: false,
        message: message,
        data: [],
        errors: formattedErrors,
    });
};

/**
 * Crea un error personalizado (operacional) para controlar
 * las respuestas del servidor de forma consistente.
 * Permite definir mensaje, código HTTP y detalles adicionales.
 */
export const createError = (message, statusCode, details = []) => {

    // Se crea una instancia base del error con el mensaje
    const err = new Error(message);

    // Código de estado HTTP (ej: 404, 400, 500)
    err.statusCode = statusCode;

    // Indica que es un error controlado (no es fallo interno inesperado)
    err.isOperational = true;

    // Lista de errores detallados (si no hay, usa el mensaje principal)
    err.errors = details.length ? details : [message];

    // Retorna el error listo para ser manejado por el middleware
    return err;
};
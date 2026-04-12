/**
 * Envoltorio (Wrapper) para controladores asíncronos.
 * @param {Function} fn - Función asíncrona (controlador) que retorna una Promesa.
 * @returns {Function} Middleware de Express que captura errores mediante .catch(next).
 */
export const catchAsync = (fn) => {
    return (req, res, next) => {
        // Ejecuta la función y delega cualquier error al middleware de errores global
        fn(req, res, next).catch(next);
    };
};
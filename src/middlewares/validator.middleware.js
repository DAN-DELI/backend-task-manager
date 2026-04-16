import { createError } from "../utils/response.handler.js";

/**
 * Middleware para validar el cuerpo de la petición (req.body) contra un esquema de Zod.
 * Actúa como una capa de seguridad que asegura que los datos de entrada sean correctos
 * antes de procesarlos en los controladores.
 * @param {ZodSchema} schema - El esquema de validación definido con la librería Zod.
 * @returns {Function} Un middleware de Express (req, res, next).
 */
export const validateSchema = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const structuredErrors = result.error.issues.map((issue) => {
                let finalMessage = issue.message;

                // Si detectamos que Zod escupió su error por defecto en inglés por un campo faltante
                if (finalMessage.includes("received undefined")) {
                    finalMessage = "Este campo es obligatorio";
                }

                return {
                    field: issue.path.length > 0 ? issue.path[0] : "body",
                    message: finalMessage,
                };
            });

            // Estructuraccion de error
            const validationError = createError(
                "Error de validación en los datos enviados",
                400,
                structuredErrors
            );

            return next(validationError);
        }

        req.body = result.data;
        next();
    };
};

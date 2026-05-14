import { createError } from "../utils/response.handler.js";


/**
 * Middleware genérico para validar datos de la petición contra un esquema de Zod.
 * Soporta validación de body, params y query.
 * @param {ZodSchema} schema - El esquema de validación definido con Zod.
 * @param {"body" | "params" | "query"} source - Origen de los datos a validar. Por defecto: "body".
 * @returns {Function} Middleware de Express (req, res, next).
 */
export const validateSchema = (schema, source = "body") => {
    return (req, res, next) => {
        const dataToValidate = req[source];

        // Si la fuente no existe (ej: params en una ruta sin parámetros), evitamos undefined
        if (dataToValidate === undefined) {
            const error = createError(
                `No se encontraron datos en ${source} para validar`,
                400
            );
            return next(error);
        }

        const result = schema.safeParse(dataToValidate);

        if (!result.success) {
            const structuredErrors = result.error.issues.map((issue) => {
                let finalMessage = issue.message;

                // Normalización de mensajes por defecto de Zod para campos faltantes
                if (finalMessage.includes("received undefined")) {
                    finalMessage = "Este campo es obligatorio";
                }

                return {
                    field: issue.path.length > 0 ? issue.path[0] : source,
                    message: finalMessage,
                };
            });

            const validationError = createError(
                "Error de validación en los datos enviados",
                400,
                structuredErrors
            );

            return next(validationError);
        }

        // Sobrescribimos la propiedad validada (body, params o query) con los datos transformados
        req[source] = result.data;
        next();
    };
};
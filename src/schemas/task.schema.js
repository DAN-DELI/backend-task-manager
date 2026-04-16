// src/schemas/task.schema.js
import { z } from "zod";

/**
 * Esquema de validación base para la creación y actualización total de tareas.
 * Define las restricciones de tipo, longitud y mensajes de error para cada campo.
 * @const {z.ZodObject}
 */
export const taskSchema = z.object({
    /** Identificador del usuario: Obligatorio, debe ser un número entero. */
    user_id: z.number({
        required_error: "El id del usuario es obligatorio",
        invalid_type_error: "El id del usuario debe ser un número entero",
    }).int(),

    /** Título de la tarea: Obligatorio, entre 5 y 150 caracteres. */
    title: z.string({
        required_error: "El título es obligatorio",
        invalid_type_error: "El título debe ser una cadena de texto",
    }).min(5, "El título debe tener al menos 5 caracteres")
      .max(150, "El título no puede exceder los 150 caracteres"),

    /** Descripción detallada: Obligatoria, entre 5 y 2000 caracteres. */
    description: z.string({
        required_error: "La descripción es obligatoria",
        invalid_type_error: "La descripción debe ser una cadena de texto",
    }).min(5, "La descripción debe tener al menos 5 caracteres")
      .max(2000, "La descripción no puede exceder los 2000 caracteres"),

    /** Estado: Opcional, solo permite 'pendiente', 'en-progreso' o 'completada'. */
    status: z.enum(['pendiente', 'en-progreso', 'completada'], {
        errorMap: () => ({ message: "El estado es inválido" }),
    }).optional(), 

    /** Creador: Define el rol que origina la tarea (admin o user). */
    created_by: z.enum(['admin', 'user'], {
        errorMap: () => ({ message: "El creador es inválido" }),
    })
});

/**
 * Esquema para actualizaciones parciales (PATCH).
 * Convierte todos los campos de taskSchema en opcionales y valida que se envíe al menos uno.
 * @const {z.ZodEffects}
 */
export const taskPartialSchema = taskSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    {
        message: "Debe enviar al menos un campo para actualizar",
    }
);
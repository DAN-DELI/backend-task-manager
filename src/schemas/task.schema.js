// src/schemas/task.schema.js
import { z } from "zod";

export const taskSchema = z.object({
    user_id: z.number({
        required_error: "El id del usuario es obligatorio",
        invalid_type_error: "El id del usuario debe ser un número entero",
    }).int(),
    title: z.string({
        required_error: "El título es obligatorio",
        invalid_type_error: "El título debe ser una cadena de texto",
    }).min(5, "El título debe tener al menos 5 caracteres")
      .max(150, "El título no puede exceder los 150 caracteres"),
    description: z.string({
        required_error: "La descripción es obligatoria",
        invalid_type_error: "La descripción debe ser una cadena de texto",
    }).min(5, "La descripción debe tener al menos 5 caracteres")
      .max(2000, "La descripción no puede exceder los 2000 caracteres"),
    status: z.enum(['pendiente', 'en-progreso', 'completada'], {
        errorMap: () => ({ message: "El estado es inválido" }),
    }).optional(), // Se marca como opcional si la DB tiene default, pero valida el tipo si viene
    created_by: z.enum(['admin', 'user'], {
        errorMap: () => ({ message: "El creador es inválido" }),
    })
});

// Esquema para actualizaciones parciales (PATCH)
export const taskPartialSchema = taskSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    {
        message: "Debe enviar al menos un campo para actualizar",
    }
);
import { z } from "zod";

/**
 * Esquema de validación base para Usuarios.
 * Se utiliza para validar la creación (POST) y actualización total (PUT).
 * @const {z.ZodObject}
 */
export const userSchema = z.object({
    /** Nombre: Obligatorio, entre 3 y 100 caracteres. */
    name: z.string({
        required_error: "El nombre es obligatorio",
        invalid_type_error: "El nombre debe ser una cadena de texto",
    })
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(100, "El nombre no puede exceder los 100 caracteres"),

    /** Email: Obligatorio, debe tener formato de correo electrónico válido. */
    email: z.string({
        required_error: "El correo electrónico es obligatorio",
        invalid_type_error: "El correo electrónico debe ser una cadena de texto",
    })
        .email("El correo electrónico no es válido"),

    /** Documento: Obligatorio, numérico (string), entre 5 y 20 dígitos, no inicia en 0. */
    document: z.string({
        required_error: "El documento es obligatorio",
        invalid_type_error: "El documento debe ser una cadena de texto",
    })
        .min(5, "El documento debe tener al menos 5 dígitos")
        .max(20, "El documento no puede exceder los 20 dígitos")
        .regex(/^[1-9][0-9]*$/, "El documento solo debe contener números y no puede iniciar en 0"),

    /** Contraseña: Obligatoria, string, entre 8 y 120 caracteres. */
    password: z.string({
        required_error: "La contraseña es obligatoria",
        invalid_type_error: "La contraseña debe ser una cadena de texto",
    })
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .max(120, "La contraseña no puede exceder los 120 caracteres"),

    /** Rol: Opcional, solo permite los valores "admin" o "user". */
    role: z.enum(["admin", "user"], {
        invalid_type_error: "El rol es inválido",
    }).optional(),
});

/**
 * Esquema para actualizaciones parciales (PATCH/PUT).
 * Hace que todos los campos sean opcionales y exige enviar al menos una propiedad.
 * @const {z.ZodEffects}
 */
export const userPartialSchema = userSchema
    .partial()
    .refine(
        (data) => Object.keys(data).length > 0,
        { message: "Debe enviar al menos un campo para actualizar" }
    );
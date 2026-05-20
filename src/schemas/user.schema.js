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

    /** Roles: Array de IDs de roles (soporta múltiples) */
    roleIds: z.array(
        z.number().int().positive("Cada ID de rol debe ser válido"),
        { invalid_type_error: "Los roles deben enviarse como un array de números" }
    ).min(1, "Debe asignar al menos un rol").optional(),

    /** Legacy: un solo roleId para compatibilidad hacia atrás */
    roleId: z.number().int().positive("El ID del rol debe ser válido").optional(),

}).strict();

/**
 * Esquema para actualizaciones parciales (PATCH).
 * Todos los campos opcionales, pero debe venir al menos uno.
 * NOTA: En Zod v4 no se puede usar .partial() después de .refine(),
 * así que construimos el esquema parcial manualmente.
 * @const {z.ZodEffects}
 */
export const userPartialSchema = z.object({
    name: z.string().min(3).max(100).optional(),
    email: z.string().email().optional(),
    document: z.string().min(5).max(20).regex(/^[1-9][0-9]*$/).optional(),
    password: z.string().min(8).max(120).optional(),
    roleIds: z.array(z.number().int().positive()).min(1).optional(),
    roleId: z.number().int().positive().optional(),
}).strict().refine(
    (data) => Object.keys(data).length > 0,
    { message: "Debe enviar al menos un campo para actualizar" }
);

/**
 * Esquema para cambio de contraseña desde settings (usuario autenticado).
 * Requiere la contraseña actual para verificar identidad y la nueva dos veces.
 * @const {z.ZodEffects}
 */
export const changePasswordSchema = z.object({

    /** Contraseña actual del usuario para verificar identidad */
    currentPassword: z.string({
        required_error: "La contraseña actual es obligatoria",
        invalid_type_error: "La contraseña actual debe ser una cadena de texto",
    }).min(1, "La contraseña actual es obligatoria"),

    /** Nueva contraseña: entre 8 y 120 caracteres */
    newPassword: z.string({
        required_error: "La nueva contraseña es obligatoria",
        invalid_type_error: "La nueva contraseña debe ser una cadena de texto",
    })
        .min(8, "La nueva contraseña debe tener al menos 8 caracteres")
        .max(120, "La nueva contraseña no puede exceder los 120 caracteres"),

    /** Confirmación de la nueva contraseña */
    confirmPassword: z.string({
        required_error: "La confirmación de contraseña es obligatoria",
        invalid_type_error: "La confirmación debe ser una cadena de texto",
    }).min(1, "La confirmación de contraseña es obligatoria"),

}).refine(
    (data) => data.newPassword === data.confirmPassword,
    {
        message: "Las contraseñas nuevas no coinciden",
        path: ["confirmPassword"],
    }
);
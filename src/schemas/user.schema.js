import { z } from "zod";


// Schema que se usa en post y put

export const userSchema = z.object({
    name: z.string({
        required_error: "El nombre es obligatorio",
        invalid_type_error: "El nombre debe ser una cadena de texto",
    })
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(100, "El nombre no puede exceder los 100 caracteres"),

    email: z.string({
        required_error: "El correo electrónico es obligatorio",
        invalid_type_error: "El correo electrónico debe ser una cadena de texto",
    })
        .email("El correo electrónico no es válido"),

    document: z.string({
        required_error: "El documento es obligatorio",
        invalid_type_error: "El documento debe ser una cadena de texto",
    })
        .min(5, "El documento debe tener al menos 5 dígitos")
        .max(20, "El documento no puede exceder los 20 dígitos")
        .regex(/^[1-9][0-9]*$/, "El documento solo debe contener números y no puede iniciar en 0"),

    role: z.enum(["admin", "user"], {
        invalid_type_error: "El rol es inválido",
    }).optional(),
});

// Se usa en patch y put, permitiendo realizar los cambios que se quieran hacer
// al menos uno debe ser enviado
export const userPartialSchema = userSchema
    .partial()
    .refine(
        (data) => Object.keys(data).length > 0,
        { message: "Debe enviar al menos un campo para actualizar" }
    );
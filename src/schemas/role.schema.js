import { z } from 'zod';

/**
 * @constant {z.ZodObject} idParamSchema
 * @description Valida que el parámetro de ID en la URL sea una cadena numérica y lo transforma a número.
 */
export const idParamSchema = z.object({
    id: z.string().regex(/^\d+$/, "El ID debe ser un valor numérico").transform(Number)
});


/**
 * @constant {z.ZodObject} roleSchema
 * @description Esquema para validar campos relacionados a un rol.
 */
export const roleSchema = z.object({
    name: z.string({
        required_error: "El nombre del rol es obligatorio",
        invalid_type_error: "El nombre debe ser una cadena de texto"
    }).min(3, "El nombre debe tener al menos 3 caracteres").max(50),
    description: z.string({
        required_error: "La descripción del rol es obligatoria",
        invalid_type_error: "La descripción debe ser una cadena de texto"
    }).min(1, "La descripción no puede estar vacía").max(255, "La descripción no puede exceder los 255 caracteres")
}).strict();


/**
 * @constant {z.ZodObject} patchRoleSchema
 * @description Esquema derivado para actualización parcial (PATCH). 
 * Todos los campos son opcionales, pero si se envían se aplican las mismas reglas de validación del esquema base.
 * Además, exige que venga al menos un campo en el body.
 */
export const patchRoleSchema = roleSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    {
        message: "Debe enviar al menos un campo para actualizar"
    }
);


/**
 * @constant {z.ZodObject} assignPermissionsSchema
 * @description Valida que se reciba un arreglo de identificadores numéricos de permisos.
 */
export const assignPermissionsSchema = z.object({
    permissionIds: z.array(z.number().int().positive(), {
        required_error: "El arreglo de permisos es obligatorio"
    }).min(1, "Debe asignar al menos un permiso")
}).strict();


/**
 * @constant {z.ZodObject} assignRolesSchema
 * @description Valida el identificador del usuario y un arreglo de identificadores de roles.
 */
export const assignRolesSchema = z.object({
    userId: z.number({
        required_error: "El ID de usuario es obligatorio",
        invalid_type_error: "El ID de usuario debe ser un número"
    }).int().positive(),
    roleIds: z.array(z.number().int().positive(), {
        required_error: "El arreglo de roles es obligatorio"
    }).min(1, "Debe asignar al menos un rol")
}).strict();

/**
 * @constant {z.ZodObject} syncUserRolesSchema
 * @description Esquema para sincronizar los roles de un usuario.
 * Permite enviar un array vacío para limpiar todos los roles asignados.
 */
export const syncUserRolesSchema = z.object({
    userId: z.string({
        required_error: "El ID del usuario es obligatorio",
        invalid_type_error: "El ID del usuario debe ser una cadena de texto numérica"
    }).regex(/^\d+$/, "El ID del usuario debe ser un valor numérico").transform(Number),
    roleIds: z.array(
        z.string().regex(/^\d+$/, "Cada ID de rol debe ser un valor numérico").transform(Number),
        {
            invalid_type_error: "Los roles deben enviarse como un array de IDs numéricos"
        }
    ).default([])
}).strict();
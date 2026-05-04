import { z } from 'zod';

/**
 * @module auth.schema
 * @description Esquema de validación para los endpoints de autenticación utilizando Zod.
 * Este módulo garantiza que los datos de entrada cumplan con las reglas de negocio 
 * establecidas antes de llegar a los controladores.
 */

/**
 * @constant {z.ZodObject} registerSchema
 * @description Esquema estricto para validar el cuerpo de la petición en el registro de usuarios (POST /auth/register).
 * Rechaza objetos vacíos, campos adicionales no permitidos y valida tipos, formatos y longitudes.
 */
export const registerSchema = z.object({
  
  // Validación para el nombre completo del usuario
  name: z.string({
    required_error: "El nombre es obligatorio",
    invalid_type_error: "El nombre debe ser una cadena de texto"
  }).min(3, {
    message: "El nombre debe tener al menos 3 caracteres"
  }).max(100, {
    message: "El nombre no puede exceder los 100 caracteres"
  }),

  // Validación para el correo electrónico
  email: z.string({
    required_error: "El correo electrónico es obligatorio",
    invalid_type_error: "El correo electrónico debe ser una cadena de texto"
  }).email({
    message: "El correo electrónico no es válido"
  }),

  // Validación para el documento de identidad
  document: z.string({
    required_error: "El documento es obligatorio",
    invalid_type_error: "El documento debe ser una cadena de texto"
  }).regex(/^[1-9][0-9]*$/, {
    message: "El documento solo debe contener números y no puede iniciar en 0"
  }).min(5, {
    message: "El documento debe tener al menos 5 dígitos"
  }).max(20, {
    message: "El documento no puede exceder los 20 dígitos"
  }),

  // Validación para la contraseña
  password: z.string({
    required_error: "La contraseña es obligatoria",
    invalid_type_error: "La contraseña debe ser una cadena de texto"
  }).min(8, {
    message: "La contraseña debe tener al menos 8 caracteres"
  }).max(80, {
    message: "La contraseña no puede exceder los 80 caracteres"
  })

}).strict();

/**
 * @constant {z.ZodObject} loginSchema
 * @description Esquema estricto para validar el cuerpo de la petición en el inicio de sesión (POST /auth/login).
 * Rechaza objetos vacíos, campos adicionales no permitidos y asegura el formato correcto de las credenciales.
 */
export const loginSchema = z.object({
  
  // Validación para el documento de identidad en el login
  document: z.string({
    required_error: "El documento es obligatorio",
    invalid_type_error: "El documento debe ser una cadena de texto"
  }).regex(/^[1-9][0-9]*$/, {
    message: "El documento solo debe contener números y no puede iniciar en 0"
  }).min(5, {
    message: "El documento debe tener al menos 5 dígitos"
  }).max(20, {
    message: "El documento no puede exceder los 20 dígitos"
  }),

  // Validación para la contraseña en el login
  password: z.string({
    required_error: "La contraseña es obligatoria",
    invalid_type_error: "La contraseña debe ser una cadena de texto"
  }).min(8, {
    message: "La contraseña debe tener al menos 8 caracteres"
  }).max(80, {
    message: "La contraseña no puede exceder los 80 caracteres"
  })

}).strict();

/**
 * @constant {z.ZodObject} refreshTokenSchema
 * @description Esquema estricto para validar la renovación de tokens (POST /auth/refresh).
 * Garantiza que el refreshToken esté presente y no sea una cadena vacía.
 */
export const refreshTokenSchema = z.object({
  
  // Validación para el token de refresco
  refreshToken: z.string({
    required_error: "El token de refresco es obligatorio",
    invalid_type_error: "El token de refresco debe ser una cadena de texto"
  }).min(1, {
    message: "El token de refresco no puede estar vacío"
  })

}).strict();

/**
 * @constant {z.ZodObject} idParamSchema
 * @description Valida que el parámetro de ID en la URL sea una cadena numérica y lo transforma a número.
 */
export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, "El ID debe ser un valor numérico").transform(Number)
});

/**
 * @constant {z.ZodObject} createRoleSchema
 * @description Esquema para validar la creación de un rol con nombre obligatorio y descripción opcional.
 */
export const createRoleSchema = z.object({
  name: z.string({
    required_error: "El nombre del rol es obligatorio",
    invalid_type_error: "El nombre debe ser una cadena de texto"
  }).min(3, "El nombre debe tener al menos 3 caracteres").max(50),
  description: z.string().max(255, "La descripción no puede exceder los 255 caracteres").optional()
}).strict();

/**
 * @constant {z.ZodObject} updateRoleSchema
 * @description Esquema para la actualización completa de un rol (todos los campos requeridos).
 */
export const updateRoleSchema = z.object({
  name: z.string({
    required_error: "El nombre es requerido para la actualización completa",
  }).min(3).max(50),
  description: z.string().max(255)
}).strict();

/**
 * @constant {z.ZodObject} patchRoleSchema
 * @description Esquema para la actualización parcial de un rol. Valida que se envíe al menos un campo.
 */
export const patchRoleSchema = z.object({
  name: z.string().min(3).max(50).optional(),
  description: z.string().max(255).optional()
}).strict().refine(data => Object.keys(data).length > 0, {
  message: "Debe enviar al menos un campo para actualizar"
});

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
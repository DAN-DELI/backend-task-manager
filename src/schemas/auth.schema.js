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
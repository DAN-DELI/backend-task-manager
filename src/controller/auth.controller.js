import bcrypt from 'bcrypt';
import { UserModel } from '../models/user.model.js';
import { createError, successResponse } from '../utils/response.handler.js';
import { catchAsync } from '../utils/catchAsync.js';

/**
 * Registra un nuevo usuario en el sistema.
 * Valida duplicados por documento, cifra la contraseña y persiste el registro.
 * @route POST /api/auth/register
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} req.body - Cuerpo de la petición ya validado por el middleware.
 * @param {string} req.body.name - Nombre completo del usuario.
 * @param {string} req.body.email - Correo electrónico del usuario.
 * @param {string} req.body.document - Documento de identidad del usuario.
 * @param {string} req.body.password - Contraseña en texto plano.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para delegar errores al middleware global.
 * @returns {Promise} Responde con los datos públicos del usuario creado y status 201.
 */
export const register = catchAsync(async (req, res, next) => {
    // Paso 1: Extraer los datos del cuerpo (ya validados por el middleware)
    const { name, email, document, password } = req.body;

    // Paso 2: Verificar que el documento no esté registrado previamente
    const existingUser = await UserModel.findByDocument(document);

    if (existingUser) {
        return next(createError("El usuario ya se encuentra registrado", 400, [
            { field: "document", message: "Ya existe un usuario registrado con este documento" }
        ]));
    }

    // Paso 3: Cifrar la contraseña antes de persistirla
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Paso 4: Crear el registro en la base de datos con la contraseña cifrada
    const newUser = await UserModel.create({
        name,
        email,
        document,
        password: hashedPassword,
        role: "user",
    });

    // Paso 5: Separar la contraseña del resto de datos y responder solo con datos públicos
    const { password: _, ...publicUser } = newUser;

    return successResponse(res, 201, "Usuario registrado exitosamente", publicUser);
});
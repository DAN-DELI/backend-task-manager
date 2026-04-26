import bcrypt from 'bcrypt';
import { UserModel } from '../models/user.model.js';
import { createError, successResponse } from '../utils/response.handler.js';
import { catchAsync } from '../utils/catchAsync.js';

// REGISTER
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

// LOGIN

/**
 * Autentica a un usuario y genera un par de tokens JWT para el manejo de sesión.
 * Valida las credenciales, compara la contraseña y retorna un Access Token
 * de corta duración y un Refresh Token de larga duración.
 * @route POST /api/auth/login
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} req.body - Cuerpo de la petición ya validado por el middleware.
 * @param {string} req.body.document - Documento de identidad del usuario.
 * @param {string} req.body.password - Contraseña en texto plano.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para delegar errores al middleware global.
 * @returns {Promise} Responde con los tokens generados y los datos públicos del usuario con status 200.
 */
export const login = catchAsync(async (req, res, next) => {
    // Paso 1: Extraer las credenciales del cuerpo de la solicitud
    const { document, password } = req.body;

    // Paso 2: Verificar que el usuario exista en la base de datos
    const user = await UserModel.findByDocument(document);

    if (!user) {
        const error = createError("Credenciales inválidas", 401);
        return next(error);
    }

    // Paso 3: Comparar la contraseña recibida con el hash almacenado
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        const error = createError("Credenciales inválidas", 401);
        return next(error);
    }

    // Paso 4: Generar el par de tokens JWT
    const payload = { id: user.id, role: user.role };

    // Access Token: corta duración, para autenticar peticiones a rutas protegidas
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "15m",
    });

    // Refresh Token: larga duración, para renovar el Access Token sin re-login
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "7d",
    });

    // Paso 5: Persistir el Refresh Token en la base de datos para control de sesiones
    await UserModel.updateRefreshToken(user.id, refreshToken);

    // Paso 6: Limpiar campos sensibles y responder con los tokens y datos públicos
    const { password: _, refresh_token: __, ...publicUser } = user;

    return successResponse(res, 200, "Inicio de sesión exitoso", {
        accessToken,
        refreshToken,
        user: publicUser,
    });
});

// RENOVACION ACCESS TOKEN

/**
 * Renueva el Access Token de un usuario a partir de un Refresh Token válido.
 * Verifica la autenticidad del token, su vigencia y que coincida con el almacenado
 * en la base de datos. Retorna únicamente un nuevo Access Token de corta duración.
 * @route POST /api/auth/refresh
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} req.body - Cuerpo de la petición.
 * @param {string} req.body.refreshToken - Token de refresco de larga duración.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para delegar errores al middleware global.
 * @returns {Promise<void>} Responde con un nuevo accessToken y status 200.
 */
export const refreshToken = catchAsync(async (req, res, next) => {
    // Paso 1: Obtener el Refresh Token del cuerpo de la solicitud
    const { refreshToken } = req.body;

    // Paso 2: Verificar la autenticidad y vigencia del token con JWT
    let decoded;
    try {
        decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
        return next(createError("Sesión expirada", 401, [
            "El token de refresco es inválido o ha expirado. Por favor inicie sesión nuevamente."
        ]));
    }

    // Paso 3: Validar que el usuario exista y que el token coincida con el de la base de datos
    const user = await UserModel.findById(decoded.id);

    if (!user || user.refresh_token !== refreshToken) {
        return next(createError("Acceso denegado", 401, [
            "Token de refresco inválido o revocado"
        ]));
    }

    // Paso 4: Firmar un nuevo Access Token de corta duración
    const accessToken = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    );

    // Paso 5: Responder con el nuevo Access Token
    return successResponse(res, 200, "Token renovado exitosamente", { accessToken });
});
import rateLimit from 'express-rate-limit';
import { RATE_LIMIT } from '../config/rateLimits.config.js';

export const profileUpdateLimiter = rateLimit({
    windowMs: RATE_LIMIT.windowMs,
    max: RATE_LIMIT.max,
    message: { message: "Demasiados intentos, espera unos minutos" }
});
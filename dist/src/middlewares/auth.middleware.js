import { AuthService } from "../services/auth.js";
import { GeneralError } from "../utils/classError.js";
const authService = new AuthService();
export function requireAuth(req, res, next) {
    // 1. Extraer token de cookies (HTTP-Only) o header Authorization Bearer
    const cookieToken = req.cookies?.token;
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
    const token = cookieToken || bearerToken;
    if (!token) {
        return next(new GeneralError("No autorizado: Debes iniciar sesión", 401));
    }
    try {
        const decoded = authService.verifyToken(token);
        req.user = decoded;
        if (req.body && typeof req.body === "object" && !req.body.currentUser) {
            req.body.currentUser = decoded.id;
        }
        next();
    }
    catch (error) {
        next(error);
    }
}
export function optionalAuth(req, res, next) {
    const cookieToken = req.cookies?.token;
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
    const token = cookieToken || bearerToken;
    if (token) {
        try {
            const decoded = authService.verifyToken(token);
            req.user = decoded;
            if (req.body && typeof req.body === "object" && !req.body.currentUser) {
                req.body.currentUser = decoded.id;
            }
        }
        catch {
            // Ignorar si expiró o es inválido para rutas opcionales
        }
    }
    next();
}
//# sourceMappingURL=auth.middleware.js.map
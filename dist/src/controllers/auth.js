import { AuthService } from "../services/auth.js";
import { dryFn } from "../utils/dryFn.js";
import { UserService } from "../services/user.js";
const authService = new AuthService();
const userService = new UserService();
export class AuthController {
    login = dryFn(async (req, res) => {
        const identifier = req.body.username || req.body.email || req.body.identifier;
        const password = req.body.password;
        const { user, token } = await authService.login(identifier, password);
        const isHttps = req.secure ||
            req.headers["x-forwarded-proto"] === "https" ||
            process.env.COOKIE_SECURE === "true";
        const sameSite = process.env.COOKIE_SAMESITE || "lax";
        // Inyectar cookie HTTP-Only segura (adaptativa a HTTP en EC2 directo o HTTPS detrás de proxy/CloudFront)
        res.cookie("token", token, {
            httpOnly: true,
            secure: isHttps,
            sameSite,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
            path: "/",
        });
        res.status(200).json({
            success: true,
            message: "Login exitoso",
            data: user,
            token,
        });
    });
    me = dryFn(async (req, res) => {
        if (!req.user?.id) {
            return res.status(401).json({ success: false, message: "No autenticado" });
        }
        const fullUser = await userService.findOneById(req.user.id);
        res.status(200).json({
            success: true,
            data: {
                id: fullUser.id,
                username: fullUser.username,
                email: fullUser.email,
                phone: fullUser.phone,
            },
        });
    });
    logout = dryFn(async (req, res) => {
        const isHttps = req.secure ||
            req.headers["x-forwarded-proto"] === "https" ||
            process.env.COOKIE_SECURE === "true";
        const sameSite = process.env.COOKIE_SAMESITE || "lax";
        res.clearCookie("token", {
            httpOnly: true,
            secure: isHttps,
            sameSite,
            path: "/",
        });
        res.setHeader("Clear-Site-Data", '"cookies", "storage"');
        res.status(200).json({
            success: true,
            message: "Sesión cerrada correctamente",
        });
    });
}
//# sourceMappingURL=auth.js.map
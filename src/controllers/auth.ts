import { Response } from "express";
import { AuthService } from "../services/auth.js";
import { dryFn } from "../utils/dryFn.js";
import { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import { UserService } from "../services/user.js";

const authService = new AuthService();
const userService = new UserService();

export class AuthController {
  login = dryFn(async (req: AuthenticatedRequest, res: Response) => {
    const identifier = req.body.username || req.body.email || req.body.identifier;
    const password = req.body.password;

    const { user, token } = await authService.login(identifier, password);

    // Inyectar cookie HTTP-Only segura
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true en HTTPS de producción
      sameSite: "lax",
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

  me = dryFn(async (req: AuthenticatedRequest, res: Response) => {
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

  logout = dryFn(async (req: AuthenticatedRequest, res: Response) => {
    res.clearCookie("token", { path: "/" });
    res.status(200).json({
      success: true,
      message: "Sesión cerrada correctamente",
    });
  });
}

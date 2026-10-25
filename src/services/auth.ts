import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { myDataSource } from "../config/app-data-source.js";
import { User } from "../models/UserEntity.js";
import { GeneralError } from "../utils/classError.js";

const isProd = process.env.NODE_ENV === "production";
if (isProd && !process.env.JWT_SECRET) {
  throw new Error("FATAL: JWT_SECRET debe estar definido en las variables de entorno en producción.");
}
const JWT_SECRET = process.env.JWT_SECRET || "fing_secret_key_2026_super_secure";

export interface AuthUserResponse {
  id: number;
  username: string;
  email: string;
  phone?: string;
}

export class AuthService {
  async login(identifier: string, password: string): Promise<{ user: AuthUserResponse; token: string }> {
    if (!identifier || !password) {
      throw new GeneralError("Usuario/Email y contraseña son requeridos", 400);
    }

    // Buscar por username o email (incluyendo hashedPassword explícitamente porque tiene select: false)
    const userRepo = myDataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: [
        { username: identifier },
        { email: identifier }
      ],
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        hashedPassword: true,
      },
    });

    if (!user) {
      throw new GeneralError("Credenciales inválidas", 401);
    }

    // Validar contraseña estrictamente con bcrypt
    let isMatch = false;
    try {
      isMatch = await bcrypt.compare(password, user.hashedPassword);
    } catch {
      isMatch = false;
    }

    if (!isMatch) {
      throw new GeneralError("Credenciales inválidas", 401);
    }

    // Generar JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const userResponse: AuthUserResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone
    };

    return { user: userResponse, token };
  }

  verifyToken(token: string): { id: number; username: string; email: string } {
    try {
      return jwt.verify(token, JWT_SECRET) as { id: number; username: string; email: string };
    } catch {
      throw new GeneralError("Sesión inválida o expirada", 401);
    }
  }
}

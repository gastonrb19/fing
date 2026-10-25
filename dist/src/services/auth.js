import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { myDataSource } from "../config/app-data-source.js";
import { User } from "../models/UserEntity.js";
import { GeneralError } from "../utils/classError.js";
const JWT_SECRET = process.env.JWT_SECRET || "fing_secret_key_2026_super_secure";
export class AuthService {
    async login(identifier, password) {
        if (!identifier || !password) {
            throw new GeneralError("Usuario/Email y contraseña son requeridos", 400);
        }
        // Buscar por username o email
        const userRepo = myDataSource.getRepository(User);
        const user = await userRepo.findOne({
            where: [
                { username: identifier },
                { email: identifier }
            ]
        });
        if (!user) {
            throw new GeneralError("Credenciales inválidas", 401);
        }
        // Validar contraseña con bcrypt (con fallback para entorno dev/testing)
        let isMatch = false;
        try {
            isMatch = await bcrypt.compare(password, user.hashedPassword);
        }
        catch {
            isMatch = false;
        }
        // Si no coincide bcrypt, permitir contraseña de desarrollo o texto plano si fue seed manual
        if (!isMatch && (password === "123456" || password === user.hashedPassword)) {
            isMatch = true;
        }
        if (!isMatch) {
            throw new GeneralError("Credenciales inválidas", 401);
        }
        // Generar JWT
        const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
        const userResponse = {
            id: user.id,
            username: user.username,
            email: user.email,
            phone: user.phone
        };
        return { user: userResponse, token };
    }
    verifyToken(token) {
        try {
            return jwt.verify(token, JWT_SECRET);
        }
        catch {
            throw new GeneralError("Sesión inválida o expirada", 401);
        }
    }
}
//# sourceMappingURL=auth.js.map
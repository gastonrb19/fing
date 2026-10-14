import { Router } from "express";
import { AuthController } from "../controllers/auth.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();
const authController = new AuthController();

// Rutas absolutas cumpliendo la regla de arquitectura (Rule 6)
router.post("/auth/login", authController.login);
router.get("/auth/me", requireAuth, authController.me);
router.post("/auth/logout", authController.logout);

export default router;

import { Router } from "express";
import { UserController } from "../controllers/user.js";
import { UserService } from "../services/user.js";
import { validateBody } from "../middlewares/validation.js";
import { createUserSchema, updateUserSchema } from "../schemas/user.schema.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();
const userController = new UserController(new UserService());

router.route("/users")
    .get(requireAuth, userController.findAll)
    .post(requireAuth, validateBody(createUserSchema), userController.create);

router.route("/users/:id")
    .get(requireAuth, userController.findOne)
    .put(requireAuth, validateBody(updateUserSchema), userController.update);

export default router;

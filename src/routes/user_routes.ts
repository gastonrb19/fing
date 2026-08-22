import { Router } from "express";
import { UserController } from "../controllers/user.js";
import { UserService } from "../services/user.js";
import { validateBody } from "../middlewares/validation.js";
import { createUserSchema, updateUserSchema } from "../schemas/user.schema.js";

const router = Router();
const userController = new UserController(new UserService());

router.route("/users")
    .get(userController.findAll)
    .post(validateBody(createUserSchema), userController.create);

router.route("/users/:id")
    .get(userController.findOne)
    .put(validateBody(updateUserSchema), userController.update);

export default router;

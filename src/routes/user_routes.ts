import { Router } from "express";
import { UserController } from "../controllers/user.js";
import { UserService } from "../services/user.js";

const router = Router();
const userController = new UserController(new UserService());

router.route("/users").get(userController.findAll);
router.route("/users/:id").get(userController.findOne);

export default router;

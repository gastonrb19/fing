import { Router } from "express";
import { CategoryController } from "../controllers/category.js";
import { CategoryService } from "../services/category.js";
import { UserService } from "../services/user.js";

const router = Router();
const categoryController = new CategoryController(new CategoryService());

router.route("/categories")
    .get(categoryController.findAll)
    .post(categoryController.create);

router.route("/categories/:id")
    .get(categoryController.findOne)
    .put(categoryController.update)
    .delete(categoryController.delete);

export default router;

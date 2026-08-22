import { Router } from "express";
import { CategoryController } from "../controllers/category.js";
import { CategoryService } from "../services/category.js";
import { validateBody } from "../middlewares/validation.js";
import { createCategorySchema, updateCategorySchema } from "../schemas/category.schema.js";

const router = Router();
const categoryController = new CategoryController(new CategoryService());

router.route("/categories")
    .get(categoryController.findAll)
    .post(validateBody(createCategorySchema), categoryController.create);

router.route("/categories/:id")
    .get(categoryController.findOne)
    .put(validateBody(updateCategorySchema), categoryController.update)
    .delete(categoryController.delete);

export default router;

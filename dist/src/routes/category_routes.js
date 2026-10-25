import { Router } from "express";
import { CategoryController } from "../controllers/category.js";
import { CategoryService } from "../services/category.js";
import { validateBody } from "../middlewares/validation.js";
import { createCategorySchema, updateCategorySchema } from "../schemas/category.schema.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
const router = Router();
const categoryController = new CategoryController(new CategoryService());
router.route("/categories")
    .get(requireAuth, categoryController.findAll)
    .post(requireAuth, validateBody(createCategorySchema), categoryController.create);
router.route("/categories/:id")
    .get(requireAuth, categoryController.findOne)
    .put(requireAuth, validateBody(updateCategorySchema), categoryController.update)
    .delete(requireAuth, categoryController.delete);
export default router;
//# sourceMappingURL=category_routes.js.map
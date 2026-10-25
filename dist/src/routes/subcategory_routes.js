import { Router } from "express";
import { SubcategoryController } from "../controllers/subcategory.js";
import { SubcategoryService } from "../services/subcategory.js";
import { CategoryService } from "../services/category.js";
import { validateBody } from "../middlewares/validation.js";
import { createSubcategorySchema, updateSubcategorySchema } from "../schemas/subcategory.schema.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
const router = Router();
const subcategoryController = new SubcategoryController(new SubcategoryService(new CategoryService()));
router.route("/categories/:categoryId/subcategories")
    .get(requireAuth, subcategoryController.findByCategory);
router.route("/subcategories")
    .get(requireAuth, subcategoryController.findAll)
    .post(requireAuth, validateBody(createSubcategorySchema), subcategoryController.create);
router.route("/subcategories/:id")
    .get(requireAuth, subcategoryController.findOne)
    .put(requireAuth, validateBody(updateSubcategorySchema), subcategoryController.update)
    .delete(requireAuth, subcategoryController.delete);
export default router;
//# sourceMappingURL=subcategory_routes.js.map
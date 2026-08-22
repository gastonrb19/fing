import { Router } from "express";
import { SubcategoryController } from "../controllers/subcategory.js";
import { SubcategoryService } from "../services/subcategory.js";
import { CategoryService } from "../services/category.js";
import { validateBody } from "../middlewares/validation.js";
import { createSubcategorySchema, updateSubcategorySchema } from "../schemas/subcategory.schema.js";

const router = Router();
const subcategoryController = new SubcategoryController(new SubcategoryService(new CategoryService()));

router.route("/categories/:categoryId/subcategories")
    .get(subcategoryController.findByCategory);

router.route("/subcategories")
    .get(subcategoryController.findAll)
    .post(validateBody(createSubcategorySchema), subcategoryController.create);

router.route("/subcategories/:id")
    .get(subcategoryController.findOne)
    .put(validateBody(updateSubcategorySchema), subcategoryController.update)
    .delete(subcategoryController.delete);

export default router;

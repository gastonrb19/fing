import { Router } from "express";
import { SubcategoryController } from "../controllers/subcategory.js";
import { SubcategoryService } from "../services/subcategory.js";

const router = Router();
const subcategoryController = new SubcategoryController(new SubcategoryService());

router.route("/categories/:categoryId/subcategories")
    .get(subcategoryController.findByCategory);

router.route("/subcategories")
    .get(subcategoryController.findAll)
    .post(subcategoryController.create);

router.route("/subcategories/:id")
    .get(subcategoryController.findOne)
    .put(subcategoryController.update)
    .delete(subcategoryController.delete);

export default router;

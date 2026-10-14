import { Router } from "express";
import { SpendController } from "../controllers/spend.js";
import { SpendService } from "../services/spend.js";
import { UserService } from "../services/user.js";
import { SubcategoryService } from "../services/subcategory.js";
import { CategoryService } from "../services/category.js";
import { validateBody } from "../middlewares/validation.js";
import { createSpendSchema, updateSpendSchema } from "../schemas/spend.schema.js";

import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();
const spendController = new SpendController(new SpendService(new UserService(), new SubcategoryService(new CategoryService())));

// spends de un usuario, filtrados por subcategory (query param)
router.route("/users/:id_user/spends")
    .get(requireAuth, spendController.findByUserAndSubcategory);

router.route("/spends")
    .get(requireAuth, spendController.findAll)
    .post(requireAuth, validateBody(createSpendSchema), spendController.create);

router.route("/spends/:id")
    .get(requireAuth, spendController.findOne)
    .put(requireAuth, validateBody(updateSpendSchema), spendController.update)
    .delete(requireAuth, spendController.delete);

export default router;

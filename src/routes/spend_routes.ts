import { Router } from "express";
import { SpendController } from "../controllers/spend.js";
import { SpendService } from "../services/spend.js";
import { UserService } from "../services/user.js";
import { SubcategoryService } from "../services/subcategory.js";
import { CategoryService } from "../services/category.js";
import { validateBody } from "../middlewares/validation.js";
import { createSpendSchema, updateSpendSchema } from "../schemas/spend.schema.js";

const router = Router();
const spendController = new SpendController(new SpendService(new UserService(), new SubcategoryService(new CategoryService())));

// spends de un usuario, filtrados por subcategory (query param)
router.route("/users/:id_user/spends")
    .get(spendController.findByUserAndSubcategory);

router.route("/spends")
    .get(spendController.findAll)
    .post(validateBody(createSpendSchema), spendController.create);

router.route("/spends/:id")
    .get(spendController.findOne)
    .put(validateBody(updateSpendSchema), spendController.update)
    .delete(spendController.delete);

export default router;

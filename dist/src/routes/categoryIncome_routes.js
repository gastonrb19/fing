import { Router } from "express";
import { CategoryIncomeController } from "../controllers/categoryIncome.js";
import { CategoryIncomeService } from "../services/categoryIncome.js";
import { validateBody } from "../middlewares/validation.js";
import { createCategoryIncomeSchema, updateCategoryIncomeSchema, } from "../schemas/categoryIncome.schema.js";
const router = Router();
const categoryIncomeController = new CategoryIncomeController(new CategoryIncomeService());
router
    .route("/category-incomes")
    .get(categoryIncomeController.findAll)
    .post(validateBody(createCategoryIncomeSchema), categoryIncomeController.create);
router
    .route("/category-incomes/:id")
    .get(categoryIncomeController.findOne)
    .put(validateBody(updateCategoryIncomeSchema), categoryIncomeController.update)
    .delete(categoryIncomeController.delete);
export default router;
//# sourceMappingURL=categoryIncome_routes.js.map
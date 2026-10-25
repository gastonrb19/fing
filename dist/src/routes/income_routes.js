import { Router } from "express";
import { IncomeController } from "../controllers/income.js";
import { IncomeService } from "../services/income.js";
import { UserService } from "../services/user.js";
import { CategoryIncomeService } from "../services/categoryIncome.js";
import { validateBody } from "../middlewares/validation.js";
import { createIncomeSchema, updateIncomeSchema, } from "../schemas/income.schema.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
const router = Router();
const incomeController = new IncomeController(new IncomeService(new UserService(), new CategoryIncomeService()));
router
    .route("/users/:id_user/incomes")
    .get(requireAuth, incomeController.findByUser);
router
    .route("/incomes")
    .get(requireAuth, incomeController.findAll)
    .post(requireAuth, validateBody(createIncomeSchema), incomeController.create);
router
    .route("/incomes/:id")
    .get(requireAuth, incomeController.findOne)
    .put(requireAuth, validateBody(updateIncomeSchema), incomeController.update)
    .delete(requireAuth, incomeController.delete);
export default router;
//# sourceMappingURL=income_routes.js.map
import { Router } from "express";
import { CategoryIncomeController } from "../controllers/categoryIncome.js";
import { CategoryIncomeService } from "../services/categoryIncome.js";
import { validateBody } from "../middlewares/validation.js";
import {
    createCategoryIncomeSchema,
    updateCategoryIncomeSchema,
} from "../schemas/categoryIncome.schema.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();
const categoryIncomeController = new CategoryIncomeController(
    new CategoryIncomeService()
);

router
    .route("/category-incomes")
    .get(requireAuth, categoryIncomeController.findAll)
    .post(
        requireAuth,
        validateBody(createCategoryIncomeSchema),
        categoryIncomeController.create
    );

router
    .route("/category-incomes/:id")
    .get(requireAuth, categoryIncomeController.findOne)
    .put(
        requireAuth,
        validateBody(updateCategoryIncomeSchema),
        categoryIncomeController.update
    )
    .delete(requireAuth, categoryIncomeController.delete);

export default router;

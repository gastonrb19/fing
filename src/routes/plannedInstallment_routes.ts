import { Router } from "express";
import { PlannedInstallmentController } from "../controllers/plannedInstallment.js";
import { PlannedInstallmentService } from "../services/plannedInstallment.js";
import { validateBody } from "../middlewares/validation.js";
import { createPlannedInstallmentSchema, updatePlannedInstallmentSchema } from "../schemas/plannedInstallment.schema.js";

const router = Router();
const controller = new PlannedInstallmentController(new PlannedInstallmentService());

router.route("/plannedinstallments")
    .get(controller.findAll)
    .post(validateBody(createPlannedInstallmentSchema), controller.create);

router.route("/plannedinstallments/:idPI")
    .get(controller.findOne)
    .put(validateBody(updatePlannedInstallmentSchema), controller.update)
    .delete(controller.delete);

router.route("/spends/:spendId/plannedinstallments")
    .get(controller.findBySpend);

export default router;

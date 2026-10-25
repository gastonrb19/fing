import { Router } from "express";
import { PlannedInstallmentController } from "../controllers/plannedInstallment.js";
import { PlannedInstallmentService } from "../services/plannedInstallment.js";
import { validateBody } from "../middlewares/validation.js";
import { createPlannedInstallmentSchema, updatePlannedInstallmentSchema } from "../schemas/plannedInstallment.schema.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();
const controller = new PlannedInstallmentController(new PlannedInstallmentService());

router.route("/plannedinstallments")
    .get(requireAuth, controller.findAll)
    .post(requireAuth, validateBody(createPlannedInstallmentSchema), controller.create);

router.route("/plannedinstallments/:idPI")
    .get(requireAuth, controller.findOne)
    .put(requireAuth, validateBody(updatePlannedInstallmentSchema), controller.update)
    .delete(requireAuth, controller.delete);

router.route("/spends/:spendId/plannedinstallments")
    .get(requireAuth, controller.findBySpend);

export default router;

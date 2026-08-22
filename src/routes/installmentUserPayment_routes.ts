import { Router } from "express";
import { InstallmentUserPaymentController } from "../controllers/installmentUserPayment.js";
import { InstallmentUserPaymentService } from "../services/installmentUserPayment.js";
import { validateBody } from "../middlewares/validation.js";
import { createInstallmentUserPaymentSchema, updateInstallmentUserPaymentSchema } from "../schemas/installmentUserPayment.schema.js";

const router = Router();
const controller = new InstallmentUserPaymentController(new InstallmentUserPaymentService());

router.route("/installmentuserpayments")
    .get(controller.findAll)
    .post(validateBody(createInstallmentUserPaymentSchema), controller.create);

router.route("/installmentuserpayments/:idPayment")
    .get(controller.findOne)
    .put(validateBody(updateInstallmentUserPaymentSchema), controller.update)
    .delete(controller.delete);

router.route("/users/:userId/installmentuserpayments")
    .get(controller.findByUser);

export default router;

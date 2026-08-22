import { Router } from "express";
import { TypeSpendController } from "../controllers/typeSpend.js";
import { TypeSpendService } from "../services/typeSpend.js";
import { validateBody } from "../middlewares/validation.js";
import { createTypeSpendSchema, updateTypeSpendSchema } from "../schemas/typeSpend.schema.js";

const router = Router();
const controller = new TypeSpendController(new TypeSpendService());

router.route("/typespends")
    .get(controller.findAll)
    .post(validateBody(createTypeSpendSchema), controller.create);

router.route("/typespends/:id")
    .get(controller.findOne)
    .put(validateBody(updateTypeSpendSchema), controller.update)
    .delete(controller.delete);

export default router;

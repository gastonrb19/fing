import { Router } from "express";
import { TypeSpendController } from "../controllers/typeSpend.js";
import { TypeSpendService } from "../services/typeSpend.js";
import { validateBody } from "../middlewares/validation.js";
import { createTypeSpendSchema, updateTypeSpendSchema } from "../schemas/typeSpend.schema.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();
const controller = new TypeSpendController(new TypeSpendService());

router.route("/typespends")
    .get(requireAuth, controller.findAll)
    .post(requireAuth, validateBody(createTypeSpendSchema), controller.create);

router.route("/typespends/:id")
    .get(requireAuth, controller.findOne)
    .put(requireAuth, validateBody(updateTypeSpendSchema), controller.update)
    .delete(requireAuth, controller.delete);

export default router;

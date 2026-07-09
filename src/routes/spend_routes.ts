import { Router } from "express";
import { SpendController } from "../controllers/spend.js";
import { SpendService } from "../services/spend.js";
import { UserService } from "../services/user.js";
import { SubcategoryService } from "../services/subcategory.js";

const router = Router();
const spendController = new SpendController(new SpendService(new UserService(), new SubcategoryService()));

// spends de un usuario, filtrados por subcategory (query param)
router.route("/users/:id_user/spends")
    .get(spendController.findByUserAndSubcategory);

router.route("/spends")
    .get(spendController.findAll)
    .post(spendController.create);

router.route("/spends/:id")
    .get(spendController.findOne)
    .put(spendController.update)
    .delete(spendController.delete);

export default router;

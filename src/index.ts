import { Router } from "express";
import userRoutes from "./routes/user_routes.js";
import categoryRoutes from "./routes/category_routes.js";
import subcategoryRoutes from "./routes/subcategory_routes.js";
import spendRoutes from "./routes/spend_routes.js";
import typeSpendRoutes from "./routes/typeSpend_routes.js";
import plannedInstallmentRoutes from "./routes/plannedInstallment_routes.js";
import installmentUserPaymentRoutes from "./routes/installmentUserPayment_routes.js";
import friendRequestRoutes from "./routes/friendRequest_routes.js";
import friendshipRoutes from "./routes/friendship_routes.js";
import authRoutes from "./routes/auth_routes.js";
import categoryIncomeRoutes from "./routes/categoryIncome_routes.js";
import incomeRoutes from "./routes/income_routes.js";

const routes = Router();

routes.use(authRoutes);
routes.use(userRoutes);
routes.use(categoryRoutes);
routes.use(subcategoryRoutes);
routes.use(spendRoutes);
routes.use(typeSpendRoutes);
routes.use(plannedInstallmentRoutes);
routes.use(installmentUserPaymentRoutes);
routes.use(friendRequestRoutes);
routes.use(friendshipRoutes);
routes.use(categoryIncomeRoutes);
routes.use(incomeRoutes);

export default routes;

import { Router } from "express";
import userRoutes from "./routes/user_routes.js";
import categoryRoutes from "./routes/category_routes.js";
import subcategoryRoutes from "./routes/subcategory_routes.js";
import spendRoutes from "./routes/spend_routes.js";

const routes = Router();

routes.use(userRoutes);
routes.use(categoryRoutes);
routes.use(subcategoryRoutes);
routes.use(spendRoutes);

export default routes;

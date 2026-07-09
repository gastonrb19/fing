import { Router } from "express";
import userRoutes from "./routes/user_routes.js";
import categoryRoutes from "./routes/category_routes.js";

const routes = Router();

routes.use(userRoutes);
routes.use(categoryRoutes);

export default routes;

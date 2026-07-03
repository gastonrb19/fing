import { Router } from "express";
import userRoutes from "./routes/user_routes.js";

const routes = Router();

routes.use(userRoutes);

export default routes;

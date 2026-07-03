import "reflect-metadata";
import express from "express";
import routes from "./index.js";
import { logError, handleError } from "./middlewares/errorHandler.js";
import { testConnection } from "./config/connection.js";

const app = express();
const PORT = Number(process.env.PORT) || 8080;

app.use(express.json());
app.use(routes);

// Manejo de errores (siempre despues de las rutas)
app.use(logError);
app.use(handleError);

testConnection();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

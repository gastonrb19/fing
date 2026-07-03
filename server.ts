import express from 'express';
import routes from './src/index.js';
import { logError, handleError } from './src/middlewares/errorHandler.js';
import { testConnection } from './src/config/connection.js';

const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(routes);

// Manejo de errores (siempre despues de las rutas)
app.use(logError);
app.use(handleError);

await testConnection();

app.listen(PORT, () => console.log(`running on port:${PORT}`));

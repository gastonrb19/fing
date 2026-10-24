if (typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile();
  } catch {
    // Ignore if .env is missing
  }
}

import express from 'express';
import cors from 'cors';
import routes from './src/index.js';
import { logError, handleError } from './src/middlewares/errorHandler.js';
import { testConnection } from './src/config/connection.js';

import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { join } from 'path';

//Swagger Documentation
const openapiSpec = JSON.parse(
  readFileSync(join(process.cwd(), './src/config/openapi.json'), 'utf8')
);

const app = express();

const PORT = process.env.PORT || 8000;

// Configuración de CORS para permitir cookies y credenciales desde el Frontend
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));
app.use(routes);

// Manejo de errores (siempre despues de las rutas)
app.use(logError);
app.use(handleError);

await testConnection();

app.listen(PORT, () => console.log(`running on port:${PORT}`));

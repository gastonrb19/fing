import express from 'express';
import routes from './src/index.js';
import { logError, handleError } from './src/middlewares/errorHandler.js';
import { testConnection } from './src/config/connection.js';

import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { join } from 'path';

const openapiSpec = JSON.parse(
  readFileSync(join(process.cwd(), './src/config/openapi.json'), 'utf8')
);

const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));
app.use(routes);

// Manejo de errores (siempre despues de las rutas)
app.use(logError);
app.use(handleError);

await testConnection();

app.listen(PORT, () => console.log(`running on port:${PORT}`));

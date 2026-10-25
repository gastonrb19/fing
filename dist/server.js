if (typeof process.loadEnvFile === 'function') {
    try {
        process.loadEnvFile();
    }
    catch {
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
const openapiSpec = JSON.parse(readFileSync(join(process.cwd(), './src/config/openapi.json'), 'utf8'));
const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 8000;
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
// Cabeceras base de endurecimiento HTTP
app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), geolocation=(), microphone=(), focus-without-user-activation=()');
    next();
});
// Configuración de CORS dinámica para permitir cookies y credenciales desde orígenes autorizados
app.use(cors({
    origin: (origin, callback) => {
        // Permitir peticiones same-origin / server-to-server (ej. proxy Nginx o healthchecks sin header Origin)
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Origen no permitido por CORS'));
    },
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json({ limit: '256kb' }));
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
});
if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_SWAGGER === 'true') {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));
}
app.use(routes);
// Manejo de errores (siempre despues de las rutas)
app.use(logError);
app.use(handleError);
await testConnection();
app.listen(PORT, () => console.log(`running on port:${PORT}`));
//# sourceMappingURL=server.js.map
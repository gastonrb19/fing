# 📌 Tareas Backend (TODO)

### 🌱 Datos Iniciales y Seeding (Supabase)
  - Tipos de gasto (`TYPESPEND`): Fijo, Variable, Cuotas / Ingreso, Gasto.
  - Categorías y Subcategorías base (`CATEGORY` y `SUBCATEGORY`): Alimentación (Supermercado, Salidas), Vivienda (Alquiler, Cuentas/Servicios), Transporte (Combustible, Transporte público), Salud, Ocio.
  - Usuario inicial administrador/personal y amigos de prueba (`USERS` y `FRIENDSHIP`) para pruebas de gastos compartidos con contraseñas hasheadas en `bcrypt`.

### ☁️ Despliegue Económico en AWS (AWS App Runner & Supabase PostgreSQL)
- [ ] **Dockerfile Multi-Stage para Producción:** Crear `Dockerfile` optimizado (Node.js Alpine/Slim) multi-stage (`builder` + `runner`), excluyendo devDependencies, configurando usuario `node` no-root y puerto configurable por variable `PORT` (por defecto 8000).
- [ ] **Endpoint de Health Check (`GET /health`):** Crear endpoint de salud ligero para la verificación automática nativa de AWS App Runner, validando estado del proceso y conectividad activa con PostgreSQL (`myDataSource.isInitialized`).
  - Crear proyecto en Supabase (Tier Gratuito) y obtener credenciales de conexión (`Transaction Pooler` puerto 6543 o conexión directa 5432).
  - Parametrizar `app-data-source.ts` con variables de entorno (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`).
  - Habilitar soporte SSL obligatorio para Supabase (`ssl: { rejectUnauthorized: false }`).
  - Desactivar `synchronize: true` en producción (`NODE_ENV === 'production'`) para prevenir alteraciones destructivas del esquema.
- [ ] **Configuración del Servicio en AWS App Runner (Cero Costo de ALB):**
  - Configurar servicio en AWS App Runner conectado al repositorio GitHub o imagen en Amazon ECR.
  - Asignar capacidad mínima para ahorro de costos (0.25 vCPU y 0.5 GB RAM).
  - Obtener URL pública con HTTPS y certificado SSL automático gestionado por AWS (ej. `https://xxxx.us-east-1.awsapprunner.com`) **sin pagar Application Load Balancer**.
  - Inyectar variables de entorno seguras (`DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`, `JWT_SECRET`, `NODE_ENV=production`, `PORT=8000`, `CORS_ORIGIN`).
- [ ] **Estrategia CORS y Cookies de Sesión en Producción:**
  - Configurar `cors` en `server.ts` con `origin: process.env.CORS_ORIGIN` y `credentials: true`.
  - Asegurar flags de cookies HTTP-Only de sesión (`secure: true`, `sameSite: 'none'`).

### 📦 DevOps Local
- [ ] Levantar base de datos Dockerizada (docker-compose) para correr y validar localmente el entorno SQL con las migraciones actualizadas.

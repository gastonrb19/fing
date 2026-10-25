# 📌 Tareas Backend (TODO)

### ☁️ Despliegue en AWS EC2 (Docker Compose + Elastic IP + Supabase)
- [ ] **Subir Cambios de Producción a GitHub (`fing` y `FingApp`):** Hacer commit y push del hardening de seguridad, módulo de Ingresos, `Dockerfile` y `docker-compose.prod.yml` antes de clonar en la instancia EC2.
- [ ] **Aprovisionar Instancia AWS EC2 + Elastic IP (Free Tier):** Lanzar instancia Ubuntu 24.04 (`t3.micro`/`t2.micro` en `us-east-1`), asociar 1 Elastic IP gratuita (cubierta por las 750 h/mes con la instancia encendida), configurar 1.5 GB de Swap e instalar Docker abriendo solo puertos `22` (Mi IP) y `80` (`0.0.0.0/0`).
- [ ] **Configurar `.env.prod` con Session Pooler IPv4 de Supabase:** Crear `FingApp/.env.prod` en la EC2 apuntando a `aws-0-us-east-1.pooler.supabase.com:5432` (`postgres.<ref>`, `DB_SSL=true`), generar `JWT_SECRET` fuerte (`openssl rand -hex 32`) y definir `CORS_ORIGIN` con la Elastic IP.
- [ ] **Levantar Contenedor Backend y Validar Salud (`GET /api/health`):** Ejecutar `docker compose -f docker-compose.prod.yml up -d --build` en la EC2 y verificar respuesta `200 OK` junto con conectividad activa hacia Supabase.

### 🌱 Cuentas Reales y Datos Iniciales (Supabase)
- [ ] **Verificar las 2 Cuentas de Usuario Reales y Amistad:** Confirmar en Supabase las cuentas definitivas de ambos usuarios con contraseñas hasheadas en `bcrypt` y su vínculo activo en `FRIENDSHIP` (ya que `POST /users` quedó cerrado con `requireAuth`).
- [ ] **Verificar Catálogos Base en Producción:** Confirmar las categorías iniciales de gastos (`CATEGORY`, `SUBCATEGORY`) e ingresos (`CATEGORY_INCOME`) para empezar a registrar movimientos reales.

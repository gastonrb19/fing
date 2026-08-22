# 📌 Tareas Backend (TODO)

### 🧪 Prueba

### 🏗️ Arquitectura Base

### 👥 Módulo: Usuarios (User)

### 🏷️ Módulo: Categorías (Category)

### 💸 Módulo: Gastos (Gasto/Spending)

### 💳 Módulo: Deudas (Debt)

# 📌 Tareas Proyecto (Pendientes para la próxima sesión)

### 🖥️ Módulo Frontend: Integración
- [ ] Actualizar interfaces TypeScript en fing-frontend (renombrar `totalAmount` a `amount` y adaptar DTOs).
- [ ] Consumir APIs dinámicas de Categories, Subcategories y TypeSpends desde el `FormTransaction.tsx`.
- [ ] Renderizar los errores de validación estructurados (Zod) provenientes del backend directo en los inputs.

### 👤 Módulo Frontend: Pagos de Usuario
- [ ] Implementar vista de Cuotas y Cobros Pendientes del Usuario (`GET /users/:userId/installmentuserpayments`).
- [ ] Habilitar el botón y acción visual de "Pagar Cuota" conectándolo al Endpoint (`PUT /installmentuserpayments/:id`).

### 📦 DevOps y Cierre
- [ ] Levantar base de datos Dockerizada para correr y validar el entorno SQL con las migraciones actualizadas.

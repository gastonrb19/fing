# 📌 Tareas Backend (TODO)

### 🏗️ Arquitectura Base
- [ ] Crear clase `BaseController` y `BaseService` para estandarizar respuestas y manejo de errores.

### 👥 Módulo: Usuarios (User)
- [ ] Implementar `UserService`, `UserController` y rutas básicas (CRUD).

### 🏷️ Módulo: Categorías (Category)
- [ ] Implementar `CategoryService`, `CategoryController` y rutas (CRUD).

### 💸 Módulo: Gastos (Gasto/Spending)
- [ ] Implementar `GastoService` y `GastoController`.
- [ ] Crear rutas de Gastos (`POST`, `GET`, `PUT`, `DELETE`).

### 💳 Módulo: Deudas (Debt)
- [ ] Implementar `DebtService`, `DebtController` y rutas (CRUD).
- [ ] **Lógica de Negocio (Trigger):** Implementar lógica en `GastoService` que detecte categoría 'Deuda' y cree automáticamente el registro correspondiente en la tabla/entidad `Debt`.

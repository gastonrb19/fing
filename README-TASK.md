# 📌 Tareas Backend (TODO)

### 📦 DevOps y Cierre
- [ ] Levantar base de datos Dockerizada para correr y validar el entorno SQL con las migraciones actualizadas.

### 🔐 Seguridad y Autenticación
- [ ] Refactorizar Auth: Implementar Middleware JWT para extraer el ID del usuario (`req.user.id`) de los headers de autorización, en lugar de recibir `currentUser` directamente en el payload (body) de las peticiones (Ej. FriendRequests y Spends).

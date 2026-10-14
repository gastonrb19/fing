# 📘 Documentación Técnica de la API Backend - Fing

Bienvenido a la documentación oficial de la API REST de **Fing**, el sistema integral de finanzas personales, gestión de gastos maestros, división equitativa en cuotas y auditoría de deudas entre amigos.

La API también se encuentra disponible de forma interactiva en la interfaz Swagger UI en:  
📍 **`http://localhost:8000/api-docs`**

---

## 🔐 1. Seguridad, Sesión y Autenticación

El sistema implementa autenticación basada en **JWT (JSON Web Tokens)** con soporte dual para:

1. **Cookie HTTP-Only (`token`):** Emitida automáticamente en el `Set-Cookie` al hacer login exitoso. Posee los flags `HttpOnly: true`, `SameSite: "lax"` y expiración de 7 días. Los navegadores la envían automáticamente en cada petición si se incluye `credentials: "include"`.
2. **Cabecera de Autorización (`Bearer`):** Se acepta también el envío explícito del token en `Authorization: Bearer <token>`.

### Respuestas de Error de Seguridad
- **`401 Unauthorized`:** Token inexistente, inválido o expirado:
  ```json
  {
    "error": {
      "code": 401,
      "message": "No autorizado: Debes iniciar sesión"
    }
  }
  ```
- **`403 Forbidden`:** El usuario autenticado no posee permisos para modificar el recurso (ej. rechazar la cuota de otra persona).

---

## 📑 2. Índice de Módulos

1. [Módulo de Autenticación](#-módulo-de-autenticación)
2. [Módulo de Gastos Maestros (Spends)](#-módulo-de-gastos-maestros-spends)
3. [Módulo de Cuotas y Pagos (InstallmentUserPayments)](#-módulo-de-cuotas-y-pagos-installmentuserpayments)
4. [Módulo de Amistades y Solicitudes](#-módulo-de-amistades-y-solicitudes)
5. [Módulo de Usuarios](#-módulo-de-usuarios)
6. [Módulo de Categorías, Subcategorías y Tipos de Gasto](#-módulo-de-categorías-subcategorías-y-tipos-de-gasto)

---

## 🔑 Módulo de Autenticación

### `POST /auth/login`
- **Nivel de acceso:** 🌐 Público
- **Descripción:** Valida credenciales contra la BD. Si son correctas, genera un JWT, retorna los datos del usuario y emite la cookie HTTP-Only `token`. Para pruebas y desarrollo local se permite la contraseña comodín `123456`.
- **Headers:** `Content-Type: application/json`
- **Body Esperado:**
  ```json
  {
    "identifier": "gaston", // O "gaston.nuevo@test.com"
    "password": "123456"
  }
  ```
- **Respuestas:**
  - `200 OK`:
    ```json
    {
      "success": true,
      "message": "Login exitoso",
      "data": {
        "id": 1,
        "username": "gaston",
        "email": "gaston.nuevo@test.com",
        "phone": "+56912345678"
      },
      "token": "eyJhbGciOiJIUzI1NiIsIn..."
    }
    ```
  - `400 Bad Request`: `{"error": {"code": 400, "message": "Usuario/Email y contraseña son requeridos"}}`
  - `401 Unauthorized`: `{"error": {"code": 401, "message": "Credenciales inválidas"}}`

---

### `GET /auth/me`
- **Nivel de acceso:** 🔒 Protegido (Requiere Cookie `token` o `Bearer`)
- **Descripción:** Retorna la información del usuario autenticado en la sesión actual.
- **Respuestas:**
  - `200 OK`:
    ```json
    {
      "success": true,
      "data": {
        "id": 1,
        "username": "gaston",
        "email": "gaston.nuevo@test.com",
        "phone": "+56912345678"
      }
    }
    ```
  - `401 Unauthorized`

---

### `POST /auth/logout`
- **Nivel de acceso:** 🔒 Protegido
- **Descripción:** Destruye la sesión activa limpiando la cookie HTTP-Only `token`.
- **Respuestas:**
  - `200 OK`:
    ```json
    {
      "success": true,
      "message": "Sesión cerrada correctamente"
    }
    ```

---

## 💳 Módulo de Gastos Maestros (Spends)

Un Gasto Maestro representa el gasto total (ej. una cena de $60.000). Al crearse, el sistema construye de forma automática la matriz de cuotas temporales (`PLANNEDINSTALLMENT`) y los pagos asignados a cada amigo (`INSTALLMENTUSERPAYMENT`).

---

### `POST /spends`
- **Nivel de acceso:** 🔒 Protegido
- **Descripción:** Registra un nuevo gasto maestro y divide el pago entre los participantes según sus porcentajes asignados.
- **Validación Estricta:** La sumatoria de los porcentajes dentro del arreglo `participants` debe ser exactamente **100%**.
- **Body Esperado:**
  ```json
  {
    "name": "Pizza con Gastón",
    "amount": 20000,
    "userId": 1,
    "subcategoryId": 1,
    "minDayToPayment": 15,
    "maxDayToPayment": 20,
    "totalInstallment": 2,
    "startPayment": "2026-10-15",
    "fkTypeSpend": 1,
    "participants": [
      { "userId": 1, "percentage": 50 },
      { "userId": 2, "percentage": 50 }
    ]
  }
  ```
- **Campos del Body:**
  - `name` (*string, obligatorio*): Concepto del gasto.
  - `amount` (*number positivo, obligatorio*): Monto total.
  - `userId` (*number, obligatorio*): Creador del gasto.
  - `subcategoryId` (*number, obligatorio*): Subcategoría asociada.
  - `minDayToPayment` (*number 1-31, obligatorio*): Día límite sugerido de pago.
  - `maxDayToPayment` (*number 1-31, opcional*): Día máximo límite de pago.
  - `totalInstallment` (*number, opcional, default 1*): Número de cuotas.
  - `startPayment` (*string ISO o YYYY-MM-DD, opcional*): Fecha de inicio.
  - `participants` (*array de objetos, obligatorio para división*): Cada elemento `{ userId, percentage }`.
- **Respuestas:**
  - `201 Created`: Gasto y cuotas generados exitosamente.
  - `400 Bad Request`: Si la suma de porcentajes difiere de 100.
  - `401 Unauthorized`

---

### `GET /spends/:id`
- **Nivel de acceso:** 🔒 Protegido
- **Descripción:** Obtiene el detalle completo del gasto maestro, incluyendo sus cuotas planificadas y los pagos individuales de cada usuario participante.
- **Parámetros de Ruta:** `id` (ID numérico del gasto maestro).
- **Respuestas:** `200 OK`, `404 Not Found`.

---

### `GET /users/:id_user/spends`
- **Nivel de acceso:** 🔒 Protegido
- **Descripción:** Retorna los gastos asociados a un usuario con soporte para filtros de búsqueda.
- **Query Params Opcionales:**
  - `limit`: Cantidad de resultados por página (default 10).
  - `offset`: Desplazamiento de paginación (default 0).
  - `category`: Filtrar por ID de Categoría.
  - `subcategory`: Filtrar por ID de Subcategoría.
  - `from`: Fecha inicio (`YYYY-MM-DD`).
  - `until`: Fecha término (`YYYY-MM-DD`).
  - `done`: `true` (solo pagados) o `false` (pendientes).
  - `role`: `owner` (creados por mí), `guest` (asociados por otros), `all` (todos).
- **Respuestas:** `200 OK`.

---

### `PUT /spends/:id`
- **Nivel de acceso:** 🔒 Protegido
- **Descripción:** Edita el gasto maestro. Si se altera el monto o el número de cuotas, el sistema reconstruye la matriz completa.
- **Regla Inmutable:** Si cualquiera de los participantes ya pagó al menos 1 cuota, el gasto no puede modificarse.
- **Body Esperado:**
  ```json
  {
    "spend": {
      "name": "Pizza Familiar",
      "amount": 25000,
      "minDayToPayment": 16
    }
  }
  ```

---

### `DELETE /spends/:id`
- **Nivel de acceso:** 🔒 Protegido
- **Descripción:** Elimina el gasto maestro y todas sus cuotas asociadas en cascada.

---

## 💰 Módulo de Cuotas y Pagos (InstallmentUserPayments)

Control atómico de cada pago asignado a un usuario en una cuota determinada.

---

### `GET /installmentuserpayments/rejected`
- **Nivel de acceso:** 🔒 Protegido
- **Descripción:** Bandeja de auditoría de cuotas rechazadas.
- **Query Params Opcionales:**
  - `asCreator=true`: Filtra automáticamente las cuotas rechazadas que pertenecen a gastos del usuario autenticado (asumidas por él).
  - `creatorId`: ID específico del creador que asume la deuda.
  - `userId`: ID específico del deudor que rechazó.
  - `page`: Número de página (default 1).
  - `limit`: Elementos por página (default 20).
- **Respuestas:**
  - `200 OK`: Array de cuotas con las relaciones `plannedInstallment.piId` (gasto maestro), `user` (amigo que rechazó) y `assumedByUser` (creador).

---

### `PUT /installmentuserpayments/:id/reject`
- **Nivel de acceso:** 🔒 Protegido
- **Descripción:** El deudor asignado declina la responsabilidad de pago de la cuota.
- **Efecto en BD:**
  - Se ejecuta en una transacción TypeORM atómica.
  - Se marca `rejected = true` y `accepted = false`.
  - Se establece `assumedByUserId` apuntando al **creador del gasto maestro**.
- **Respuestas:**
  - `200 OK`: Cuota actualizada y reasignada al creador.
  - `400 Bad Request`: Si ya estaba aceptada o rechazada previamente.
  - `403 Forbidden`: Si quien llama al endpoint no es el deudor titular.
  - `404 Not Found`

---

### `PUT /installmentuserpayments/:id`
- **Nivel de acceso:** 🔒 Protegido
- **Descripción:** Actualiza el estado de pago o reasigna la cuota a otro amigo.
- **Casos de Uso:**
  1. **Pago Exacto (Anti-remanentes):**
     ```json
     {
       "paymentDone": true,
       "paidAmount": 10000
     }
     ```
  2. **Reasignación de Deuda a otro Amigo (Exclusivo del Creador):**
     ```json
     {
       "userId": 3
     }
     ```
     *El backend utiliza `QueryBuilder` nativo para actualizar la llave foránea `userId`, reseteando `accepted: false` y `rejected: false`.*

---

### `GET /installmentuserpayments/:id`
- **Nivel de acceso:** 🔒 Protegido
- **Descripción:** Obtiene una cuota individual por su ID (UUID).

---

## 👥 Módulo de Amistades y Solicitudes

---

### `POST /friend-requests`
- **Nivel de acceso:** 🔒 Protegido
- **Descripción:** Envía una solicitud de amistad. El emisor se extrae del usuario autenticado.
- **Body Esperado:**
  ```json
  {
    "receiverId": 2
  }
  ```
- **Respuestas:**
  - `201 Created`
  - `400 Bad Request`: Bloqueo de auto-solicitud (`sender === receiver`) o solicitud duplicada activa.

---

### `PUT /friend-requests/:id/respond`
- **Nivel de acceso:** 🔒 Protegido
- **Descripción:** El receptor acepta o rechaza una solicitud. Al ser aceptada, se crea el registro de amistad bidireccional en `FRIENDSHIP`.
- **Body Esperado:**
  ```json
  {
    "status": "ACCEPTED" // O "REJECTED"
  }
  ```

---

### `GET /users/:userId/friend-requests`
- **Nivel de acceso:** 🔒 Protegido
- **Descripción:** Lista las solicitudes de amistad recibidas que están pendientes de respuesta.

---

### `GET /users/:userId/sent-friend-requests`
- **Nivel de acceso:** 🔒 Protegido
- **Descripción:** Lista las solicitudes de amistad enviadas por el usuario.

---

### `DELETE /friend-requests/:id`
- **Nivel de acceso:** 🔒 Protegido
- **Descripción:** Cancela una solicitud de amistad enviada previamente.

---

### `GET /users/:userId/friends`
- **Nivel de acceso:** 🔒 Protegido
- **Descripción:** Retorna la lista consolidada de amigos del usuario.

---

### `DELETE /users/:userId/friends/:friendId`
- **Nivel de acceso:** 🔒 Protegido
- **Descripción:** Elimina una amistad consolidada entre dos usuarios.

---

## 👤 Módulo de Usuarios

---

### `POST /users`
- **Nivel de acceso:** 🌐 Público
- **Descripción:** Crea un nuevo usuario en el sistema.
- **Body Esperado:**
  ```json
  {
    "username": "nuevo_usuario",
    "email": "usuario@test.com",
    "hashedPassword": "miPasswordSeguro123",
    "phone": "+56912345678"
  }
  ```

---

### `GET /users`
- **Nivel de acceso:** 🌐 Público
- **Query Params:** `limit` (default 10), `offset` (default 0).

---

### `GET /users/:id`
- **Nivel de acceso:** 🌐 Público
- **Parámetros:** `id` del usuario.

---

### `PUT /users/:id`
- **Nivel de acceso:** 🌐 Público
- **Body:** Campos opcionales `username`, `email`, `phone`.

---

## 🏷️ Módulo de Categorías, Subcategorías y Tipos de Gasto

| Método | Endpoint | Acceso | Descripción | Body / Parámetros |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/categories` | 🌐 Público | Lista categorías principales | Query: `limit`, `offset` |
| **POST** | `/categories` | 🌐 Público | Crea una categoría | `{ "name": "Salud", "description": "Farmacia, médicos" }` |
| **GET** | `/categories/:id` | 🌐 Público | Obtiene una categoría | Path: `id` |
| **PUT** | `/categories/:id` | 🌐 Público | Edita una categoría | `{ "name": "Salud y Bienestar" }` |
| **DELETE** | `/categories/:id` | 🌐 Público | Elimina una categoría | Path: `id` |
| **GET** | `/categories/:categoryId/subcategories` | 🌐 Público | Lista subcategorías de una categoría | Path: `categoryId` |
| **GET** | `/subcategories` | 🌐 Público | Lista todas las subcategorías | Query: `limit`, `offset` |
| **POST** | `/subcategories` | 🌐 Público | Crea una subcategoría | `{ "name": "Dentista", "categoryId": 2 }` |
| **PUT** | `/subcategories/:id` | 🌐 Público | Edita una subcategoría | `{ "name": "Odontología" }` |
| **DELETE** | `/subcategories/:id` | 🌐 Público | Elimina una subcategoría | Path: `id` |
| **GET** | `/typespends` | 🌐 Público | Lista tipos de gasto (Fijo, Variable, Cuotas) | Query: `limit`, `offset` |
| **POST** | `/typespends` | 🌐 Público | Crea un tipo de gasto | `{ "name": "Extraordinario" }` |

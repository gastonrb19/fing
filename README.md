# Proyecto Fing

**API de seguimiento de gastos.**

Fing es una API para llevar el control de en qué se te va la plata. La idea es simple: cada usuario registra sus gastos (*spends*), y cada gasto cuelga de una subcategoría, que a su vez pertenece a una categoría. Así puedes responder preguntas como "¿cuánto gasté este mes en delivery?" sin tener que hacer memoria.

Debajo del capó hay una estructura bien ordenada y repetible: cada entidad tiene su modelo, sus DTOs, su servicio, su controlador y sus rutas. Los servicios se apoyan entre sí (por ejemplo, `Spend` reutiliza `UserService` y `SubcategoryService` en vez de tocar sus repositorios directamente), y los errores se traducen a respuestas JSON consistentes en un solo lugar.

---

## Stack

- **Node.js + Express 5** — servidor HTTP
- **TypeScript** — tipado estricto
- **TypeORM** — ORM y migraciones
- **PostgreSQL** — base de datos
- **tsx** — ejecución/watch en desarrollo

---

## Puesta en marcha

Levantar la base de datos (Postgres en Docker):

```bash
docker compose up -d
```

Instalar dependencias y correr en modo desarrollo:

```bash
npm install
npm run dev
```

La API queda escuchando en `http://localhost:8000`.

Scripts disponibles:

| Script | Qué hace |
|---|---|
| `npm run dev` | Levanta el server con recarga en caliente (`tsx watch`) |
| `npm start` | Levanta el server una vez |
| `npm run build` | Compila TypeScript a `dist/` |
| `npm run typecheck` | Chequeo de tipos sin emitir archivos |

### Variables de entorno

Se leen desde `.env` (con estos valores por defecto):

| Variable | Default |
|---|---|
| `DB_HOST` | `localhost` |
| `DB_PORT` | `5432` |
| `DB_USER` | `postgres` |
| `DB_PASS` | `postgres` |
| `DB_NAME` | `fing` |
| `PORT` | `8000` |

> Actualmente el datasource usa `synchronize: true`, así que las tablas se crean solas al arrancar. Las migraciones ya están escritas en `src/migrations`; para usarlas en producción cambia a `synchronize: false` y córrelas con `migrationsRun` o el CLI de TypeORM.

---

## Forma de las respuestas

Todas las respuestas siguen el mismo formato.

Éxito:

```json
{
  "success": true,
  "code_message": "ABC",
  "len": 1,
  "data": { }
}
```

Error (traducido por el middleware `errorHandler`):

```json
{
  "success": false,
  "error": { "message": "Resource ...", "code": "NOT_FOUND" }
}
```

Códigos de error frecuentes: `NOT_FOUND` (404), `SVR_ERR` (500), `VL_UNI` (400, viola un valor único), `NOT_FK` (400, la FK referenciada no existe).

---

## Entidades

### User (`user`)

| Campo | Tipo | Nulable | Notas |
|---|---|---|---|
| `id` | number | No | PK autogenerada |
| `username` | varchar | No | Único |
| `email` | varchar | No | Único |
| `hashedPassword` | varchar | No | Se guarda hasheado |
| `phone` | varchar | Sí | Único |

### Category (`category_entity`)

| Campo | Tipo | Nulable | Notas |
|---|---|---|---|
| `id` | number | No | PK autogenerada |
| `name` | varchar | No | Único |
| `description` | varchar | Sí | |

### Subcategory (`subcategory_entity`)

| Campo | Tipo | Nulable | Notas |
|---|---|---|---|
| `id` | number | No | PK autogenerada |
| `name` | varchar | No | Único |
| `description` | varchar | Sí | |
| `category` | FK → Category | No | `ManyToOne` (`categoryId`), `ON DELETE CASCADE` |

### Spend (`spend_entity`)

| Campo | Tipo | Nulable | Notas |
|---|---|---|---|
| `id` | number | No | PK autogenerada |
| `name` | varchar | No | No es único |
| `amount` | double precision | No | Monto del gasto |
| `createDate` | timestamp | No | Automático (`@CreateDateColumn`) |
| `updateDate` | timestamp | No | Automático (`@UpdateDateColumn`) |
| `user` | FK → User | No | `ManyToOne` (`userId`), `ON DELETE CASCADE` |
| `subcategory` | FK → Subcategory | No | `ManyToOne` (`subcategoryId`), `ON DELETE CASCADE` |

**Relaciones de un vistazo:** `Category 1—N Subcategory 1—N Spend N—1 User`.

---

## Endpoints

Paginación: los `GET` de listado aceptan `?limit=<n>&offset=<n>` (por defecto `limit=10`, `offset=0`).

### Users

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/users` | Lista usuarios (paginado) |
| `GET` | `/users/:id` | Un usuario por id |
| `POST` | `/users` | Crea usuario — body: `{ username, email, hashedPassword, phone }` |
| `PUT` | `/users/:id` | Actualiza — body envuelto: `{ "user": { ... } }` |

### Categories

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/categories` | Lista categorías (paginado) |
| `GET` | `/categories/:id` | Una categoría por id |
| `POST` | `/categories` | Crea — body: `{ name, description? }` |
| `PUT` | `/categories/:id` | Actualiza — body envuelto: `{ "category": { ... } }` |
| `DELETE` | `/categories/:id` | Elimina |

### Subcategories

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/subcategories` | Lista subcategorías (paginado) |
| `GET` | `/subcategories/:id` | Una subcategoría por id |
| `GET` | `/categories/:categoryId/subcategories` | Subcategorías de una categoría específica |
| `POST` | `/subcategories` | Crea — body: `{ name, description?, categoryId }` |
| `PUT` | `/subcategories/:id` | Actualiza — body envuelto: `{ "subcategory": { ... } }` |
| `DELETE` | `/subcategories/:id` | Elimina |

### Spends

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/spends` | Lista gastos (paginado) |
| `GET` | `/spends/:id` | Un gasto por id |
| `GET` | `/users/:id_user/spends?subcategory=<id>` | Gastos de un usuario filtrados por subcategoría (el query `subcategory` es requerido) |
| `POST` | `/spends` | Crea — body: `{ name, amount, userId, subcategoryId }` |
| `PUT` | `/spends/:id` | Actualiza — body envuelto: `{ "spend": { ... } }` |
| `DELETE` | `/spends/:id` | Elimina |

---

## Probar todo con `make`

En `src/Makefile` hay comandos listos para golpear cada endpoint con `curl`. Corre `make list` (o solo `make`) para ver el menú completo con ejemplos.

Cada recurso trae 3 escenarios por operación (casos válidos + un caso de error tipo 404/400) y un agregador que los corre todos.

### Users

```bash
make users        # GET /users (3 escenarios de paginación)
make user         # GET /users/:id
make create       # POST /users
make update       # PUT /users/:id
```

### Categories

```bash
make categories   # GET /categories
make category     # GET /categories/:id
make cat-create   # POST /categories
make cat-update   # PUT /categories/:id
make cat-delete   # DELETE /categories/:id
```

### Subcategories

```bash
make subcategories # GET /subcategories
make subcategory   # GET /subcategories/:id
make sub-create    # POST /subcategories
make sub-update    # PUT /subcategories/:id
make sub-delete    # DELETE /subcategories/:id
make cat-subs      # GET /categories/:categoryId/subcategories
```

### Spends

```bash
make spends        # GET /spends
make spend         # GET /spends/:id
make spend-create  # POST /spends
make spend-update  # PUT /spends/:id
make spend-delete  # DELETE /spends/:id
make user-spends   # GET /users/:id_user/spends?subcategory=<id>
```

También puedes correr un escenario puntual, por ejemplo `make spend-create-1` o `make user-spends-3`. Si tu API no está en el puerto por defecto, pásale la URL: `make spends BASE_URL=http://localhost:3000`.

---

## Estructura del proyecto

```
src/
├── config/         # datasource y conexión a la BD
├── controllers/    # capa HTTP (request/response)
├── dtos/           # contratos de create/update por entidad
├── middlewares/    # manejo centralizado de errores
├── migrations/     # migraciones de TypeORM
├── models/         # entidades de TypeORM
├── routes/         # definición de rutas por entidad
├── services/       # lógica de negocio y acceso a datos
├── utils/          # paginación, errores, hashing, helpers
└── Makefile        # atajos de curl para probar la API
```

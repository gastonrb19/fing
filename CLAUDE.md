# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Fing is an Express + TypeORM + PostgreSQL REST API for expense tracking. Each user logs spends (`spends`), each spend belongs to a subcategory, and each subcategory belongs to a category — `Category 1—N Subcategory 1—N Spend N—1 User`. Currently JWT auth is not yet wired in (see recent commits — bcrypt hashing exists, login/middleware/cookies are TODO).

## Commands

```bash
docker compose up -d      # starts Postgres in Docker (required before running the app)
npm run dev                # tsx watch server.ts — hot reload dev server
npm start                  # tsx server.ts — run once
npm run build               # tsc -> dist/
npm run typecheck           # tsc --noEmit
```

No automated test suite exists (`npm test` is a stub). Endpoint testing is done via `src/Makefile`, which wraps curl calls for every route with 3 scenarios each (2 valid + 1 error case):

```bash
make            # or `make list` — prints the full endpoint/scenario menu
make users      # run all 3 findAll scenarios for users
make spend-create-1   # run one specific scenario
make spends BASE_URL=http://localhost:3000   # override the default port (8000)
```

Server listens on `PORT` (default 8000). DB config comes from `.env`: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME` (defaults match `docker-compose.yml`: postgres/postgres/fing on localhost:5432).

## Architecture

Every resource (User, Category, Subcategory, Spend) follows the same 5-layer, one-file-per-concern structure — when adding a resource or endpoint, replicate this shape rather than inventing a new pattern:

```
routes/<resource>_routes.ts   -> wires Router to controller methods, instantiates services (manual DI, no container)
controllers/<resource>.ts     -> HTTP layer only: parses req, calls service, shapes the JSON envelope
services/<resource>.ts        -> business logic + TypeORM repository access (myDataSource.getRepository(...))
dtos/<resource>/create*.ts, update*.ts  -> plain interfaces describing request bodies
models/<Resource>Entity.ts    -> TypeORM entity (decorators, relations)
```

Key conventions to preserve:

- **Cross-resource logic lives in services, not controllers.** A service that needs another resource takes that resource's service as a constructor dependency and calls its public methods (e.g. `SpendService` takes `UserService` and `SubcategoryService` and calls `.findOneById()` on them rather than touching their repositories directly). Wiring happens in the route file, e.g. `new SpendService(new UserService(), new SubcategoryService())` in `src/routes/spend_routes.ts`.
- **`findOneById` is the validation primitive.** It throws `NotFoundError` when a row doesn't exist, and every service.create/update that references a foreign resource calls the related service's `findOneById` instead of duplicating existence checks.
- **Controllers are wrapped in `dryFn`** (`src/utils/dryFn.ts`) so async errors are forwarded to `next()` automatically — no manual try/catch per controller method.
- **Errors are centralized.** Throw `GeneralError(message, statusCode, code)` or `NotFoundError(resourceName, id)` (`src/utils/classError.ts`) from services/controllers; `src/middlewares/errorHandler.ts` (registered last in `server.ts`, after routes) normalizes them — plus raw TypeORM `QueryFailedError`s for Postgres unique (`23505` -> `VL_UNI`) and FK (`23503` -> `NOT_FK`) violations — into the standard error envelope.
- **Response envelope is consistent** across all endpoints: `{ success, code_message, len, data }` on success, `{ success: false, error: { message, code } }` on failure. Match this shape for any new endpoint.
- **Update endpoints expect a wrapped body**: `PUT /categories/:id` expects `{ "category": {...} }`, `PUT /spends/:id` expects `{ "spend": {...} }`, etc. Controllers throw a 400-ish error if the wrapper key is missing.
- **Pagination** on list endpoints uses `?limit=&offset=` (defaults 10/0), normalized via `checkAndConvertPagination` (`src/utils/checkPagination.ts`) into the `Pagination` interface (`src/utils/pagination.ts`) and passed straight to TypeORM's `skip`/`take`.
- **Nested/filtered routes** live in the child resource's controller/service, not the parent's: `GET /categories/:categoryId/subcategories` is handled by `SubcategoryController`/`SubcategoryService`, and `GET /users/:id_user/spends?subcategory=<id>` (subcategory query param required) by `SpendController`/`SpendService`.
- **Passwords** are hashed via `hashPassword` (`src/utils/hashPassword.ts`, bcrypt cost 10) inside `UserService.create` — never store or compare raw passwords.
- Module system is native ESM (`"type": "module"` in package.json) with `NodeNext` resolution — internal imports must use explicit `.js` extensions even though source files are `.ts` (e.g. `import { UserService } from "./user.js"`).
- `app-data-source.ts` currently runs with `synchronize: true` (tables auto-created from entities). Migrations exist under `src/migrations` for when `synchronize` is turned off in production — don't assume migrations run automatically today.

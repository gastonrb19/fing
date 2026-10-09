# Reglas de Arquitectura y Flujo - Fing Backend

## 1. Convenciones de Base de Datos (TypeORM)
- **Tablas en Mayúsculas:** Todas las entidades (`@Entity`) y migraciones deben definir los nombres de las tablas estrictamente en MAYÚSCULAS (ej. `SPEND`, `INSTALLMENTUSERPAYMENT`).
- **Carga Automática:** No es necesario importar manualmente los nuevos modelos en `app-data-source.ts`; ya se cargan dinámicamente mediante comodines (`src/models/**/*{.js,.ts}`).

## 2. Manejo de Errores y Controladores
- **Cero Boilerplate (`dryFn`):** Evitar el uso de bloques `try/catch` dentro de los Controladores.
- **Excepciones Nativas:** Los Servicios deben lanzar directamente instancias de `GeneralError` (con código HTTP) o `NotFoundError`. El wrapper `dryFn` capturará y enviará la respuesta automáticamente.

## 3. Entorno de Ejecución (ES Modules)
- **Scripts Temporales:** El backend usa `"type": "module"`. Si se requiere generar y correr scripts temporales de Node.js (ej. actualizar Swagger), utilizar la extensión `.cjs` para evitar conflictos con `require()`, o bien redactar el script usando `import` nativo.

## 4. Gestión de Tareas (Gitflow y Husky)
- **Archivos de Tareas:** Las tareas de backend viven en `fing/README-TASK.md` y las de frontend en `fing-frontend/README-TASK.md`. No mezclar ambos repositorios.
- **Flujo de Commits:** Al hacer commits que disparen hooks de Husky (`update-tasks.cjs`), se debe desactivar el Sandbox (`BypassSandbox: true`) para evitar el error de permisos (`.git/index.lock`). El script `update-tasks.cjs` mueve automáticamente las tareas completadas `[x]` a `README-HISTORYTASK.md`.

## 5. Validaciones (Zod) y Variables de Sesión
- **Cuidado con el Stripping de Zod:** Al utilizar middlewares de Zod para validar `req.body`, asegúrate SIEMPRE de declarar en el esquema campos temporales o inyectados como `currentUser` (`currentUser: z.number().optional()`). Si omites un campo en el esquema, Zod lo eliminará silenciosamente del body, rompiendo la lógica del controlador que lo espera.

## 6. Enrutamiento (Express)
- **Rutas Absolutas en Routers:** Ya que `index.ts` importa las rutas utilizando `routes.use(routesFile)` sin un prefijo base, los archivos dentro de `src/routes/` DEBEN declarar la ruta completa (ej. `router.post('/friend-requests')`, nunca `router.post('/')`) para evitar que Express devuelva 404 HTML que rompan el parseo JSON del Frontend.


## 7. Actualización de Llaves Foráneas (TypeORM)
- **Evitar asignación directa de objetos:** Al reasignar una relación (ej. cambio de dueño en una cuota), evitar usar `entidad.relacion = nuevoObjeto` seguido de `repo.save()`, ya que TypeORM tiende a ignorar la actualización en SQL si la columna nativa no está mapeada o cacheada correctamente.
- **Uso obligatorio de QueryBuilder para FKs:** Para forzar el cambio de ID de una relación, se DEBE utilizar el `QueryBuilder` nativo: `await myDataSource.createQueryBuilder().update(Entity).set({ relation: newObject }).where(...).execute()`.

## 8. Sintaxis de Relaciones en TypeORM
- **Cero arrays de strings:** TypeORM v1+ eliminó el soporte para `relations: ["nombre"]`. Utilizar esto provoca un Crash / Error 500 fatal.
- **Uso obligatorio de Objetos:** Las relaciones en `find` o `findOne` deben definirse SIEMPRE usando sintaxis de objeto: `relations: { user: true, plannedInstallment: true }`.

# Makefile para probar los endpoints de la API de usuarios
# Uso: make <comando>   (ej: make list, make users-1, make user-2)

BASE_URL ?= http://localhost:8000
CURL = curl -s -w "\n[HTTP %{http_code}]\n"
CURLJ = curl -s -w "\n[HTTP %{http_code}]\n" -H "Content-Type: application/json"

.DEFAULT_GOAL := list
.PHONY: list users user create update \
        users-1 users-2 users-3 \
        user-1 user-2 user-3 \
        create-1 create-2 create-3 \
        update-1 update-2 update-3 \
        categories category cat-create cat-update cat-delete \
        categories-1 categories-2 categories-3 \
        category-1 category-2 category-3 \
        cat-create-1 cat-create-2 cat-create-3 \
        cat-update-1 cat-update-2 cat-update-3 \
        cat-delete-1 cat-delete-2 cat-delete-3 \
        subcategories subcategory sub-create sub-update sub-delete \
        cat-subs cat-subs-1 cat-subs-2 cat-subs-3 \
        subcategories-1 subcategories-2 subcategories-3 \
        subcategory-1 subcategory-2 subcategory-3 \
        sub-create-1 sub-create-2 sub-create-3 \
        sub-update-1 sub-update-2 sub-update-3 \
        sub-delete-1 sub-delete-2 sub-delete-3 \
        spends spend spend-create spend-update spend-delete \
        spends-1 spends-2 spends-3 \
        spend-1 spend-2 spend-3 \
        spend-create-1 spend-create-2 spend-create-3 \
        spend-update-1 spend-update-2 spend-update-3 \
        spend-delete-1 spend-delete-2 spend-delete-3 \
        user-spends user-spends-1 user-spends-2 user-spends-3

## list: muestra los endpoints disponibles y su estructura de llamada
list:
	@echo ""
	@echo "API de usuarios  (BASE_URL=$(BASE_URL))"
	@echo "======================================================================"
	@echo ""
	@echo "GET  /users            -> findAll (paginado con query params)"
	@echo "     query:  ?limit=<number>&offset=<number>"
	@echo "     ejemplo: $(BASE_URL)/users?limit=10&offset=0"
	@echo "     escenarios: make users-1 | make users-2 | make users-3"
	@echo ""
	@echo "GET  /users/:id        -> findOne (usuario individual por id)"
	@echo "     param:  id (number)"
	@echo "     ejemplo: $(BASE_URL)/users/1"
	@echo "     escenarios: make user-1 | make user-2 | make user-3"
	@echo ""
	@echo "POST /users            -> create (crea usuario, body = DTO en JSON)"
	@echo "     body:   { username, email, hashedPassword, phone }"
	@echo "     ejemplo: $(BASE_URL)/users"
	@echo "     escenarios: make create-1 | make create-2 | make create-3"
	@echo ""
	@echo "PUT  /users/:id        -> update (actualiza usuario, body envuelto en 'user')"
	@echo "     param:  id (number)"
	@echo "     body:   { \"user\": { username?, email?, password?, phone? } }"
	@echo "     ejemplo: $(BASE_URL)/users/1"
	@echo "     escenarios: make update-1 | make update-2 | make update-3"
	@echo ""
	@echo "Extras:  make users   (corre los 3 escenarios de findAll)"
	@echo "         make user    (corre los 3 escenarios de findOne)"
	@echo "         make create  (corre los 3 escenarios de create)"
	@echo "         make update  (corre los 3 escenarios de update)"
	@echo ""
	@echo "======================================================================"
	@echo ""
	@echo "GET  /categories       -> findAll (paginado con query params)"
	@echo "     query:  ?limit=<number>&offset=<number>"
	@echo "     ejemplo: $(BASE_URL)/categories?limit=10&offset=0"
	@echo "     escenarios: make categories-1 | make categories-2 | make categories-3"
	@echo ""
	@echo "GET  /categories/:id   -> findOne (categoria individual por id)"
	@echo "     param:  id (number)"
	@echo "     ejemplo: $(BASE_URL)/categories/1"
	@echo "     escenarios: make category-1 | make category-2 | make category-3"
	@echo ""
	@echo "POST /categories       -> create (crea categoria, body = DTO en JSON)"
	@echo "     body:   { name, description? }"
	@echo "     ejemplo: $(BASE_URL)/categories"
	@echo "     escenarios: make cat-create-1 | make cat-create-2 | make cat-create-3"
	@echo ""
	@echo "PUT  /categories/:id   -> update (actualiza categoria, body envuelto en 'category')"
	@echo "     param:  id (number)"
	@echo "     body:   { \"category\": { name?, description? } }"
	@echo "     ejemplo: $(BASE_URL)/categories/1"
	@echo "     escenarios: make cat-update-1 | make cat-update-2 | make cat-update-3"
	@echo ""
	@echo "DEL  /categories/:id   -> delete (elimina categoria por id)"
	@echo "     param:  id (number)"
	@echo "     ejemplo: $(BASE_URL)/categories/1"
	@echo "     escenarios: make cat-delete-1 | make cat-delete-2 | make cat-delete-3"
	@echo ""
	@echo "Extras:  make categories  (corre los 3 escenarios de findAll)"
	@echo "         make category     (corre los 3 escenarios de findOne)"
	@echo "         make cat-create   (corre los 3 escenarios de create)"
	@echo "         make cat-update   (corre los 3 escenarios de update)"
	@echo "         make cat-delete   (corre los 3 escenarios de delete)"
	@echo ""
	@echo "======================================================================"
	@echo ""
	@echo "GET  /subcategories    -> findAll (paginado con query params)"
	@echo "     query:  ?limit=<number>&offset=<number>"
	@echo "     ejemplo: $(BASE_URL)/subcategories?limit=10&offset=0"
	@echo "     escenarios: make subcategories-1 | make subcategories-2 | make subcategories-3"
	@echo ""
	@echo "GET  /subcategories/:id -> findOne (subcategoria individual por id)"
	@echo "     param:  id (number)"
	@echo "     ejemplo: $(BASE_URL)/subcategories/1"
	@echo "     escenarios: make subcategory-1 | make subcategory-2 | make subcategory-3"
	@echo ""
	@echo "POST /subcategories    -> create (crea subcategoria, body = DTO en JSON)"
	@echo "     body:   { name, description?, categoryId }"
	@echo "     ejemplo: $(BASE_URL)/subcategories"
	@echo "     escenarios: make sub-create-1 | make sub-create-2 | make sub-create-3"
	@echo ""
	@echo "PUT  /subcategories/:id -> update (actualiza subcategoria, body envuelto en 'subcategory')"
	@echo "     param:  id (number)"
	@echo "     body:   { \"subcategory\": { name?, description?, categoryId? } }"
	@echo "     ejemplo: $(BASE_URL)/subcategories/1"
	@echo "     escenarios: make sub-update-1 | make sub-update-2 | make sub-update-3"
	@echo ""
	@echo "DEL  /subcategories/:id -> delete (elimina subcategoria por id)"
	@echo "     param:  id (number)"
	@echo "     ejemplo: $(BASE_URL)/subcategories/1"
	@echo "     escenarios: make sub-delete-1 | make sub-delete-2 | make sub-delete-3"
	@echo ""
	@echo "GET  /categories/:categoryId/subcategories -> findByCategory (subcategorias de una categoria)"
	@echo "     param:  categoryId (number)   query: ?limit=<number>&offset=<number>"
	@echo "     ejemplo: $(BASE_URL)/categories/1/subcategories"
	@echo "     escenarios: make cat-subs-1 | make cat-subs-2 | make cat-subs-3"
	@echo ""
	@echo "Extras:  make subcategories (corre los 3 escenarios de findAll)"
	@echo "         make subcategory    (corre los 3 escenarios de findOne)"
	@echo "         make sub-create     (corre los 3 escenarios de create)"
	@echo "         make sub-update     (corre los 3 escenarios de update)"
	@echo "         make sub-delete     (corre los 3 escenarios de delete)"
	@echo "         make cat-subs       (corre los 3 escenarios de findByCategory)"
	@echo ""
	@echo "======================================================================"
	@echo ""
	@echo "GET  /spends           -> findAll (paginado con query params)"
	@echo "     query:  ?limit=<number>&offset=<number>"
	@echo "     ejemplo: $(BASE_URL)/spends?limit=10&offset=0"
	@echo "     escenarios: make spends-1 | make spends-2 | make spends-3"
	@echo ""
	@echo "GET  /spends/:id       -> findOne (gasto individual por id)"
	@echo "     param:  id (number)"
	@echo "     ejemplo: $(BASE_URL)/spends/1"
	@echo "     escenarios: make spend-1 | make spend-2 | make spend-3"
	@echo ""
	@echo "POST /spends           -> create (crea gasto, body = DTO en JSON)"
	@echo "     body:   { name, amount, userId, subcategoryId }"
	@echo "     ejemplo: $(BASE_URL)/spends"
	@echo "     escenarios: make spend-create-1 | make spend-create-2 | make spend-create-3"
	@echo ""
	@echo "PUT  /spends/:id       -> update (actualiza gasto, body envuelto en 'spend')"
	@echo "     param:  id (number)"
	@echo "     body:   { \"spend\": { name?, amount?, userId?, subcategoryId? } }"
	@echo "     ejemplo: $(BASE_URL)/spends/1"
	@echo "     escenarios: make spend-update-1 | make spend-update-2 | make spend-update-3"
	@echo ""
	@echo "DEL  /spends/:id       -> delete (elimina gasto por id)"
	@echo "     param:  id (number)"
	@echo "     ejemplo: $(BASE_URL)/spends/1"
	@echo "     escenarios: make spend-delete-1 | make spend-delete-2 | make spend-delete-3"
	@echo ""
	@echo "GET  /users/:id_user/spends -> findByUserAndSubcategory (gastos de un user por subcategory)"
	@echo "     param:  id_user (number)   query (requerido): ?subcategory=<id_subcategory>"
	@echo "     ejemplo: $(BASE_URL)/users/1/spends?subcategory=1"
	@echo "     escenarios: make user-spends-1 | make user-spends-2 | make user-spends-3"
	@echo ""
	@echo "Extras:  make spends       (corre los 3 escenarios de findAll)"
	@echo "         make spend        (corre los 3 escenarios de findOne)"
	@echo "         make spend-create (corre los 3 escenarios de create)"
	@echo "         make spend-update (corre los 3 escenarios de update)"
	@echo "         make spend-delete (corre los 3 escenarios de delete)"
	@echo "         make user-spends  (corre los 3 escenarios de user->spends)"
	@echo ""

# ---------------------------------------------------------------------------
# GET /users  -> findAll  (3 escenarios con distinta paginacion)
# ---------------------------------------------------------------------------

## users-1: primera pagina, 5 registros
users-1:
	@echo ">> GET /users?limit=5&offset=0  (primera pagina, 5 registros)"
	@$(CURL) "$(BASE_URL)/users?limit=5&offset=0"

## users-2: segunda pagina, 10 registros
users-2:
	@echo ">> GET /users?limit=10&offset=10  (segunda pagina, 10 registros)"
	@$(CURL) "$(BASE_URL)/users?limit=10&offset=10"

## users-3: sin query params (usa defaults limit=10 offset=0)
users-3:
	@echo ">> GET /users  (sin params, defaults limit=10 offset=0)"
	@$(CURL) "$(BASE_URL)/users"

## users: corre los 3 escenarios de findAll
users: users-1 users-2 users-3

# ---------------------------------------------------------------------------
# GET /users/:id  -> findOne  (3 escenarios con distinto id)
# ---------------------------------------------------------------------------

## user-1: usuario id=1
user-1:
	@echo ">> GET /users/1"
	@$(CURL) "$(BASE_URL)/users/1"

## user-2: usuario id=42
user-2:
	@echo ">> GET /users/42"
	@$(CURL) "$(BASE_URL)/users/42"

## user-3: usuario id=999 (probable 404 NotFoundError)
user-3:
	@echo ">> GET /users/999  (probable 404)"
	@$(CURL) "$(BASE_URL)/users/999"

## user: corre los 3 escenarios de findOne
user: user-1 user-2 user-3

# ---------------------------------------------------------------------------
# POST /users  -> create  (3 escenarios con distinto body)
# ---------------------------------------------------------------------------

## create-1: usuario valido completo
create-1:
	@echo ">> POST /users  (usuario valido completo)"
	@$(CURLJ) -X POST "$(BASE_URL)/users" \
		-d '{"username":"jdoe","email":"jdoe@mail.com","hashedPassword":"secret123","phone":"+56911111111"}'

## create-2: otro usuario valido
create-2:
	@echo ">> POST /users  (otro usuario valido)"
	@$(CURLJ) -X POST "$(BASE_URL)/users" \
		-d '{"username":"asmith","email":"asmith@mail.com","hashedPassword":"pass456","phone":"+56922222222"}'

## create-3: sin password (probable 400 GeneralError)
create-3:
	@echo ">> POST /users  (sin password, probable 400)"
	@$(CURLJ) -X POST "$(BASE_URL)/users" \
		-d '{"username":"nopass","email":"nopass@mail.com","phone":"+56933333333"}'

## create: corre los 3 escenarios de create
create: create-1 create-2 create-3

# ---------------------------------------------------------------------------
# PUT /users/:id  -> update  (3 escenarios; body envuelto en "user")
# ---------------------------------------------------------------------------

## update-1: actualiza varios campos del usuario id=1
update-1:
	@echo ">> PUT /users/1  (actualiza varios campos)"
	@$(CURLJ) -X PUT "$(BASE_URL)/users/1" \
		-d '{"user":{"username":"jdoe_edit","email":"jdoe_edit@mail.com","phone":"+56900000000"}}'

## update-2: actualiza solo el email del usuario id=2
update-2:
	@echo ">> PUT /users/2  (actualiza solo email)"
	@$(CURLJ) -X PUT "$(BASE_URL)/users/2" \
		-d '{"user":{"email":"nuevo@mail.com"}}'

## update-3: sin wrapper "user" (probable 400 Bad request)
update-3:
	@echo ">> PUT /users/1  (sin wrapper user, probable 400)"
	@$(CURLJ) -X PUT "$(BASE_URL)/users/1" \
		-d '{"email":"sinwrapper@mail.com"}'

## update: corre los 3 escenarios de update
update: update-1 update-2 update-3

# ===========================================================================
# CATEGORY
# ===========================================================================

# ---------------------------------------------------------------------------
# GET /categories  -> findAll  (3 escenarios con distinta paginacion)
# ---------------------------------------------------------------------------

## categories-1: primera pagina, 5 registros
categories-1:
	@echo ">> GET /categories?limit=5&offset=0  (primera pagina, 5 registros)"
	@$(CURL) "$(BASE_URL)/categories?limit=5&offset=0"

## categories-2: segunda pagina, 10 registros
categories-2:
	@echo ">> GET /categories?limit=10&offset=10  (segunda pagina, 10 registros)"
	@$(CURL) "$(BASE_URL)/categories?limit=10&offset=10"

## categories-3: sin query params (usa defaults limit=10 offset=0)
categories-3:
	@echo ">> GET /categories  (sin params, defaults limit=10 offset=0)"
	@$(CURL) "$(BASE_URL)/categories"

## categories: corre los 3 escenarios de findAll
categories: categories-1 categories-2 categories-3

# ---------------------------------------------------------------------------
# GET /categories/:id  -> findOne  (3 escenarios con distinto id)
# ---------------------------------------------------------------------------

## category-1: categoria id=1
category-1:
	@echo ">> GET /categories/1"
	@$(CURL) "$(BASE_URL)/categories/1"

## category-2: categoria id=42
category-2:
	@echo ">> GET /categories/42"
	@$(CURL) "$(BASE_URL)/categories/42"

## category-3: categoria id=999 (probable 404 NotFoundError)
category-3:
	@echo ">> GET /categories/999  (probable 404)"
	@$(CURL) "$(BASE_URL)/categories/999"

## category: corre los 3 escenarios de findOne
category: category-1 category-2 category-3

# ---------------------------------------------------------------------------
# POST /categories  -> create  (3 escenarios con distinto body)
# ---------------------------------------------------------------------------

## cat-create-1: categoria valida completa
cat-create-1:
	@echo ">> POST /categories  (categoria valida completa)"
	@$(CURLJ) -X POST "$(BASE_URL)/categories" \
		-d '{"name":"Electronica","description":"Dispositivos y gadgets"}'

## cat-create-2: categoria valida solo con name (description es opcional)
cat-create-2:
	@echo ">> POST /categories  (solo name, description opcional)"
	@$(CURLJ) -X POST "$(BASE_URL)/categories" \
		-d '{"name":"Libros"}'

## cat-create-3: sin name (probable 400 GeneralError)
cat-create-3:
	@echo ">> POST /categories  (sin name, probable 400)"
	@$(CURLJ) -X POST "$(BASE_URL)/categories" \
		-d '{"description":"sin nombre"}'

## cat-create: corre los 3 escenarios de create
cat-create: cat-create-1 cat-create-2 cat-create-3

# ---------------------------------------------------------------------------
# PUT /categories/:id  -> update  (3 escenarios; body envuelto en "category")
# ---------------------------------------------------------------------------

## cat-update-1: actualiza varios campos de la categoria id=1
cat-update-1:
	@echo ">> PUT /categories/1  (actualiza varios campos)"
	@$(CURLJ) -X PUT "$(BASE_URL)/categories/1" \
		-d '{"category":{"name":"Electronica_edit","description":"Actualizada"}}'

## cat-update-2: actualiza solo el name de la categoria id=2
cat-update-2:
	@echo ">> PUT /categories/2  (actualiza solo name)"
	@$(CURLJ) -X PUT "$(BASE_URL)/categories/2" \
		-d '{"category":{"name":"NuevoNombre"}}'

## cat-update-3: sin wrapper "category" (probable 400 Bad request)
cat-update-3:
	@echo ">> PUT /categories/1  (sin wrapper category, probable 400)"
	@$(CURLJ) -X PUT "$(BASE_URL)/categories/1" \
		-d '{"name":"sinwrapper"}'

## cat-update: corre los 3 escenarios de update
cat-update: cat-update-1 cat-update-2 cat-update-3

# ---------------------------------------------------------------------------
# DELETE /categories/:id  -> delete  (3 escenarios con distinto id)
# ---------------------------------------------------------------------------

## cat-delete-1: elimina categoria id=1
cat-delete-1:
	@echo ">> DELETE /categories/1"
	@$(CURL) -X DELETE "$(BASE_URL)/categories/1"

## cat-delete-2: elimina categoria id=2
cat-delete-2:
	@echo ">> DELETE /categories/2"
	@$(CURL) -X DELETE "$(BASE_URL)/categories/2"

## cat-delete-3: elimina categoria id=999 (probable 404 NotFoundError)
cat-delete-3:
	@echo ">> DELETE /categories/999  (probable 404)"
	@$(CURL) -X DELETE "$(BASE_URL)/categories/999"

## cat-delete: corre los 3 escenarios de delete
cat-delete: cat-delete-1 cat-delete-2 cat-delete-3

# ===========================================================================
# SUBCATEGORY
# ===========================================================================

# ---------------------------------------------------------------------------
# GET /subcategories  -> findAll  (3 escenarios con distinta paginacion)
# ---------------------------------------------------------------------------

## subcategories-1: primera pagina, 5 registros
subcategories-1:
	@echo ">> GET /subcategories?limit=5&offset=0  (primera pagina, 5 registros)"
	@$(CURL) "$(BASE_URL)/subcategories?limit=5&offset=0"

## subcategories-2: segunda pagina, 10 registros
subcategories-2:
	@echo ">> GET /subcategories?limit=10&offset=10  (segunda pagina, 10 registros)"
	@$(CURL) "$(BASE_URL)/subcategories?limit=10&offset=10"

## subcategories-3: sin query params (usa defaults limit=10 offset=0)
subcategories-3:
	@echo ">> GET /subcategories  (sin params, defaults limit=10 offset=0)"
	@$(CURL) "$(BASE_URL)/subcategories"

## subcategories: corre los 3 escenarios de findAll
subcategories: subcategories-1 subcategories-2 subcategories-3

# ---------------------------------------------------------------------------
# GET /subcategories/:id  -> findOne  (3 escenarios con distinto id)
# ---------------------------------------------------------------------------

## subcategory-1: subcategoria id=1
subcategory-1:
	@echo ">> GET /subcategories/1"
	@$(CURL) "$(BASE_URL)/subcategories/1"

## subcategory-2: subcategoria id=42
subcategory-2:
	@echo ">> GET /subcategories/42"
	@$(CURL) "$(BASE_URL)/subcategories/42"

## subcategory-3: subcategoria id=999 (probable 404 NotFoundError)
subcategory-3:
	@echo ">> GET /subcategories/999  (probable 404)"
	@$(CURL) "$(BASE_URL)/subcategories/999"

## subcategory: corre los 3 escenarios de findOne
subcategory: subcategory-1 subcategory-2 subcategory-3

# ---------------------------------------------------------------------------
# POST /subcategories  -> create  (3 escenarios con distinto body)
# ---------------------------------------------------------------------------

## sub-create-1: subcategoria valida completa (con categoria padre)
sub-create-1:
	@echo ">> POST /subcategories  (subcategoria valida completa)"
	@$(CURLJ) -X POST "$(BASE_URL)/subcategories" \
		-d '{"name":"Celulares","description":"Telefonos moviles","categoryId":1}'

## sub-create-2: subcategoria valida solo con name y categoryId (description opcional)
sub-create-2:
	@echo ">> POST /subcategories  (solo name y categoryId, description opcional)"
	@$(CURLJ) -X POST "$(BASE_URL)/subcategories" \
		-d '{"name":"Novelas","categoryId":1}'

## sub-create-3: categoryId inexistente (probable 404 NotFoundError de Category)
sub-create-3:
	@echo ">> POST /subcategories  (categoryId inexistente, probable 404)"
	@$(CURLJ) -X POST "$(BASE_URL)/subcategories" \
		-d '{"name":"Huerfana","categoryId":999}'

## sub-create: corre los 3 escenarios de create
sub-create: sub-create-1 sub-create-2 sub-create-3

# ---------------------------------------------------------------------------
# PUT /subcategories/:id  -> update  (3 escenarios; body envuelto en "subcategory")
# ---------------------------------------------------------------------------

## sub-update-1: actualiza varios campos de la subcategoria id=1
sub-update-1:
	@echo ">> PUT /subcategories/1  (actualiza varios campos)"
	@$(CURLJ) -X PUT "$(BASE_URL)/subcategories/1" \
		-d '{"subcategory":{"name":"Celulares_edit","description":"Actualizada","categoryId":1}}'

## sub-update-2: actualiza solo el name de la subcategoria id=2
sub-update-2:
	@echo ">> PUT /subcategories/2  (actualiza solo name)"
	@$(CURLJ) -X PUT "$(BASE_URL)/subcategories/2" \
		-d '{"subcategory":{"name":"NuevoNombre"}}'

## sub-update-3: sin wrapper "subcategory" (probable 400 Bad request)
sub-update-3:
	@echo ">> PUT /subcategories/1  (sin wrapper subcategory, probable 400)"
	@$(CURLJ) -X PUT "$(BASE_URL)/subcategories/1" \
		-d '{"name":"sinwrapper"}'

## sub-update: corre los 3 escenarios de update
sub-update: sub-update-1 sub-update-2 sub-update-3

# ---------------------------------------------------------------------------
# DELETE /subcategories/:id  -> delete  (3 escenarios con distinto id)
# ---------------------------------------------------------------------------

## sub-delete-1: elimina subcategoria id=1
sub-delete-1:
	@echo ">> DELETE /subcategories/1"
	@$(CURL) -X DELETE "$(BASE_URL)/subcategories/1"

## sub-delete-2: elimina subcategoria id=2
sub-delete-2:
	@echo ">> DELETE /subcategories/2"
	@$(CURL) -X DELETE "$(BASE_URL)/subcategories/2"

## sub-delete-3: elimina subcategoria id=999 (probable 404 NotFoundError)
sub-delete-3:
	@echo ">> DELETE /subcategories/999  (probable 404)"
	@$(CURL) -X DELETE "$(BASE_URL)/subcategories/999"

## sub-delete: corre los 3 escenarios de delete
sub-delete: sub-delete-1 sub-delete-2 sub-delete-3

# ---------------------------------------------------------------------------
# GET /categories/:categoryId/subcategories  -> findByCategory  (3 escenarios)
# ---------------------------------------------------------------------------

## cat-subs-1: subcategorias de la categoria id=1
cat-subs-1:
	@echo ">> GET /categories/1/subcategories"
	@$(CURL) "$(BASE_URL)/categories/1/subcategories"

## cat-subs-2: subcategorias de la categoria id=1 con paginacion
cat-subs-2:
	@echo ">> GET /categories/1/subcategories?limit=5&offset=0  (con paginacion)"
	@$(CURL) "$(BASE_URL)/categories/1/subcategories?limit=5&offset=0"

## cat-subs-3: categoria inexistente id=999 (probable 404 NotFoundError)
cat-subs-3:
	@echo ">> GET /categories/999/subcategories  (categoria inexistente, probable 404)"
	@$(CURL) "$(BASE_URL)/categories/999/subcategories"

## cat-subs: corre los 3 escenarios de findByCategory
cat-subs: cat-subs-1 cat-subs-2 cat-subs-3

# ===========================================================================
# SPEND
# ===========================================================================

# ---------------------------------------------------------------------------
# GET /spends  -> findAll  (3 escenarios con distinta paginacion)
# ---------------------------------------------------------------------------

## spends-1: primera pagina, 5 registros
spends-1:
	@echo ">> GET /spends?limit=5&offset=0  (primera pagina, 5 registros)"
	@$(CURL) "$(BASE_URL)/spends?limit=5&offset=0"

## spends-2: segunda pagina, 10 registros
spends-2:
	@echo ">> GET /spends?limit=10&offset=10  (segunda pagina, 10 registros)"
	@$(CURL) "$(BASE_URL)/spends?limit=10&offset=10"

## spends-3: sin query params (usa defaults limit=10 offset=0)
spends-3:
	@echo ">> GET /spends  (sin params, defaults limit=10 offset=0)"
	@$(CURL) "$(BASE_URL)/spends"

## spends: corre los 3 escenarios de findAll
spends: spends-1 spends-2 spends-3

# ---------------------------------------------------------------------------
# GET /spends/:id  -> findOne  (3 escenarios con distinto id)
# ---------------------------------------------------------------------------

## spend-1: gasto id=1
spend-1:
	@echo ">> GET /spends/1"
	@$(CURL) "$(BASE_URL)/spends/1"

## spend-2: gasto id=42
spend-2:
	@echo ">> GET /spends/42"
	@$(CURL) "$(BASE_URL)/spends/42"

## spend-3: gasto id=999 (probable 404 NotFoundError)
spend-3:
	@echo ">> GET /spends/999  (probable 404)"
	@$(CURL) "$(BASE_URL)/spends/999"

## spend: corre los 3 escenarios de findOne
spend: spend-1 spend-2 spend-3

# ---------------------------------------------------------------------------
# POST /spends  -> create  (3 escenarios con distinto body)
# ---------------------------------------------------------------------------

## spend-create-1: gasto valido completo
spend-create-1:
	@echo ">> POST /spends  (gasto valido completo)"
	@$(CURLJ) -X POST "$(BASE_URL)/spends" \
		-d '{"name":"Almuerzo","amount":12500.5,"userId":1,"subcategoryId":1}'

## spend-create-2: otro gasto valido
spend-create-2:
	@echo ">> POST /spends  (otro gasto valido)"
	@$(CURLJ) -X POST "$(BASE_URL)/spends" \
		-d '{"name":"Transporte","amount":990,"userId":1,"subcategoryId":1}'

## spend-create-3: subcategoryId inexistente (probable 404 NotFoundError)
spend-create-3:
	@echo ">> POST /spends  (subcategoryId inexistente, probable 404)"
	@$(CURLJ) -X POST "$(BASE_URL)/spends" \
		-d '{"name":"Fantasma","amount":100,"userId":1,"subcategoryId":999}'

## spend-create: corre los 3 escenarios de create
spend-create: spend-create-1 spend-create-2 spend-create-3

# ---------------------------------------------------------------------------
# PUT /spends/:id  -> update  (3 escenarios; body envuelto en "spend")
# ---------------------------------------------------------------------------

## spend-update-1: actualiza varios campos del gasto id=1
spend-update-1:
	@echo ">> PUT /spends/1  (actualiza varios campos)"
	@$(CURLJ) -X PUT "$(BASE_URL)/spends/1" \
		-d '{"spend":{"name":"Almuerzo_edit","amount":13000}}'

## spend-update-2: actualiza solo el amount del gasto id=2
spend-update-2:
	@echo ">> PUT /spends/2  (actualiza solo amount)"
	@$(CURLJ) -X PUT "$(BASE_URL)/spends/2" \
		-d '{"spend":{"amount":1500.75}}'

## spend-update-3: sin wrapper "spend" (probable 400 Bad request)
spend-update-3:
	@echo ">> PUT /spends/1  (sin wrapper spend, probable 400)"
	@$(CURLJ) -X PUT "$(BASE_URL)/spends/1" \
		-d '{"amount":1}'

## spend-update: corre los 3 escenarios de update
spend-update: spend-update-1 spend-update-2 spend-update-3

# ---------------------------------------------------------------------------
# DELETE /spends/:id  -> delete  (3 escenarios con distinto id)
# ---------------------------------------------------------------------------

## spend-delete-1: elimina gasto id=1
spend-delete-1:
	@echo ">> DELETE /spends/1"
	@$(CURL) -X DELETE "$(BASE_URL)/spends/1"

## spend-delete-2: elimina gasto id=2
spend-delete-2:
	@echo ">> DELETE /spends/2"
	@$(CURL) -X DELETE "$(BASE_URL)/spends/2"

## spend-delete-3: elimina gasto id=999 (probable 404 NotFoundError)
spend-delete-3:
	@echo ">> DELETE /spends/999  (probable 404)"
	@$(CURL) -X DELETE "$(BASE_URL)/spends/999"

## spend-delete: corre los 3 escenarios de delete
spend-delete: spend-delete-1 spend-delete-2 spend-delete-3

# ---------------------------------------------------------------------------
# GET /users/:id_user/spends?subcategory=<id>  -> findByUserAndSubcategory
# ---------------------------------------------------------------------------

## user-spends-1: gastos del user id=1 en la subcategory id=1
user-spends-1:
	@echo ">> GET /users/1/spends?subcategory=1"
	@$(CURL) "$(BASE_URL)/users/1/spends?subcategory=1"

## user-spends-2: gastos del user id=1 en la subcategory id=1 con paginacion
user-spends-2:
	@echo ">> GET /users/1/spends?subcategory=1&limit=5&offset=0  (con paginacion)"
	@$(CURL) "$(BASE_URL)/users/1/spends?subcategory=1&limit=5&offset=0"

## user-spends-3: subcategory inexistente (probable 404 NotFoundError)
user-spends-3:
	@echo ">> GET /users/1/spends?subcategory=999  (subcategory inexistente, probable 404)"
	@$(CURL) "$(BASE_URL)/users/1/spends?subcategory=999"

## user-spends: corre los 3 escenarios de user->spends
user-spends: user-spends-1 user-spends-2 user-spends-3

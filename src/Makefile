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
        cat-delete-1 cat-delete-2 cat-delete-3

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

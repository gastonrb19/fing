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
        update-1 update-2 update-3

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

# Makefile para probar los endpoints de la API de usuarios
# Uso: make <comando>   (ej: make list, make users-1, make user-2)

BASE_URL ?= http://localhost:8000
CURL = curl -s -w "\n[HTTP %{http_code}]\n"

.DEFAULT_GOAL := list
.PHONY: list users user \
        users-1 users-2 users-3 \
        user-1 user-2 user-3

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
	@echo "Extras:  make users  (corre los 3 escenarios de findAll)"
	@echo "         make user   (corre los 3 escenarios de findOne)"
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

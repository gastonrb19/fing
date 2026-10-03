.PHONY: test typecheck all

# Verifica errores de tipado de TypeScript
typecheck:
	@echo "🔍 Corriendo comprobación de tipos (TypeScript)..."
	npm run typecheck

# Corre la suite de pruebas unitarias
test:
	@echo "🧪 Ejecutando Casos de Uso..."
	npx tsx --test tests/**/*.test.ts

# Corre todo junto
all: typecheck test

.PHONY: help up down restart build logs ps backend-shell frontend-shell test

help:
	@echo "CodeQuest 2026 — Comandos del Monorepo"
	@echo ""
	@echo "  make up             Levantar servicios con Docker Compose en segundo plano"
	@echo "  make down           Detener y limpiar contenedores"
	@echo "  make restart        Reiniciar todos los servicios"
	@echo "  make build          Reconstruir imágenes de Docker"
	@echo "  make logs           Visualizar logs de los servicios en tiempo real"
	@echo "  make ps             Verificar estado de los contenedores"
	@echo "  make backend-shell  Abrir sesión interactiva en el contenedor backend"
	@echo "  make frontend-shell Abrir sesión interactiva en el contenedor frontend"
	@echo "  make migrate        Ejecutar migraciones en el backend"
	@echo "  make seed           Poblar base de datos con seeders"
	@echo "  make test           Ejecutar pruebas del backend"

up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose restart

build:
	docker compose build

logs:
	docker compose logs -f

ps:
	docker compose ps

backend-shell:
	docker compose exec backend sh

frontend-shell:
	docker compose exec frontend sh

migrate:
	docker compose exec backend php artisan migrate

seed:
	docker compose exec backend php artisan db:seed

test:
	docker compose exec backend php artisan test

.PHONY: help build up dev down logs shell clean npm-%

help:
	@echo "Product Manager Dev Container Commands"
	@echo "========================================"
	@echo "  make build        - Build the dev container image"
	@echo "  make up           - Start containers in background"
	@echo "  make dev          - Start containers in foreground (interactive)"
	@echo "  make down         - Stop and remove containers"
	@echo "  make logs         - Follow container logs"
	@echo "  make shell        - Open shell in running container"
	@echo "  make clean        - Remove containers, images and volumes"
	@echo "  make npm-*        - Run npm scripts (e.g. make npm-start, make npm-lint)"

# Build the container
build:
	docker-compose build --no-cache

# Start in background
up:
	docker-compose up -d
	@echo "✓ Container started. Use 'make logs' to view output"

# Start in foreground (useful during development)
dev:
	docker-compose up

# Stop containers
down:
	docker-compose down

# View live logs
logs:
	docker-compose logs -f app

# Open shell in container
shell:
	docker-compose exec app bash

# Clean up everything
clean:
	docker-compose down -v
	docker rmi product-manager-dev:latest || true

# Run npm commands inside container
# Usage: make npm-start, make npm-lint, etc.
npm-%:
	docker-compose exec app npm run $*

# Developer convenience Makefile for product-manager

.PHONY: up down build logs attach mise-install mise-use dev

# Build and run docker compose
up:
	docker compose up --build -d

# Run in foreground
dev:
	docker compose up --build

# Stop and cleanup
down:
	docker compose down

# Build image without starting
build:
	docker compose build --no-cache

# Attach to container shell
attach:
	docker compose exec app bash

# View logs
logs:
	docker compose logs -f --tail=200

# Install tools via mise inside the dev container
# This will create Node and other tools defined in mise.toml
mise-install:
	docker compose exec app bash -lc "~/.local/bin/mise install || echo 'mise not found; install locally with curl https://mise.run | sh'"

# Use a specific node version from the host or container
mise-use:
	@echo "Use: make mise-use MISE_NODE=22"
	if [ -z "$(MISE_NODE)" ]; then echo "Set MISE_NODE"; exit 1; fi
	docker compose exec app bash -lc "~/.local/bin/mise use --global node@$(MISE_NODE) || echo 'failed to use'; ~/.local/bin/mise --version"

# Run npm scripts inside container
npm-%:
	docker compose exec app bash -lc "npm run $*"

DC := docker-compose -f docker-compose.yml
DEV_COMPOSE_FILE := docker-compose.dev.yml

# Start in prod mode (default)
.PHONY: start
start:
	$(DC) up -d

# Build the stack
.PHONY: build
build:
	$(DC) build

# Bring the stack down
.PHONY: down
down:
	$(DC) down

############### DEV ###############
# Set default compose command to use the base AND dev compose file
.PHONY: use-dev
use-dev:
	$(eval DC := $(DC) -f $(DEV_COMPOSE_FILE))

# Use start AFTER we append dev compose file
.PHONY: dev
dev: use-dev build start

# Watch mode to tail logs
.PHONY: watch
watch: use-dev
	$(DC) up

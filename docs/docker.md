# Docker & Node setup for development

This project is an Electron app using Node + SQLite. These instructions show how to install Node locally and run the project via Docker / Docker Compose for development.

## 1) Install Node (recommended: nvm)

Install nvm (Node Version Manager) and use it to install Node LTS (recommended):

```bash
# install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.6/install.sh | bash
# re-open your shell or source nvm script
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
# install node LTS
nvm install --lts
# check node version
node -v
npm -v
```

Alternative (Debian/Ubuntu):

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## 2) Install Docker on Linux

Official Docker installation (Debian/Ubuntu) commands:

```bash
# 1) Setup repository
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg lsb-release
mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 2) Manage docker as non-root (log out/in)
sudo usermod -aG docker $USER
```

Then verify with:

```bash
docker --version
docker compose version
```

Note: on some distros `docker-compose` is a separate tool; we use `docker compose` plugin.

## 3) Start the dev environment with Docker Compose

From the project root run:

```bash
# Build the dev image and start the app service (mounted to your working directory)
docker compose up --build

# To run in background
docker compose up --build -d

# To stop and cleanup containers
docker compose down
```

This compose file mounts your project into the container and runs `npm run start`. Node modules are kept in an anonymous volume to avoid permission problems.

- The SQLite database used in dev mode is stored in `./public/database.db` by default (the project will create it if missing).

## 4) Using VS Code Remote - Containers

A devcontainer configuration is provided in `.devcontainer/` and is set to use the `docker-compose.yml` service named `app`. Open the folder in a dev container via the VS Code command palette: `Remote-Containers: Reopen in Container`.

## 5) Notes & Tips

- If you need different Node versions in CI or for packaging, update the `FROM node:N.x` line in `.devcontainer/Dockerfile`.
- For packaging Electron binaries, extra system dependencies (libXtst, libgtk, etc.) may be required; the Dockerfile has a minimal set which works for many setups but you may need to add more depending on the platform.

If you'd like, I can also add a small `Makefile` or `npm` scripts to streamline the docker commands.

## 6) Using mise (mise-en-place) to manage tools and Node versions ⚙️

`mise` (https://mise.jdx.dev/) is a lightweight tool manager that can install and pin developer tools such as Node, Go, Terraform, etc. It is a great choice to lock to a specific Node version across contributors and CI.

Quick steps to install mise locally:

```bash
# Install mise (single-line install)
curl https://mise.run | sh

# Hook mise into your shell (bash example)
echo 'eval "$(~/.local/bin/mise activate bash)"' >> ~/.bashrc
source ~/.bashrc

# Then install and select Node (example: install Node 22)
~/.local/bin/mise install node@22
~/.local/bin/mise use --global node@22

# Verify node version
node -v
```

Add a `mise.toml` to your project to pin tools and versions. Example `mise.toml`:

```toml
[tools]
node = "22"

[env]
# example environment variables
NODE_ENV = "development"

[tasks]
build = { run = "npm run build" }
```

Then contributors can simply run:

```bash
mise install     # installs tools from mise.toml
mise run build   # run project task
```

If you use VS Code Remote - Containers, the devcontainer is configured to run `mise install` during the post-create step. This will ensure the pinned Node version and tools get installed automatically for contributors that open the project in a container.

If you prefer to install `mise` inside the dev container itself, modify the Dockerfile or the `postCreateCommand` to run the `curl https://mise.run | sh` installer; the devcontainer currently includes a post-create command that attempts to install `mise` on container creation.

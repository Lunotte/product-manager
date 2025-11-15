# Dev container Dockerfile for Node development
# Use Node LTS - 18 or adapt to your needs (18 is widely supported for Electron builds)
FROM node:18-bullseye-slim

# Avoid interactive prompts
ENV DEBIAN_FRONTEND=noninteractive

# Install OS-level dependencies required by native packages and electron (simplified)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    python3 \
    git \
    curl \
    ca-certificates \
    libgtk-3-0 \
    libx11-xcb1 \
    libasound2 \
    libgconf-2-4 \
    libnss3 \
    libgdk-pixbuf2.0-0 \
    libxss1 \
    libxtst6 \
    libx11-6 \
    libdbus-glib-1-2 \
    libgbm1 \
    libcairo2 \
    libpango-1.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Create app dir
WORKDIR /workspace

# Use non-root user for better dev security
RUN groupadd -r node && useradd -r -g node -m node

# Install mise (mise-en-place) for managing dev tools in the container
# - installs into root's ~/.local/bin by default, then create a symlink into /usr/local/bin
# - add a small activation script so shells will automatically load mise
RUN curl -fsSL https://mise.run | sh \
    && ln -sf /root/.local/bin/mise /usr/local/bin/mise \
    && echo 'eval "$(mise activate bash)"' > /etc/profile.d/mise.sh \
    && chmod +x /etc/profile.d/mise.sh || true

# Copy only package files first for better caching
COPY package.json package-lock.json* ./

# Install dependencies as the non-root user
RUN chown -R node:node /workspace
USER node
RUN npm ci --silent || npm install --silent

# Copy rest of the sources
COPY --chown=node:node . /workspace

# Expose commonly used development port (adjust if you run a server)
EXPOSE 3000

# Default command to start the app - you can override with docker-compose command.
CMD ["bash", "-lc", "npm run start"]

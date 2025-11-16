# Dev container for Electron + React + TypeScript project
FROM mcr.microsoft.com/devcontainers/javascript-node:20-bullseye

# Install system dependencies required for Electron and native modules
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    python3 \
    pkg-config \
    libx11-dev \
    libxext-dev \
    libxss-dev \
    libappindicator1 \
    gconf-service \
    libgconf-2-4 \
    libnotify-dev \
    libxkbfile-dev \
    xdg-utils \
    libgbm-dev \
    libcairo2-dev \
    libnss3-dev \
    libxrandr-dev \
    libpango-1.0-0 \
    libgdk-pixbuf2.0-0 \
    libdrm-dev \
    libglu1-mesa \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspaces

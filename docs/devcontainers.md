# Dev Containers Setup Guide

This project uses **Dev Containers** to provide a consistent, reproducible development environment for Electron + React + TypeScript development.

## Quick Start with VS Code

1. **Install Prerequisites**
   - [Docker Desktop](https://www.docker.com/products/docker-desktop)
   - [VS Code](https://code.visualstudio.com/)
   - [VS Code Remote - Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

2. **Open in Dev Container**
   - Clone and open the repository folder in VS Code
   - Press `Ctrl+Shift+P` (Cmd+Shift+P on macOS)
   - Search for "Dev Containers: Reopen in Container"
   - VS Code will build and start the container automatically

3. **Done!**
   - You now have Node 20, npm, and all Electron dependencies installed
   - The entire project is mounted and ready for development
   - Run `npm run start` to launch the Electron app

## Manual Docker Compose Commands

If you prefer to manage containers manually:

```bash
# Build the image
make build

# Start in foreground (see logs in real-time)
make dev

# Start in background
make up

# View logs
make logs

# Open a shell in the container
make shell

# Stop containers
make down

# Clean up everything
make clean
```

Or use `docker-compose` directly:

```bash
docker-compose up
docker-compose exec app bash
docker-compose down
```

## Project Structure

- `.devcontainer/devcontainer.json` - VS Code dev container configuration
- `.devcontainer/Dockerfile` - Container image definition (Node 20 + Electron dependencies)
- `docker-compose.yml` - Docker Compose service definition
- `Makefile` - Convenient shortcut commands
- `mise.toml` - Tool version management (optional)

## What's Included

The dev container includes:

- **Node.js 20** (LTS) with npm
- **TypeScript** support
- **Python3** (required for native module builds)
- **build-essential** (C/C++ compiler tools)
- **Electron dependencies** (GTK, X11, audio libraries, etc.)
- **Git** support

## Port Forwarding

The container exposes:
- **Port 3000** - Electron development server
- **Port 5173** - Secondary dev server (if needed)

## Database: SQLite

Your project uses **SQLite**, which is automatically embedded in the Electron application. Key points:

- **Storage Location**: `public/database.db` (in development)
- **No external database required** - SQLite runs within the Electron process
- **Advantages**:
  - ✅ Zero configuration
  - ✅ Single-file database (easy backup)
  - ✅ Works offline
  - ✅ Perfect for desktop apps
  - ✅ Cross-platform (Windows, Mac, Linux)

## Troubleshooting

### Container won't build
- Check Docker Desktop is running
- Delete old images: `make clean`
- Rebuild: `make build`

### Port conflicts
- Change the port mapping in `docker-compose.yml` if ports 3000 or 5173 are in use
- Example: change `"3000:3000"` to `"3001:3000"`

### Permission issues on Linux
- Add your user to the docker group: `sudo usermod -aG docker $USER`
- Log out and back in, or run: `newgrp docker`

### SQLite database not persisting
- The database file should be stored in the workspace volume (`./public/database.db`)
- Ensure the directory has proper permissions
- Check that migrations have run via `src/db/database.ts`

## Environment Variables

The dev container sets:
- `NODE_ENV=development`

Additional environment variables can be added in `docker-compose.yml` under the `environment:` section.

## Development Workflow

### With VS Code Remote Containers

1. Open folder in container (auto-setup)
2. Use VS Code terminals normally (they run inside the container)
3. Run `npm run start` from the integrated terminal
4. The Electron app window appears on your host

### With Docker CLI

1. Start container: `make up` or `docker-compose up -d`
2. Execute commands: `docker-compose exec app npm run start`
3. Shell access: `docker-compose exec app bash`
4. View logs: `make logs`

## SQLite Considerations & Recommendations

### Current Setup
Your app uses `better-sqlite3`, which:
- Synchronous operations (blocks until complete)
- Perfect for small-to-medium datasets
- Direct file-based storage with migrations

### Why SQLite is Ideal for Electron

| Aspect | SQLite | PostgreSQL |
|--------|--------|-----------|
| **Setup** | None | Server + container |
| **Deployment** | Single file | Network server |
| **Maintenance** | Zero | Database administration |
| **Offline support** | ✅ Built-in | ❌ Requires sync logic |
| **App size** | Small | Large |

### When to Consider PostgreSQL
If your app eventually needs:
- Real-time collaborative editing (multiple users)
- Server-side business logic
- Complex multi-user transactions
- Migration to a web app

For now, **SQLite is the right choice** for a desktop Electron app.

### Migration Strategy

Your project uses Flyway-style migrations in `migrations/`:
- `V0__init.sql` - Initial schema
- `V1__creer_contact.sql` - Add contacts table
- `V2__contact_email_tel.sql` - Extend contacts

To add a new migration:
1. Create `migrations/V3__your_feature.sql`
2. Add SQL statements
3. The app automatically runs migrations on startup (see `src/db/database.ts`)

### Backing Up Development Database

```bash
# Copy database file from container to host
docker-compose exec app cp public/database.db ./backup_$(date +%s).db

# Or just back up the local file when not in a container
cp public/database.db public/database.db.backup
```

## Dépannage : "No space left on device" (erreur pendant le démarrage)

Cause fréquente : l'erreur "tar: write error: No space left on device" dans les logs de Remote - Containers signifie que le disque **du backend Docker/WSL** s'est rempli pendant l'extraction du serveur VS Code ou pendant la construction de l'image.

Points importants à savoir :
- L'espace disque affiché sur Windows (ex. 300 GiB de libre) n'est pas forcément utilisable directement par le conteneur : Docker Desktop WSL2 utilise un disque virtuel (ext4.vhdx) qui peut être configuré ou limité dans Docker Desktop.
- L'erreur s'est produite pendant l'extraction d'un archive tar vers `/root/.vscode-remote-containers/` dans la distribution `docker-desktop` (WSL) — c'est donc bien l'espace libre dans Docker/WSL qui manque.

Étapes de diagnostic & résolution (non destructif):

1. Vérifier l'espace disponible dans le backend Docker/WSL :

```powershell
# Vérifier occupation Docker
docker system df

# Vérifier taille du disque dans la distro docker-desktop (WSL)
wsl -d docker-desktop -- df -h
wsl -d docker-desktop -- du -sh /var/lib/docker || true
```

2. Si l'espace est faible, nettoyez les images/volumes non utilisées (privilégier d'abord l'inspection) :

```powershell
# Lister images et volumes volumineux
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.ID}}"
docker volume ls
docker volume inspect <volume>

# Nettoyage rapide (destructif pour les images non référencées)
docker system prune -a --volumes --force
```

3. Si Docker Desktop a une limite de disque (paramétrée), changez-la dans l'UI : `Settings -> Resources -> Advanced -> Disk image size` (augmenter si nécessaire), puis Redémarrer Docker Desktop.

4. Si vous préférez ne pas tout supprimer, retirez uniquement les images ou volumes inutiles identifiés à l'étape 2.

5. Relancer le dev container depuis VS Code : "Dev Containers: Reopen in Container".

6. Si le message d'erreur se reproduit mais à un autre moment (ex. lors de `npm ci`), ouvrez un shell dans le container et regardez les logs npm :

```powershell
docker compose exec app bash
# puis dans le container
tail -f /root/.npm/_logs/* || true
```

Notes et bonnes pratiques :
- Docker Desktop conserve un cache de builds/images : `docker builder prune` et `docker image prune` peuvent aider.
- Si vous avez des volumes persistants anciens, supprimez-les avec `docker volume rm` (inspectez d'abord).
- Éviter de monter `node_modules` à la racine du workspace sans un volume (nous utilisons un volume dédié `/workspace/node_modules` dans `docker-compose.yml`).

## Augmenter la taille du disque pour WSL / Docker Desktop

Si vous utilisez Docker Desktop avec backend WSL2, certaines opérations (extraction du serveur VS Code, build docker) peuvent échouer si la partition WSL associée (ex. `docker-desktop`) est pleine. Voici comment augmenter l'espace disponible :

### 1) Méthode recommandée — utiliser Docker Desktop (facile)

1. Ouvrez Docker Desktop
2. Allez dans `Settings` → `Resources` → `Advanced`
3. Ajustez **Disk image size** (ex: augmentez à 64 GiB selon vos besoins)
4. Cliquez sur `Apply & Restart`

Après redémarrage, la distribution `docker-desktop` disposera d'un plus grand disque virtuel et les extractions (`tar`) trop volumineuses ne devraient plus échouer.

### 2) Méthode avancée — ré-importer / resize (si nécessaire)

Attention : les commandes ci-dessous peuvent entraîner la perte de données non sauvegardées si vous ne prenez pas de précautions. Sauvegardez avant d'exécuter.

1. Arrêtez WSL et Docker Desktop :

```powershell
wsl --shutdown
```

2. Exportez la distribution (exemple pour `docker-desktop-data`) :

```powershell
wsl --export docker-desktop-data C:\tmp\docker-desktop-data-backup.tar
```

3. Supprimez / désenregistrez la distribution :

```powershell
wsl --unregister docker-desktop-data
```

4. Ré-importez (le nouveau VHD prend souvent automatiquement plus d'espace) :

```powershell
wsl --import docker-desktop-data C:\wsl\docker-desktop-data C:\tmp\docker-desktop-data-backup.tar --version 2
```

5. Redémarrez Docker Desktop.

Alternative (PowerShell + Hyper-V) — si vous préférez redimensionner le fichier `.vhdx` directement :

1. Localisez le fichier (ex: `%USERPROFILE%\\AppData\\Local\\Docker\\wsl\\docker-desktop-data\\ext4.vhdx`)
2. Ouvrez PowerShell en admin et exécutez :

```powershell
# Stop WSL first
wsl --shutdown

# Then expand the VHD size (example: 64GB)
Resize-VHD -Path "$env:USERPROFILE\\AppData\\Local\\Docker\\wsl\\docker-desktop-data\\ext4.vhdx" -SizeBytes 64GB
```

Note: `Resize-VHD` nécessite le module Hyper-V (Install-WindowsFeature -Name Hyper-V) et privilèges admin; si vous n'avez pas Hyper-V, utilisez plutôt la méthode Docker Desktop UI.

### 3) Après l'augmentation

- Démarrez Docker Desktop
- Vérifiez l'utilisation depuis PowerShell :

```powershell
# check WSL distro disk usage
wsl -d docker-desktop -- df -h

# check docker reclaimable space (optionnel)
docker system df
```

Ces étapes vous permettent d'augmenter la taille du disque utilisé par Docker/WSL. Pour la plupart des utilisateurs, la méthode la plus simple et sûre est d'utiliser l'UI de Docker Desktop (option 1).

## Next Steps

- Read `src/db/database.ts` to understand database initialization
- Check migrations in `migrations/` to see schema
- Review Electron configuration in `forge.config.ts`
- Start developing! 🚀

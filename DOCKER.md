# 🐳 Docker Guide - RoyalMatch

Guide complet pour utiliser Docker avec RoyalMatch.

## Prérequis

- Docker Desktop 20.10+
- Docker Compose 2.0+

## Installation rapide

### 1. Cloner le projet

```bash
git clone https://github.com/yourusername/royalmatch.git
cd royalmatch
```

### 2. Configurer les variables d'environnement

Copiez le fichier `.env.example` et ajustez les valeurs :

```bash
cp .env.example .env
```

Modifiez `.env` avec vos propres valeurs (notamment `DB_PASSWORD` et `APP_KEY`).

### 3. Lancer l'application

```bash
npm run docker:dev
```

L'application sera accessible sur :

- **Frontend** : http://localhost:4200
- **Backend** : http://localhost:3333
- **PostgreSQL** : localhost:5432

## Scripts disponibles

### Développement

```bash
# Lancer tous les services
npm run docker:dev

# Lancer avec rebuild des images
npm run docker:dev:build

# Arrêter tous les services
npm run docker:down

# Arrêter et supprimer les volumes (⚠️ perte de données)
npm run docker:clean

# Voir les logs de tous les services
npm run docker:logs

# Voir les logs du backend uniquement
npm run docker:logs:backend

# Voir les logs du frontend uniquement
npm run docker:logs:frontend

# Voir l'état des conteneurs
npm run docker:ps

# Redémarrer tous les services
npm run docker:restart
```

### Production

```bash
# Lancer en mode production
npm run docker:prod

# Lancer avec rebuild des images
npm run docker:prod:build

# Arrêter la production
npm run docker:prod:down
```

## Architecture Docker

### Services

#### 1. PostgreSQL (`postgres`)

- **Image** : `postgres:15-alpine`
- **Port** : 5432
- **Volume** : `postgres_data` (données persistantes)
- **Health check** : `pg_isready`

#### 2. Redis (`redis`)

- **Image** : `redis:7-alpine`
- **Port** : 6379
- **Volume** : `redis_data` (données persistantes)
- **Health check** : `redis-cli ping`

#### 3. Backend (`backend`)

- **Dockerfile** : `server/Dockerfile`
- **Port** : 3333
- **Hot reload** : Activé en développement
- **Dépendances** : PostgreSQL, Redis

#### 4. Frontend (`frontend`)

- **Dockerfile** : `client/Dockerfile`
- **Port** : 4200 (dev) / 80 (prod)
- **Hot reload** : Activé en développement
- **Dépendances** : Backend

### Volumes

- `postgres_data` : Données PostgreSQL persistantes
- `redis_data` : Données Redis persistantes

### Network

- `royalmatch-network` : Bridge network pour la communication inter-services

## Développement avec Docker

### Hot Reload

Le hot reload est activé automatiquement en mode développement :

- **Backend** : Les changements dans `server/` sont détectés
- **Frontend** : Les changements dans `client/` sont détectés

### Accéder aux conteneurs

```bash
# Backend
docker exec -it royalmatch-backend sh

# Frontend
docker exec -it royalmatch-frontend sh

# PostgreSQL
docker exec -it royalmatch-postgres psql -U postgres -d royalmatch
```

### Exécuter des commandes

```bash
# Migrations backend
docker exec royalmatch-backend node ace migration:run

# Build backend
docker exec royalmatch-backend npm run build

# Tests backend
docker exec royalmatch-backend npm test

# Build frontend
docker exec royalmatch-frontend npm run build
```

## Production

### Build des images

```bash
npm run docker:prod:build
```

### Images optimisées

Les images de production utilisent des multi-stage builds :

#### Backend

1. **Stage build** : Compilation TypeScript
2. **Stage production** : Node Alpine + fichiers compilés uniquement
3. **Optimisations** :
   - Non-root user (nodejs:1001)
   - Dependencies minimales (--omit=dev)
   - Health check intégré

#### Frontend

1. **Stage build** : Compilation Angular
2. **Stage production** : Nginx Alpine + fichiers statiques
3. **Optimisations** :
   - Gzip activé
   - Cache des assets
   - Proxy API/WebSocket
   - Security headers

### Configuration Nginx (Production)

Le frontend en production utilise Nginx avec :

- Proxy vers le backend (`/api`)
- Proxy WebSocket (`/ws`)
- Gzip compression
- Cache des assets (1 an)
- Security headers (X-Frame-Options, X-XSS-Protection, etc.)
- Health check endpoint (`/health`)

## Troubleshooting

### Les conteneurs ne démarrent pas

```bash
# Vérifier les logs
npm run docker:logs

# Vérifier l'état
npm run docker:ps

# Rebuild complet
npm run docker:clean
npm run docker:dev:build
```

### Problème de connexion PostgreSQL

```bash
# Vérifier que PostgreSQL est prêt
docker exec royalmatch-postgres pg_isready -U postgres

# Vérifier les variables d'environnement
docker exec royalmatch-backend env | grep DB_
```

### Port déjà utilisé

Si un port est déjà utilisé, modifiez les ports dans `docker-compose.yml` ou `.env`.

### Permissions (Linux/macOS)

Si vous rencontrez des problèmes de permissions :

```bash
# Changer le propriétaire
sudo chown -R $USER:$USER .

# Rebuilder les images
npm run docker:dev:build
```

### Réinitialiser complètement

```bash
# Arrêter et supprimer tout
npm run docker:clean

# Supprimer les images
docker rmi royalmatch-backend royalmatch-frontend

# Supprimer les volumes (⚠️ perte de données)
docker volume rm royalmatch_postgres_data royalmatch_redis_data

# Relancer
npm run docker:dev:build
```

## Performance

### Optimiser les builds

Les Dockerfiles utilisent :

- **Layer caching** : `package.json` copié avant le code source
- **Multi-stage builds** : Séparation build/production
- **Alpine images** : Images légères
- **Production dependencies** : Uniquement les dépendances nécessaires

### Volumes

En développement, le code source est monté en volume :

- ✅ Hot reload fonctionnel
- ✅ Pas besoin de rebuild
- ⚠️ Performance légèrement réduite sur Windows/macOS

## Sécurité

### Production

- Non-root users dans les conteneurs
- Variables d'environnement pour les secrets
- Health checks configurés
- Minimal attack surface (Alpine images)
- Security headers (Nginx)

### Bonnes pratiques

1. **Ne jamais** commiter les fichiers `.env`
2. Utiliser des secrets forts pour `APP_KEY` et `DB_PASSWORD`
3. Limiter l'exposition des ports en production
4. Mettre à jour régulièrement les images de base

## CI/CD

Les Dockerfiles sont optimisés pour les pipelines CI/CD :

```bash
# Build
docker compose -f docker-compose.prod.yml build

# Push
docker tag royalmatch-backend:latest registry.example.com/royalmatch-backend
docker push registry.example.com/royalmatch-backend

# Deploy
docker compose -f docker-compose.prod.yml up -d
```

## Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Best practices for writing Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)

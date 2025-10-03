# Tâche 1.4 : Configuration Docker et environnements

## Objectif
Dockeriser l'application pour faciliter le développement et le déploiement.

## Technologies
- Docker
- Docker Compose
- Multi-stage builds

## Actions à réaliser

### Docker Compose pour le développement
Créer un `docker-compose.yml` avec les services :

#### Service PostgreSQL
- Image : postgres:15-alpine
- Port : 5432
- Volume persistant pour les données
- Variables d'environnement (POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD)

#### Service Backend (AdonisJS)
- Dockerfile multi-stage
- Hot reload pour le développement
- Port : 3333
- Dépend de PostgreSQL
- Volume pour le code source

#### Service Frontend (Angular)
- Dockerfile multi-stage
- Hot reload avec ng serve
- Port : 4200
- Proxy vers le backend configuré

#### Service Redis (optionnel, pour les sessions/cache)
- Image : redis:7-alpine
- Port : 6379

### Dockerfiles

#### Backend Dockerfile
```dockerfile
# Stage développement
FROM node:20-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]

# Stage production
FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN node ace build --production
CMD ["node", "server.js"]
```

#### Frontend Dockerfile
```dockerfile
# Stage développement
FROM node:20-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]

# Stage production
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine AS production
COPY --from=build /app/dist/client /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

### Fichiers de configuration

#### .dockerignore
- node_modules
- dist
- .git
- .env (sauf .env.example)

#### .env.example
Créer des exemples de variables d'environnement pour :
- Backend (DB_HOST, DB_PORT, PORT, etc.)
- Frontend (API_URL, WS_URL, etc.)

### Scripts npm
Ajouter des scripts pour faciliter l'utilisation :
- `npm run docker:dev` : lance tous les services en dev
- `npm run docker:build` : build les images de production
- `npm run docker:down` : arrête tous les services

## Points d'attention
- Utiliser des networks Docker pour isoler les services
- Configurer les health checks pour PostgreSQL
- Prévoir des volumes nommés pour la persistance des données
- Utiliser des variables d'environnement pour la configuration
- Optimiser les builds avec des layers cachés
- Sécuriser les containers (non-root user, minimal attack surface)

## Résultat attendu
- `docker-compose up` lance toute l'application
- Hot reload fonctionnel en développement
- Base de données persistante même après redémarrage
- Images optimisées pour la production
- Documentation claire dans un README Docker

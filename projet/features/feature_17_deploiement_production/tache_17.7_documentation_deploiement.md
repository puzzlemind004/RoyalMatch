# Tâche 17.7 : Documentation de déploiement

## README.md de déploiement
```markdown
# RoyalMatch - Guide de déploiement

## Prérequis
- Serveur Ubuntu 22.04 LTS
- Node.js 20 LTS
- PostgreSQL 14+
- Nginx
- Nom de domaine configuré

## Étape 1 : Préparation du serveur
\`\`\`bash
# Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# Installer les dépendances
sudo apt install -y nodejs postgresql nginx
\`\`\`

## Étape 2 : Configuration de la base de données
\`\`\`bash
sudo -u postgres psql
CREATE DATABASE royalmatch_production;
CREATE USER royalmatch WITH ENCRYPTED PASSWORD 'VOTRE_MOT_DE_PASSE';
GRANT ALL PRIVILEGES ON DATABASE royalmatch_production TO royalmatch;
\q
\`\`\`

## Étape 3 : Cloner le projet
\`\`\`bash
cd /var/www
git clone https://github.com/your-username/royalmatch.git
cd royalmatch
\`\`\`

## Étape 4 : Configuration
\`\`\`bash
# Backend
cd server
cp .env.example .env.production
nano .env.production # Modifier les variables

# Installer les dépendances
npm ci --production

# Exécuter les migrations
node ace migration:run --force

# Frontend
cd ../client
npm ci
npm run build --configuration=production
\`\`\`

## Étape 5 : Nginx
\`\`\`bash
sudo cp nginx.conf /etc/nginx/sites-available/royalmatch
sudo ln -s /etc/nginx/sites-available/royalmatch /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
\`\`\`

## Étape 6 : SSL
\`\`\`bash
sudo certbot --nginx -d votre-domaine.com
\`\`\`

## Étape 7 : Lancer l'application
\`\`\`bash
cd /var/www/royalmatch/server
pm2 start server.js --name royalmatch-api
pm2 startup
pm2 save
\`\`\`

## Mises à jour
\`\`\`bash
cd /var/www/royalmatch
git pull origin main
cd server && npm ci --production && node ace migration:run --force
pm2 restart royalmatch-api
\`\`\`

## Troubleshooting

### L'application ne démarre pas
\`\`\`bash
pm2 logs royalmatch-api
\`\`\`

### Problème de connexion à la BDD
Vérifier les credentials dans .env.production

### WebSocket ne fonctionne pas
Vérifier la configuration Nginx pour le proxy WebSocket
\`\`\`
```

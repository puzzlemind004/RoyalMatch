# Tâche 17.1 : Configuration serveur Hostinger

## Prérequis
- Serveur VPS Hostinger
- Ubuntu 22.04 LTS
- Accès SSH

## Installation initiale
```bash
# Se connecter en SSH
ssh root@your-server-ip

# Mettre à jour le système
apt update && apt upgrade -y

# Installer Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Installer PostgreSQL
apt install -y postgresql postgresql-contrib

# Installer Nginx
apt install -y nginx

# Installer PM2 (process manager)
npm install -g pm2

# Installer Docker (optionnel mais recommandé)
curl -fsSL https://get.docker.com | sh
```

## Configuration PostgreSQL
```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Créer la base de données et l'utilisateur
CREATE DATABASE royalmatch_production;
CREATE USER royalmatch WITH ENCRYPTED PASSWORD 'votre_mot_de_passe_fort';
GRANT ALL PRIVILEGES ON DATABASE royalmatch_production TO royalmatch;
\q

# Configurer l'accès distant (si nécessaire)
nano /etc/postgresql/14/main/pg_hba.conf
# Ajouter : host royalmatch_production royalmatch 0.0.0.0/0 md5
```

## Configuration Nginx
```nginx
# /etc/nginx/sites-available/royalmatch
server {
    listen 80;
    server_name votre-domaine.com;

    # Frontend (Angular build)
    location / {
        root /var/www/royalmatch/client/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3333;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket
    location /ws {
        proxy_pass http://localhost:3333;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

## Activer le site
```bash
ln -s /etc/nginx/sites-available/royalmatch /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

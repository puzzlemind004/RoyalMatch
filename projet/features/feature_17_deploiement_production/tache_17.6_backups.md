# Tâche 17.6 : Backups automatiques

Déjà couvert dans tache_17.4_bdd_production.md (section backup)

## Backup complet du serveur
```bash
# Script de backup complet
#!/bin/bash
BACKUP_DIR="/var/backups/full"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup de l'application
tar -czf $BACKUP_DIR/app_$DATE.tar.gz /var/www/royalmatch

# Backup de la BDD (déjà fait dans l'autre script)

# Backup de la config Nginx
tar -czf $BACKUP_DIR/nginx_$DATE.tar.gz /etc/nginx

# Upload vers S3 ou autre stockage distant (optionnel)
# aws s3 cp $BACKUP_DIR s3://your-bucket/backups/ --recursive

echo "Full backup completed"
```

## Restauration
```bash
# Restaurer la BDD
gunzip < /var/backups/royalmatch/royalmatch_20240101_030000.sql.gz | psql -U royalmatch royalmatch_production

# Restaurer l'application
tar -xzf /var/backups/full/app_20240101_030000.tar.gz -C /
```

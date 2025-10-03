# Tâche 17.4 : Base de données production

## Configuration production
```env
# server/.env.production
NODE_ENV=production
PORT=3333
HOST=0.0.0.0
APP_KEY=votre_app_key_generee

DB_CONNECTION=pg
DB_HOST=localhost
DB_PORT=5432
DB_USER=royalmatch
DB_PASSWORD=votre_mot_de_passe_fort
DB_DATABASE=royalmatch_production

SESSION_DRIVER=cookie
CACHE_VIEWS=true
```

## Migrations en production
```bash
cd /var/www/royalmatch/server
node ace migration:run --force
```

## Backup automatique
```bash
# Créer un script de backup
nano /root/backup-db.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/royalmatch"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="royalmatch_$DATE.sql.gz"

mkdir -p $BACKUP_DIR

# Backup de la base de données
pg_dump -U royalmatch royalmatch_production | gzip > $BACKUP_DIR/$FILENAME

# Garder seulement les 30 derniers backups
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Backup completed: $FILENAME"
```

```bash
# Rendre exécutable
chmod +x /root/backup-db.sh

# Ajouter au crontab (tous les jours à 3h du matin)
crontab -e
# Ajouter : 0 3 * * * /root/backup-db.sh
```

## Optimisation PostgreSQL
```sql
-- Analyser et optimiser
VACUUM ANALYZE;

-- Créer des index sur les colonnes fréquemment utilisées
CREATE INDEX idx_games_status ON games(status);
CREATE INDEX idx_game_players_game_id ON game_players(game_id);
CREATE INDEX idx_rounds_game_id ON rounds(game_id);
```

# Database Setup - RoyalMatch

## Prérequis

- PostgreSQL 15+ installé localement
- Node.js 20+ LTS

## Configuration de la base de données

### 1. Installation de PostgreSQL

#### Windows

Télécharger et installer PostgreSQL depuis [postgresql.org](https://www.postgresql.org/download/windows/)

#### macOS

```bash
brew install postgresql@15
brew services start postgresql@15
```

#### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Création de la base de données

Connectez-vous à PostgreSQL en tant que superutilisateur :

```bash
psql -U postgres
```

Créez la base de données :

```sql
CREATE DATABASE royalmatch;
```

Si vous souhaitez utiliser un utilisateur différent :

```sql
CREATE USER royalmatch_user WITH PASSWORD 'your_password';
ALTER DATABASE royalmatch OWNER TO royalmatch_user;
GRANT ALL PRIVILEGES ON DATABASE royalmatch TO royalmatch_user;
```

### 3. Configuration de l'environnement

Vérifiez que votre fichier `.env` contient les bonnes informations :

```env
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_DATABASE=royalmatch
```

Ajustez les valeurs selon votre configuration PostgreSQL.

### 4. Exécution des migrations

Une fois PostgreSQL configuré, exécutez les migrations :

```bash
node ace migration:run
```

Pour vérifier l'état des migrations :

```bash
node ace migration:status
```

Pour rollback (annuler) les migrations :

```bash
node ace migration:rollback
```

Pour réinitialiser complètement la base de données :

```bash
node ace migration:fresh
```

## Schéma de la base de données

Le schéma inclut les tables suivantes :

- **users** : Utilisateurs du jeu (UUID)
- **games** : Parties créées
- **game_players** : Joueurs dans une partie (humains ou IA)
- **rounds** : Manches d'une partie
- **player_objectives** : Objectifs assignés aux joueurs par manche
- **turns** : Tours de jeu dans une manche
- **played_cards** : Cartes jouées à chaque tour

Toutes les tables utilisent des UUID comme clés primaires pour une meilleure sécurité et scalabilité.

## Troubleshooting

### Erreur d'authentification PostgreSQL

Si vous obtenez une erreur "authentification par mot de passe échouée" :

1. Vérifiez que PostgreSQL est démarré
2. Vérifiez le fichier `pg_hba.conf` de PostgreSQL et assurez-vous que la méthode d'authentification est `md5` ou `scrypt`
3. Réinitialisez le mot de passe postgres si nécessaire :
   ```bash
   sudo -u postgres psql
   ALTER USER postgres PASSWORD 'nouveau_mot_de_passe';
   ```

### La base de données n'existe pas

Créez-la manuellement :

```bash
createdb -U postgres royalmatch
```

### Problème de connexion

Vérifiez que PostgreSQL écoute sur le bon port :

```bash
sudo netstat -plunt | grep postgres
```

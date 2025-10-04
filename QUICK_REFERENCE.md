# 📝 Quick Reference - RoyalMatch

Guide de référence rapide pour le développement quotidien.

## 🔄 Quand redémarrer Docker ?

### ✅ Aucune action requise (Hot Reload automatique)

Les changements sont détectés automatiquement :

- **Code TypeScript/JavaScript** (backend)
  - Controllers, Models, Services, Routes, etc.
  - AdonisJS recharge automatiquement

- **Code Angular** (frontend)
  - Components, Services, Templates HTML, Styles CSS
  - Angular recharge automatiquement dans le navigateur

**👉 Tu édites, tu sauvegardes, c'est à jour !**

---

### 🔄 Redémarrer sans rebuild

**Quand** : Changements de configuration

```bash
npm run docker:down
npm run docker:dev
```

**Cas d'usage** :
- Modification des variables d'environnement (`.env`, `server/.env`)
- Modification de `docker-compose.yml`
- Modification de configuration AdonisJS (`config/*.ts`)

---

### 🛠️ Rebuild complet

**Quand** : Changements de structure ou dépendances

```bash
npm run docker:down
npm run docker:dev:build
```

**Cas d'usage** :
- ✅ **Ajout/suppression de dépendances npm** (`npm install`, `package.json`)
- ✅ Modification des Dockerfiles
- ✅ Modification de `nginx.conf`
- ✅ Changements dans les fichiers de configuration système

---

## 🗄️ Migrations de base de données

### Créer une nouvelle migration

**En local (sans Docker)** :
```bash
cd server
node ace make:migration nom_de_la_migration
```

**Avec Docker** :
```bash
docker exec royalmatch-backend node ace make:migration nom_de_la_migration
```

Le fichier de migration sera créé dans `server/database/migrations/`.

### Exécuter les migrations

**Option 1 - En local (recommandé)** :
```bash
cd server
node ace migration:run
```

**Option 2 - Avec Docker** :
```bash
docker exec royalmatch-backend node ace migration:run
```

**🎯 Pas besoin de redémarrer Docker après les migrations !**
La base de données PostgreSQL tourne dans un conteneur séparé, les migrations s'appliquent directement.

### Rollback des migrations

**En local** :
```bash
cd server
node ace migration:rollback
```

**Avec Docker** :
```bash
docker exec royalmatch-backend node ace migration:rollback
```

### Créer un modèle

**En local** :
```bash
cd server
node ace make:model NomDuModele
```

**Avec Docker** :
```bash
docker exec royalmatch-backend node ace make:model NomDuModele
```

**🎯 Pas besoin de redémarrer, le hot reload détectera le nouveau fichier !**

---

## 📦 Gestion des dépendances npm

### Ajouter une dépendance

**Backend** :
```bash
cd server
npm install nom-du-package
# Puis rebuild Docker
cd ..
npm run docker:down
npm run docker:dev:build
```

**Frontend** :
```bash
cd client
npm install nom-du-package
# Puis rebuild Docker
cd ..
npm run docker:down
npm run docker:dev:build
```

**⚠️ Rebuild obligatoire** : Les `node_modules` sont dans le conteneur, pas sur ton PC.

### Supprimer une dépendance

Même processus que l'ajout :
```bash
npm uninstall nom-du-package
# Puis rebuild
```

---

## 🐛 Debugging

### Voir les logs

**Tous les services** :
```bash
npm run docker:logs
```

**Backend uniquement** :
```bash
npm run docker:logs:backend
```

**Frontend uniquement** :
```bash
npm run docker:logs:frontend
```

### Accéder à un conteneur

**Backend** :
```bash
docker exec -it royalmatch-backend sh
```

**Frontend** :
```bash
docker exec -it royalmatch-frontend sh
```

**PostgreSQL** :
```bash
docker exec -it royalmatch-postgres psql -U postgres -d royalmatch
```

### Vérifier l'état des conteneurs

```bash
npm run docker:ps
```

---

## 🧹 Nettoyage

### Redémarrer tous les services

```bash
npm run docker:restart
```

### Arrêter tous les services

```bash
npm run docker:down
```

### Nettoyer complètement (⚠️ Supprime les données)

```bash
npm run docker:clean
```

**⚠️ ATTENTION** : Cette commande supprime les volumes PostgreSQL et Redis. Toutes les données seront perdues !

---

## 📊 Tableau récapitulatif

| Action | Hot Reload | Redémarrer | Rebuild |
|--------|------------|------------|---------|
| Modifier code TS/JS/HTML/CSS | ✅ Auto | - | - |
| Ajouter un fichier | ✅ Auto | - | - |
| Modifier `.env` | - | 🔄 Oui | - |
| Créer une migration | ✅ Auto | - | - |
| Exécuter une migration | - | - | - |
| Créer un modèle | ✅ Auto | - | - |
| `npm install` | - | - | 🛠️ Oui |
| Modifier Dockerfile | - | - | 🛠️ Oui |
| Modifier `docker-compose.yml` | - | 🔄 Oui | - |

---

## 🎯 Workflow quotidien

### Démarrer la journée

```bash
npm run docker:dev
```

### Pendant le développement

1. **Code normalement** - Le hot reload s'occupe de tout
2. **Créer des migrations** - Pas besoin de redémarrer
3. **Exécuter les migrations** - Pas besoin de redémarrer
4. **Voir les logs** - `npm run docker:logs`

### Ajouter une dépendance

```bash
cd server  # ou client
npm install package-name
cd ..
npm run docker:down
npm run docker:dev:build
```

### Fin de journée

```bash
npm run docker:down
```

---

## 🔗 Connexions rapides

### pgAdmin (PostgreSQL)

- **Host** : `localhost`
- **Port** : `5432`
- **Database** : `royalmatch`
- **Username** : `postgres`
- **Password** : (voir `.env`)

### Redis Commander (optionnel)

- **Host** : `localhost`
- **Port** : `6379`

---

## ⚡ Commandes ultra-rapides

```bash
# Lancer l'app
npm run docker:dev

# Voir les logs
npm run docker:logs

# Migration
docker exec royalmatch-backend node ace migration:run

# Arrêter
npm run docker:down

# Rebuild si besoin
npm run docker:dev:build
```

---

**💡 Astuce** : Garde ce fichier ouvert dans un onglet de ton éditeur pour référence rapide !

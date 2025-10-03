# Tâche 1.1 : Configuration du projet

## Objectif
Initialiser la structure complète du projet avec Angular (frontend) et AdonisJS (backend).

## Stack technique
- **Frontend** : Angular 18+ avec Signals
- **Backend** : AdonisJS 6 (TypeScript)
- **Base de données** : PostgreSQL
- **Temps réel** : WebSocket (intégré AdonisJS)
- **Styling** : TailwindCSS

## Actions à réaliser

### Backend (AdonisJS)
- Initialiser un projet AdonisJS 6 avec TypeScript
- Configurer la structure des dossiers :
  - `app/Models/` : modèles de données
  - `app/Services/` : logique métier
  - `app/Controllers/` : contrôleurs HTTP et WebSocket
  - `app/Validators/` : validation des données
  - `config/` : configurations
- Installer les dépendances essentielles (@adonisjs/lucid pour PostgreSQL, @adonisjs/transmit pour WebSocket)
- Configurer les variables d'environnement (.env)

### Frontend (Angular)
- Initialiser un projet Angular 18+ avec standalone components
- Installer et configurer TailwindCSS
- Créer la structure des dossiers :
  - `src/app/core/` : services core, guards, interceptors
  - `src/app/features/` : modules fonctionnels
  - `src/app/shared/` : composants, pipes, directives partagés
  - `src/app/models/` : interfaces et types TypeScript
- Configurer les signaux Angular pour la gestion d'état
- Installer les dépendances (RxJS, Socket.IO client, etc.)

### Monorepo ou séparé ?
Décider si on crée un monorepo (frontend + backend) ou deux projets séparés.
Suggestion : deux dossiers séparés (`/client` et `/server`) dans le même repo.

## Points d'attention
- S'assurer que les versions d'Angular et AdonisJS sont compatibles avec Node.js LTS
- Configurer ESLint et Prettier pour les deux projets
- Prévoir la configuration CORS pour les appels API
- Configurer les chemins TypeScript (@/* aliases)

## Résultat attendu
- Structure de projet complète et fonctionnelle
- `npm run dev` lance le backend AdonisJS
- `npm start` lance le frontend Angular
- Communication de base testée entre front et back

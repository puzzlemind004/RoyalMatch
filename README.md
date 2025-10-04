# 🎴 RoyalMatch

> Jeu de cartes compétitif et stratégique multijoueur en temps réel

## 📖 Description

RoyalMatch est un jeu de cartes innovant jouable en multijoueur (2-4 joueurs) ou contre IA, avec mode spectateur. Le jeu combine stratégie, prise de risque et gestion d'objectifs pour créer une expérience unique à chaque partie.

### Caractéristiques principales

- 🎯 **Système d'objectifs** : Accomplissez des objectifs pour marquer des points
- 🎡 **Roulette des couleurs** : Une couleur dominante change la hiérarchie à chaque manche
- ⚡ **Temps réel** : Actions simultanées et synchronisées via WebSocket
- 🤖 **Intelligence artificielle** : Plusieurs niveaux de difficulté
- 👁️ **Mode spectateur** : Observez les parties en direct
- 🎨 **Interface moderne** : Design responsive et animations fluides

## 🛠️ Stack technique

### Frontend
- **Angular 18+** avec Standalone Components et Signals
- **TailwindCSS** pour le styling
- **RxJS** pour la programmation réactive
- **Socket.IO** pour le temps réel

### Backend
- **AdonisJS 6** (TypeScript)
- **PostgreSQL** pour la base de données
- **WebSocket** (AdonisJS Transmit) pour le temps réel
- **Lucid ORM** pour les requêtes BDD

### DevOps
- **Docker** pour la conteneurisation
- **GitHub Actions** pour CI/CD
- **Hostinger** pour l'hébergement

## 📁 Structure du projet

```
RoyalMatch/
├── client/          # Frontend Angular 18+ ✅
│   ├── src/app/
│   │   ├── core/          # Services, guards, interceptors
│   │   ├── features/      # Modules fonctionnels
│   │   ├── shared/        # Composants partagés
│   │   └── models/        # Interfaces TypeScript
│   └── ...
├── server/          # Backend AdonisJS 6 ✅
│   ├── app/
│   │   ├── controllers/   # Contrôleurs HTTP/WS
│   │   ├── models/        # Modèles Lucid ORM
│   │   ├── services/      # Logique métier
│   │   └── validators/    # Validation des données
│   └── ...
├── projet/          # Documentation des features (101 tâches)
└── README.md        # Ce fichier
```

## 🚀 Statut du projet

**Phase actuelle** : Développement en cours 🚧

- ✅ Cahier des charges complet
- ✅ 18 features planifiées
- ✅ 101 tâches documentées
- ✅ **Tâche 1.1 : Configuration du projet terminée**
  - Backend AdonisJS 6 avec TypeScript
  - Frontend Angular 18+ avec Signals
  - TailwindCSS v4 configuré
  - WebSocket (Transmit) installé
  - CORS configuré
  - Structure de dossiers complète

**Temps estimé de développement** : 2,5-3,5 mois (temps plein)

## 🎮 Règles du jeu

### Objectif
Soyez le premier joueur à atteindre le score cible en remplissant vos objectifs au fil des manches.

### Déroulement
1. **Roulette des couleurs** : Une couleur devient forte, son opposée devient faible
2. **Sélection d'objectifs** : Choisissez 1-3 objectifs à accomplir
3. **Distribution** : Recevez 13 cartes, choisissez-en 5 pour votre main de départ
4. **Tours de jeu** : Jouez des cartes simultanément, activez leurs effets
5. **Scoring** : Marquez des points en accomplissant vos objectifs

### Système de couleurs
- ♥️ **Cœur** ↔ ♠️ **Pique** (opposées)
- ♦️ **Carreau** ↔ ♣️ **Trèfle** (opposées)

La couleur forte bat toutes les autres, la couleur faible perd contre toutes.

## 🏗️ Installation

### Prérequis
- Node.js 20+ LTS
- PostgreSQL 14+
- npm ou yarn

### Configuration du backend

```bash
cd server
npm install

# Configurer PostgreSQL dans .env
# DB_HOST=127.0.0.1
# DB_PORT=5432
# DB_USER=postgres
# DB_PASSWORD=postgres
# DB_DATABASE=royalmatch

# Lancer le serveur de développement
npm run dev
```

Le backend sera accessible sur `http://localhost:3333`

### Configuration du frontend

```bash
cd client
npm install

# Lancer le serveur de développement
npm start
```

Le frontend sera accessible sur `http://localhost:4200`

### Commandes utiles

**Backend:**
- `npm run dev` - Serveur de développement avec HMR
- `npm run build` - Build de production
- `npm run lint` - Vérification ESLint
- `npm run format` - Formatage avec Prettier

**Frontend:**
- `npm start` - Serveur de développement
- `npm run build` - Build de production
- `npm run format` - Formatage avec Prettier
- `npm test` - Lancer les tests

## 📚 Documentation

- [Cahier des charges complet](./projet.md)
- [Règles des couleurs](./REGLES_COULEURS_FINAL.md)
- [Corrections importantes](./CORRECTIONS_IMPORTANTES.md)
- [Features détaillées](./features/)

## 🤝 Contribution

Le projet est actuellement en développement initial. Les contributions seront ouvertes une fois la v1.0 sortie.

## 📝 Licence

À définir

## 👥 Auteurs

Projet développé avec l'assistance de Claude Code

---

**Note** : Ce projet est en cours de développement actif. Le code source sera ajouté progressivement.

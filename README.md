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
├── client/          # Frontend Angular (à créer)
├── server/          # Backend AdonisJS (à créer)
├── features/        # Documentation des features (101 tâches)
├── projet.md        # Cahier des charges complet
├── REGLES_COULEURS_FINAL.md  # Règles définitives des couleurs
└── CORRECTIONS_IMPORTANTES.md # Corrections appliquées
```

## 🚀 Statut du projet

**Phase actuelle** : Planification terminée ✅

- ✅ Cahier des charges complet
- ✅ 18 features planifiées
- ✅ 101 tâches documentées
- ⏳ Développement à démarrer

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

## 🏗️ Installation (à venir)

```bash
# Cloner le repository
git clone https://github.com/VOTRE_USERNAME/RoyalMatch.git
cd RoyalMatch

# Backend
cd server
npm install
npm run dev

# Frontend
cd ../client
npm install
npm start
```

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

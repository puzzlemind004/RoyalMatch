# Tâche 1.2 : Configuration du serveur WebSocket

## Objectif
Mettre en place le serveur temps réel avec WebSocket pour gérer les parties multijoueurs.

## Technologies
- AdonisJS Transmit (WebSocket natif)
- Socket.IO en fallback si nécessaire

## Actions à réaliser

### Backend
- Configurer AdonisJS Transmit pour WebSocket
- Créer les channels de communication :
  - `game:{gameId}` : événements de la partie
  - `room:{roomId}` : salon d'attente
  - `spectator:{gameId}` : mode spectateur
- Implémenter l'authentification WebSocket (connexion sécurisée)
- Créer les événements de base :
  - `player:joined`
  - `player:left`
  - `game:started`
  - `turn:started`
  - `card:played`
  - `turn:ended`
  - `round:ended`
  - `game:ended`

### Frontend
- Créer un service Angular `WebSocketService` utilisant les signals
- Implémenter la connexion/reconnexion automatique
- Gérer les états de connexion (connecté, déconnecté, erreur)
- Créer des signals réactifs pour les événements du jeu

### Gestion des erreurs
- Timeout de connexion
- Déconnexion brutale
- Reconnexion avec état de jeu préservé
- Gestion de la latence

## Points d'attention
- Le système doit supporter jusqu'à 6 joueurs + spectateurs par partie
- Les actions simultanées (choix de cartes) doivent être synchronisées
- Prévoir un système de heartbeat pour détecter les déconnexions
- Utiliser des rooms isolées pour éviter les fuites de données entre parties

## Résultat attendu
- Communication bidirectionnelle fonctionnelle
- Latence < 100ms en conditions normales
- Reconnexion automatique en cas de coupure
- Logs détaillés des événements WebSocket

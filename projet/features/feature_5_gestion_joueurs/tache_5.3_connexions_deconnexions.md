# Tâche 5.3 : Gestion des connexions/déconnexions

## Gestion WebSocket
- Connexion avec authentification
- Heartbeat pour détecter les déconnexions
- Reconnexion automatique
- État du joueur (online/offline/in_game)

## Gestion en partie
- Si déconnexion < 2min : attendre
- Si déconnexion > 2min : IA prend le relais
- Possibilité de reconnecter et reprendre
- Notification aux autres joueurs

# Tâche 12.4 : Visualisation roulette et objectifs

## Roulette
- Le spectateur voit l'animation de la roulette
- Affichage de la hiérarchie des couleurs
- Même expérience que les joueurs

## Objectifs
- Le spectateur voit que les objectifs sont distribués
- Il ne voit PAS quels objectifs chaque joueur a gardé
- En fin de manche : révélation des objectifs et lesquels sont complétés

## Implémentation
```typescript
// Les spectateurs reçoivent les mêmes événements que les joueurs
// SAUF les données privées (objectifs choisis, mains)
this.broadcast('spectator:round_started', {
  dominantColor: round.dominantColor,
  objectivesDistributed: true, // Mais pas le détail
})
```

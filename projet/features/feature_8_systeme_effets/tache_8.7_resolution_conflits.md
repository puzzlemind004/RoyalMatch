# Tâche 8.7 : Résolution des conflits d'effets

## Cas de conflits

### Conflit 1 : Deux joueurs ciblent la même carte
- Résolution : ordre chronologique (qui a joué en premier)

### Conflit 2 : Effet d'annulation vs effet normal
- Résolution : annulation s'exécute en premier (priorité haute)

### Conflit 3 : Piocher d'un deck vide
- Résolution : effet échoue gracieusement, pas de crash

### Conflit 4 : Voler une carte d'un joueur qui n'en a plus
- Résolution : vol du maximum disponible

## Implémentation
```typescript
class ConflictResolver {
  resolve(effects: QueuedEffect[]): QueuedEffect[] {
    // Trier par priorité puis par timestamp
    return effects.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority // Haute priorité d'abord
      }
      return a.createdAt - b.createdAt // Chronologique
    })
  }
}
```

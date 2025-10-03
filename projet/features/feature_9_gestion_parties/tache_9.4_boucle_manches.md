# Tâche 9.4 : Boucle de manches jusqu'à victoire

## Logique
```typescript
async runGameLoop(gameId: string) {
  while (true) {
    await roundService.runRound(gameId)
    const winner = await this.checkVictory(gameId)

    if (winner) {
      await this.endGame(gameId, winner)
      break
    }

    // Pause entre les manches
    await this.intermission(gameId, 10) // 10 secondes
  }
}

async checkVictory(gameId: string): Promise<Player | null> {
  const game = await Game.find(gameId)
  const players = await this.getPlayers(gameId)

  for (const player of players) {
    if (player.totalScore >= game.targetScore) {
      return player
    }
  }

  return null
}
```

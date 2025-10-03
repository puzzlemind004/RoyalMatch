# Tâche 15.3 : Tests IA vs IA pour équilibrage

Déjà couvert dans Feature 11 - IA.
Voir tache_11.7_mode_ia_vs_ia.md

## Métriques à analyser
- Taux de victoire par difficulté
- Objectifs les plus/moins complétés
- Cartes les plus/moins jouées
- Effets les plus/moins activés
- Équilibre des couleurs dominantes

## Script d'analyse
```typescript
async function analyzeGameBalance() {
  const results = await runAIBattle(1000) // 1000 parties

  console.log('Taux de victoire:')
  console.log(`Easy: ${results.winRate.easy}%`)
  console.log(`Medium: ${results.winRate.medium}%`)
  console.log(`Hard: ${results.winRate.hard}%`)

  console.log('\nObjectifs les plus complétés:')
  results.objectiveStats
    .sort((a, b) => b.completionRate - a.completionRate)
    .slice(0, 10)
    .forEach(obj => console.log(`${obj.name}: ${obj.completionRate}%`))

  console.log('\nEffets les plus utilisés:')
  results.effectStats
    .sort((a, b) => b.usageRate - a.usageRate)
    .slice(0, 10)
    .forEach(effect => console.log(`${effect.name}: ${effect.usageRate}%`))
}
```

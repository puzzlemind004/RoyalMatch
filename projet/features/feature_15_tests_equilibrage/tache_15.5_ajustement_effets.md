# Tâche 15.5 : Ajustement des effets et objectifs

## Process d'équilibrage
1. Analyser les données des tests IA vs IA
2. Identifier les déséquilibres
3. Ajuster les valeurs
4. Re-tester
5. Répéter

## Exemples d'ajustements

### Objectif trop facile
```typescript
// Avant
{
  id: 'win_1_trick',
  points: 5, // Trop de points pour quelque chose de facile
  difficulty: 'easy'
}

// Après
{
  id: 'win_1_trick',
  points: 2, // Ajusté
  difficulty: 'easy'
}
```

### Effet trop puissant
```typescript
// Avant
const aceOfSpades = {
  name: 'Voler 3 cartes',
  power: 10
}

// Après
const aceOfSpades = {
  name: 'Voler 2 cartes', // Réduit de 3 à 2
  power: 8
}
```

### Couleur dominante trop forte
```typescript
// Si les stats montrent que la couleur forte gagne trop souvent
// → Peut-être réduire le bonus de la couleur forte
// → Ou augmenter légèrement le poids des valeurs
```

## Tableau de suivi
| Élément | Version | Taux usage | Taux succès | Action |
|---------|---------|------------|-------------|--------|
| Objectif "Perfection" | 1.0 | 2% | 95% | ✅ Équilibré |
| Objectif "3 plis" | 1.0 | 45% | 80% | ⚠️ Réduire points |
| Effet A♠️ | 1.0 | 85% | 70% | ⚠️ Trop puissant |
| Effet 2♥️ | 1.0 | 15% | 40% | ⚠️ Trop faible |

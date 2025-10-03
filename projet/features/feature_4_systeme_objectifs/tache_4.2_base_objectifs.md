# Tâche 4.2 : Base d'objectifs variés

## Objectif
Créer une bibliothèque complète de 40+ objectifs équilibrés et intéressants.

## Liste complète des objectifs

### Catégorie TRICKS (Plis) - Facile

1. **Zéro Hero** (2 pts) - Gagnez 0 pli
2. **Solitaire** (1 pt) - Gagnez exactement 1 pli
3. **La paire** (2 pts) - Gagnez exactement 2 plis
4. **Le trio** (3 pts) - Gagnez exactement 3 plis
5. **Poker** (4 pts) - Gagnez exactement 4 plis
6. **Main pleine** (5 pts) - Gagnez exactement 5 plis
7. **Demi-douzaine** (6 pts) - Gagnez au moins 6 plis
8. **Sept chanceux** (7 pts) - Gagnez au moins 7 plis

### Catégorie TRICKS - Moyen

9. **Premier et dernier** (4 pts) - Gagnez le 1er et dernier pli
10. **Encadrement** (5 pts) - Gagnez les 3 premiers OU les 3 derniers plis
11. **Alternance** (6 pts) - Gagnez 1 pli sur 2 (minimum 5 plis)
12. **Série noire** (5 pts) - Gagnez 3 plis consécutifs
13. **Marathon** (7 pts) - Gagnez 5 plis consécutifs

### Catégorie COLORS (Couleurs) - Facile/Moyen

14. **Anti-rouge** (3 pts) - Ne gagnez aucune carte rouge
15. **Anti-noir** (3 pts) - Ne gagnez aucune carte noire
16. **Monochrome cœur** (4 pts) - Gagnez uniquement des cœurs
17. **Monochrome carreau** (4 pts) - Gagnez uniquement des carreaux
18. **Arc-en-ciel** (5 pts) - Gagnez au moins 1 pli de chaque couleur
19. **Puriste** (6 pts) - Ne jouez jamais la couleur faible
20. **Dominance** (5 pts) - Gagnez 5+ plis avec la couleur forte

### Catégorie COLORS - Difficile

21. **Caméléon** (7 pts) - Gagnez au moins 2 plis de chaque couleur
22. **Rouge intégral** (6 pts) - Toutes vos cartes gagnées sont rouges
23. **Noir intégral** (6 pts) - Toutes vos cartes gagnées sont noires

### Catégorie VALUES (Valeurs) - Facile/Moyen

24. **Collecteur d'As** (5 pts) - Gagnez les 4 As
25. **Chasseur de rois** (4 pts) - Gagnez les 4 Rois
26. **Cour royale** (6 pts) - Gagnez 8+ figures (J, Q, K)
27. **Roturier** (4 pts) - Ne gagnez aucune figure
28. **Pairs seulement** (5 pts) - Gagnez uniquement des cartes paires (2,4,6,8,10,Q)
29. **Impairs seulement** (5 pts) - Gagnez uniquement des cartes impaires (3,5,7,9,J,K,A)

### Catégorie VALUES - Difficile

30. **Suite basse** (6 pts) - Gagnez 2,3,4,5,6 de n'importe quelle couleur
31. **Suite haute** (7 pts) - Gagnez 10,J,Q,K,A de n'importe quelle couleur
32. **Minimaliste** (5 pts) - Total des valeurs gagnées < 50
33. **Maximaliste** (6 pts) - Total des valeurs gagnées > 100
34. **Sept magnifiques** (5 pts) - Gagnez les 4 Sept

### Catégorie SPECIAL (Spéciaux) - Varié

35. **Pacifiste** (6 pts) - N'activez aucun effet de carte
36. **Magicien** (5 pts) - Activez tous les effets de vos cartes jouées
37. **Précision** (4 pts) - Finissez avec exactement 0 carte en main
38. **Économe** (5 pts) - Finissez avec 3+ cartes en main
39. **Sniper** (7 pts) - Gagnez exactement les plis où vous avez activé un effet
40. **Fantôme** (8 pts) - Perdez tous vos plis SAUF le dernier

### Catégorie SPECIAL - Très difficile

41. **Perfection** (10 pts) - Gagnez tous les plis
42. **Paradoxe** (9 pts) - Gagnez 0 pli mais finissez premier en points
43. **Stratège** (8 pts) - Gagnez avec uniquement des couleurs neutres
44. **Kamikazé** (7 pts) - Jouez toutes vos cartes fortes en premier (10,J,Q,K,A)

## Implémentation

### Fichier de données
```typescript
// app/Data/objectives-library.ts
import { ObjectiveDefinition } from '#types/Objective'

export const OBJECTIVES_LIBRARY: ObjectiveDefinition[] = [
  // ... tous les objectifs avec leur logique de vérification
]

// Fonction helper pour récupérer des objectifs aléatoires
export function getRandomObjectives(count: number = 3): ObjectiveDefinition[] {
  const shuffled = [...OBJECTIVES_LIBRARY].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

// Fonction pour obtenir des objectifs équilibrés par difficulté
export function getBalancedObjectives(): ObjectiveDefinition[] {
  const easy = OBJECTIVES_LIBRARY.filter(o => o.difficulty === 'easy')
  const medium = OBJECTIVES_LIBRARY.filter(o => o.difficulty === 'medium')
  const hard = OBJECTIVES_LIBRARY.filter(o => o.difficulty === 'hard')

  return [
    easy[Math.floor(Math.random() * easy.length)],
    medium[Math.floor(Math.random() * medium.length)],
    hard[Math.floor(Math.random() * hard.length)]
  ]
}
```

## Points d'attention
- Certains objectifs sont mutuellement exclusifs (choix tactique)
- Équilibrer les points selon la difficulté réelle
- Tester chaque objectif en conditions réelles
- Prévoir des objectifs adaptatifs selon le nombre de joueurs
- Documenter clairement les conditions de victoire

## Résultat attendu
- 40+ objectifs implémentés et testés
- Distribution équilibrée des difficultés
- Logique de sélection aléatoire mais équilibrée
- Documentation complète de chaque objectif

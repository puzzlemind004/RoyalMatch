# ⚠️ CORRECTIONS IMPORTANTES - RoyalMatch

## 📋 Résumé des erreurs corrigées

### 1. Relations de couleurs (CRITIQUE)
**CORRECT** :
- ♥️ Cœur ↔ ♠️ Pique (Rouge ↔ Noir)
- ♦️ Carreau ↔ ♣️ Trèfle (Rouge ↔ Noir)

**INCORRECT** (à ne plus utiliser) :
- ~~Cœur ↔ Trèfle~~
- ~~Carreau ↔ Pique~~

### 2. Nombre de joueurs maximum
**CORRECT** : 2-4 joueurs maximum

**INCORRECT** : ~~2-6 joueurs~~

### 3. Distribution des objectifs
**CORRECT** : Système semi-aléatoire
1. Le joueur choisit combien d'objectifs piocher par niveau :
   - Facile : 0-3
   - Moyen : 0-3
   - Difficile : 0-3
   - Total : 1-3 objectifs
2. Le serveur pioche aléatoirement dans chaque catégorie choisie

**INCORRECT** : ~~Distribution aléatoire de 3 objectifs fixes (1 facile + 1 moyen + 1 difficile)~~

## 📁 Fichiers déjà corrigés

✅ `feature_2_gestion_cartes/tache_2.1_modele_cartes.md`
✅ `feature_2_gestion_cartes/tache_2.3_logique_comparaison.md`
✅ `feature_3_roulette_couleurs/tache_3.1_selection_couleur.md`
✅ `feature_3_roulette_couleurs/tache_3.2_determination_faible.md`
✅ `feature_6_logique_manche/tache_6.2_distribution_cartes.md`
✅ `feature_9_gestion_parties/tache_9.1_creation_partie.md`
✅ `feature_10_mode_multijoueur/tache_10.1_gestion_rooms.md`
✅ `feature_13_interface_utilisateur/tache_13.3_creation_recherche_partie.md`
✅ `feature_4_systeme_objectifs/tache_4.3_distribution_objectifs.md`
✅ `feature_4_systeme_objectifs/tache_4.4_interface_selection.md`
✅ `feature_11_intelligence_artificielle/tache_11.2_selection_objectifs_ia.md`

## ⚠️ Fichiers à vérifier/corriger manuellement

Les fichiers suivants peuvent encore contenir des références incorrectes aux anciennes règles :

### Relations de couleurs incorrectes
- `feature_3_roulette_couleurs/tache_3.3_logique_resolution_plis.md` (Exemples 1 et 3)
- `feature_3_roulette_couleurs/tache_3.4_interface_roulette.md`

### Nombre de joueurs > 4
Rechercher dans tous les fichiers les mentions de "5 joueurs" ou "6 joueurs"

### Distribution objectifs (ancien système)
Rechercher "3 objectifs" ou "garde au moins 1"

## 🔍 Comment vérifier

Utilisez ces commandes de recherche :
```bash
# Chercher les relations de couleurs incorrectes
grep -r "Cœur.*Trèfle" features/
grep -r "Carreau.*Pique" features/

# Chercher 5 ou 6 joueurs
grep -r "[5-6] joueurs" features/

# Chercher ancienne distribution objectifs
grep -r "reçoit 3 objectifs" features/
grep -r "écarter.*objectif" features/
```

## ✅ Règles définitives

### Couleurs opposées
```typescript
const COLOR_OPPOSITES = {
  hearts: 'spades',   // ♥️ ↔ ♠️
  spades: 'hearts',   // ♠️ ↔ ♥️
  diamonds: 'clubs',  // ♦️ ↔ ♣️
  clubs: 'diamonds'   // ♣️ ↔ ♦️
}
```

### Hiérarchie en cas de valeur égale (ex: Cœur forte)
1. **Cœur** (forte) - bat tout
2. **Carreau** (rouge neutre) - bat Trèfle et Pique
3. **Trèfle** (noir neutre) - bat Pique
4. **Pique** (faible) - perd contre tout

### Hiérarchie en cas de valeur égale (ex: Trèfle forte)
1. **Trèfle** (forte) - bat tout
2. **Pique** (noir neutre) - bat Cœur et Carreau
3. **Cœur** (rouge neutre) - bat Carreau
4. **Carreau** (faible) - perd contre tout

### Distribution objectifs
```typescript
// Le joueur choisit
selection = {
  easy: 1,    // 0-3
  medium: 1,  // 0-3
  hard: 1     // 0-3
  // Total : 1-3
}

// Le serveur pioche aléatoirement dans chaque catégorie
```

## 📝 Notes importantes

1. **Règle des couleurs neutres** : Entre deux couleurs neutres, c'est la couleur du MÊME TYPE (rouge/noir) que la couleur forte qui gagne
   - Si couleur forte est ROUGE (Cœur/Carreau) → la couleur neutre ROUGE bat la neutre NOIRE
     - Exemple : Cœur forte → Carreau (neutre rouge) bat Trèfle (neutre noir)
   - Si couleur forte est NOIRE (Trèfle/Pique) → la couleur neutre NOIRE bat la neutre ROUGE
     - Exemple : Trèfle forte → Pique (neutre noir) bat Cœur (neutre rouge)

2. **Pas d'égalité** : Le système garantit toujours un gagnant unique

3. **4 joueurs max** : 52 cartes / 13 par joueur = 4 joueurs maximum

## 🎯 Exemples de hiérarchie complète

### Cas 1 : Cœur (rouge) forte → Pique (noir) faible
1. ♥️ Cœur (forte) - bat tout
2. ♦️ Carreau (rouge neutre) - bat Trèfle ET Pique (même couleur que forte)
3. ♣️ Trèfle (noir neutre) - bat Pique
4. ♠️ Pique (faible) - perd contre tout

### Cas 2 : Trèfle (noir) forte → Carreau (rouge) faible
1. ♣️ Trèfle (forte) - bat tout
2. ♠️ Pique (noir neutre) - bat Cœur ET Carreau (même couleur que forte)
3. ♥️ Cœur (rouge neutre) - bat Carreau
4. ♦️ Carreau (faible) - perd contre tout

### Cas 3 : Carreau (rouge) forte → Trèfle (noir) faible
1. ♦️ Carreau (forte) - bat tout
2. ♥️ Cœur (rouge neutre) - bat Pique ET Trèfle (même couleur que forte)
3. ♠️ Pique (noir neutre) - bat Trèfle
4. ♣️ Trèfle (faible) - perd contre tout

### Cas 4 : Pique (noir) forte → Cœur (rouge) faible
1. ♠️ Pique (forte) - bat tout
2. ♣️ Trèfle (noir neutre) - bat Carreau ET Cœur (même couleur que forte)
3. ♦️ Carreau (rouge neutre) - bat Cœur
4. ♥️ Cœur (faible) - perd contre tout

---

Date de création : 2025-01-03
Auteur : Claude Code Assistant

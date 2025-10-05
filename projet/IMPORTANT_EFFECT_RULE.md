# ⚠️ RÈGLE IMPORTANTE : ACTIVATION DES EFFETS

## Règle actuelle (à implémenter)

**SEULE LA CARTE GAGNANTE DU PLI PEUT ACTIVER SON EFFET**

### Impact
- ✅ Maximum 13 effets par manche (1 effet par pli)
- ✅ Simplifie la gestion de la file d'attente des effets
- ✅ Réduit la complexité du jeu
- ✅ Évite la surcharge d'effets simultanés (52 → 13)

### Moment d'activation
1. Le pli est joué (tous les joueurs ont joué leur carte)
2. Le système détermine la carte gagnante selon les règles de couleur
3. **SI le joueur qui a gagné le pli choisit d'activer l'effet** → Effet mis en file d'attente
4. Les effets en file s'exécutent au début du tour suivant

### Implications techniques

#### Backend
- `EffectEngine` : Gérer uniquement l'effet de la carte gagnante
- Validation : Vérifier que seul le gagnant du pli peut activer
- File d'attente : Maximum 13 effets par manche

#### Frontend
- Interface : Afficher l'option d'activation UNIQUEMENT au gagnant du pli
- Animation : Mettre en avant la carte gagnante et son effet potentiel

### Code concerné
- ✅ `server/app/services/effect_engine.ts` - Déjà conçu pour être flexible
- ✅ `server/app/services/effect_executor.ts` - Pattern Strategy permet modifications faciles
- ✅ `client/src/app/core/services/effect.service.ts` - Signals permettent activation conditionnelle
- 📝 À implémenter lors de la logique de tour/pli (tâches 6-7)

### Avantages de cette règle
1. **Stratégique** : Les joueurs doivent choisir entre gagner le pli (effet) ou sacrifier
2. **Équilibré** : Moins d'effets = moins de chaos
3. **Clair** : Facile à comprendre pour les joueurs
4. **Performance** : Moins de calculs et d'animations

---

**Date de documentation** : 2025-10-04
**Statut** : À implémenter dans les tâches 6-7 (logique de tour/manche)

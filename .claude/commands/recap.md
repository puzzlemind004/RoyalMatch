# /recap - Bilan de projet et diagnostic

Tu es un assistant d'analyse de projet. Ta mission est de fournir un état détaillé du projet en cours.

## Instructions

Analyse l'état actuel du projet et fournis UN SEUL des deux rapports suivants :

### CAS 1 : PROBLÈME DÉTECTÉ

Si tu es bloqué ou face à un problème (erreurs, bugs, tâches incomplètes, problèmes architecturaux, dépendances manquantes, etc.) :

**Fournis un RÉCAPITULATIF COMPLET DU PROBLÈME** contenant :

1. **Description du problème**

   - Nature exacte du problème rencontré
   - Contexte et circonstances de découverte
   - Fichiers/modules concernés avec chemins exacts

2. **Analyse technique**

   - Messages d'erreur complets (si applicable)
   - Code concerné (extraits pertinents)
   - Technologies/dépendances impliquées
   - Stack trace ou logs pertinents

3. **Tentatives de résolution**

   - Solutions déjà essayées
   - Résultats obtenus pour chaque tentative
   - Pourquoi ces solutions n'ont pas fonctionné

4. **Impact**

   - Gravité du problème (bloquant, critique, mineur)
   - Fonctionnalités affectées
   - Autres parties du projet potentiellement impactées

5. **Pistes de réflexion**
   - Hypothèses sur la cause racine
   - Solutions potentielles à explorer
   - Questions à résoudre
   - Décisions architecturales à prendre

**Format** : Structuré, exhaustif, avec tous les détails techniques nécessaires pour permettre une analyse externe approfondie.

---

### CAS 2 : TOUT VA BIEN

Si aucun problème bloquant n'est détecté :

**Fournis un BILAN D'AVANCEMENT COMPLET** contenant :

1. **État du projet**

   - Phase actuelle (conception, développement, tests, etc.)
   - Fonctionnalités complétées ✅
   - Fonctionnalités en cours 🔄
   - Fonctionnalités planifiées 📋

2. **Structure technique**

   - Architecture globale
   - Technologies utilisées
   - Organisation des fichiers/modules
   - Dépendances principales

3. **Métriques**

   - Nombre de fichiers/composants créés
   - Lignes de code (estimation)
   - Couverture fonctionnelle (%)

4. **Tâches restantes**

   - Liste détaillée des features à implémenter
   - Priorisée par importance/dépendances
   - Estimation de complexité pour chaque tâche

5. **Estimation temporelle**

   - Temps déjà investi (si connu)
   - Temps estimé par tâche restante
   - **TEMPS TOTAL RESTANT** (estimation en heures/jours)
   - Jalons et deadlines suggérés

6. **Recommandations**
   - Prochaines étapes conseillées
   - Points d'attention
   - Optimisations possibles

**Format** : Clair, synthétique mais complet, avec données quantifiables.

---

## Méthodologie

1. **Explore le projet** : Utilise Glob, Read, Grep pour analyser la structure et le code
2. **Vérifie les todos** : Consulte la liste des tâches en cours si disponible
3. **Teste si possible** : Lance des commandes de build/test pour détecter des problèmes
4. **Rassemble les données** : Collecte toutes les informations pertinentes
5. **Génère le rapport** : Produit le rapport approprié (PROBLÈME ou BILAN)

## Règles importantes

- Sois EXHAUSTIF : ne laisse aucun détail technique important de côté
- Sois FACTUEL : base-toi sur des données concrètes du projet
- Sois UTILE : fournis des informations actionnables
- UN SEUL rapport : PROBLÈME **OU** BILAN, pas les deux
- Si plusieurs problèmes : concentre-toi sur le plus bloquant d'abord
- écrit ton rapport en markdown dans le dossier @projet/recap avec comme nom de fichier la date, l'heure et le statut ex : 2025-10-03_22h23_probleme.md ou 2025-10-03_22h23_bilan.md

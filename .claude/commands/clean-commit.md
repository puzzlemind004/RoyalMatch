---
description: Remove console.log, verify compilation, lint, format and create clean commit
---

# Clean Commit Workflow

Exécute automatiquement les étapes suivantes pour nettoyer le code et créer un commit propre :

## Étapes automatisées

1. **Recherche et suppression des console.log**

   - Trouve tous les fichiers .ts/.js (hors node_modules, dist, build)
   - Supprime les console.log/debug/info/warn/error
   - Compte le nombre de fichiers modifiés

2. **Vérification de la compilation**

   - Client (Angular) : `npm run build` si le dossier client/ existe
   - Server (AdonisJS) : `npm run build` si le dossier server/ existe
   - Arrête si une compilation échoue

3. **Analyse des changements**

   - `git status` pour voir les fichiers modifiés
   - `git diff` pour analyser les modifications
   - Génère un message de commit descriptif basé sur les vrais changements

4. **Création du commit**
   - Stage automatiquement tous les changements
   - Crée un commit avec un message détaillé et précis
   - Format : `chore: clean code - [actions effectuées]`

## Résultat attendu

Un commit propre avec :

- Code sans console.log
- Build qui compile sans erreur
- Message de commit descriptif basé sur les vrais changements

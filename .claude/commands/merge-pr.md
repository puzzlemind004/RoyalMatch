# /merge-pr

Merge la Pull Request d'une tâche, vérifie la fermeture automatique de l'issue, et retourne sur master.

**IMPORTANT: Réponds en français tout au long de cette commande.**

## Usage

```
/merge-pr <task-number>
```

**Example:** `/merge-pr 3.1`

## What this command does

1. **Find PR** - Trouve la PR associée à la tâche
2. **Find Issue** - Trouve l'issue GitHub associée
3. **Merge PR** - Merge la PR sur master et supprime la branche remote
4. **Verify issue closed** - Vérifie que l'issue s'est fermée automatiquement
5. **Close issue if needed** - Ferme manuellement l'issue si toujours ouverte
6. **Switch to master** - Retourne sur la branche master et pull les dernières modifications
7. **Clean up** - Supprime la branche locale et nettoie les références

## Implementation Steps

### Step 1: Find Associated PR

```bash
# Chercher la PR par numéro de tâche dans le titre
gh pr list --search "in:title [Task X.Y]" --json number,title,state,headRefName --limit 1
```

- Vérifier qu'une PR existe pour cette tâche
- Récupérer le numéro de PR
- Vérifier que la PR est "OPEN" (sinon erreur "PR already merged")

### Step 2: Find Associated Issue

```bash
# Chercher l'issue par numéro de tâche dans le titre
gh issue list --search "in:title [Task X.Y]" --json number,title,state --limit 1
```

- Récupérer le numéro d'issue
- Noter l'état actuel (open/closed)

### Step 3: Merge the Pull Request

**Options de merge :**
- **Squash merge** (recommandé) : Combine tous les commits en un seul
- **Merge commit** : Garde l'historique complet
- **Rebase merge** : Rebase les commits

```bash
# Squash merge (recommandé pour feature branches)
gh pr merge <pr-number> --squash --delete-branch

# OU Merge commit (si on veut garder l'historique)
gh pr merge <pr-number> --merge --delete-branch

# OU Rebase merge
gh pr merge <pr-number> --rebase --delete-branch
```

**Par défaut, utiliser `--squash --delete-branch`**

Options importantes :
- `--delete-branch` : Supprime la branche après merge
- `--auto` : Merge automatiquement quand les checks passent (optionnel)

### Step 4: Verify Issue Auto-Closed

Attendre 2-3 secondes pour que GitHub traite le merge, puis :

```bash
# Vérifier le statut de l'issue
gh issue view <issue-number> --json state,closedAt
```

- Si `state: "CLOSED"` et `closedAt` est défini → ✅ Issue fermée automatiquement
- Si `state: "OPEN"` → ⚠️ Pas fermée automatiquement (body PR n'avait peut-être pas "Closes #X")

### Step 5: Close Issue if Still Open

```bash
# Si l'issue est toujours ouverte, la fermer manuellement
gh issue close <issue-number> --comment "Closed automatically after merging PR #<pr-number>"
```

### Step 6: Switch to Master and Clean Up

```bash
# Retourner sur master
git switch master

# Pull les dernières modifications (incluant le merge)
git pull origin master

# Supprimer la branche locale mergée
git branch -d <branch-name>

# Nettoyer les branches remote trackées
git fetch --prune
```

**Actions effectuées :**
- Switch vers master
- Pull des dernières modifications (incluant le merge)
- Suppression de la branche locale de la feature
- Nettoyage des références remote obsolètes

### Step 7: Display Summary

Afficher un résumé final :

```markdown
✅ PR #X merged successfully
✅ Issue #Y closed automatically
✅ Branch `<branch-name>` deleted
✅ Switched to master and pulled latest changes

**Summary:**
- Task: X.Y - <Task Title>
- PR: #X (merged with squash)
- Issue: #Y (closed)
- Commits: X commits squashed into 1

**Next steps:**
1. Start next task with `/start-task <task-number>`
2. Or review project status with `gh issue list`
```

## Important Notes

- **NEVER merge without user confirmation** - Always confirm before merging
- **Check PR status first** - Don't merge if already merged
- **Squash is default** - Keeps git history clean
- **Always delete branch** - Keeps repo clean
- **Verify issue closure** - Some PRs might not have "Closes #X" in body
- **Pull after merge** - Ensures local master is up to date

## Error Handling

### PR Not Found
```
❌ No PR found for task X.Y
   Make sure the PR title contains "[Task X.Y]"
```

### PR Already Merged
```
❌ PR #X is already merged
   State: MERGED
   Merged at: 2025-10-05T10:30:00Z
```

### Issue Not Found
```
⚠️ No issue found for task X.Y
   Skipping issue closure step
```

### Merge Conflicts
```
❌ Cannot merge PR #X - merge conflicts detected
   Please resolve conflicts first:
   1. git switch <branch-name>
   2. git merge master
   3. Resolve conflicts
   4. git push
   5. Try /merge-pr again
```

### Permission Denied
```
❌ Permission denied to merge PR
   Make sure you have write access to the repository
```

## Examples

### Success Flow
```bash
> /merge-pr 3.1

🔍 Finding PR for task 3.1...
   Found: PR #1 "[Task 3.1] Implémentation de la roulette"

🔍 Finding issue for task 3.1...
   Found: Issue #15 "[Task 3.1] Sélection couleur dominante"

✅ Merging PR #1 with squash...
   ✓ Merged successfully
   ✓ Branch '3.1-selection-couleur' deleted

⏳ Verifying issue closure...
   ✓ Issue #15 closed automatically

🔄 Switching to master...
   ✓ Switched to master
   ✓ Pulled latest changes

✅ Task 3.1 successfully completed and merged!
```

### Issue Not Auto-Closed
```bash
> /merge-pr 3.1

[... finding and merging ...]

⏳ Verifying issue closure...
   ⚠️ Issue #15 still open

📝 Closing issue manually...
   ✓ Issue #15 closed with comment

✅ Task 3.1 successfully completed and merged!
```

# /end-task

Finalize current task with clean commit and create Pull Request.

**IMPORTANT: Réponds en français tout au long de cette commande.**

## Usage

```
/end-task
```

## What this command does

1. **Clean code** - Remove console.logs from the codebase
2. **Verify completion** - Check all todos are done
3. **Run quality checks** - Type-check, tests, builds
4. **Create clean commit** - Commit changes with detailed message
5. **Push branch** - Push to remote repository
6. **Create PR** - Generate PR with detailed description
7. **Provide PR link** - Give user the PR URL for review

## Implementation Steps

### Step 1: Clean Code

**Recherche et suppression des console.log:**
```bash
# Rechercher les fichiers avec console.log
find client/src server/app -type f \( -name "*.ts" -o -name "*.js" \) ! -path "*/node_modules/*" ! -path "*/dist/*" ! -path "*/build/*" -exec grep -l "console\." {} \;

# Si des fichiers sont trouvés, les nettoyer (supprimer les lignes console.log/debug/info/warn/error)
```

### Step 2: Pre-commit Verification

- Verify all TodoWrite items are marked as completed
- Verify TypeScript compilation passes:
  - Backend: `cd server && npm run typecheck`
- Run linting and formatting if needed

### Step 3: Testing

- Run unit tests:
  - Backend: `cd server && npm test`
- Run build to ensure production readiness:
  - Backend: `cd server && npm run build`
  - Frontend: `cd client && npm run build`
- Check for any errors or warnings

### Step 4: Git Status Check

- Check which files have been modified: `git status`
- Show statistics: `git diff --stat`
- Verify changes are related to the current task
- Ensure no unrelated changes are included

### Step 5: Create Clean Commit

**DO NOT use `/clean-commit` - do the work directly:**

1. Stage all changes: `git add .`

2. Create commit with detailed message:
   ```bash
   git commit -m "$(cat <<'EOF'
   feat(task-X.Y): <task title>

   <Brief description of what was implemented>

   **Backend:**
   - Key backend change 1
   - Key backend change 2

   **Frontend:**
   - Key frontend change 1
   - Key frontend change 2

   **Modifications:**
   - Other important changes

   🤖 Generated with [Claude Code](https://claude.com/claude-code)

   Co-Authored-By: Claude <noreply@anthropic.com>
   EOF
   )"
   ```

3. Verify commit was created: `git status`

### Step 6: Push Branch

- Push branch to remote: `git push -u origin <branch-name>`
- Handle any authentication if needed

### Step 7: Create Pull Request

**Get the issue number first:**
```bash
# Find the corresponding GitHub Issue
gh issue list --search "in:title [Task X.Y]" --json number,title --limit 1
```

**Create PR with automatic issue linking:**
- Use `gh pr create` to create the PR
- PR title: `[Task X.Y] <Task Title>`
- **IMPORTANT**: PR body MUST include `Closes #<issue-number>` to auto-close the issue on merge
- PR body includes:
  - **Closes #X** (links and auto-closes the issue)
  - **Summary**: What was implemented
  - **Changes**: List of modifications
  - **Testing**: How to test the feature
  - **Screenshots**: If UI changes (ask user to add manually)
  - **Checklist**:
    - [ ] Code follows CLAUDE.md rules
    - [ ] All user-facing text uses Transloco (i18n)
    - [ ] Mobile-first responsive design
    - [ ] Tests pass
    - [ ] TypeScript compiles
    - [ ] No console.logs
    - [ ] Clean, maintainable code

Example:
```bash
gh pr create --title "[Task 3.1] Roulette selection" --body "$(cat <<'EOF'
Closes #15

## Summary
Implementation of color roulette system...
EOF
)"
```

### Step 8: Output

- Provide PR URL to user
- Remind user to use `/review-pr <task-number>` for automated review
- List next steps:
  1. Review PR with `/review-pr <task-number>`
  2. Fix any issues found
  3. Re-run review until clean
  4. Manual testing by user
  5. Merge when ready

## Important Notes

- **This command WILL clean your code** (remove console.logs)
- **This command WILL create a git commit**
- **This command WILL push to remote** and create PR
- **Use only when task is fully complete**
- **PR is created on master branch** as specified
- **All steps are done automatically** - no manual intervention needed

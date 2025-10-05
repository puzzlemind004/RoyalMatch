# /end-task

Finalize current task with clean commit and create Pull Request.

**IMPORTANT: Réponds en français tout au long de cette commande.**

## Usage

```
/end-task
```

## What this command does

1. **Verify completion** - Check all todos are done
2. **Run quality checks** - Lint, format, type-check, tests
3. **Clean commit** - Use `/clean-commit` to commit changes
4. **Create PR** - Generate PR with detailed description
5. **Provide PR link** - Give user the PR URL for review

## Implementation Steps

### Step 1: Pre-commit Verification

- Verify all TodoWrite items are marked as completed
- Check no console.logs remain in the code
- Verify TypeScript compilation passes
- Run linting and formatting

### Step 2: Testing

- Run unit tests (if any exist)
- Run build to ensure production readiness
- Check for any errors or warnings

### Step 3: Git Status Check

- Check which files have been modified
- Verify changes are related to the current task
- Ensure no unrelated changes are included

### Step 4: Create Clean Commit

- Use the `/clean-commit` slash command
- Commit message format:

  ```
  feat(task-X.Y): <task title>

  <Brief description of what was implemented>

  - Key change 1
  - Key change 2
  - Key change 3
  ```

### Step 5: Create Pull Request

- Use `gh pr create` to create the PR
- PR title: `[Task X.Y] <Task Title>`
- PR body includes:
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

### Step 6: Output

- Provide PR URL to user
- Remind user to use `/review-pr <task-number>` for automated review
- List next steps:
  1. Review PR with `/review-pr <task-number>`
  2. Fix any issues found
  3. Re-run review until clean
  4. Manual testing by user
  5. Merge when ready

## Important Notes

- **This command WILL create a git commit** (via `/clean-commit`)
- **This command WILL push to remote** and create PR
- **Use only when task is fully complete**
- **PR is created on master branch** as specified

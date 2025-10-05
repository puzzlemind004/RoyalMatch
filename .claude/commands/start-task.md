# /start-task

Start working on a specific task with dedicated branch and development workflow.

**IMPORTANT: Réponds en français tout au long de cette tâche.**

## Usage

```
/start-task <task-number>
```

**Example:** `/start-task 2.1`

## What this command does

1. **Load task specifications** from `projet/features/feature_*/task_*.md`
2. **Create dedicated branch** `<task-number>-<task-name>` from master
3. **Display task details** (description, acceptance criteria, technical requirements)
4. **Plan implementation** with step-by-step breakdown
5. **Start development** with TodoWrite tracking
6. **Run tests** after implementation to ensure everything works

## Implementation Steps

### Step 1: Load Task File

- Read task file from `projet/features/feature_X/task_Y.md`
- Parse task number, title, description, and requirements
- Display full task context to user

### Step 2: Create Branch

- Ensure we're on master branch and up to date
- Create branch with format: `<task-number>-<slugified-task-name>`
- Example: `2.1-card-effect-system`

### Step 3: Analysis & Planning

- Analyze existing codebase related to the task
- Identify files that need to be created/modified
- Check for dependencies and potential conflicts
- Create implementation plan with TodoWrite

### Step 4: Development

- Implement the task following CLAUDE.md rules:
  - Use Transloco for all user-facing text
  - Follow TypeScript/Angular/AdonisJS best practices
  - Write clean, maintainable code with design patterns
  - Ensure mobile-first responsive design
- Update TodoWrite as you progress

### Step 5: Testing

- Run relevant tests (frontend and/or backend)
- Verify compilation (TypeScript, build)
- Check for linting/formatting issues
- Test the feature manually if needed

### Step 6: Summary

- Mark all todos as completed
- Summarize what was done
- List modified/created files
- **Explain how to test the feature**:
  - Either: Add a demo page in `client/src/app/features/demo/` to showcase the new functionality
  - Or: Specify the affected areas/endpoints/components where the user can see the changes in action
  - Provide clear testing instructions (e.g., "Go to /demo/roulette to see the animation")
- Remind user to use `/end-task` when ready

## Important Notes

- **NEVER commit automatically** - only `/end-task` creates commits
- **Always follow i18n rules** - all user-facing text must use Transloco
- **Mobile-first design** - ensure responsive on all screen sizes
- **Use TodoWrite** to track progress throughout the task

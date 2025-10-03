---
description: Remove console.log, verify compilation, lint, format and create clean commit
---

Execute the following steps to clean the code and prepare a commit:

1. Remove all console.log statements from TypeScript and JavaScript files
2. Verify that the code compiles without errors
3. Run lint checks and fix issues
4. Format the code
5. Stage all changes
6. Analyze the changes and create a descriptive commit message

!powershell -ExecutionPolicy Bypass -File .claude/scripts/clean-commit.ps1

After the script completes, review the changes shown and create a commit with a detailed message describing:
- Removal of console.log statements
- Any compilation fixes applied
- Lint and format improvements
- Other changes included

Use this format for the commit message:
```
chore: clean code - remove logs, verify build, lint and format

- Removed console.log statements from X files
- Verified compilation succeeds for client and server
- Applied lint fixes
- Formatted code according to style guide

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

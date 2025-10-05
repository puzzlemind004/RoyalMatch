# /review-pr

Automated code review of a Pull Request with focus on quality, performance, and i18n compliance.

**IMPORTANT: Réponds en français tout au long de cette revue.**

## Usage

```
/review-pr <task-number>
```

**Example:** `/review-pr 2.1`

## What this command does

1. **Load PR details** using `gh pr view` for the task
2. **Analyze all changes** in the PR (git diff)
3. **Deep code review** focusing on critical points
4. **Generate review report** in `review-pr-recap-<task-number>.md`
5. **Provide verdict** - Issues found or all good ✅

## Review Criteria (in order of importance)

### 1. Internationalization (i18n) ⚠️ CRITICAL
- ✅ All user-facing text uses Transloco (`this.transloco.translate()`)
- ✅ No hardcoded French or English text in UI
- ✅ Server responses use translation keys, not raw text
- ✅ Error messages use codes + translation keys
- ❌ Flag ANY hardcoded text that users will see

### 2. Code Quality & Cleanliness
- ✅ No `console.log()` statements
- ✅ No commented-out code
- ✅ No unused imports or variables
- ✅ Proper error handling
- ✅ TypeScript types properly used (no `any`)
- ✅ Code follows SOLID principles

### 3. Architecture & Design Patterns
- ✅ Follows Angular best practices (standalone components, signals)
- ✅ Follows AdonisJS patterns (services, controllers separation)
- ✅ Design patterns used appropriately (Factory, Strategy, etc.)
- ✅ DRY principle respected
- ✅ Proper separation of concerns

### 4. Performance
- ✅ No unnecessary re-renders (Angular change detection)
- ✅ Efficient database queries (no N+1 problems)
- ✅ Proper use of signals vs observables
- ✅ No memory leaks (unsubscribe, cleanup)
- ✅ Optimized imports (tree-shaking friendly)

### 5. Responsive Design (if UI changes)
- ✅ Mobile-first approach with Tailwind breakpoints
- ✅ Works on mobile (320px), tablet (768px), desktop (1024px+)
- ✅ No custom CSS (TailwindCSS only)
- ✅ Proper use of Tailwind responsive utilities

### 6. Testing & Validation
- ✅ TypeScript compiles without errors
- ✅ All tests pass (if tests exist)
- ✅ No linting errors
- ✅ Code is formatted correctly

### 7. Security
- ✅ No sensitive data in code (API keys, passwords)
- ✅ Proper input validation (client AND server)
- ✅ No SQL injection risks
- ✅ No XSS vulnerabilities

### 8. Documentation
- ✅ Complex logic has comments
- ✅ Functions have clear names (self-documenting)
- ✅ Interfaces/types properly defined
- ✅ README updated if needed

## Implementation Steps

### Step 1: Load PR Information
```bash
gh pr view <task-number> --json number,title,body,files,commits
git diff master...feature/<task-number>-<task-name>
```

### Step 2: Analyze Each File
- Read all modified files
- Check against review criteria
- Note issues with line numbers
- Suggest improvements

### Step 3: Generate Review Report
Create `review-pr-recap-<task-number>.md` with:
```markdown
# PR Review Report - Task <task-number>

## Summary
<One-line summary of the PR>

## Review Status
- [ ] ✅ All Good - Ready to Merge
- [ ] ⚠️ Minor Issues - Can merge after fixes
- [ ] ❌ Major Issues - Must fix before merge

## Critical Issues (MUST FIX) 🔴
<List of blocking issues>

## Important Issues (SHOULD FIX) 🟡
<List of important but non-blocking issues>

## Suggestions (NICE TO HAVE) 🟢
<List of improvements and optimizations>

## Detailed Analysis

### Internationalization (i18n)
<Detailed findings>

### Code Quality
<Detailed findings>

### Architecture
<Detailed findings>

### Performance
<Detailed findings>

### Responsive Design
<Detailed findings>

### Security
<Detailed findings>

## Files Reviewed
- ✅ file1.ts - Clean
- ⚠️ file2.ts - Minor issues (line 42, 67)
- ❌ file3.ts - Critical issues (line 15, 89)

## Verdict
<Final decision: Ready to merge / Needs fixes>

## Next Steps
<What user should do next>
```

### Step 4: Provide Verdict
- If **no critical issues**: ✅ "All good! Ready for your manual testing and merge."
- If **minor issues**: ⚠️ "Found some minor issues. Please review and I'll fix them."
- If **major issues**: ❌ "Found critical issues that must be fixed. I'll start fixing them now."

### Step 5: Auto-fix if Possible
- If issues are found and user confirms, fix them automatically
- Re-run review after fixes
- Iterate until clean

## Output

1. Display review summary in terminal
2. Save detailed report in `review-pr-recap-<task-number>.md`
3. Ask user for action:
   - "Fix issues automatically" → Fix and re-review
   - "Show me the issues first" → Just display report
   - "All good, I'll test manually" → End review

## Important Notes

- **Review is thorough but constructive** - suggest improvements, don't just criticize
- **Focus on user-facing quality** - i18n, performance, UX are top priority
- **Automated fixes when possible** - don't ask user to fix trivial issues
- **Iterative review** - keep reviewing until clean
- **Clear next steps** - always tell user what to do next

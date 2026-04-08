---
name: memory-guard
description: Validates and enforces best practices when creating or modifying CLAUDE.md files, .claude/rules/, or auto memory files. Automatically triggered when Claude detects changes to memory-related files. Use proactively before any CLAUDE.md or memory modification.
disable-model-invocation: false
user-invocable: true
argument-hint: file-path
---

# Memory Guard

You are a validator for Claude Code memory files. Before writing or modifying any CLAUDE.md, `.claude/rules/`, or auto memory file, you MUST follow this checklist.

## When to Activate

This skill applies when modifying ANY of:

- `CLAUDE.md` or `CLAUDE.local.md` (at any level)
- `.claude/CLAUDE.md`
- `.claude/rules/*.md`
- Auto memory files in `~/.claude/projects/*/memory/`

## Pre-Write Checklist

### 1. Line Count Check

- **Hard limit: 200 lines per CLAUDE.md file.**
- Before writing, count the lines of the target file. If the edit would push it over 200 lines:
  - Move detailed content into `.claude/rules/` topic files
  - Or use `@path/to/file` imports to reference external docs
  - Keep the CLAUDE.md as a concise index

### 2. Specificity Audit

Review every instruction and reject vague ones. Apply these transformations:

| Bad (vague)             | Good (specific)                            |
| ----------------------- | ------------------------------------------ |
| "Format code properly"  | "Use 2-space indentation"                  |
| "Test your changes"     | "Run `pnpm test` before committing"        |
| "Keep files organized"  | "API handlers live in `src/api/handlers/`" |
| "Follow best practices" | Remove entirely — adds no value            |
| "Write clean code"      | Remove entirely — adds no value            |

If an instruction cannot be verified by a machine or a reviewer, rewrite it or remove it.

### 3. Conflict Detection

- Read ALL CLAUDE.md files in the project hierarchy (root, packages/_, apps/_)
- Read ALL files in `.claude/rules/` if they exist
- Flag any contradictions between files
- If two files give different guidance for the same behavior, resolve the conflict before writing

### 4. Scope Validation

Each CLAUDE.md must only contain instructions relevant to its scope:

| File                   | Should contain                                             | Should NOT contain                                  |
| ---------------------- | ---------------------------------------------------------- | --------------------------------------------------- |
| Root `CLAUDE.md`       | Shared conventions, commands, git rules, project structure | Component-specific patterns, framework details      |
| `packages/*/CLAUDE.md` | Package-specific architecture, APIs, conventions           | Build commands that belong at root, git conventions |
| `apps/*/CLAUDE.md`     | App-specific setup, content guidelines, tooling            | Package internals, publishing config                |

If an instruction is in the wrong scope, move it to the correct file.

### 5. Structure Check

Every CLAUDE.md must follow this structure:

- **Markdown headers and bullets** to group related instructions
- **No dense paragraphs** — use lists and tables
- **Consistent formatting** — same style across all files
- **Actionable content only** — if a section adds no value, remove it

### 6. Duplication Check

- Search for duplicate instructions across all CLAUDE.md files and `.claude/rules/`
- If the same instruction exists in multiple files, keep it in the most appropriate scope and remove the rest
- Use `@path` imports if content needs to be shared

### 7. Content Categories

Verify instructions fall into valid categories:

**Allowed in CLAUDE.md:**

- Build and test commands
- Coding standards and conventions
- Project structure and architecture
- Naming conventions
- Common workflows
- Tool-specific configuration

**NOT allowed in CLAUDE.md (use auto memory instead):**

- Session-specific context or current task details
- Temporary state or in-progress work
- Speculative or unverified conclusions

**NOT allowed anywhere:**

- Secrets, API keys, credentials, or tokens
- Personal information beyond preferences

## Post-Write Validation

After writing, verify:

1. `wc -l` on the file — must be under 200 lines
2. No contradictions with other CLAUDE.md files
3. No duplicate instructions across files
4. All instructions are specific and verifiable
5. File is properly scoped to its location

## Output Format

When validating, report:

```
Memory Guard Report
─────────────────
File: [path]
Lines: [count]/200
Scope: [root|package|app]

✓ Line count OK / ✗ Over limit (N lines over)
✓ All instructions specific / ✗ Vague instructions found: [list]
✓ No conflicts / ✗ Conflicts with [file]: [description]
✓ Correct scope / ✗ Misplaced instructions: [list]
✓ No duplicates / ✗ Duplicated in [file]: [instruction]
✓ No secrets detected / ✗ Potential secret found: [line]
```

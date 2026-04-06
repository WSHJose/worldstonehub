---
paths:
  - "**/CLAUDE.md"
  - "**/CLAUDE.local.md"
  - ".claude/rules/**"
  - ".claude/CLAUDE.md"
---

# Memory File Rules

When editing any CLAUDE.md or rules file, follow these constraints:

- **Max 200 lines** per CLAUDE.md file. Move detailed content to `.claude/rules/` or use `@path` imports.
- **Every instruction must be specific and verifiable.** No vague guidelines like "write clean code" or "follow best practices."
- **Check for conflicts** with other CLAUDE.md files before writing. Two files must not give contradictory guidance.
- **Scope correctly**: root CLAUDE.md = shared conventions, package/app CLAUDE.md = domain-specific rules only.
- **No duplicates** across files. If the same instruction exists in multiple places, keep it in the most appropriate scope.
- **No secrets, API keys, or credentials** in any memory file.
- Use the `/memory-guard` skill to validate changes before committing.

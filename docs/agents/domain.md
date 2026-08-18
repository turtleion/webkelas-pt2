# Domain Docs

How engineering skills should consume repo's domain documentation exploring codebase.

## Before exploring, read

- **`CONTEXT.md`** repo root
- **`docs/adr/`** — read ADRs touch area you're about work in.

If any files don't exist, **proceed silently**. Don't flag absence; don't suggest creating upfront. `/domain-modeling` skill creates lazily terms decisions actually get resolved.

## File structure

Single-context repo:

```text
/
├── CONTEXT.md
├── docs/adr/
│   ├── 0001-<title>.md
│   └── 0002-<title>.md
└── src/
```

## Use glossary's vocabulary

When output names domain concept (in issue title, refactor proposal, hypothesis, test name), use term defined in `CONTEXT.md`. Don't drift synonyms glossary explicitly avoids. If concept you need isn't in glossary yet, that's signal — either you're inventing language project doesn't use (reconsider) or there's real gap (note `/domain-modeling`).

## Flag ADR conflicts

If output contradicts existing ADR, surface explicitly silently overriding:

> _Contradicts ADR-0007 (…) — but worth reopening because…_

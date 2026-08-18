# Issue tracker: Local Markdown

Issues specs repo live markdown files in `.scratch/`.

## Conventions

- One feature per directory: `.scratch/<feature-slug>/`
- spec `.scratch/<feature-slug>/spec.md`
- Implementation issues one file per ticket at `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, numbered from `01` — never single combined tickets file
- Triage state recorded `Status:` line near top issue file
- Comments conversation history append bottom file under `## Comments` heading

## When skill says "publish issue tracker"

Create new file under `.scratch/<feature-slug>/` (creating directory if needed).

## When skill says "fetch relevant ticket"

Read file referenced path. user will normally pass path issue number directly.

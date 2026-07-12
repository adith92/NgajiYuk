---
name: redesign-or-add-page-flow
description: Workflow command scaffold for redesign-or-add-page-flow in NgajiYuk.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /redesign-or-add-page-flow

Use this workflow when working on **redesign-or-add-page-flow** in `NgajiYuk`.

## Goal

Redesigns or adds a feature page in the app, typically for a major UI/UX update or new learning flow.

## Common Files

- `src/app/dashboard/page.tsx`
- `src/app/progress/page.tsx`
- `src/app/hijaiyah/page.tsx`
- `src/app/doa/page.tsx`
- `src/app/sholat/page.tsx`
- `src/app/kuis/page.tsx`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Edit or create a file at src/app/<feature>/page.tsx
- Implement new UI/UX or learning flow logic
- Commit with a 'feat(ui): redesign <feature>...' or similar message

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.
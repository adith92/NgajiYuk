---
name: ui-component-addition-or-redesign
description: Workflow command scaffold for ui-component-addition-or-redesign in NgajiYuk.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /ui-component-addition-or-redesign

Use this workflow when working on **ui-component-addition-or-redesign** in `NgajiYuk`.

## Goal

Adds a new reusable UI component or redesigns an existing one to update the design system or improve user experience.

## Common Files

- `src/components/ui/StatusBadge.tsx`
- `src/components/MenuCard.tsx`
- `src/components/Header.tsx`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Create or edit a file in src/components/
- Implement or update the UI logic and styles
- Commit with a 'feat(ui): add/rebuild/redesign...' message

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.
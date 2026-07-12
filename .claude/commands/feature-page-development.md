---
name: feature-page-development
description: Workflow command scaffold for feature-page-development in NgajiYuk.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /feature-page-development

Use this workflow when working on **feature-page-development** in `NgajiYuk`.

## Goal

Implements or redesigns a feature by creating or updating a dedicated page component for a specific route or module.

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

- Create or update a page component in 'src/app/{feature}/page.tsx'
- Implement UI and logic for the feature
- Optionally, update related components or hooks

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.
```markdown
# NgajiYuk Development Patterns

> Auto-generated skill from repository analysis

## Overview

This skill teaches you how to contribute to the NgajiYuk TypeScript codebase, focusing on UI/UX page flows and reusable component design. You'll learn the project's coding conventions, commit patterns, and step-by-step workflows for adding or redesigning pages and UI components.

## Coding Conventions

- **Language:** TypeScript
- **Framework:** None detected (vanilla TypeScript/React)
- **File Naming:** Use camelCase for files and folders.
  - Example: `menuCard.tsx`, `statusBadge.tsx`
- **Import Style:** Use alias imports for modules.
  ```typescript
  import MenuCard from '@/components/MenuCard';
  ```
- **Export Style:** Default exports are preferred.
  ```typescript
  // src/components/MenuCard.tsx
  export default function MenuCard() { /* ... */ }
  ```
- **Commit Messages:** Use [Conventional Commits](https://www.conventionalcommits.org/), with prefixes like `feat` and `fix`.
  - Example: `feat(ui): redesign dashboard page`
  - Keep commit messages concise (average ~46 characters).

## Workflows

### Redesign or Add Page Flow
**Trigger:** When you want to redesign an existing page or add a new feature page to the app.  
**Command:** `/redesign-page`

1. Edit or create a file at `src/app/<feature>/page.tsx`.
2. Implement the new UI/UX or learning flow logic.
3. Commit your changes with a message like:
   ```
   feat(ui): redesign <feature> page
   ```
4. Example:
   ```typescript
   // src/app/dashboard/page.tsx
   export default function DashboardPage() {
     return <div>New Dashboard UI</div>;
   }
   ```
5. Affected files may include:
   - `src/app/dashboard/page.tsx`
   - `src/app/progress/page.tsx`
   - `src/app/hijaiyah/page.tsx`
   - `src/app/doa/page.tsx`
   - `src/app/sholat/page.tsx`
   - `src/app/kuis/page.tsx`
   - `src/app/gamezone/page.tsx`

### UI Component Addition or Redesign
**Trigger:** When you want to add a new reusable UI component or redesign an existing one.  
**Command:** `/add-ui-component`

1. Create or edit a file in `src/components/`.
2. Implement or update the UI logic and styles.
3. Commit your changes with a message like:
   ```
   feat(ui): add StatusBadge component
   ```
4. Example:
   ```typescript
   // src/components/ui/StatusBadge.tsx
   export default function StatusBadge({ status }: { status: string }) {
     return <span className={`badge badge--${status}`}>{status}</span>;
   }
   ```
5. Common files involved:
   - `src/components/ui/StatusBadge.tsx`
   - `src/components/MenuCard.tsx`
   - `src/components/Header.tsx`

## Testing Patterns

- **Test File Pattern:** Test files are named with the `*.test.*` pattern (e.g., `menuCard.test.tsx`).
- **Testing Framework:** Not explicitly detected; follow standard TypeScript/React testing practices.
- **Example:**
  ```typescript
  // src/components/MenuCard.test.tsx
  import MenuCard from './MenuCard';

  test('renders MenuCard', () => {
    // Test implementation here
  });
  ```

## Commands

| Command           | Purpose                                                      |
|-------------------|--------------------------------------------------------------|
| /redesign-page    | Start the workflow to redesign or add a feature page         |
| /add-ui-component | Start the workflow to add or redesign a reusable UI component|
```

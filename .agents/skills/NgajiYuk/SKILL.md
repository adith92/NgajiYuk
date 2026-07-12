```markdown
# NgajiYuk Development Patterns

> Auto-generated skill from repository analysis

## Overview

This skill teaches you how to effectively contribute to the NgajiYuk codebase, a TypeScript project built with Next.js. You'll learn the project's coding conventions, common development workflows, and best practices for adding features, refactoring, testing, and maintaining CI pipelines. Whether you're building new pages, creating reusable UI components, or improving error handling, this guide will help you follow the established patterns and contribute confidently.

## Coding Conventions

### File Naming

- **CamelCase** is used for files and components.
  - Example: `StatusBadge.tsx`, `MenuCard.tsx`, `useSpeechPractice.ts`

### Import Style

- **Alias imports** are preferred for internal modules.
  - Example:
    ```typescript
    import { getProgress } from '@/lib/learning/progress';
    import StatusBadge from '@/components/ui/StatusBadge';
    ```

### Export Style

- **Mixed exports**: Both default and named exports are used as appropriate.
  - Example:
    ```typescript
    // Named export
    export function getProgress() { ... }

    // Default export
    export default function StatusBadge() { ... }
    ```

### Commit Patterns

- **Conventional commits** with the following prefixes: `chore`, `feat`, `refactor`, `fix`, `test`, `docs`, `ci`
- Commit messages are concise (average ~42 characters).

---

## Workflows

### Feature Page Development

**Trigger:** When adding or redesigning a feature page (e.g., dashboard, quiz, learning flow).  
**Command:** `/new-feature-page`

1. Create or update a page component in `src/app/{feature}/page.tsx`.
2. Implement the UI and logic for the feature.
3. Optionally, update related components or hooks.

**Example:**
```typescript
// src/app/kuis/page.tsx
import Quiz from '@/components/Quiz';

export default function KuisPage() {
  return <Quiz />;
}
```

---

### UI Component Addition or Redesign

**Trigger:** When introducing a new UI component or updating an existing one for consistency or new features.  
**Command:** `/add-ui-component`

1. Create or update a component in `src/components/` or `src/components/ui/`.
2. Implement or refine the component logic and styles.
3. Optionally, update global styles in `src/app/globals.css`.

**Example:**
```typescript
// src/components/ui/StatusBadge.tsx
export default function StatusBadge({ status }: { status: string }) {
  return <span className={`badge badge-${status}`}>{status}</span>;
}
```

---

### Refactor Helper or Hook and Consume

**Trigger:** When centralizing logic for reuse and maintainability.  
**Command:** `/refactor-helper`

1. Refactor or create a helper/hook in `src/lib/` or `src/hooks/`.
2. Update relevant page(s) in `src/app/{feature}/page.tsx` to use the new helper/hook.
3. Test the integration.

**Example:**
```typescript
// src/hooks/useRequireUser.ts
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useRequireUser(user) {
  const router = useRouter();
  useEffect(() => {
    if (!user) router.push('/login');
  }, [user]);
}
```

---

### CI Pipeline Update

**Trigger:** When improving or adding CI/CD checks and automation.  
**Command:** `/update-ci`

1. Create or update workflow files in `.github/workflows/`.
2. Add or update supporting scripts in `scripts/`.
3. Update configuration files if needed.

**Example:**
```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm run build
      - run: npm test
```

---

### Test Helper or Feature

**Trigger:** When ensuring correctness of helpers or new features via tests.  
**Command:** `/add-test`

1. Create or update test files in `tests/` or update `package.json` for test scripts.
2. Write or update tests for helpers or features.
3. Run tests to verify correctness.

**Example:**
```typescript
// tests/quiz.test.mjs
import { getQuizQuestions } from '../src/lib/learning/quiz';

test('getQuizQuestions returns expected questions', () => {
  const questions = getQuizQuestions();
  expect(questions.length).toBeGreaterThan(0);
});
```

---

### Error and Loading Boundary Setup

**Trigger:** When improving error handling and loading feedback in the app.  
**Command:** `/add-error-boundary`

1. Create or update error, loading, and not-found components in `src/app/`.
2. Wire up boundaries in layout or root files.

**Example:**
```typescript
// src/app/error.tsx
export default function Error({ error }) {
  return <div>An error occurred: {error.message}</div>;
}
```

---

## Testing Patterns

- **Test files** use the `*.test.ts` or `*.test.mjs` pattern and are located in the `tests/` directory.
- The testing framework is not explicitly specified, but tests follow standard unit test structures.
- Tests are run via scripts defined in `package.json`.

**Example:**
```typescript
// tests/progress.test.mjs
import { getProgress } from '../src/lib/learning/progress';

test('getProgress returns correct value', () => {
  expect(getProgress(5, 10)).toBe(0.5);
});
```

---

## Commands

| Command             | Purpose                                                        |
|---------------------|----------------------------------------------------------------|
| /new-feature-page   | Scaffold or update a feature page component                    |
| /add-ui-component   | Add or redesign a reusable UI component                        |
| /refactor-helper    | Refactor or extract a helper/hook and update consumers         |
| /update-ci          | Add or update CI/CD workflows and automation scripts           |
| /add-test           | Add or update tests for helpers or features                    |
| /add-error-boundary | Add or update error/loading/not-found boundaries for the app   |
```

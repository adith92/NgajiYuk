import fs from "node:fs";

const file = "src/app/kuis/page.tsx";
let content = fs.readFileSync(file, "utf8");

const replacements = [
  {
    from: `import { createQuizProgressItemId, createQuizQuestion } from "@/lib/learning/quiz";`,
    to: `import { createQuizProgressItemId, createQuizQuestion, createQuizSessionId } from "@/lib/learning/quiz";`,
  },
  {
    from: `if (!sessionIdRef.current) sessionIdRef.current = \`quiz-\${Date.now()}\`;`,
    to: `if (!sessionIdRef.current) sessionIdRef.current = createQuizSessionId();`,
  },
  {
    from: `sessionIdRef.current = \`quiz-\${Date.now()}\`;`,
    to: `sessionIdRef.current = createQuizSessionId();`,
  },
];

for (const replacement of replacements) {
  if (!content.includes(replacement.from)) {
    throw new Error(`Expected text was not found: ${replacement.from}`);
  }
  content = content.replace(replacement.from, replacement.to);
}

fs.writeFileSync(file, content);

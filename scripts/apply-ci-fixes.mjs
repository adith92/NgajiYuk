import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function update(relativePath, transformations) {
  const filePath = path.join(root, relativePath);
  let content = fs.readFileSync(filePath, "utf8");

  for (const { from, to, label } of transformations) {
    if (!content.includes(from)) {
      throw new Error(`Unable to apply ${label} in ${relativePath}`);
    }
    content = content.replace(from, to);
  }

  fs.writeFileSync(filePath, content);
}

update("src/app/dashboard/page.tsx", [
  {
    label: "stable dashboard memo dependencies",
    from: `  const currentUser = currentUserUid ? users[currentUserUid] : null;
  const userProgress: UserProgressMap = currentUserUid ? progress[currentUserUid] ?? {} : {};
  const userQuizHistory = currentUserUid ? quizHistory[currentUserUid] ?? [] : [];
  const metrics = useMemo(
    () => calculateLearningSummary(userProgress, userQuizHistory, MODULE_TOTALS),
    [userProgress, userQuizHistory],
  );`,
    to: `  const currentUser = currentUserUid ? users[currentUserUid] : null;
  const metrics = useMemo(() => {
    const userProgress: UserProgressMap = currentUserUid ? progress[currentUserUid] ?? {} : {};
    const userQuizHistory = currentUserUid ? quizHistory[currentUserUid] ?? [] : [];
    return calculateLearningSummary(userProgress, userQuizHistory, MODULE_TOTALS);
  }, [currentUserUid, progress, quizHistory]);`,
  },
]);

update("src/app/progress/page.tsx", [
  {
    label: "stable progress memo dependencies",
    from: `  const userProgress: UserProgressMap = currentUserUid ? progress[currentUserUid] ?? {} : {};
  const history = currentUserUid ? quizHistory[currentUserUid] ?? [] : [];
  const summary = useMemo(
    () => calculateLearningSummary(userProgress, history, MODULE_TOTALS),
    [history, userProgress],
  );`,
    to: `  const userProgress = useMemo<UserProgressMap>(
    () => (currentUserUid ? progress[currentUserUid] ?? {} : {}),
    [currentUserUid, progress],
  );
  const history = useMemo(
    () => (currentUserUid ? quizHistory[currentUserUid] ?? [] : []),
    [currentUserUid, quizHistory],
  );
  const summary = useMemo(
    () => calculateLearningSummary(userProgress, history, MODULE_TOTALS),
    [history, userProgress],
  );`,
  },
]);

update("src/app/doa/page.tsx", [
  {
    label: "add useMemo import",
    from: `import { useCallback, useEffect, useState } from "react";`,
    to: `import { useCallback, useEffect, useMemo, useState } from "react";`,
  },
  {
    label: "stable completed prayer list",
    from: `  const completed = currentUserUid ? progress[currentUserUid]?.doa?.completedItems ?? [] : [];`,
    to: `  const completed = useMemo(
    () => (currentUserUid ? progress[currentUserUid]?.doa?.completedItems ?? [] : []),
    [currentUserUid, progress],
  );`,
  },
]);

update("src/app/kuis/page.tsx", [
  {
    label: "pure quiz session initialization",
    from: `  const sessionIdRef = useRef(\`quiz-\${Date.now()}\`);`,
    to: `  const sessionIdRef = useRef<string | null>(null);`,
  },
  {
    label: "lazy quiz session ID",
    from: `  const handleGuess = (item: HijaiyahItem) => {
    if (status !== "playing") return;`,
    to: `  const getSessionId = () => {
    if (!sessionIdRef.current) sessionIdRef.current = \`quiz-\${Date.now()}\`;
    return sessionIdRef.current;
  };

  const handleGuess = (item: HijaiyahItem) => {
    if (status !== "playing") return;`,
  },
  {
    label: "use lazy session ID",
    from: `createQuizProgressItemId(sessionIdRef.current, currentIndex)`,
    to: `createQuizProgressItemId(getSessionId(), currentIndex)`,
  },
]);

update("src/app/page.tsx", [
  {
    label: "use persisted ready state",
    from: `  const { login, initializeApp, currentUserUid } = useAppStore();
  const [mounted, setMounted] = useState(false);`,
    to: `  const { login, initializeApp, currentUserUid, isReady } = useAppStore();`,
  },
  {
    label: "remove synchronous mounted state effect",
    from: `  useEffect(() => {
    setMounted(true);
    initializeApp();
  }, [initializeApp]);

  useEffect(() => {
    if (mounted && currentUserUid) router.replace("/dashboard");
  }, [mounted, currentUserUid, router]);`,
    to: `  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  useEffect(() => {
    if (isReady && currentUserUid) router.replace("/dashboard");
  }, [isReady, currentUserUid, router]);`,
  },
  {
    label: "render from store readiness",
    from: `  if (!mounted) return <div className="min-h-screen bg-[#21105f]" aria-label="Memuat NgajiYuk" />;`,
    to: `  if (!isReady) return <div className="min-h-screen bg-[#21105f]" aria-label="Memuat NgajiYuk" />;`,
  },
]);

update("src/hooks/useRequireUser.ts", [
  {
    label: "remove local hydration state",
    from: `import { useEffect, useState } from "react";`,
    to: `import { useEffect } from "react";`,
  },
  {
    label: "use store readiness",
    from: `  const initializeApp = useAppStore((state) => state.initializeApp);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    initializeApp();
    setHydrated(true);
  }, [initializeApp]);

  useEffect(() => {
    if (hydrated && !currentUserUid) router.replace("/");
  }, [currentUserUid, hydrated, router]);

  return {
    currentUserUid,
    hydrated,
    isReady: hydrated && Boolean(currentUserUid),
  };`,
    to: `  const initializeApp = useAppStore((state) => state.initializeApp);
  const storeReady = useAppStore((state) => state.isReady);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  useEffect(() => {
    if (storeReady && !currentUserUid) router.replace("/");
  }, [currentUserUid, storeReady, router]);

  return {
    currentUserUid,
    hydrated: storeReady,
    isReady: storeReady && Boolean(currentUserUid),
  };`,
  },
]);

update("src/lib/utils.ts", [
  {
    label: "typed array literal",
    from: `  const costs = new Array();`,
    to: `  const costs: number[] = [];`,
  },
]);

for (const relativePath of [
  "src/app/doa/page.tsx",
  "src/app/hijaiyah/page.tsx",
  "src/app/sholat/page.tsx",
  "src/app/kuis/page.tsx",
  "src/app/gamezone/page.tsx",
]) {
  const filePath = path.join(root, relativePath);
  const content = fs.readFileSync(filePath, "utf8");
  fs.writeFileSync(
    filePath,
    content.replace(
      `useEffect(() => () => confetti.reset(), []);`,
      `useEffect(() => () => {\n    confetti.reset();\n  }, []);`,
    ),
  );
}

fs.rmSync(path.join(root, "src/types/canvas-confetti.d.ts"), { force: true });
console.log("Applied deterministic CI fixes.");

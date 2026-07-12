"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";

export function useRequireUser() {
  const router = useRouter();
  const currentUserUid = useAppStore((state) => state.currentUserUid);
  const initializeApp = useAppStore((state) => state.initializeApp);
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
  };
}

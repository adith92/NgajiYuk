"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";

export function useRequireUser() {
  const router = useRouter();
  const currentUserUid = useAppStore((state) => state.currentUserUid);
  const initializeApp = useAppStore((state) => state.initializeApp);
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
  };
}

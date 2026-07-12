import { openDB } from "idb";

const DB_NAME = "ngajiyuk-audio-cache";
const STORE_NAME = "audios";
const MAX_CACHE_ITEMS = 64;

interface AudioCacheEntry {
  blob: Blob;
  cachedAt: number;
  lastAccessedAt: number;
}

let activeAudio: HTMLAudioElement | null = null;
let activeObjectUrl: string | null = null;

async function initDB() {
  return openDB(DB_NAME, 2, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
    },
  });
}

function isCacheEntry(value: unknown): value is AudioCacheEntry {
  return Boolean(
    value &&
    typeof value === "object" &&
    "blob" in value &&
    (value as AudioCacheEntry).blob instanceof Blob,
  );
}

export async function clearAudioCache() {
  const db = await initDB();
  await db.clear(STORE_NAME);
}

export async function countAudioCache(): Promise<number> {
  const db = await initDB();
  return db.count(STORE_NAME);
}

export async function getAudioFromCache(id: string): Promise<Blob | undefined> {
  const db = await initDB();
  const stored = await db.get(STORE_NAME, id) as unknown;
  if (!stored) return undefined;

  const now = Date.now();
  if (stored instanceof Blob) {
    await db.put(STORE_NAME, { blob: stored, cachedAt: now, lastAccessedAt: now } satisfies AudioCacheEntry, id);
    return stored;
  }

  if (!isCacheEntry(stored)) {
    await db.delete(STORE_NAME, id);
    return undefined;
  }

  await db.put(STORE_NAME, { ...stored, lastAccessedAt: now } satisfies AudioCacheEntry, id);
  return stored.blob;
}

async function evictLeastRecentlyUsed(db: Awaited<ReturnType<typeof initDB>>, incomingId: string) {
  const existing = await db.get(STORE_NAME, incomingId);
  if (existing) return;

  const count = await db.count(STORE_NAME);
  if (count < MAX_CACHE_ITEMS) return;

  const keys = await db.getAllKeys(STORE_NAME);
  const values = await db.getAll(STORE_NAME) as unknown[];
  let oldestIndex = -1;
  let oldestTimestamp = Number.POSITIVE_INFINITY;

  values.forEach((value, index) => {
    const timestamp = isCacheEntry(value)
      ? value.lastAccessedAt || value.cachedAt
      : 0;
    if (timestamp < oldestTimestamp) {
      oldestTimestamp = timestamp;
      oldestIndex = index;
    }
  });

  const key = keys[oldestIndex];
  if (key !== undefined) await db.delete(STORE_NAME, key);
}

export async function saveAudioToCache(id: string, blob: Blob) {
  const db = await initDB();
  await evictLeastRecentlyUsed(db, id);
  const now = Date.now();
  await db.put(STORE_NAME, { blob, cachedAt: now, lastAccessedAt: now } satisfies AudioCacheEntry, id);
}

export async function fetchAndCacheAudio(id: string, url: string, signal?: AbortSignal): Promise<Blob | null> {
  const cached = await getAudioFromCache(id);
  if (cached) return cached;

  try {
    const response = await fetch(url, { signal, cache: "force-cache" });
    if (!response.ok) throw new Error(`HTTP ${response.status} while fetching ${url}`);
    const blob = await response.blob();
    await saveAudioToCache(id, blob);
    return blob;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") return null;
    console.error(`[audio] Failed to load ${id}`, error);
    return null;
  }
}

export function stopAudio() {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.removeAttribute("src");
    activeAudio.load();
    activeAudio = null;
  }
  if (activeObjectUrl) {
    URL.revokeObjectURL(activeObjectUrl);
    activeObjectUrl = null;
  }
}

export async function playAudio(id: string, url: string): Promise<HTMLAudioElement | null> {
  const blob = await fetchAndCacheAudio(id, url);
  if (!blob) return null;

  stopAudio();
  const objectUrl = URL.createObjectURL(blob);
  const audio = new Audio(objectUrl);
  activeAudio = audio;
  activeObjectUrl = objectUrl;

  const cleanup = () => {
    if (activeAudio === audio) activeAudio = null;
    if (activeObjectUrl === objectUrl) activeObjectUrl = null;
    URL.revokeObjectURL(objectUrl);
  };

  audio.addEventListener("ended", cleanup, { once: true });
  audio.addEventListener("error", cleanup, { once: true });

  try {
    await audio.play();
    return audio;
  } catch (error) {
    cleanup();
    console.error("[audio] Playback failed", error);
    return null;
  }
}

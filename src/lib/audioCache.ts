import { openDB } from 'idb';

const DB_NAME = 'ngajiyuk-audio-cache';
const STORE_NAME = 'audios';

async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
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
  return db.get(STORE_NAME, id);
}

const MAX_CACHE_ITEMS = 50;

export async function saveAudioToCache(id: string, blob: Blob) {
  const db = await initDB();
  
  // Quota Management: delete oldest if exceeded
  const count = await db.count(STORE_NAME);
  if (count >= MAX_CACHE_ITEMS) {
    const keys = await db.getAllKeys(STORE_NAME);
    if (keys.length > 0) {
      await db.delete(STORE_NAME, keys[0]);
    }
  }
  
  await db.put(STORE_NAME, blob, id);
}

export async function fetchAndCacheAudio(id: string, url: string): Promise<Blob | null> {
  let blob = await getAudioFromCache(id);
  if (!blob) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP Error ${res.status} fetching ${url}`);
      blob = await res.blob();
      await saveAudioToCache(id, blob);
    } catch (error) {
      console.error(`Failed to fetch audio for ${id}:`, error);
      return null;
    }
  }
  return blob;
}

/**
 * Main audio playback engine.
 * 1. Checks Cache
 * 2. If not found, fetches from public folder
 * 3. Saves to cache
 * 4. Plays audio
 * Returns the HTMLAudioElement if successful, allowing consumers to modify playback speed/loop.
 */
export async function playAudio(id: string, url: string): Promise<HTMLAudioElement | null> {
  const blob = await fetchAndCacheAudio(id, url);
  
  if (!blob) return null;

  const objectUrl = URL.createObjectURL(blob);
  const audio = new Audio(objectUrl);
  
  audio.onended = () => {
    URL.revokeObjectURL(objectUrl);
  };
  
  try {
    await audio.play();
    return audio;
  } catch (err) {
    console.error('Audio playback failed', err);
    return null;
  }
}

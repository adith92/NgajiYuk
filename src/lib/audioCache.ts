import { openDB } from 'idb';
import { generateTtsAudio } from './vynaa';

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

export async function saveAudioToCache(id: string, blob: Blob) {
  const db = await initDB();
  await db.put(STORE_NAME, blob, id);
}

/**
 * Main audio playback engine.
 * 1. Checks Cache
 * 2. If not found, generates via API
 * 3. Saves to cache
 * 4. Plays audio
 * Returns the HTMLAudioElement if successful, allowing consumers to modify playback speed/loop.
 */
export async function playAudio(id: string, text: string, lang: 'ar' | 'id', apiKey: string): Promise<HTMLAudioElement | null> {
  if (!apiKey) {
    console.warn('API Key not set for TTS, fallback to speech synthesis if possible.');
    return null;
  }

  let blob = await getAudioFromCache(id);
  
  if (!blob) {
    try {
      blob = await generateTtsAudio({ text, lang, apiKey });
      await saveAudioToCache(id, blob);
    } catch (error) {
      console.error(`Failed to generate TTS for ${id}:`, error);
      return null;
    }
  }

  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  
  audio.onended = () => {
    URL.revokeObjectURL(url);
  };
  
  try {
    await audio.play();
    return audio;
  } catch (err) {
    console.error('Audio playback failed', err);
    return null;
  }
}


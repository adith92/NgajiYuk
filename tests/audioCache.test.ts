import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchAndCacheAudio, clearAudioCache } from '../src/lib/audioCache';

// Mock IndexedDB
const mockDB = new Map();

vi.mock('idb', () => ({
  openDB: vi.fn().mockResolvedValue({
    get: vi.fn((_store, id) => mockDB.get(id)),
    put: vi.fn((_store, blob, id) => mockDB.set(id, blob)),
    count: vi.fn(() => mockDB.size),
    clear: vi.fn(() => mockDB.clear()),
    getAllKeys: vi.fn(() => Array.from(mockDB.keys())),
    delete: vi.fn((_store, id) => mockDB.delete(id))
  })
}));

// Mock Fetch
global.fetch = vi.fn();

describe('audioCache', () => {
  beforeEach(() => {
    mockDB.clear();
    vi.clearAllMocks();
  });

  it('should fetch and cache if not in DB', async () => {
    const mockBlob = new Blob(['test audio data']);
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      blob: () => Promise.resolve(mockBlob)
    });

    const result = await fetchAndCacheAudio('test_id', '/test.mp3');
    expect(global.fetch).toHaveBeenCalledWith('/test.mp3');
    expect(result).toBe(mockBlob);
    expect(mockDB.get('test_id')).toBe(mockBlob);
  });

  it('should return from cache if exists without fetching', async () => {
    const mockBlob = new Blob(['cached data']);
    mockDB.set('test_id_2', mockBlob);

    const result = await fetchAndCacheAudio('test_id_2', '/test.mp3');
    expect(global.fetch).not.toHaveBeenCalled();
    expect(result).toBe(mockBlob);
  });
  
  it('should handle fetch errors gracefully', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));
    
    const result = await fetchAndCacheAudio('error_id', '/error.mp3');
    expect(result).toBeNull();
  });
});

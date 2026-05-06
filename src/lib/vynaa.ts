// VYNAA API Wrapper
// Documentation: https://vynaa.web.id

export const VYNAA_BASE_URL = '/vynaa-api';

/**
 * Cek limit API dan status profil.
 * 
 * TODO: Jika parameter dan response API check-limit Vynaa berubah, 
 * sesuaikan tipe dan endpoint di sini.
 */
export async function checkVynaaKey(apiKey: string): Promise<boolean> {
  if (!apiKey) return false;
  try {
    const res = await fetch(`${VYNAA_BASE_URL}/status/userlimit/check-limit?apikey=${apiKey}`);
    const data = await res.json();
    return data && data.status === 200;
  } catch (err) {
    console.error('Error checking Vynaa key:', err);
    return false;
  }
}

/**
 * Generate audio dari text menggunakan Vynaa TTS.
 * Fallback to direct client call for now.
 * 
 * TODO: Jika endpoint atau model berubah, edit fetch ini.
 */
export async function generateTtsAudio(params: { text: string; lang: 'ar' | 'id'; apiKey: string }): Promise<Blob> {
  const { text, lang, apiKey } = params;
  
  // Vynaa endpoint /pollinations/pollinations/audio?text=...&model=...
  // Model yang tersedia di Vynaa atau Pollinations (biasanya tts-1, atau lainnya)
  // Lang mungkin ga didukung secara eksplisit sbg query di Vynaa, tapi kita lewatkan ke prompt/text.
  
  const query = new URLSearchParams({
    text: text,
    apikey: apiKey,
    // misal tambah model
    // model: lang === 'ar' ? 'aura-asteria-en' : 'aura-styx-en' // TODO: check correct voice for arabic in VYNAA
  });

  const url = `${VYNAA_BASE_URL}/api/ai/tts?text=${encodeURIComponent(text)}&apikey=${apiKey}`;

  // Mengingat Vynaa docs endpoint: /pollinations/pollinations/audio atau /api/ai/tts
  // Saya pakai /api/ai/tts karena lebih umum untuk TTS di web.id, 
  // Jika ini gagal di runtime, silakan sesuaikan URL endpoint sesuai docs terbaru.

  const res = await fetch(url);
  
  if (!res.ok) {
    // try fallback route based on user instruction
    const fallbackUrl = `${VYNAA_BASE_URL}/pollinations/pollinations/audio?text=${encodeURIComponent(text)}&apikey=${apiKey}`;
    const fbRes = await fetch(fallbackUrl);
    if (!fbRes.ok) throw new Error('TTS generation failed');
    return await fbRes.blob();
  }

  return await res.blob();
}

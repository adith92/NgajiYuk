export default async function handler(req: any, res: any) {
  const apiKey = req.headers['x-vynaa-api-key'] || process.env.VYNAA_API_KEY;
  const text = req.query.text;

  if (!apiKey) {
    return res.status(401).json({ error: 'Missing API Key' });
  }

  if (!text) {
    return res.status(400).json({ error: 'Missing text parameter' });
  }

  try {
    const url = `https://vynaa.web.id/api/ai/tts?text=${encodeURIComponent(text as string)}&apikey=${apiKey}`;
    const vynaaRes = await fetch(url);
    
    if (!vynaaRes.ok) {
       // fallback
       const fbUrl = `https://vynaa.web.id/pollinations/pollinations/audio?text=${encodeURIComponent(text as string)}&apikey=${apiKey}`;
       const fbRes = await fetch(fbUrl);
       if (!fbRes.ok) {
          throw new Error('Fallback also failed');
       }
       const arrayBuffer = await fbRes.arrayBuffer();
       res.setHeader('Content-Type', 'audio/mpeg');
       res.send(Buffer.from(arrayBuffer));
       return;
    }

    const arrayBuffer = await vynaaRes.arrayBuffer();
    
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(Buffer.from(arrayBuffer));
  } catch (error) {
    res.status(500).json({ error: 'TTS Serverless failed' });
  }
}

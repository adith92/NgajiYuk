import asyncio
import os
import edge_tts

VOICE = "ar-SA-ZariyahNeural"
PITCH = "+30Hz"
RATE = "-50%"

async def generate(text, output_path):
    # Selalu timpa (overwrite) file yang sudah ada
    print(f"Generating: {output_path}")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    communicate = edge_tts.Communicate(text, VOICE, pitch=PITCH, rate=RATE)
    await communicate.save(output_path)

async def main():
    sholat = [
        ('niat', 'أُصَلِّي فَرْضَ الْمَغْرِبِ ثَلَاثَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلَّهِ تَعَالَى'),
        ('takbir', 'اللَّهُ أَكْبَرُ'),
        ('doa_iftitah', 'اللَّهُ أَكْبَرُ كَبِيرًا وَالْحَمْدُ لِلَّهِ كَثِيرًا وَسُبْحَانَ اللَّهِ بُكْرَةً وَأَصِيلًا'),
        ('ruku', 'سُبْحَانَ رَبِّيَ الْعَظِيمِ وَبِحَمْدِهِ'),
        ('itidal', 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ. رَبَّنَا لَكَ الْحَمْدُ'),
        ('sujud', 'سُبْحَانَ رَبِّيَ الْأَعْلَى وَبِحَمْدِهِ'),
        ('duduk', 'رَبِّ اغْفِرْ لِي وَارْحَمْنِي وَاجْبُرْنِي وَارْفَعْنِي وَارْزُقْنِي وَاهْدِنِي وَعَافِنِي وَاعْفُ عَنِّي'),
        ('tahiyat', 'التَّحِيَّاتُ الْمُبَارَكَاتُ الصَّلَوَاتُ الطَّيِّبَاتُ لِلَّهِ'),
        ('salam', 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ')
    ]
    
    for id, txt in sholat:
        await generate(txt, f"public/audio/sholat/{id}.mp3")

if __name__ == "__main__":
    asyncio.run(main())

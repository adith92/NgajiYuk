import asyncio
import os
import edge_tts

VOICE = "ar-SA-ZariyahNeural"
PITCH = "+30Hz"
RATE = "-10%"

async def generate(text, output_path):
    if os.path.exists(output_path):
        return
    print(f"Generating: {output_path}")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    communicate = edge_tts.Communicate(text, VOICE, pitch=PITCH, rate=RATE)
    await communicate.save(output_path)

async def main():
    doa = [
        ('makan_sebelum', 'اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ'),
        ('makan_sesudah', 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ'),
        ('tidur_sebelum', 'بِاسْمِكَ اللَّهُمَّ أَحْيَا وَبِاسْمِكَ أَمُوتُ'),
        ('tidur_bangun', 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَتَا وَإِلَيْهِ النُّشُورُ'),
        ('belajar_sebelum', 'رَبِّ زِدْنِي عِلْمًا وَارْزُقْنِي فَهْمًا'),
        ('belajar_sesudah', 'اللَّهُمَّ أَرِنَا الْحَقَّ حَقًّا وَارْزُقْنَا اتِّبَاعَهُ، وَأَرِنَا الْبَاطِلَ بَاطِلًا وَارْزُقْنَا اجْتِنَابَهُ'),
        ('keluar_rumah', 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ'),
        ('naik_kendaraan', 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ'),
        ('orang_tua', 'رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا'),
        ('kamar_mandi_masuk', 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ'),
        ('kamar_mandi_keluar', 'غُفْرَانَكَ')
    ]
    for id, txt in doa:
        await generate(txt, f"public/audio/doa/{id}.mp3")

if __name__ == "__main__":
    asyncio.run(main())

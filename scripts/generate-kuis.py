import asyncio
import os
import edge_tts

VOICE = "id-ID-GadisNeural"
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
    hijaiyah = [
        ('alif', 'Alif'), ('ba', 'Ba'), ('ta', 'Ta'), ('tsa', 'Tsa'), 
        ('jim', 'Jim'), ('ha', 'Ha'), ('kho', 'Kho'), ('dal', 'Dal'), 
        ('dzal', 'Dzal'), ('ro', 'Ro'), ('zai', 'Zai'), ('sin', 'Sin'), 
        ('syin', 'Syin'), ('shod', 'Shod'), ('dhod', 'Dhod'), ('tho', 'Tho'), 
        ('zho', 'Zho'), ('ain', 'Ain'), ('ghoin', 'Ghoin'), ('fa', 'Fa'), 
        ('qof', 'Qof'), ('kaf', 'Kaf'), ('lam', 'Lam'), ('mim', 'Mim'), 
        ('nun', 'Nun'), ('wawu', 'Wawu'), ('ha_besar', 'Ha besar'), 
        ('hamzah', 'Hamzah'), ('ya', 'Ya')
    ]
    
    # Generate Hijaiyah audios
    for id, text in hijaiyah:
        await generate(text, f"public/audio/kuis/hijaiyah_{id}.mp3")
        
    # Generate Feedback audios
    await generate("Benar! Hebat!", "public/audio/kuis/correct.mp3")
    await generate("Kurang tepat, coba lagi ya!", "public/audio/kuis/wrong.mp3")

if __name__ == "__main__":
    asyncio.run(main())

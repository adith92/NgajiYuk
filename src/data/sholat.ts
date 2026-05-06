export interface SholatData {
  id: string;
  title: string;
  arabic: string;
  latin: string;
  translation: string;
  audioText: string;
}

export const sholatData: SholatData[] = [
  {
    id: 'niat',
    title: 'Niat Sholat',
    arabic: 'أُصَلِّي فَرْضَ الْمَغْرِبِ ثَلَاثَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلَّهِ تَعَالَى',
    latin: 'Ushalli fardhol maghribi tsalaatsa raka\'aatin mustaqbilal qiblati adaa\'an lillaahi ta\'aalaa.',
    translation: 'Aku berniat sholat fardhu Maghrib tiga rakaat menghadap kiblat karena Allah Ta\'ala. (Contoh niat sholat Maghrib)',
    audioText: 'أُصَلِّي فَرْضَ الْمَغْرِبِ ثَلَاثَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلَّهِ تَعَالَى',
  },
  {
    id: 'takbir',
    title: 'Takbiratul Ihram',
    arabic: 'اللَّهُ أَكْبَرُ',
    latin: 'Allaahu akbar',
    translation: 'Allah Maha Besar',
    audioText: 'اللَّهُ أَكْبَرُ',
  },
  {
    id: 'doa_iftitah',
    title: 'Doa Iftitah',
    arabic: 'اللَّهُ أَكْبَرُ كَبِيرًا وَالْحَمْدُ لِلَّهِ كَثِيرًا وَسُبْحَانَ اللَّهِ بُكْرَةً وَأَصِيلًا',
    latin: 'Allaahu akbaru kabiiran, walhamdu lillaahi katsiiran, wa subhaanallaahi bukratan wa aşiilaa.',
    translation: 'Allah Maha Besar dengan sebesar-besarnya, segala puji bagi Allah dengan pujian yang banyak, dan Maha Suci Allah pada waktu pagi dan petang.',
    audioText: 'اللَّهُ أَكْبَرُ كَبِيرًا وَالْحَمْدُ لِلَّهِ كَثِيرًا وَسُبْحَانَ اللَّهِ بُكْرَةً وَأَصِيلًا',
  },
  {
    id: 'ruku',
    title: 'Doa Ruku\'',
    arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ وَبِحَمْدِهِ',
    latin: 'Subhaana rabbiyal \'adhiimi wabihamdih (3x)',
    translation: 'Maha Suci Tuhanku Yang Maha Agung dan dengan memuji-Nya.',
    audioText: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ وَبِحَمْدِهِ',
  },
  {
    id: 'itidal',
    title: 'I\'tidal',
    arabic: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ. رَبَّنَا لَكَ الْحَمْدُ',
    latin: 'Sami\'allaahu liman hamidah. Rabbanaa lakal hamd.',
    translation: 'Allah maha mendengar terhadap orang yang memuji-Nya. Ya Tuhan kami, hanya bagi-Mu segala puji.',
    audioText: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ. رَبَّنَا لَكَ الْحَمْدُ',
  },
  {
    id: 'sujud',
    title: 'Doa Sujud',
    arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى وَبِحَمْدِهِ',
    latin: 'Subhaana rabbiyal a\'laa wa bihamdih (3x)',
    translation: 'Maha Suci Tuhanku Yang Maha Tinggi dan dengan memuji-Nya.',
    audioText: 'سُبْحَانَ رَبِّيَ الْأَعْلَى وَبِحَمْدِهِ',
  },
  {
    id: 'duduk',
    title: 'Duduk Antara Dua Sujud',
    arabic: 'رَبِّ اغْفِرْ لِي وَارْحَمْنِي وَاجْبُرْنِي وَارْفَعْنِي وَارْزُقْنِي وَاهْدِنِي وَعَافِنِي وَاعْفُ عَنِّي',
    latin: 'Rabbighfirlii, warhamnii, wajburnii, warfa\'nii, warzuqnii, wahdinii, wa\'aafinii, wa\'fu\'annii.',
    translation: 'Ya Tuhanku ampunilah aku, rahmatilah aku, cukupkanlah aku, angkatlah derajatku, berilah aku rezeki, berilah aku petunjuk, sehatkanlah aku, dan maafkanlah aku.',
    audioText: 'رَبِّ اغْفِرْ لِي وَارْحَمْنِي وَاجْبُرْنِي وَارْفَعْنِي وَارْزُقْنِي وَاهْدِنِي وَعَافِنِي وَاعْفُ عَنِّي',
  },
  {
    id: 'tahiyat',
    title: 'Tahiyat / Tasyahud',
    arabic: 'التَّحِيَّاتُ الْمُبَارَكَاتُ الصَّلَوَاتُ الطَّيِّبَاتُ لِلَّهِ',
    latin: 'Attahiyyaatul mubaarakaatush shalawaatuth thayyibaatu lillaah.',
    translation: 'Segala kehormatan, keberkahan, rahmat, dan kebaikan adalah milik Allah.',
    audioText: 'التَّحِيَّاتُ الْمُبَارَكَاتُ الصَّلَوَاتُ الطَّيِّبَاتُ لِلَّهِ',
  },
  {
    id: 'salam',
    title: 'Salam',
    arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
    latin: 'Assalaamu\'alaikum warahmatullaah.',
    translation: 'Semoga keselamatan dan rahmat Allah terlimpahkan kepadamu.',
    audioText: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
  }
];

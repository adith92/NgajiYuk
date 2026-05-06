export interface SurahData {
  id: string;
  title: string;
  arabic: string;
  latin: string;
  translation: string;
  audioText: string;
  audioUrl?: string;
  needsReview?: boolean;
}

export const surahData: SurahData[] = [
  {
    id: 'alfatihah',
    title: 'Al-Fatihah',
    // TODO: verify with ustadz/source
    needsReview: true,
    audioUrl: '/audio/surah/alfatihah.mp3',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ. الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ. الرَّحْمَنِ الرَّحِيمِ. مَالِكِ يَوْمِ الدِّينِ. إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ. اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ. صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ.',
    latin: 'Bismillaahir-rohmaanir-rohiim. Alhamdulillaahi robbil-\'aalamiin. Ar-rohmaanir-rohiim. Maaliki yaumid-diin. Iyyaaka na\'budu wa iyyaaka nasta\'iin. Ihdinas-shirothol-mustaqiim. Shirotholladziina an\'amta \'alaihim ghoiril-maghdhuubi \'alaihim wa ladh-dholliin.',
    translation: 'Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang. Segala puji bagi Allah, Tuhan semesta alam. Yang Maha Pengasih lagi Maha Penyayang. Pemilik hari pembalasan. Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami memohon pertolongan. Tunjukilah kami jalan yang lurus. (yaitu) jalan orang-orang yang telah Engkau beri nikmat kepadanya; bukan (jalan) mereka yang dimurkai, dan bukan (pula jalan) mereka yang sesat.',
    audioText: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ. الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ. الرَّحْمَنِ الرَّحِيمِ. مَالِكِ يَوْمِ الدِّينِ. إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ. اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ. صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ.',
  },
  {
    id: 'alikhlas',
    title: 'Al-Ikhlas',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ. قُلْ هُوَ اللَّهُ أَحَدٌ. اللَّهُ الصَّمَدُ. لَمْ يَلِدْ وَلَمْ يُولَدْ. وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ.',
    latin: 'Bismillaahir-rohmaanir-rohiim. Qul huwallahu ahad. Allahus-samad. Lam yalid walam yuulad. Walam yakullahu kufuwan ahad.',
    translation: 'Katakanlah (Muhammad), "Dialah Allah, Yang Maha Esa. Allah tempat meminta segala sesuatu. Dia tiada beranak dan tiada pula diperanakkan, dan tidak ada satupun yang setara dengan Dia."',
    audioText: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ. قُلْ هُوَ اللَّهُ أَحَدٌ. اللَّهُ الصَّمَدُ. لَمْ يَلِدْ وَلَمْ يُولَدْ. وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ.',
  },
  {
    id: 'alfalaq',
    title: 'Al-Falaq',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ. قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ. مِن شَرِّ مَا خَلَقَ. وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ. وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ. وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ.',
    latin: 'Bismillaahir-rohmaanir-rohiim. Qul a\'uudzu birobbil-falaq. Min syarri maa kholaq. Wa min syarri ghaasiqin idzaa waqob. Wa min syarrin-naffaathaati fil-\'uqod. Wa min syarri haasidin idzaa hasad.',
    translation: 'Katakanlah, "Aku berlindung kepada Tuhan yang menguasai subuh (fajar), dari kejahatan (makhluk yang) Dia ciptakan, dan dari kejahatan malam apabila telah gelap gulita, dan dari kejahatan perempuan-perempuan tukang sihir yang meniup pada buhul-buhul (talinya), dan dari kejahatan orang yang dengki apabila dia dengki."',
    audioText: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ. قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ. مِن شَرِّ مَا خَلَقَ. وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ. وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ. وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ.',
  },
  {
    id: 'annas',
    title: 'An-Nas',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ. قُلْ أَعُوذُ بِرَبِّ النَّاسِ. مَلِكِ النَّاسِ. إِلَهِ النَّاسِ. مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ. الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ. مِنَ الْجِنَّةِ وَالنَّاسِ.',
    latin: 'Bismillaahir-rohmaanir-rohiim. Qul a\'uudzu birobbin-naas. Malikin-naas. Ilaahin-naas. Min syarril-waswaasil-khonnaas. Alladzii yuwaswisu fii shuduurin-naas. Minal-jinnati wan-naas.',
    translation: 'Katakanlah, "Aku berlindung kepada Tuhannya manusia. Raja manusia. Sembahan manusia. dari kejahatan (bisikan) setan yang bersembunyi, yang membisikkan (kejahatan) ke dalam dada manusia, dari (golongan) jin dan manusia."',
    audioText: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ. قُلْ أَعُوذُ بِرَبِّ النَّاسِ. مَلِكِ النَّاسِ. إِلَهِ النَّاسِ. مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ. الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ. مِنَ الْجِنَّةِ وَالنَّاسِ.',
  },
  {
    id: 'alkautsar',
    title: 'Al-Kautsar',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ. إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ. فَصَلِّ لِرَبِّكَ وَانْحَرْ. إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ.',
    latin: 'Bismillaahir-rohmaanir-rohiim. Innaa a\'thainaakal-kautsar. Fasholli lirobbika wanhar. Inna syaani\'aka huwal-abtar.',
    translation: 'Sungguh, Kami telah memberimu (Muhammad) nikmat yang banyak. Maka laksanakanlah sholat karena Tuhanmu, dan berkurbanlah (sebagai ibadah dan mendekatkan diri kepada Allah). Sungguh, orang-orang yang membencimu dialah yang terputus (dari rahmat Allah).',
    audioText: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ. إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ. فَصَلِّ لِرَبِّكَ وَانْحَرْ. إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ.',
  },
  {
    id: 'alasr',
    title: 'Al-Asr',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ. وَالْعَصْرِ. إِنَّ الْإِنسَانَ لَفِي خُسْرٍ. إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ.',
    latin: 'Bismillaahir-rohmaanir-rohiim. Wal-\'ashr. Innal-insaana lafii khusr. Illalladziina aamanuu wa \'amilush-shoolihaati wa tawaashau bil-haqqi wa tawaashau bish-shabr.',
    translation: 'Demi masa. Sungguh, manusia berada dalam kerugian, kecuali orang-orang yang beriman dan mengerjakan kebajikan serta saling menasihati untuk kebenaran dan saling menasihati untuk kesabaran.',
    audioText: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ. وَالْعَصْرِ. إِنَّ الْإِنسَانَ لَفِي خُسْرٍ. إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ.',
  },
  {
    id: 'annasr',
    title: 'An-Nasr',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ. إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ. وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا. فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ إِنَّهُ كَانَ تَوَّابًا.',
    latin: 'Bismillaahir-rohmaanir-rohiim. Idzaa jaa\'a nashrulloohi wal-fath. Waro\'aitan-naasa yadkhuluuna fii diinillaahi afwaajaa. Fasabbih bihamdi robbika wastaghfirh innahuu kaana tawwaabaa.',
    translation: 'Apabila telah datang pertolongan Allah dan kemenangan, dan engkau melihat manusia berbondong-bondong masuk agama Allah, maka bertasbihlah dengan memuji Tuhanmu dan mohonlah ampunan kepada-Nya. Sungguh, Dia Maha Penerima tobat.',
    audioText: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ. إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ. وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا. فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ إِنَّهُ كَانَ تَوَّابًا.',
  },
  {
    id: 'allahab',
    title: 'Al-Lahab',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ. تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ. مَا أَغْنَى عَنْهُ مَالُهُ وَمَا كَسَبَ. سَيَصْلَى نَارًا ذَاتَ لَهَبٍ. وَامْرَأَتُهُ حَمَّالَةَ الْحَطَبِ. فِي جِيدِهَا حَبْلٌ مِّن مَّسَدٍ.',
    latin: 'Bismillaahir-rohmaanir-rohiim. Tabbat yadaa abii lahabiw watabb. Maa aghnaa \'anhu maaluhuu wa maa kasab. Sayashlaa naaron dzaata lahab. Wamro\'atuhuu hammaalatal-hathob. Fii jiidihaa hablum mim masad.',
    translation: 'Binasalah kedua tangan Abu Lahab dan benar-benar binasa dia! Tidaklah berguna baginya hartanya dan apa yang dia usahakan. Kelak dia akan masuk ke dalam api yang bergejolak (neraka). Dan (begitu pula) istrinya, pembawa kayu bakar (penyebar fitnah). Di lehernya ada tali dari sabut yang dipintal.',
    audioText: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ. تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ. مَا أَغْنَى عَنْهُ مَالُهُ وَمَا كَسَبَ. سَيَصْلَى نَارًا ذَاتَ لَهَبٍ. وَامْرَأَتُهُ حَمَّالَةَ الْحَطَبِ. فِي جِيدِهَا حَبْلٌ مِّن مَّسَدٍ.',
  },
  {
    id: 'quraisy',
    title: 'Quraisy',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ. لِإِيلَافِ قُرَيْشٍ. إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ. فَلْيَعْبُدُوا رَبَّ هَذَا الْبَيْتِ. الَّذِي أَطْعَمَهُم مِّن جُوعٍ وَآمَنَهُم مِّنْ خَوْفٍ.',
    latin: 'Bismillaahir-rohmaanir-rohiim. Li\'iilaafi quroisy. Iilaafihim rihlatasy-syitaa\'i wash-shoif. Falya\'buduu robba haadzal-bait. Alladzii ath\'amahum min juu\'iw wa aamanahum min khouf.',
    translation: 'Karena kebiasaan orang-orang Quraisy, (yaitu) kebiasaan mereka bepergian pada musim dingin dan musim panas. Maka hendaklah mereka menyembah Tuhan (pemilik) rumah ini (Kakbah), yang telah memberi makanan kepada mereka untuk menghilangkan lapar dan mengamankan mereka dari rasa ketakutan.',
    audioText: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ. لِإِيلَافِ قُرَيْشٍ. إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ. فَلْيَعْبُدُوا رَبَّ هَذَا الْبَيْتِ. الَّذِي أَطْعَمَهُم مِّن جُوعٍ وَآمَنَهُم مِّنْ خَوْفٍ.',
  },
  {
    id: 'alfil',
    title: 'Al-Fil',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ. أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ. أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ. وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ. تَرْمِيهِم بِحِجَارَةٍ مِّن سِجِّيلٍ. فَجَعَلَهُمْ كَعَصْفٍ مَّأْكُولٍ.',
    latin: 'Bismillaahir-rohmaanir-rohiim. Alam taro kaifa fa\'ala robbuka bi\'ash-haabil-fiil. Alam yaj\'al kaidahum fii tadhliil. Wa arsala \'alaihim thoiron abaabiil. Tarmiihim bihijaarotim min sijjiil. Faja\'alahum ka\'ashfim ma\'kuul.',
    translation: 'Tidakkah engkau memperhatikan bagaimana Tuhanmu telah bertindak terhadap pasukan bergajah? Bukankah Dia telah menjadikan tipu daya mereka itu sia-sia? dan Dia mengirimkan kepada mereka burung yang berbondong-bondong, yang melempari mereka dengan batu dari tanah liat yang dibakar, sehingga mereka dijadikan-Nya seperti daun-daun yang dimakan (ulat).',
    audioText: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ. أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ. أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ. وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ. تَرْمِيهِم بِحِجَارَةٍ مِّن سِجِّيلٍ. فَجَعَلَهُمْ كَعَصْفٍ مَّأْكُولٍ.',
  }
];

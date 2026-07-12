<div align="center">

# 📖✨ NgajiYuk

### Belajar Hijaiyah, doa harian, bacaan sholat, dan kuis Islami dengan pengalaman yang ceria untuk anak 🌙⭐

![Project Status](https://img.shields.io/badge/status-active%20development-f59e0b?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16.2.9-000000?style=for-the-badge&logo=nextdotjs)
![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=111827)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

</div>

---

## 🌟 Tentang NgajiYuk

**NgajiYuk** adalah aplikasi web edukasi Islam untuk anak dan keluarga. Aplikasi ini menggabungkan materi belajar dasar, audio interaktif, pencatatan progres, kuis, dan sistem hadiah waktu bermain dalam antarmuka yang cerah serta ramah anak. 🎨🕌

Aplikasi aktif saat ini berjalan dengan **Next.js App Router** dan menyimpan profil, progres, riwayat kuis, serta status Game Zone secara lokal di browser menggunakan Zustand Persist.

> 🚧 **Status produk:** prototype fungsional dalam pengembangan aktif. Beberapa bagian masih berupa simulasi lokal dan belum menggunakan autentikasi atau database cloud secara penuh.

---

## 📊 Status Aplikasi

**Terakhir disinkronkan dengan codebase aktif:** 12 Juli 2026 🗓️

| Area | Status | Keterangan |
|---|---|---|
| 👨‍👩‍👧‍👦 Profil keluarga lokal | ✅ Aktif | Tersedia empat profil cepat: Abeel, Emily, Emier, dan Bunda Uma |
| 🔐 Login email dan password | 🟡 Simulasi | Form tersedia, tetapi belum melakukan autentikasi ke server |
| 🔤 Belajar Hijaiyah | 🟡 Aktif, perlu perbaikan audio | Materi dan progres aktif; jalur audio halaman Hijaiyah masih perlu diselaraskan |
| 🤲 Doa harian | ✅ Aktif | Arab, latin, arti, audio, progres, dan latihan pengucapan |
| 🎙️ Latihan pengucapan | 🟡 Eksperimental | Menggunakan Web Speech API dan kemiripan teks, bukan penilaian tajwid atau makhraj |
| 🕌 Bacaan sholat | ✅ Aktif | Bacaan, latin, arti, audio, urutan, dan progres |
| 🧠 Kuis Hijaiyah | ✅ Aktif | Sepuluh soal per sesi dengan skor dan riwayat lokal |
| 🎮 Game Zone | ✅ Aktif secara lokal | Terbuka saat skor kuis minimal 80% dan memakai timer lokal |
| 💾 Cache audio | ✅ Aktif | Audio disimpan di IndexedDB untuk mengurangi pengunduhan berulang |
| ☁️ Supabase | 🟡 Disiapkan | Client dan environment variable tersedia, tetapi belum terhubung ke flow aplikasi |
| 🌐 Bahasa Indonesia, Jepang, Betawi | 🟡 Parsial | Resource terjemahan tersedia, tetapi sebagian besar UI aktif masih berbahasa Indonesia |
| 📚 Hafalan surah | 🔴 Belum aktif | Data dan implementasi lama masih terdapat pada aplikasi legacy |
| 👤 Halaman profil dan tema | 🔴 Belum aktif | Model state tersedia, tetapi route aktif belum tersedia |
| 🧪 Automated testing | 🔴 Belum aktif pada app Next.js | Test lama masih berada di folder `_old_vite_app` |
| 📱 PWA penuh | 🔴 Belum tersedia | Cache audio tersedia, tetapi service worker dan installable PWA belum diterapkan |

### Legenda status 🚦

- ✅ **Aktif:** tersedia pada aplikasi Next.js yang berjalan sekarang.
- 🟡 **Parsial/eksperimental:** tersedia, tetapi belum lengkap atau memiliki batasan penting.
- 🔴 **Belum aktif:** belum menjadi bagian dari pengalaman aplikasi aktif.

---

## 🎯 Fitur Utama

### 👨‍👩‍👧‍👦 Profil belajar keluarga

- Memilih profil anak atau pembimbing dari halaman awal.
- Progres, poin, riwayat kuis, dan hadiah Game Zone dipisahkan berdasarkan profil.
- Data saat ini tersimpan pada browser/perangkat yang digunakan.

### 🔤 Belajar huruf Hijaiyah

- Daftar huruf dari Alif sampai Ya.
- Tampilan kartu interaktif dan animasi ramah anak.
- Poin progres untuk setiap huruf yang dipelajari.
- Dukungan audio lokal sedang dalam tahap penyelarasan jalur file.

### 🤲 Doa harian

- Teks Arab, transliterasi latin, dan terjemahan Indonesia.
- Audio lokal untuk setiap doa.
- Tombol penanda hafal dan pemberian poin.
- Latihan mengucapkan doa melalui Web Speech API pada browser yang mendukung.

### 🕌 Bacaan sholat

- Urutan bacaan mulai dari niat hingga salam.
- Teks Arab, latin, arti, audio, dan pencatatan progres.
- Modul aktif saat ini berfokus pada **bacaan sholat**, belum menjadi panduan visual lengkap gerakan sholat.

### 🧠 Kuis Hijaiyah

- Sepuluh pertanyaan per sesi.
- Empat pilihan jawaban pada setiap soal.
- Audio petunjuk huruf.
- Rekap jawaban benar, salah, persentase skor, dan hadiah waktu bermain.

### 🎮 Game Zone

| Skor kuis | Hadiah bermain |
|---:|---:|
| 80–89% | 15 menit |
| 90–99% | 30 menit |
| 100% | 45 menit |

Game Zone saat ini berisi permainan mengetuk bintang dengan timer yang disimpan secara lokal. ⭐🪐

### 🔊 Audio lokal dan cache

- Audio dimuat dari folder `public/audio`.
- File yang berhasil dimuat disimpan ke IndexedDB.
- Cache dibatasi hingga 50 item.
- Script Python tersedia untuk membuat ulang sebagian aset audio menggunakan `edge-tts`.

---

## 🗺️ Route Aktif

| Route | Fungsi |
|---|---|
| `/` | Pemilihan profil dan simulasi login email |
| `/dashboard` | Menu utama pembelajaran |
| `/hijaiyah` | Materi huruf Hijaiyah |
| `/doa` | Doa harian dan latihan pengucapan |
| `/sholat` | Bacaan sholat |
| `/kuis` | Kuis Hijaiyah |
| `/gamezone` | Game hadiah setelah lulus kuis |

Route seperti `/hafalan` dan `/profile` belum tersedia pada aplikasi Next.js aktif. 🧭

---

## 🧰 Teknologi

| Teknologi | Kegunaan |
|---|---|
| [Next.js](https://nextjs.org/) 16 | Framework dan App Router |
| [React](https://react.dev/) 19 | Antarmuka pengguna |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) 4 | Styling |
| [Framer Motion](https://www.framer.com/motion/) | Animasi dan transisi |
| [Zustand](https://zustand-demo.pmnd.rs/) | State management dan local persistence |
| [IndexedDB](https://developer.mozilla.org/docs/Web/API/IndexedDB_API) | Cache audio lokal |
| [Supabase](https://supabase.com/) | Fondasi autentikasi/database yang belum diintegrasikan |
| [Web Speech API](https://developer.mozilla.org/docs/Web/API/Web_Speech_API) | Speech-to-text eksperimental |
| [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) | Efek penghargaan visual 🎉 |

---

## 🏗️ Struktur Project

```text
NgajiYuk/
├── public/
│   ├── audio/                 # Audio doa, sholat, dan kuis
│   └── images/                # Aset gambar aplikasi
├── scripts/
│   ├── generate-doa.py        # Generator audio doa
│   ├── generate-kuis.py       # Generator audio kuis
│   └── generate-sholat.py     # Generator audio sholat
├── src/
│   ├── app/                   # Route Next.js App Router
│   ├── components/            # Komponen UI reusable
│   ├── data/                  # Data Hijaiyah, doa, sholat, dan surah
│   ├── lib/
│   │   ├── store/             # Zustand slices
│   │   ├── supabase/          # Supabase browser client
│   │   ├── audioCache.ts      # IndexedDB audio cache
│   │   ├── i18n.ts            # Resource terjemahan
│   │   └── utils.ts           # Normalisasi teks dan similarity
│   └── types/                 # Model data TypeScript
├── _old_vite_app/             # Arsip aplikasi Vite lama, bukan source aktif
├── package.json
└── README.md
```

> 📌 Source of truth aplikasi aktif adalah folder **`src/`** pada root. Folder **`_old_vite_app/`** merupakan kode legacy dari sebelum migrasi ke Next.js.

---

## 🚀 Menjalankan Secara Lokal

### Prasyarat

- Node.js versi modern yang kompatibel dengan Next.js 16
- npm
- Browser modern, disarankan Google Chrome untuk fitur pengucapan 🎙️

### Instalasi

```bash
git clone https://github.com/adith92/NgajiYuk.git
cd NgajiYuk
npm install
```

### Menjalankan development server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) pada browser.

### Build production

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

---

## 🔐 Environment Variables

Salin contoh environment variable:

```bash
cp .env.example .env.local
```

Isi nilai berikut apabila Supabase mulai digunakan:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

> 🟡 Pada kondisi codebase saat ini, Supabase client sudah tersedia tetapi autentikasi, profil, progres, dan kuis masih menggunakan state lokal. Jangan menganggap form email sebagai autentikasi production.

---

## 🎧 Membuat Ulang Audio

Script generator audio menggunakan Python dan package `edge-tts`.

### Instal dependency Python

```bash
pip install edge-tts
```

### Jalankan generator

```bash
python scripts/generate-doa.py
python scripts/generate-kuis.py
python scripts/generate-sholat.py
```

Script akan melewati file yang sudah tersedia. Hapus file target terlebih dahulu apabila ingin membuat ulang audionya. 🎵

---

## ⚠️ Batasan Penting

### 🔐 Autentikasi masih lokal

Login profil dan form email belum menggunakan server. Seluruh data aplikasi dapat berubah atau hilang apabila local storage browser dibersihkan.

### 🎙️ Pemeriksaan pengucapan bukan pemeriksaan tajwid

Fitur pengucapan membandingkan hasil transkripsi suara dengan teks Arab menggunakan normalisasi karakter dan Levenshtein similarity. Fitur ini:

- bukan penilai makhraj,
- bukan penilai panjang pendek,
- bukan pemeriksa hukum tajwid,
- dapat memberikan hasil berbeda antar-browser dan perangkat.

Gunakan hasilnya sebagai motivasi latihan, bukan sebagai keputusan bahwa bacaan telah benar secara tajwid. 🫶

### 📚 Konten agama memerlukan review ahli

Sebagian data memiliki penanda `needsReview` atau komentar verifikasi. Sebelum rilis publik yang lebih luas:

- periksa teks Arab,
- transliterasi,
- terjemahan,
- sumber hadis/ayat,
- serta kecocokan audio,

bersama ustaz, guru mengaji, atau reviewer yang kompeten. ✅🕌

### 💾 Progress belum tersinkron

Progres antar-browser atau antar-perangkat belum tersinkron karena masih disimpan secara lokal.

---

## 🧪 Testing

Aplikasi Next.js aktif belum memiliki test runner pada `package.json`. Test Vitest yang lama masih berada di `_old_vite_app/tests` dan belum menjadi bagian dari pipeline aplikasi aktif.

Target testing berikutnya:

- unit test Zustand slices,
- validasi seluruh route dashboard,
- pemeriksaan keberadaan file audio,
- test aturan reward Game Zone,
- test expiry timer,
- test komponen kuis,
- dan end-to-end test dengan Playwright. 🧪🤖

---

## 🛣️ Roadmap

### 🔥 P0: stabilisasi

- [ ] Perbaiki jalur audio halaman Hijaiyah
- [ ] Hentikan Web Speech Recognition secara nyata saat tombol berhenti ditekan
- [ ] Ganti dynamic Tailwind class dengan variant map statis
- [ ] Review seluruh konten agama dan audio
- [ ] Tegaskan mode login sebagai demo atau integrasikan autentikasi sungguhan

### 🧹 P1: kesehatan codebase

- [ ] Migrasikan test yang masih relevan dari aplikasi lama
- [ ] Tambahkan script `typecheck` dan `test`
- [ ] Tambahkan GitHub Actions untuk lint, test, dan build
- [ ] Pindahkan `_old_vite_app` ke branch/tag legacy
- [ ] Hapus import, resource, dan fitur mati yang tidak digunakan
- [ ] Tambahkan migrasi versi pada Zustand Persist

### ☁️ P2: production architecture

- [ ] Supabase Auth untuk akun orang tua
- [ ] Child profile di bawah akun keluarga
- [ ] Sinkronisasi progres dan riwayat kuis
- [ ] Row Level Security
- [ ] Timer Game Zone yang divalidasi server
- [ ] PWA dan offline support penuh
- [ ] Halaman profil, bahasa, tema, dan hafalan surah

---

## 🤝 Kontribusi

Kontribusi sangat terbuka, khususnya untuk:

- koreksi konten dan sumber agama,
- aksesibilitas untuk anak,
- pengujian,
- performa audio,
- sinkronisasi cloud,
- dan pengalaman orang tua/pembimbing. 🌱

Alur yang disarankan:

1. Buat branch dari `main`.
2. Lakukan perubahan kecil dan terfokus.
3. Jalankan lint dan build.
4. Buat Pull Request dengan ringkasan dan bukti pengujian.

---

## 📜 Lisensi

Lisensi project belum ditentukan. Tambahkan file `LICENSE` sebelum mendistribusikan atau menerima kontribusi dalam skala lebih luas.

---

<div align="center">

### 🌙 Belajar sedikit demi sedikit, progresnya tumbuh bintang demi bintang ⭐📖

**NgajiYuk** · Dibuat untuk pengalaman belajar Islam yang hangat, interaktif, dan menyenangkan 💛

</div>

<div align="center">

# 🕌✨ NgajiYuk!

### 🎧📖 Aplikasi belajar ngaji anak yang ceria, interaktif, dan siap dikembangkan lagi di Google AI Studio

Belajar huruf Hijaiyah, doa harian, bacaan sholat, dan hafalan surat pendek dengan audio, poin, tema warna, kuis, animasi, serta cache offline. Dibuat supaya anak-anak bisa belajar pelan-pelan, senang-senang, dan orang tua/developer bisa lanjut nambah fitur tanpa merusak fondasi yang sudah ada. 🌙🌈🚀

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 📌 GitHub About / Description siap pakai

> **NgajiYuk! 🎧📖 Aplikasi belajar ngaji anak berbasis React + Vite, lengkap dengan Hijaiyah, kuis audio, hafalan surat pendek, doa harian, bacaan sholat, poin, tema warna, dan cache audio offline.**

**Topics rekomendasi:**

`ngaji` `quran` `islamic-education` `kids-learning` `react` `vite` `typescript` `tailwindcss` `audio-cache` `google-ai-studio`

---

## 🌟 Ringkasan Project

**NgajiYuk!** adalah web app edukasi Islami untuk anak-anak. UI-nya dibuat besar, warna-warni, ramah sentuhan, dan penuh feedback visual supaya proses belajar terasa seperti taman bermain kecil berisi huruf Arab, audio, poin, dan konfeti. 🎉

Project ini cocok untuk:

- 👨‍👩‍👧‍👦 Anak-anak yang baru mulai belajar ngaji
- 🧑‍🏫 Orang tua/guru yang ingin media belajar ringan
- 🧑‍💻 Developer yang mau lanjutkan fitur via **Google AI Studio**
- 🎧 Pembelajaran berbasis audio dan hafalan
- 📱 Pengalaman mobile-first, tablet-friendly, dan desktop-ready

---

## 🧩 Fitur Utama

| Modul | Fungsi |
|---|---|
| 👧👦 **Pilih Anak** | Profil anak bawaan, tema awal, dan lanjut sesi terakhir |
| 🌈 **Mengenal Hijaiyah** | Belajar 29 huruf Hijaiyah dengan kartu warna, audio, poin, dan konfeti |
| ✨ **Kuis Hijaiyah** | Tebak huruf dari audio dengan 4 pilihan acak dan feedback benar/salah |
| 🎧 **Hafalan Ayat** | Hafalan surat pendek dengan Arab, latin, arti, play, pause, loop, dan speed |
| 📖 **Doa Harian** | Doa sehari-hari lengkap Arab, latin, arti, audio, dan tombol hafal |
| ⭐ **Bacaan Sholat** | Materi bacaan sholat lengkap dengan audio dan status selesai |
| 👤 **Profilku** | Ubah nama, pilih tema, cek/hapus cache audio, dan ganti anak |

---

## 🔤 Detail Modul Hijaiyah

- 29 huruf dari **Alif** sampai **Ya**
- Tiap huruf punya warna, teks Arab, nama latin, dan audio
- Tap huruf untuk mendengar pelafalan
- Item baru yang selesai memberi poin
- Animasi dan konfeti bikin belajar terasa hidup 🎊

---

## 🎮 Detail Modul Kuis

- Mengacak 4 pilihan huruf Hijaiyah
- Memutar audio target sebagai pertanyaan
- Jawaban benar memberi poin
- Jawaban salah memberi feedback untuk coba lagi
- Kuis otomatis lanjut setelah jawaban benar
- Audio `correct` dan `wrong` sudah disiapkan sebagai pola

---

## 🎧 Detail Modul Hafalan

Materi surat pendek saat ini:

- Al-Fatihah
- Al-Ikhlas
- Al-Falaq
- An-Nas
- Al-Kautsar
- Al-Asr
- An-Nasr
- Al-Lahab
- Quraisy
- Al-Fil

Kontrol audio:

- ▶️ Putar
- ⏸️ Jeda
- 🔁 Loop
- ⏩ Kecepatan 0.75x, 1x, 1.25x, 1.5x

---

## 🤲 Detail Modul Doa Harian

Data doa harian saat ini:

- Doa sebelum makan
- Doa sesudah makan
- Doa sebelum tidur
- Doa bangun tidur
- Doa sebelum belajar
- Doa sesudah belajar
- Doa keluar rumah
- Doa naik kendaraan
- Doa untuk orang tua
- Doa masuk kamar mandi
- Doa keluar kamar mandi

Setiap doa punya teks Arab, latin, terjemahan, audio, status hafal, dan poin. 🌙

---

## 🧎 Detail Modul Bacaan Sholat

Materi saat ini:

- Niat sholat
- Takbiratul Ihram
- Doa Iftitah
- Ruku'
- I'tidal
- Sujud
- Duduk antara dua sujud
- Tahiyat / Tasyahud
- Salam

---

## 🏆 Progress, Tema, Bahasa, dan Cache

### 🏆 Progress

- Progress disimpan per anak
- Tiap modul punya daftar item selesai
- Poin total tampil di menu utama
- Data persist lokal menggunakan Zustand Persist

### 🎨 Tema

Tema tersedia:

`default` `ocean` `forest` `sunset` `galaxy` `candy` `sunshine` `royal`

### 🌍 Bahasa

Fondasi translasi sudah tersedia untuk:

- 🇮🇩 Indonesia
- 🇯🇵 Jepang
- 🗣️ Betawi

### 📦 Offline Audio Cache

Audio disimpan lokal via IndexedDB:

- Download semua audio dari menu utama
- Putar dari cache jika sudah ada
- Hitung jumlah audio tersimpan
- Hapus semua cache dari Profil

---

## 🛠️ Tech Stack

| Bagian | Teknologi |
|---|---|
| UI | React 19 |
| Build Tool | Vite 6 |
| Bahasa | TypeScript |
| Styling | Tailwind CSS 4 |
| Animasi | motion/react |
| State | Zustand + Persist |
| Audio Offline | IndexedDB via idb |
| Icon | lucide-react |
| Feedback | react-hot-toast + canvas-confetti |
| Development | Google AI Studio friendly |

---

## 📁 Struktur Penting

```txt
NgajiYuk/
├── README.md
├── package.json
├── vite.config.ts
├── index.html
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── components/
    │   ├── Header.tsx
    │   ├── HafalanView.tsx
    │   └── KuisView.tsx
    ├── data/
    │   ├── hijaiyah.ts
    │   ├── doa.ts
    │   ├── sholat.ts
    │   └── surah.ts
    └── lib/
        ├── audioCache.ts
        ├── i18n.ts
        └── store.ts
```

---

## 🚀 Jalankan Lokal

### 1. Install dependency

```bash
npm install
```

### 2. Jalankan development server

```bash
npm run dev
```

Buka:

```txt
http://localhost:3000
```

### 3. Build produksi

```bash
npm run build
```

### 4. Preview build

```bash
npm run preview
```

### 5. Type-check

```bash
npm run lint
```

---

## 🔊 Konvensi Audio

Simpan file audio di folder `public/audio` dengan pola:

```txt
public/audio/
├── hijaiyah/
│   └── alif.mp3
├── doa/
│   └── makan_sebelum.mp3
├── sholat/
│   └── niat.mp3
├── surah/
│   └── alfatihah.mp3
└── kuis/
    ├── hijaiyah_alif.mp3
    ├── correct.mp3
    └── wrong.mp3
```

Nama file sebaiknya mengikuti `id` pada file data supaya cache dan player tidak nyasar. 🧭

---

## 🧠 Cara Menambah Materi

### ➕ Tambah huruf Hijaiyah

Edit `src/data/hijaiyah.ts`, lalu tambahkan audio di:

```txt
public/audio/hijaiyah/id_huruf.mp3
public/audio/kuis/hijaiyah_id_huruf.mp3
```

### ➕ Tambah doa

Edit `src/data/doa.ts`, lalu tambahkan audio di:

```txt
public/audio/doa/id_doa.mp3
```

### ➕ Tambah bacaan sholat

Edit `src/data/sholat.ts`, lalu tambahkan audio di:

```txt
public/audio/sholat/id_bacaan.mp3
```

### ➕ Tambah surat hafalan

Edit `src/data/surah.ts`, lalu tambahkan audio di:

```txt
public/audio/surah/id_surat.mp3
```

---

## ✅ Checklist Review Konten Islami

Sebelum rilis lebih luas, cek ulang konten yang bertanda `needsReview` atau punya catatan `TODO`:

- 🧕 Validasi teks Arab
- 🔤 Validasi transliterasi latin
- 🇮🇩 Validasi terjemahan
- 🔊 Pastikan audio sesuai teks
- 🕌 Konsultasikan ke ustadz/guru ngaji/sumber rujukan tepercaya
- 📚 Catat sumber rujukan di dokumentasi bila perlu

Ini penting supaya NgajiYuk bukan cuma lucu, tapi juga amanah. 🌙

---

## 🧪 Ide Pengembangan Lanjutan

### 🎯 Prioritas Cepat

- [ ] Tambah selector bahasa di Profil
- [ ] Tambah halaman statistik progress per anak
- [ ] Tambah reset progress per modul
- [ ] Tambah mode orang tua / parent dashboard
- [ ] Tambah badge pencapaian
- [ ] Tambah efek suara reward
- [ ] Tambah loading state saat audio gagal
- [ ] Tambah fallback visual untuk audio yang belum tersedia

### 🚀 Prioritas Menengah

- [ ] Ubah menjadi PWA supaya bisa di-install di HP/tablet
- [ ] Tambah sync progress cloud optional
- [ ] Tambah login keluarga
- [ ] Tambah routing per modul
- [ ] Tambah mode latihan harian
- [ ] Tambah mode ujian ringan
- [ ] Tambah halaman daftar semua materi
- [ ] Tambah pencarian doa/surat

### 🧠 Prioritas AI Studio

- [ ] Generator latihan otomatis dari materi yang sudah ada
- [ ] AI helper untuk membuat soal kuis baru
- [ ] AI reviewer untuk menandai item yang perlu dicek ulang
- [ ] AI voice/TTS pipeline untuk membuat audio draft
- [ ] AI parent summary untuk rangkuman progress anak
- [ ] AI content assistant untuk menambah doa/surat dengan format data konsisten

---

## 🤖 Prompt Lanjutan untuk Google AI Studio

```txt
Lanjutkan project NgajiYuk tanpa mengubah struktur besar yang sudah ada.
Fokus pada fitur edukasi anak untuk belajar ngaji.
Jangan hapus fitur existing: Hijaiyah, Kuis, Hafalan, Doa, Sholat, Profil, Theme, Progress, dan Offline Audio Cache.
Pertahankan React + TypeScript + Vite + Tailwind CSS.
Buat perubahan kecil, aman, dan modular.
Jika menambah fitur, jelaskan file mana yang diubah dan kenapa.
Pastikan data Islami yang sensitif diberi flag needsReview bila belum tervalidasi.
```

---

## 🧯 Catatan Keamanan dan Privasi

- Progress anak disimpan lokal di browser
- Audio cache disimpan lokal melalui IndexedDB
- Jangan taruh credential rahasia di source code
- Jika nanti menambah cloud sync, gunakan rules yang ketat
- Untuk data anak, minimalkan data pribadi dan simpan seperlunya saja

---

## 🧹 Script NPM

| Script | Fungsi |
|---|---|
| `npm run dev` | Menjalankan Vite dev server di port 3000 |
| `npm run build` | Build production |
| `npm run preview` | Preview hasil build |
| `npm run clean` | Menghapus folder `dist` |
| `npm run lint` | Type-check dengan `tsc --noEmit` |

---

## 🧭 Roadmap Mini

```txt
v0.1 ✅ Fondasi app belajar ngaji anak
v0.2 🔊 Lengkapi audio semua materi
v0.3 👨‍👩‍👧 Parent dashboard + statistik
v0.4 📱 PWA installable
v0.5 ☁️ Sync progress cloud optional
v0.6 🤖 AI Studio helpers untuk quiz, review, dan ringkasan progress
```

---

<div align="center">

## 🌙 NgajiYuk!

**Belajar kecil-kecil, konsisten, penuh warna, dan penuh suara.**  
Semoga jadi teman belajar yang menyenangkan untuk anak-anak. 🤲✨

</div>

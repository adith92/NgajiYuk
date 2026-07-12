<div align="center">

# 📖✨ NgajiYuk

### Belajar Hijaiyah, doa harian, bacaan sholat, dan kuis Islami dengan pengalaman ceria untuk anak dan keluarga 🌙⭐

![Project Status](https://img.shields.io/badge/status-active%20development-f59e0b?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16.2.9-000000?style=for-the-badge&logo=nextdotjs)
![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=111827)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![CI](https://img.shields.io/badge/CI-lint%20%7C%20typecheck%20%7C%20test%20%7C%20build-22c55e?style=for-the-badge)

</div>

---

## 🌟 Tentang NgajiYuk

**NgajiYuk** adalah aplikasi web edukasi Islam untuk anak dan keluarga. Aplikasi menggabungkan materi belajar dasar, audio interaktif, pencatatan progres, kuis, serta hadiah waktu bermain dalam antarmuka yang cerah dan ramah anak. 🎨🕌

Aplikasi aktif menggunakan **Next.js App Router**, **TypeScript**, **Tailwind CSS**, **Zustand Persist**, **IndexedDB**, dan integrasi opsional **Supabase Auth**.

> 🚧 **Status produk:** prototype fungsional dalam pengembangan aktif. Profil, progres, riwayat kuis, dan timer Game Zone masih disimpan lokal. Sinkronisasi cloud dan validasi server belum diterapkan.

---

## 📊 Status Implementasi

**Terakhir disinkronkan dengan implementation stack:** 12 Juli 2026 🗓️

| Area | Status | Keterangan |
|---|---|---|
| 🎨 UI/UX baru | ✅ Aktif pada branch implementasi | Landing kosmik, dashboard anak, sidebar, mobile navigation, dan kartu modul baru |
| 👨‍👩‍👧‍👦 Profil keluarga lokal | ✅ Aktif | Abeel, Emily, Emier, dan Bunda Uma memiliki progres terpisah |
| 🔐 Login email dan password | 🟡 Siap saat Supabase dikonfigurasi | Menggunakan Supabase Auth; tombol dinonaktifkan saat environment belum tersedia |
| 🔤 Belajar Hijaiyah | ✅ Aktif | Carousel belajar, grid huruf, audio, poin, dan progres |
| 🔊 Audio Hijaiyah | ✅ Jalur diselaraskan | Menggunakan aset `/audio/kuis/hijaiyah_<id>.mp3` |
| 🤲 Doa harian | ✅ Aktif | Arab, latin, arti, audio, progres, dan latihan pengucapan |
| 🎙️ Latihan pengucapan | 🟡 Eksperimental | Web Speech API dan kemiripan teks, bukan penilaian tajwid atau makhraj |
| 🕌 Bacaan sholat | ✅ Aktif | Bacaan, latin, arti, audio, urutan, dan progres |
| 🧠 Kuis Hijaiyah | ✅ Aktif | Sepuluh soal, audio, skor, reward, dan ID progres per sesi |
| 🎮 Game Zone | ✅ Aktif secara lokal | Terbuka setelah skor minimal 80%, dengan timer lokal |
| 📈 Progress & Poin | ✅ Aktif | Ringkasan poin, progres modul, rata-rata kuis, dan riwayat kuis |
| 💾 Cache audio | ✅ Aktif | IndexedDB dengan batas 64 item dan eviksi LRU |
| 🧱 Struktur kode | ✅ Ditingkatkan | Config, hooks, progress helper, dan quiz helper dipisahkan dari halaman |
| 🛡️ Production safeguards | ✅ Dasar tersedia | Security headers, metadata, error boundary, loading, 404, dan persistence versioning |
| 🧪 Automated testing | ✅ Aktif | Native Node test runner dengan 12 unit test |
| 🚦 Continuous Integration | ✅ Aktif | GitHub Actions menjalankan lint, typecheck, unit test, dan production build |
| 🌐 Bahasa Indonesia, Jepang, Betawi | 🟡 Parsial | Resource tersedia, tetapi UI aktif masih didominasi bahasa Indonesia |
| 📚 Hafalan surah | 🔴 Belum aktif | Data lama masih tersedia pada aplikasi legacy |
| 📱 PWA penuh | 🔴 Belum tersedia | Belum memiliki service worker dan installable manifest lengkap |

### Legenda 🚦

- ✅ **Aktif:** tersedia pada implementation stack saat ini.
- 🟡 **Parsial/eksperimental:** tersedia dengan batasan penting.
- 🔴 **Belum aktif:** belum menjadi bagian pengalaman aplikasi aktif.

---

## 🎯 Pengalaman Utama

### 🌌 Landing dan profil keluarga

- Tampilan ungu kosmik dengan informasi fitur utama.
- Empat profil keluarga untuk masuk cepat.
- Login email menggunakan Supabase Auth bila environment tersedia.
- Pesan yang jelas ketika Supabase belum dikonfigurasi.

### 🏠 Dashboard anak

- Sidebar desktop dan bottom navigation mobile.
- Enam kartu aktivitas: Hijaiyah, Doa, Sholat, Kuis, Game Zone, dan Progress.
- Ringkasan poin, kuis terakhir, jumlah doa, dan sesi kuis.
- Progress bar per modul.

### 🔤 Belajar Hijaiyah

- Tampilan satu huruf dengan navigasi maju dan mundur.
- Grid semua huruf untuk perpindahan cepat.
- Audio lokal dan penanda selesai.
- Poin serta progress per profil.

### 🤲 Doa harian

- Teks Arab, latin, dan arti.
- Audio lokal.
- Latihan mikrofon dengan tombol berhenti yang benar-benar menghentikan recognition.
- Feedback menyebut **kemiripan transkrip**, bukan memastikan tajwid benar.

### 🕌 Bacaan sholat

- Navigasi langkah demi langkah.
- Daftar bacaan untuk perpindahan cepat.
- Arab, latin, arti, audio, dan progres.

### 🧠 Kuis dan reward

| Skor | Reward Game Zone |
|---:|---:|
| 80–89% | 15 menit |
| 90–99% | 30 menit |
| 100% | 45 menit |

Kuis membuat soal acak dengan empat opsi unik. Setiap sesi memiliki ID progres sendiri agar poin tidak bertabrakan dengan sesi sebelumnya. 🏆

### 🎮 Game Zone

Game Zone saat ini menyediakan permainan **Kejar Bintang**. Setiap sepuluh bintang memicu selebrasi. Puzzle Hijaiyah dan Memory Match ditampilkan sebagai fitur mendatang. ⭐🪐

---

## 🗺️ Route Aktif

| Route | Fungsi |
|---|---|
| `/` | Landing, pemilihan profil, dan Supabase Auth |
| `/dashboard` | Menu utama dan ringkasan belajar |
| `/hijaiyah` | Belajar huruf Hijaiyah |
| `/doa` | Doa harian dan latihan pengucapan |
| `/sholat` | Bacaan sholat |
| `/kuis` | Kuis Hijaiyah |
| `/gamezone` | Game hadiah setelah lulus kuis |
| `/progress` | Poin, progress modul, dan riwayat kuis |

Route `/hafalan` dan `/profile` belum tersedia pada aplikasi aktif. 🧭

---

## 🧰 Teknologi

| Teknologi | Kegunaan |
|---|---|
| Next.js 16 | Framework dan App Router |
| React 19 | Antarmuka pengguna |
| TypeScript | Type safety |
| Tailwind CSS 4 | Design system dan responsive UI |
| Framer Motion | Animasi dan transisi |
| Zustand | State management dan local persistence |
| IndexedDB | Cache audio lokal dengan LRU |
| Supabase | Autentikasi email opsional |
| Web Speech API | Speech-to-text eksperimental |
| Node Test Runner | Unit testing tanpa dependency test tambahan |
| GitHub Actions | Quality gates pada Pull Request |

---

## 🏗️ Struktur Project

```text
NgajiYuk/
├── .github/
│   ├── workflows/ci.yml          # Lint, typecheck, test, dan build
│   ├── dependabot.yml            # Pemeriksaan dependency berkala
│   └── pull_request_template.md  # Checklist review AGY
├── public/
│   ├── audio/                    # Audio doa, sholat, dan kuis
│   └── images/                   # Aset gambar aplikasi
├── scripts/                      # Generator audio edge-tts
├── src/
│   ├── app/                      # Route Next.js dan error/loading boundary
│   ├── components/               # Komponen UI reusable
│   ├── config/                   # Profil, navigasi, dan konfigurasi modul
│   ├── data/                     # Hijaiyah, doa, sholat, dan surah
│   ├── hooks/                    # Auth guard dan speech practice
│   ├── lib/
│   │   ├── learning/             # Quiz dan progress helper murni
│   │   ├── store/                # Zustand slices
│   │   ├── supabase/             # Supabase browser client
│   │   ├── audioCache.ts         # IndexedDB LRU audio cache
│   │   ├── env.ts                # Validasi environment publik
│   │   └── utils.ts              # Normalisasi dan similarity
│   └── types/                    # Model TypeScript
├── tests/                        # Native Node unit tests
├── _old_vite_app/                # Arsip legacy, tidak dilint atau dibuild
├── package.json
└── README.md
```

> 📌 Source of truth aplikasi adalah folder **`src/`** pada root. Folder **`_old_vite_app/`** hanya arsip sebelum migrasi Next.js.

---

## 🚀 Menjalankan Secara Lokal

### Prasyarat

- Node.js **22**
- npm
- Google Chrome terbaru untuk pengalaman Web Speech API terbaik 🎙️

### Instalasi

```bash
git clone https://github.com/adith92/NgajiYuk.git
cd NgajiYuk
npm ci
```

### Development

```bash
npm run dev
```

Buka `http://localhost:3000`.

### Quality gates

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Atau jalankan semuanya sekaligus:

```bash
npm run check
```

---

## 🔐 Supabase Auth

Salin environment example:

```bash
cp .env.example .env.local
```

Isi nilai berikut:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Saat kedua nilai tersedia, form email menjalankan:

- `signInWithPassword` untuk masuk,
- `signUp` untuk mendaftar,
- pesan konfirmasi email ketika session belum dibuat.

Profil keluarga tetap berjalan lokal tanpa Supabase. Progres cloud dan child profile di bawah akun orang tua belum tersedia.

---

## 🔊 Audio dan Cache

- Audio dimuat dari `public/audio`.
- Aset Hijaiyah aktif berada di `public/audio/kuis/hijaiyah_<id>.mp3`.
- Audio yang berhasil dimuat disimpan di IndexedDB.
- Cache menyimpan metadata waktu akses dan menghapus item paling lama digunakan saat melewati 64 item.
- Hanya satu audio diputar pada satu waktu.
- Object URL dibersihkan saat audio selesai, gagal, atau diganti.

Generator audio:

```bash
pip install edge-tts
python scripts/generate-doa.py
python scripts/generate-kuis.py
python scripts/generate-sholat.py
```

---

## 🧪 Testing & CI

Unit test saat ini mencakup:

- normalisasi teks Arab,
- normalisasi teks Latin,
- Levenshtein similarity,
- generator opsi kuis,
- validasi target kuis,
- ID progres per sesi,
- pembatasan persentase,
- agregasi poin dan progress,
- rata-rata serta riwayat kuis.

Jalankan:

```bash
npm test
```

GitHub Actions menjalankan quality gates pada setiap Pull Request dan push ke `main`:

1. `npm ci`
2. `npm run lint`
3. `npm run typecheck`
4. `npm test`
5. `npm run build`

Dependency npm dan GitHub Actions diperiksa bulanan melalui Dependabot. 🤖🚦

---

## ⚠️ Batasan Penting

### 🎙️ Latihan pengucapan bukan pemeriksaan tajwid

Fitur mikrofon membandingkan transkripsi browser dengan teks Arab. Fitur ini bukan penilai makhraj, panjang pendek, maupun hukum tajwid. Gunakan sebagai motivasi latihan bersama pembimbing. 🫶

### 📚 Konten agama perlu review ahli

Sebagian data masih memiliki `needsReview` atau komentar verifikasi. Sebelum rilis publik luas, teks Arab, transliterasi, terjemahan, sumber, dan audio perlu diperiksa bersama ustaz atau guru mengaji yang kompeten. ✅🕌

### 💾 Progres dan timer masih lokal

Local storage dapat diedit atau dibersihkan pengguna. Timer Game Zone belum divalidasi server dan tidak boleh dianggap sebagai kontrol parental yang aman untuk production.

### 🔐 Supabase Auth belum berarti cloud progress

Autentikasi email sudah disiapkan, tetapi profil anak, progres, kuis, dan Game Zone belum tersimpan di database Supabase.

---

## 🛣️ Roadmap

### ✅ Selesai pada implementation stack ini

- [x] Desain UI/UX baru sesuai konsep kids learning
- [x] Jalur audio Hijaiyah diselaraskan
- [x] Web Speech Recognition dapat dihentikan secara nyata
- [x] Dynamic Tailwind class diganti variant map statis
- [x] Config, hooks, quiz helper, dan progress helper dipisahkan
- [x] Supabase Auth dihubungkan secara kondisional
- [x] Cache audio LRU dan cleanup playback
- [x] Error, loading, not-found, dan global error fallback
- [x] Security headers dasar
- [x] Zustand persistence versioning dan partial persistence
- [x] Unit test dan GitHub Actions quality gates

### 🔥 Berikutnya

- [ ] Review seluruh konten agama dan audio oleh ahli
- [ ] Migrasi profil keluarga serta progres ke Supabase
- [ ] Row Level Security untuk keluarga dan child profile
- [ ] Timer Game Zone yang divalidasi server
- [ ] Test komponen dengan React Testing Library
- [ ] End-to-end test dengan Playwright
- [ ] PWA dan offline support penuh
- [ ] Halaman profil, bahasa, tema, dan hafalan surah
- [ ] Pindahkan `_old_vite_app` ke branch atau tag legacy
- [ ] Tentukan dan tambahkan lisensi project

---

## 🤖 Review dengan AGY

Sebelum merge:

1. Review setiap Draft PR sesuai urutan branch stack.
2. Pastikan seluruh quality gate hijau.
3. Periksa mobile, tablet, dan desktop.
4. Periksa keyboard navigation, focus state, kontras, dan reduced motion.
5. Periksa Supabase Auth tanpa memasukkan secret ke repository.
6. Jangan merge apabila masih ada komentar unresolved atau status gagal.

---

<div align="center">

### 🌙 Belajar sedikit demi sedikit, progresnya tumbuh bintang demi bintang ⭐📖

**NgajiYuk** · Dibuat untuk pengalaman belajar Islam yang hangat, interaktif, dan menyenangkan 💛

</div>

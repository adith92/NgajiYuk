<div align="center">

# 🌙 NgajiYuk

### Belajar Hijaiyah, doa harian, bacaan sholat, dan kuis Islami dalam pengalaman ceria untuk anak dan keluarga ✨

![Status](https://img.shields.io/badge/status-release%20candidate-8b5cf6?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16.2.9-000000?style=for-the-badge&logo=nextdotjs)
![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=111827)
![Node](https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![CI](https://img.shields.io/badge/CI-lint%20%7C%20types%20%7C%20test%20%7C%20build-22c55e?style=for-the-badge)

</div>

## Tentang aplikasi

**NgajiYuk** adalah aplikasi web edukasi Islam ramah anak yang menyediakan materi Hijaiyah, doa harian, bacaan sholat, latihan pengucapan eksperimental, kuis, progres belajar, serta reward Game Zone.

Source aktif menggunakan **Next.js App Router**, TypeScript, Tailwind CSS, Zustand Persist, IndexedDB, Supabase, dan Vercel. Folder `_old_vite_app` hanya arsip dan bukan bagian build aktif.

## Status implementasi

| Area | Status | Catatan |
|---|---|---|
| UI/UX anak dan keluarga | ✅ Aktif | Landing kosmik, dashboard, sidebar desktop, dan bottom navigation mobile |
| Profil keluarga lokal | ✅ Aktif | Progres lokal dipisahkan per profil |
| Supabase Auth | 🟡 Terintegrasi | Aktif saat environment tersedia; flow penuh tetap perlu test account |
| Database Supabase | ✅ Schema tersedia | Account, profil keluarga, progres, kuis, dan reward |
| Row Level Security | ✅ Aktif | Data dibatasi berdasarkan `auth.uid()` dan ownership |
| Sinkronisasi progres cloud | 🟡 Belum dihubungkan | Schema siap, tetapi Zustand masih menjadi source utama aplikasi |
| Audio dan IndexedDB | ✅ Aktif | Cache LRU maksimal 64 item dan satu audio aktif |
| Web Speech API | 🟡 Eksperimental | Mengukur kemiripan transkrip, bukan tajwid atau makhraj |
| Automated test dan CI | ✅ Aktif | Lint, typecheck, unit test, dan production build |
| PWA penuh | 🔴 Belum tersedia | Belum ada installable service worker lengkap |

## Route aktif

| Route | Fungsi |
|---|---|
| `/` | Landing, profil keluarga, dan Supabase Auth |
| `/dashboard` | Menu utama dan ringkasan belajar |
| `/hijaiyah` | Materi huruf Hijaiyah |
| `/doa` | Doa harian, audio, dan latihan pengucapan |
| `/sholat` | Bacaan sholat |
| `/kuis` | Kuis Hijaiyah dan reward |
| `/gamezone` | Game hadiah setelah lulus kuis |
| `/progress` | Poin, progres modul, dan riwayat kuis |

## Stack

- Next.js 16 dan React 19
- TypeScript dan Tailwind CSS 4
- Zustand Persist
- IndexedDB melalui `idb`
- Supabase Auth dan PostgreSQL
- Framer Motion dan Canvas Confetti
- Native Node Test Runner
- GitHub Actions
- Vercel

## Menjalankan secara lokal

### Prasyarat

- Node.js 22
- npm
- Browser modern

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Buka `http://localhost:3000`.

## Environment Supabase

```env
NEXT_PUBLIC_SUPABASE_URL=https://uicpfqvmcubycuqafdqb.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

`NEXT_PUBLIC_SUPABASE_ANON_KEY` masih diterima sebagai fallback legacy. Jangan pernah menaruh service-role key pada browser, repository, atau variable dengan prefix `NEXT_PUBLIC_`.

## Database dan RLS

Migration versioned berada di `supabase/migrations/`.

Schema aplikasi:

- `accounts`
- `family_profiles`
- `learning_progress`
- `quiz_sessions`
- `reward_entitlements`

Seluruh tabel data pengguna memakai RLS. Policy membatasi akses kepada pemilik yang cocok dengan `auth.uid()`. Composite foreign key mencegah profile ID milik pengguna lain dipasangkan dengan record milik pengguna saat ini.

Migration juga mencabut akses RPC publik terhadap fungsi event-trigger `public.rls_auto_enable()`.

> Schema cloud sudah tersedia, tetapi sinkronisasi Zustand ke database belum dianggap selesai sebelum diuji melalui akun autentikasi nyata.

## Quality gates

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Atau:

```bash
npm run check
```

CI menjalankan seluruh gate tersebut pada Pull Request dan push ke `main`.

## Deployment Vercel

Target menggunakan project Vercel yang sudah ada:

- Project ID: `prj_mbfVzgwfnf3f0MfXujckrQYtDaF8`
- Target project name: `ngajiyuk`
- Framework preset: Next.js melalui `vercel.json`
- Node.js: 22 melalui `package.json` dan `.nvmrc`
- Production branch: `main`
- Target alias: `ngajiyuk.vercel.app`

Production deployment dilakukan setelah PR release candidate lulus review, seluruh gate hijau, dan perubahan sudah berada di `main`.

## Audio dan TTS

Audio aplikasi disimpan sebagai aset statis di `public/audio` dan dapat dibuat ulang menggunakan `edge-tts`:

```bash
pip install edge-tts
python scripts/generate-doa.py
python scripts/generate-kuis.py
python scripts/generate-sholat.py
```

Tidak diperlukan API key runtime. OpenTTS tidak digunakan. Audio agama yang dibuat secara otomatis tetap membutuhkan pemeriksaan manusia sebelum rilis publik.

## Batasan penting

### Konten agama

Teks Arab, transliterasi, terjemahan, sumber, dan audio harus ditinjau ustaz atau guru mengaji yang kompeten. Perubahan konten tidak boleh dilakukan diam-diam.

### Latihan pengucapan

Web Speech API hanya membandingkan hasil transkripsi. Fitur ini bukan pemeriksa hukum tajwid, makhraj, maupun panjang-pendek bacaan.

### Cloud persistence

Database dan RLS sudah tersedia, tetapi progres cloud, child-profile sync, dan validasi server untuk timer Game Zone masih harus dihubungkan serta diuji sebelum diklaim production-complete.

## Struktur ringkas

```text
NgajiYuk/
├── .github/                 # CI, Dependabot, dan template PR
├── public/                  # Audio dan gambar
├── scripts/                 # Generator audio statis
├── src/app/                 # Next.js App Router
├── src/components/          # Komponen UI
├── src/config/              # Konfigurasi navigasi dan modul
├── src/hooks/               # Auth guard dan speech lifecycle
├── src/lib/                 # Store, Supabase, audio cache, helpers
├── supabase/migrations/     # Schema dan RLS versioned
├── tests/                   # Unit tests
├── _old_vite_app/           # Arsip legacy
├── vercel.json
└── README.md
```

## Release discipline

- Jangan push fitur langsung ke `main`.
- Gunakan satu branch aktif dan satu Pull Request release candidate.
- Merge hanya setelah CI, browser smoke test, Supabase RLS test, dan Vercel Preview lulus.
- Hapus branch setelah benar-benar merged.

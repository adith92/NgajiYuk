# 🤖 AGY Review Guide

Dokumen ini membantu AntiGravity atau coding reviewer lain memeriksa implementation stack NgajiYuk tanpa mencampur scope setiap Pull Request.

## 🧱 Urutan branch dan PR

1. `feature/ui-ux-kids-dashboard` → `main`
2. `refactor/code-structure` → `feature/ui-ux-kids-dashboard`
3. `chore/production-readiness` → `refactor/code-structure`
4. `test/ci-quality-gates` → `chore/production-readiness`

Jangan mengubah base branch atau merge melompati urutan sebelum seluruh stack selesai direview.

## 🎨 Review UI/UX

- Bandingkan landing, dashboard, Hijaiyah, Doa, Sholat, Kuis, Game Zone, dan Progress dengan preview yang disetujui.
- Periksa layar 320 px, 375 px, tablet, laptop, dan desktop lebar.
- Periksa keyboard navigation, focus ring, label tombol, contrast, serta `prefers-reduced-motion`.
- Pastikan teks Arab tetap terbaca dan tidak terpotong.

## 🧩 Review struktur kode

- Periksa batas antara config, hooks, pure helpers, store, data, dan page component.
- Periksa dependency cycle dan import client/server.
- Periksa lifecycle `useSpeechPractice`, termasuk stop dan unmount cleanup.
- Periksa generator kuis serta agregasi progress dengan edge case kosong.

## 🛡️ Review production readiness

- Uji aplikasi dengan dan tanpa environment Supabase.
- Uji sign-in, sign-up, confirmation email, invalid password, dan network error.
- Periksa security headers serta browser compatibility.
- Periksa IndexedDB migration, LRU eviction, playback replacement, dan object URL cleanup.
- Ingat bahwa progress serta Game Zone masih lokal dan belum menjadi kontrol parental server-side.

## 🧪 Review testing & CI

Jalankan:

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

CI harus hijau sebelum status Draft diubah menjadi Ready for review.

## ⛔ Larangan merge

Jangan merge apabila:

- salah satu quality gate gagal,
- ada komentar unresolved,
- Supabase secret masuk ke diff,
- terdapat perubahan di luar scope tanpa penjelasan,
- konten agama yang ditandai `needsReview` dianggap sudah terverifikasi tanpa pemeriksaan ahli.

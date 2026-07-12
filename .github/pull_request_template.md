## 📖 Ringkasan

Jelaskan perubahan utama dan alasan teknisnya.

## 🧩 Area perubahan

- [ ] UI/UX
- [ ] Struktur kode
- [ ] Production readiness
- [ ] Testing & CI
- [ ] Dokumentasi

## ✅ Quality gates

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm test`
- [ ] `npm run build`
- [ ] Tampilan mobile diperiksa
- [ ] Tampilan desktop diperiksa
- [ ] Tidak ada data pengguna atau secret yang di-commit

## 🤖 Instruksi review AGY

1. Periksa error TypeScript, lint, hydration, dan runtime.
2. Periksa accessibility: keyboard, focus state, label, contrast, dan reduced motion.
3. Periksa keamanan autentikasi, environment variable, dan penyimpanan lokal.
4. Jalankan seluruh quality gate sebelum memberi persetujuan.
5. Jangan merge otomatis apabila masih ada status gagal atau komentar unresolved.

## 📸 Bukti tampilan

Tambahkan screenshot atau preview deployment bila perubahan memengaruhi UI.

## ⚠️ Risiko dan rollback

Jelaskan risiko perubahan serta branch/commit yang dapat dipakai untuk rollback.

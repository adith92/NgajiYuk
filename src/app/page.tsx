"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Gamepad2,
  HeartHandshake,
  LockKeyhole,
  LogIn,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FAMILY_PROFILES } from "@/config/app";
import { useAppStore } from "@/lib/store";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { StatusBadge } from "@/components/ui/StatusBadge";

const featureRows = [
  { icon: "ا", title: "Hijaiyah", description: "Belajar huruf Arab dengan suara" },
  { icon: "🤲", title: "Doa Harian", description: "Doa pilihan untuk aktivitas sehari-hari" },
  { icon: "🕌", title: "Bacaan Sholat", description: "Niat, bacaan, latin, dan artinya" },
  { icon: "🏆", title: "Kuis & Game Zone", description: "Belajar, kumpulkan poin, lalu bermain" },
];

export default function LoginPage() {
  const router = useRouter();
  const { login, initializeApp, currentUserUid } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<"profiles" | "email-login">("profiles");
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMessage, setAuthMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabaseReady = isSupabaseConfigured();

  useEffect(() => {
    setMounted(true);
    initializeApp();
  }, [initializeApp]);

  useEffect(() => {
    if (mounted && currentUserUid) router.replace("/dashboard");
  }, [mounted, currentUserUid, router]);

  const handleProfileSelect = (uid: string, name: string) => {
    login(uid, name);
    router.push("/dashboard");
  };

  const handleEmailSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthMessage(null);

    const supabase = createClient();
    if (!supabase) {
      setAuthMessage({
        type: "error",
        text: "Autentikasi cloud belum dikonfigurasi. Gunakan profil keluarga atau lengkapi environment Supabase.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = isLogin
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

      if (response.error) {
        setAuthMessage({ type: "error", text: response.error.message });
        return;
      }

      if (!response.data.session && !isLogin) {
        setAuthMessage({
          type: "success",
          text: "Pendaftaran berhasil. Periksa email untuk konfirmasi akun sebelum masuk.",
        });
        return;
      }

      const authenticatedUser = response.data.user;
      if (!authenticatedUser) {
        setAuthMessage({ type: "error", text: "Sesi pengguna tidak ditemukan. Silakan coba kembali." });
        return;
      }

      const displayName = authenticatedUser.user_metadata?.full_name || authenticatedUser.email?.split("@")[0] || "Sobat";
      login(authenticatedUser.id, String(displayName));
      router.push("/dashboard");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return <div className="min-h-screen bg-[#21105f]" aria-label="Memuat NgajiYuk" />;

  return (
    <main className="min-h-screen bg-[#170c48] p-3 text-white sm:p-5 lg:p-7">
      <div className="purple-grid relative mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-[1480px] overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#32158a] via-[#21105f] to-[#0f1d59] shadow-[0_35px_100px_rgba(10,3,48,0.5)] lg:grid-cols-[0.88fr_1.12fr]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="absolute left-[8%] top-[11%] text-2xl animate-twinkle">✦</span>
          <span className="absolute left-[42%] top-[5%] text-amber-300 animate-twinkle">✦</span>
          <span className="absolute bottom-[17%] left-[35%] text-violet-200 animate-twinkle">✧</span>
          <span className="absolute right-[7%] top-[16%] text-sky-200 animate-twinkle">✦</span>
          <div className="absolute -left-16 top-1/4 h-60 w-60 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-sky-400/15 blur-3xl" />
        </div>

        <section className="relative z-10 flex flex-col justify-between p-6 sm:p-9 lg:p-12 xl:p-14">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-orange-500 text-2xl shadow-lg shadow-orange-500/25">🌙</div>
              <div><p className="text-2xl font-black tracking-tight">NgajiYuk</p><p className="text-xs font-semibold text-violet-200">Belajar Islam seru & menyenangkan</p></div>
            </div>

            <div className="mt-12 max-w-xl lg:mt-20">
              <StatusBadge tone="amber" icon={<Sparkles size={13} />}>Ruang belajar keluarga</StatusBadge>
              <h1 className="mt-5 text-balance text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl xl:text-6xl">Belajar Islam Jadi <span className="text-amber-300">Lebih Seru!</span> ✨</h1>
              <p className="mt-5 max-w-lg text-base font-medium leading-7 text-violet-100 sm:text-lg">Belajar Hijaiyah, doa harian, bacaan sholat, kuis, dan reward dalam pengalaman yang hangat untuk anak dan keluarga.</p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { icon: ShieldCheck, title: "Aman & Ramah", text: "Untuk Anak" },
                { icon: HeartHandshake, title: "Belajar Bersama", text: "Dengan Keluarga" },
                { icon: Trophy, title: "Reward Positif", text: "Motivasi Belajar" },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-2xl border border-white/15 bg-white/8 p-4 backdrop-blur-sm"><Icon className="text-amber-300" size={22} /><p className="mt-3 text-sm font-black">{title}</p><p className="text-xs font-medium text-violet-200">{text}</p></div>
              ))}
            </div>
          </div>

          <div className="mt-10 hidden items-end gap-4 lg:flex">
            <div className="relative h-36 w-44 overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/10 shadow-2xl"><Image src="/images/quran-kids.png" alt="Anak belajar Al-Qur'an" fill className="object-cover" priority /></div>
            <p className="max-w-xs pb-2 text-xs font-semibold leading-5 text-violet-200">Konten pembelajaran agama ditampilkan dengan penanda status review agar orang tua mengetahui materi yang masih perlu diverifikasi. 🛡️</p>
          </div>
        </section>

        <section className="relative z-10 m-3 rounded-[1.7rem] bg-[#f8f7ff] p-5 text-[#20164a] shadow-2xl sm:m-5 sm:p-8 lg:m-6 lg:p-10">
          <AnimatePresence mode="wait">
            {viewMode === "profiles" ? (
              <motion.div key="profiles" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="flex min-h-full flex-col">
                <div className="flex items-center justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-violet-500">Multi profil keluarga</p><h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Siapa yang mau belajar?</h2><p className="mt-2 text-sm font-medium text-slate-500">Pilih profil untuk melanjutkan progres masing-masing.</p></div><div className="hidden h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-2xl sm:flex">👋</div></div>

                <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                  {FAMILY_PROFILES.map((profile, index) => (
                    <motion.button key={profile.uid} type="button" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }} onClick={() => handleProfileSelect(profile.uid, profile.name)} className={`kid-button min-h-44 border-2 p-4 text-center shadow-sm transition-all hover:shadow-lg ${profile.cardClass}`}>
                      <span className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br text-3xl shadow-md ${profile.avatarClass}`}>{profile.avatar}</span><span className="mt-3 block text-base font-black">{profile.name}</span><span className="mt-1 block text-[11px] font-bold text-slate-500">{profile.label}</span>
                    </motion.button>
                  ))}
                </div>

                <div className="mt-8 grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
                  <div className="app-card p-5"><div className="mb-4 flex items-center gap-2"><BookOpen className="text-violet-600" size={20} /><h3 className="font-black">Fitur Utama</h3></div><div className="space-y-3">{featureRows.map((feature) => <div key={feature.title} className="flex items-center gap-3 rounded-xl bg-violet-50/70 p-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-lg font-black text-violet-700 shadow-sm">{feature.icon}</span><div><p className="text-sm font-black">{feature.title}</p><p className="text-[11px] font-medium text-slate-500">{feature.description}</p></div></div>)}</div></div>

                  <div className="flex flex-col gap-4">
                    <div className="app-card flex items-start gap-3 bg-emerald-50 p-5"><ShieldCheck className="mt-0.5 shrink-0 text-emerald-600" size={24} /><div><p className="font-black text-emerald-800">Konten Terverifikasi</p><p className="mt-1 text-xs font-medium leading-5 text-emerald-700">Sebagian konten masih ditandai dalam proses review sumber dan ustadz.</p></div></div>
                    <button type="button" onClick={() => { setViewMode("email-login"); setAuthMessage(null); }} className="kid-button flex items-center justify-between rounded-2xl bg-gradient-to-r from-violet-600 to-purple-700 px-5 py-4 text-left text-white shadow-lg shadow-violet-300/35"><span><span className="block text-sm font-black">Masuk dengan email</span><span className="block text-[11px] font-semibold text-violet-100">{supabaseReady ? "Autentikasi Supabase aktif" : "Perlu konfigurasi Supabase"}</span></span><ChevronRight size={20} /></button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="email" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="mx-auto flex min-h-full w-full max-w-lg flex-col justify-center py-8">
                <button type="button" onClick={() => { setViewMode("profiles"); setAuthMessage(null); }} className="mb-7 flex w-fit items-center gap-2 text-sm font-black text-violet-600 hover:text-violet-800"><ArrowLeft size={18} /> Kembali ke profil</button>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-violet-700"><LockKeyhole size={28} /></div>
                <h2 className="mt-5 text-3xl font-black">{isLogin ? "Masuk akun" : "Daftar akun"}</h2>
                <p className="mt-2 text-sm font-medium leading-6 text-slate-500">{supabaseReady ? "Akun diamankan melalui Supabase Auth." : "Supabase belum dikonfigurasi. Profil keluarga tetap dapat digunakan secara lokal."}</p>

                <form onSubmit={handleEmailSubmit} className="mt-7 space-y-4">
                  <label className="block text-sm font-black text-slate-700">Email<input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nama@email.com" className="mt-2 w-full rounded-2xl border border-violet-200 bg-white px-4 py-3.5 text-sm font-medium text-slate-800 shadow-sm focus:border-violet-500" /></label>
                  <label className="block text-sm font-black text-slate-700">Password<input type="password" required minLength={8} autoComplete={isLogin ? "current-password" : "new-password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Minimal 8 karakter" className="mt-2 w-full rounded-2xl border border-violet-200 bg-white px-4 py-3.5 text-sm font-medium text-slate-800 shadow-sm focus:border-violet-500" /></label>

                  {authMessage ? <div role="status" className={`rounded-2xl border p-4 text-sm font-semibold ${authMessage.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-800"}`}>{authMessage.text}</div> : null}

                  <button type="submit" disabled={isSubmitting || !supabaseReady} className="kid-button flex w-full items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-purple-700 px-5 py-3.5 text-white shadow-lg shadow-violet-300/35 disabled:cursor-not-allowed disabled:opacity-55">{isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}{isSubmitting ? "Memproses..." : isLogin ? "Masuk" : "Daftar"}</button>
                </form>

                <button type="button" onClick={() => { setIsLogin((value) => !value); setAuthMessage(null); }} className="mt-5 text-sm font-bold text-violet-600 hover:text-violet-800">{isLogin ? "Belum punya akun? Daftar" : "Sudah punya akun? Masuk"}</button>
                {!supabaseReady ? <div className="mt-8 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800"><Gamepad2 className="shrink-0" size={22} /><p className="text-xs font-semibold leading-5">Tambahkan environment Supabase untuk mengaktifkan login email. Profil lokal tetap tersedia.</p></div> : null}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </main>
  );
}

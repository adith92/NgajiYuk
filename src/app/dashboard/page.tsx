"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Bell, LogOut, Medal, Settings, Sparkles, Star, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MenuCard } from "@/components/MenuCard";
import { LEARNING_MODULES, PRIMARY_NAVIGATION } from "@/config/app";
import { doaData } from "@/data/doa";
import { hijaiyahData } from "@/data/hijaiyah";
import { sholatData } from "@/data/sholat";
import { useRequireUser } from "@/hooks/useRequireUser";
import { calculateLearningSummary, type UserProgressMap } from "@/lib/learning/progress";
import { useAppStore } from "@/lib/store";

const MODULE_TOTALS = {
  hijaiyah: hijaiyahData.length,
  doa: doaData.length,
  sholat: sholatData.length,
} as const;

export default function DashboardPage() {
  const router = useRouter();
  const { currentUserUid, isReady } = useRequireUser();
  const users = useAppStore((state) => state.users);
  const progress = useAppStore((state) => state.progress);
  const quizHistory = useAppStore((state) => state.quizHistory);
  const logout = useAppStore((state) => state.logout);

  const currentUser = currentUserUid ? users[currentUserUid] : null;
  const metrics = useMemo(() => {
    const userProgress: UserProgressMap = currentUserUid ? progress[currentUserUid] ?? {} : {};
    const userQuizHistory = currentUserUid ? quizHistory[currentUserUid] ?? [] : [];
    return calculateLearningSummary(userProgress, userQuizHistory, MODULE_TOTALS);
  }, [currentUserUid, progress, quizHistory]);

  const moduleProgress = {
    hijaiyah: metrics.hijaiyahPercent,
    doa: metrics.doaPercent,
    sholat: metrics.sholatPercent,
    kuis: metrics.lastQuizPercent,
    gamezone: undefined,
    progress: undefined,
  } satisfies Record<(typeof LEARNING_MODULES)[number]["id"], number | undefined>;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!isReady || !currentUserUid) {
    return <div className="min-h-screen bg-[#f7f6ff]" aria-label="Memuat dashboard" />;
  }

  return (
    <main className="min-h-screen bg-[#f7f6ff] text-[#21164a] lg:grid lg:grid-cols-[92px_1fr]">
      <aside className="hidden min-h-screen flex-col items-center bg-gradient-to-b from-[#7442e8] via-[#5527ca] to-[#32158a] py-5 text-white shadow-[12px_0_35px_rgba(47,25,117,0.14)] lg:flex">
        <Link href="/dashboard" className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/16 text-2xl shadow-inner" aria-label="NgajiYuk">🌙</Link>
        <nav className="mt-8 flex flex-1 flex-col gap-2" aria-label="Navigasi utama">
          {PRIMARY_NAVIGATION.map(({ label, icon: Icon, href }) => {
            const active = href === "/dashboard";
            return (
              <Link key={label} href={href} aria-label={label} className={`group flex h-12 w-12 items-center justify-center rounded-2xl transition-all ${active ? "bg-white text-violet-700 shadow-lg" : "text-violet-100 hover:bg-white/12 hover:text-white"}`}>
                <Icon size={21} aria-hidden="true" />
              </Link>
            );
          })}
        </nav>
        <button type="button" onClick={handleLogout} aria-label="Keluar dari profil" className="flex h-12 w-12 items-center justify-center rounded-2xl text-violet-100 transition-colors hover:bg-white/12 hover:text-white">
          <LogOut size={20} />
        </button>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-40 border-b border-violet-100/80 bg-white/88 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-pink-300 to-violet-500 text-2xl shadow-md">{currentUser?.name === "Bunda Uma" ? "🧕" : "🧒"}</div>
              <div>
                <p className="text-sm font-black sm:text-base">Assalamu&apos;alaikum, {currentUser?.name ?? "Sobat"} 👋</p>
                <p className="text-[11px] font-semibold text-slate-500">Semangat belajar hari ini!</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex h-10 items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 text-sm font-black text-amber-700 shadow-sm">
                <Star size={17} className="fill-amber-400 text-amber-400" />
                {metrics.totalPoints.toLocaleString("id-ID")}
              </div>
              <button type="button" aria-label="Notifikasi" className="flex h-10 w-10 items-center justify-center rounded-full border border-violet-100 bg-white text-violet-600 shadow-sm hover:bg-violet-50"><Bell size={18} /></button>
              <button type="button" aria-label="Pengaturan" className="hidden h-10 w-10 items-center justify-center rounded-full border border-violet-100 bg-white text-violet-600 shadow-sm hover:bg-violet-50 sm:flex"><Settings size={18} /></button>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-10">
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-[1.8rem] bg-gradient-to-r from-[#32158a] via-[#5527ca] to-[#7442e8] p-6 text-white shadow-[0_22px_55px_rgba(72,40,168,0.24)] sm:p-8">
            <div className="purple-grid absolute inset-0 opacity-60" />
            <div className="absolute -right-10 -top-20 h-56 w-56 rounded-full bg-pink-400/20 blur-3xl" />
            <div className="relative z-10 grid items-center gap-6 md:grid-cols-[1fr_auto]">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black text-violet-100"><Sparkles size={14} /> Petualangan belajar hari ini</div>
                <h1 className="mt-4 max-w-2xl text-balance text-3xl font-black tracking-tight sm:text-4xl">Belajar sedikit demi sedikit, hasilnya jadi bintang besar ⭐</h1>
                <p className="mt-3 max-w-xl text-sm font-medium leading-6 text-violet-100">Pilih satu modul, selesaikan langkahnya, dan kumpulkan poin untuk membuka Game Zone.</p>
              </div>
              <div className="hidden h-28 w-28 items-center justify-center rounded-[2rem] border border-white/15 bg-white/10 text-6xl shadow-inner md:flex">📖</div>
            </div>
          </motion.section>

          <section className="mt-7">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div><p className="text-xs font-black uppercase tracking-[0.18em] text-violet-500">Pilih aktivitas</p><h2 className="mt-1 text-2xl font-black tracking-tight">Mau belajar apa?</h2></div>
              <Link href="/progress" className="text-sm font-black text-violet-600 hover:text-violet-800">Lihat progress →</Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {LEARNING_MODULES.map((module, index) => {
                const Icon = module.icon;
                return (
                  <MenuCard
                    key={module.id}
                    title={module.title}
                    description={module.description}
                    eyebrow={module.eyebrow}
                    href={module.href}
                    icon={<Icon className="h-7 w-7" />}
                    tone={module.tone}
                    progress={moduleProgress[module.id]}
                    delay={0.05 * index}
                  />
                );
              })}
            </div>
          </section>

          <section className="mt-7 grid gap-4 lg:grid-cols-[1fr_1.25fr]">
            <div className="app-card p-5 sm:p-6">
              <div className="flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-violet-500">Ringkasan</p><h2 className="mt-1 text-xl font-black">Pencapaianmu</h2></div><Medal className="text-amber-500" size={28} /></div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  { value: metrics.lastQuizPercent ? `${metrics.lastQuizPercent}%` : "-", label: "Kuis terakhir", icon: "🔥" },
                  { value: metrics.learnedDoa, label: "Doa dipelajari", icon: "🤲" },
                  { value: metrics.quizSessions, label: "Sesi kuis", icon: "🎮" },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl bg-violet-50 p-3 text-center"><span className="text-xl">{item.icon}</span><p className="mt-2 text-xl font-black text-violet-800">{item.value}</p><p className="mt-1 text-[10px] font-bold leading-4 text-slate-500">{item.label}</p></div>
                ))}
              </div>
            </div>

            <div className="app-card p-5 sm:p-6">
              <div className="flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-violet-500">Progress belajar</p><h2 className="mt-1 text-xl font-black">Teruskan perjalanan</h2></div><UserRound className="text-violet-500" size={26} /></div>
              <div className="mt-5 space-y-4">
                {[
                  { label: "Hijaiyah", value: metrics.hijaiyahPercent, color: "from-emerald-400 to-lime-400", icon: "ا" },
                  { label: "Doa Harian", value: metrics.doaPercent, color: "from-pink-400 to-rose-400", icon: "🤲" },
                  { label: "Bacaan Sholat", value: metrics.sholatPercent, color: "from-blue-400 to-cyan-400", icon: "🕌" },
                ].map((item) => (
                  <div key={item.label} className="grid grid-cols-[32px_1fr_42px] items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-50 text-sm font-black">{item.icon}</span>
                    <div><div className="mb-1.5 flex items-center justify-between text-xs font-black"><span>{item.label}</span></div><div className="h-2.5 overflow-hidden rounded-full bg-violet-50"><div className={`h-full rounded-full bg-gradient-to-r ${item.color}`} style={{ width: `${item.value}%` }} /></div></div>
                    <span className="text-right text-xs font-black text-slate-500">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <nav className="fixed inset-x-3 bottom-3 z-50 flex items-center justify-around rounded-2xl border border-white/20 bg-[#4d26bd]/95 px-2 py-2 text-white shadow-2xl backdrop-blur-xl lg:hidden" aria-label="Navigasi mobile">
          {PRIMARY_NAVIGATION.slice(0, 5).map(({ label, icon: Icon, href }) => {
            const active = href === "/dashboard";
            return <Link key={label} href={href} aria-label={label} className={`flex h-11 w-11 items-center justify-center rounded-xl ${active ? "bg-white text-violet-700" : "text-violet-100"}`}><Icon size={20} /></Link>;
          })}
          <button type="button" onClick={handleLogout} aria-label="Keluar" className="flex h-11 w-11 items-center justify-center rounded-xl text-violet-100"><LogOut size={20} /></button>
        </nav>
      </div>
    </main>
  );
}

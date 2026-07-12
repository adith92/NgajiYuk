"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, Flame, Medal, Star, Trophy } from "lucide-react";
import { Header } from "@/components/Header";
import { useAppStore } from "@/lib/store";
import { hijaiyahData } from "@/data/hijaiyah";
import { doaData } from "@/data/doa";
import { sholatData } from "@/data/sholat";

function percent(completed: number, total: number) {
  return total ? Math.min(100, Math.round((completed / total) * 100)) : 0;
}

export default function ProgressPage() {
  const router = useRouter();
  const { currentUserUid, users, progress, quizHistory, initializeApp } = useAppStore();

  useEffect(() => {
    initializeApp();
    if (!currentUserUid) router.replace("/");
  }, [currentUserUid, initializeApp, router]);

  const summary = useMemo(() => {
    const userProgress = currentUserUid ? progress[currentUserUid] ?? {} : {};
    const history = currentUserUid ? quizHistory[currentUserUid] ?? [] : [];
    const totalPoints = Object.values(userProgress).reduce((total, item) => total + item.points, 0);
    const averageQuiz = history.length ? Math.round(history.reduce((sum, item) => sum + item.scorePercent, 0) / history.length) : 0;

    return {
      totalPoints,
      averageQuiz,
      completedTotal: Object.values(userProgress).reduce((total, item) => total + item.completedItems.length, 0),
      modules: [
        { name: "Hijaiyah", icon: "ا", value: percent(userProgress.hijaiyah?.completedItems.length ?? 0, hijaiyahData.length), color: "from-emerald-400 to-lime-400", surface: "bg-emerald-50" },
        { name: "Doa Harian", icon: "🤲", value: percent(userProgress.doa?.completedItems.length ?? 0, doaData.length), color: "from-pink-400 to-rose-400", surface: "bg-pink-50" },
        { name: "Bacaan Sholat", icon: "🕌", value: percent(userProgress.sholat?.completedItems.length ?? 0, sholatData.length), color: "from-blue-400 to-cyan-400", surface: "bg-blue-50" },
        { name: "Kuis Hijaiyah", icon: "🏆", value: history[0]?.scorePercent ?? 0, color: "from-amber-400 to-orange-400", surface: "bg-amber-50" },
      ],
      history,
    };
  }, [currentUserUid, progress, quizHistory]);

  const user = currentUserUid ? users[currentUserUid] : null;

  return (
    <main className="min-h-screen bg-[#f7f6ff] pb-12">
      <Header title="Progress & Poin" onBack={() => router.push("/dashboard")} />
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        <section className="relative overflow-hidden rounded-[1.8rem] bg-gradient-to-r from-[#32158a] via-[#5527ca] to-[#7442e8] p-6 text-white shadow-[0_22px_55px_rgba(72,40,168,0.24)] sm:p-8">
          <div className="purple-grid absolute inset-0 opacity-60" />
          <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-200">Ringkasan belajar</p>
              <h1 className="mt-2 text-3xl font-black">MasyaAllah, {user?.name ?? "Sobat"}! 🌟</h1>
              <p className="mt-2 max-w-xl text-sm font-medium leading-6 text-violet-100">Semua langkah kecilmu tersimpan di perangkat ini. Teruskan modul yang paling kamu suka.</p>
            </div>
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[1.8rem] border border-white/15 bg-white/10 text-5xl">🏅</div>
          </div>
        </section>

        <section className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: "Total Poin", value: summary.totalPoints.toLocaleString("id-ID"), icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
            { label: "Item Selesai", value: summary.completedTotal, icon: Medal, color: "text-violet-500", bg: "bg-violet-50" },
            { label: "Rata-rata Kuis", value: summary.averageQuiz ? `${summary.averageQuiz}%` : "-", icon: Trophy, color: "text-emerald-500", bg: "bg-emerald-50" },
            { label: "Sesi Kuis", value: summary.history.length, icon: Flame, color: "text-rose-500", bg: "bg-rose-50" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <article key={label} className="app-card p-4 sm:p-5">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg} ${color}`}><Icon size={20} /></div>
              <p className="mt-4 text-2xl font-black text-[#21164a]">{value}</p>
              <p className="mt-1 text-xs font-bold text-slate-500">{label}</p>
            </article>
          ))}
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="app-card p-5 sm:p-6">
            <div className="flex items-center gap-3"><BarChart3 className="text-violet-600" /><h2 className="text-xl font-black">Progress per modul</h2></div>
            <div className="mt-6 space-y-5">
              {summary.modules.map((module) => (
                <div key={module.name} className="grid grid-cols-[48px_1fr_48px] items-center gap-3">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl font-black ${module.surface}`}>{module.icon}</span>
                  <div>
                    <p className="mb-2 text-sm font-black">{module.name}</p>
                    <div className="h-3 overflow-hidden rounded-full bg-violet-50"><div className={`h-full rounded-full bg-gradient-to-r ${module.color}`} style={{ width: `${module.value}%` }} /></div>
                  </div>
                  <span className="text-right text-sm font-black text-slate-500">{module.value}%</span>
                </div>
              ))}
            </div>
          </article>

          <article className="app-card p-5 sm:p-6">
            <div className="flex items-center justify-between"><h2 className="text-xl font-black">Riwayat kuis</h2><Trophy className="text-amber-500" /></div>
            <div className="mt-5 space-y-3">
              {summary.history.length ? summary.history.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-2xl bg-violet-50 p-4">
                  <div>
                    <p className="text-sm font-black">Kuis Hijaiyah</p>
                    <p className="mt-1 text-[11px] font-semibold text-slate-500">{new Date(item.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</p>
                  </div>
                  <div className="text-right"><p className={`text-xl font-black ${item.passed ? "text-emerald-600" : "text-orange-500"}`}>{item.scorePercent}%</p><p className="text-[10px] font-bold text-slate-500">+{item.rewardMinutes} menit</p></div>
                </div>
              )) : (
                <div className="rounded-2xl border border-dashed border-violet-200 bg-violet-50/50 p-7 text-center">
                  <span className="text-4xl">🧠</span>
                  <p className="mt-3 text-sm font-black">Belum ada riwayat kuis</p>
                  <button type="button" onClick={() => router.push("/kuis")} className="kid-button mt-4 bg-violet-600 px-5 py-2.5 text-sm text-white">Mulai kuis</button>
                </div>
              )}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}

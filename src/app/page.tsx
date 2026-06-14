"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, LogIn, UserPlus, Sparkles, ChevronRight, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const { login, initializeApp, currentUserUid } = useAppStore();
  const [mounted, setMounted] = useState(false);
  
  // View states: 'profiles' | 'email-login'
  const [viewMode, setViewMode] = useState<"profiles" | "email-login">("profiles");
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    setMounted(true);
    initializeApp();
  }, [initializeApp]);

  // Auto redirect if already logged in
  useEffect(() => {
    if (mounted && currentUserUid) {
      router.push("/dashboard");
    }
  }, [mounted, currentUserUid, router]);

  const profiles = [
    { 
      uid: "abeel-uid", 
      name: "Abeel", 
      avatar: "👦", 
      bgGradient: "from-sky-300 to-blue-400", 
      borderColor: "border-sky-300",
      textColor: "text-sky-600",
      shadowColor: "shadow-sky-200/50",
      description: "Sobat Hijaiyah 🌟" 
    },
    { 
      uid: "emily-uid", 
      name: "Emily", 
      avatar: "👧", 
      bgGradient: "from-pink-300 to-rose-400", 
      borderColor: "border-pink-300",
      textColor: "text-pink-600",
      shadowColor: "shadow-pink-200/50",
      description: "Sobat Doa ✨" 
    },
    { 
      uid: "emier-uid", 
      name: "Emier", 
      avatar: "👶", 
      bgGradient: "from-emerald-300 to-teal-400", 
      borderColor: "border-emerald-300",
      textColor: "text-emerald-600",
      shadowColor: "shadow-emerald-200/50",
      description: "Sobat Kuis 🎮" 
    },
    { 
      uid: "bunda-uma-uid", 
      name: "Bunda Uma", 
      avatar: "🧕", 
      bgGradient: "from-amber-300 to-orange-400", 
      borderColor: "border-amber-300",
      textColor: "text-amber-600",
      shadowColor: "shadow-amber-200/50",
      description: "Pembimbing Utama ❤️" 
    },
  ];

  const handleProfileSelect = (uid: string, name: string) => {
    login(uid, name);
    router.push("/dashboard");
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth, fallback to dashboard
    login("email-user", email.split("@")[0]);
    router.push("/dashboard");
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Decorative Floating Elements */}
      <div className="absolute top-16 left-10 text-4xl animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>⭐</div>
      <div className="absolute top-32 right-16 text-3xl animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '4s' }}>🌙</div>
      <div className="absolute bottom-20 left-20 text-3xl animate-bounce" style={{ animationDelay: '1s', animationDuration: '3.5s' }}>📖</div>
      <div className="absolute bottom-32 right-12 text-4xl animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '4.5s' }}>🕌</div>
      <div className="absolute top-1/2 left-4 text-2xl animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}>🌟</div>

      {/* Main Glass Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-5xl glass-panel rounded-[32px] overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-2xl border-2 border-white/60 backdrop-blur-xl relative z-10"
      >
        {/* Left Column: Kids-friendly Quran reading Illustration */}
        <div className="lg:col-span-6 bg-gradient-to-br from-sky-50/80 to-violet-50/80 p-6 md:p-12 flex flex-col justify-between items-center text-center border-b lg:border-b-0 lg:border-r border-white/40">
          <div className="flex items-center gap-2 mb-6 lg:mb-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-300/30">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-700 tracking-wider">NgajiYuk</span>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="my-4 relative w-64 h-64 md:w-80 md:h-80 lg:w-[350px] lg:h-[350px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50"
          >
            <Image
              src="/images/quran-kids.png"
              alt="Anak Belajar Quran"
              fill
              className="object-cover object-center"
              priority
            />
            {/* Soft Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent" />
          </motion.div>

          <div className="mt-4">
            <h2 className="text-xl md:text-2xl font-bold text-slate-700 tracking-wide flex items-center justify-center gap-2">
              Belajar Qur&apos;an Jadi Seru! <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400 animate-pulse" />
            </h2>
            <p className="text-slate-500 text-sm mt-2 max-w-sm">
              Yuk belajar Hijaiyah, Doa Harian, dan Tata Cara Sholat dengan cara menyenangkan bersama keluarga.
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Login Area */}
        <div className="lg:col-span-6 p-6 md:p-12 flex flex-col justify-center min-h-[500px]">
          <AnimatePresence mode="wait">
            {viewMode === "profiles" ? (
              <motion.div
                key="profiles"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                <div className="text-center lg:text-left">
                  <span className="text-amber-500 text-sm font-semibold tracking-widest uppercase">Auto Login Profil</span>
                  <h1 className="text-3xl font-extrabold text-slate-700 mt-1">Siapa yang mau belajar?</h1>
                  <p className="text-slate-500 text-sm mt-2">Pilih profil anak di bawah ini untuk langsung masuk</p>
                </div>

                {/* Profiles Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {profiles.map((profile, i) => (
                    <motion.button
                      key={profile.uid}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * i, type: "spring", stiffness: 100 }}
                      whileHover={{ scale: 1.04, y: -4 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleProfileSelect(profile.uid, profile.name)}
                      className={`glass-panel p-5 rounded-2xl border-2 ${profile.borderColor} hover:shadow-xl ${profile.shadowColor} transition-all flex flex-col items-center text-center group relative overflow-hidden`}
                    >
                      {/* Avatar Orb with custom gradient */}
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${profile.bgGradient} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                        {profile.avatar}
                      </div>

                      {/* Sparkle effects on hover */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                      </div>

                      <span className="text-slate-700 font-bold text-lg mt-4 block relative z-10">{profile.name}</span>
                      <span className={`text-xs mt-1 block font-medium ${profile.textColor} relative z-10`}>
                        {profile.description}
                      </span>
                    </motion.button>
                  ))}
                </div>

                <div className="text-center pt-2">
                  <button
                    onClick={() => setViewMode("email-login")}
                    className="text-xs text-slate-500 hover:text-slate-700 transition-colors py-2 px-4 rounded-full border border-slate-200 hover:border-slate-300 bg-white/50 flex items-center gap-1 mx-auto"
                  >
                    Masuk manual dengan Email <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="email-login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="text-center lg:text-left">
                  <h1 className="text-3xl font-extrabold text-slate-700">Masuk Aplikasi</h1>
                  <p className="text-slate-500 text-sm mt-2">Gunakan email & password terdaftar</p>
                </div>

                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 ml-1">Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/70 border border-sky-200 rounded-xl px-4 py-3 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-300/50 focus:border-sky-400 transition-all text-sm"
                      placeholder="nama@email.com"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 ml-1">Password</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/70 border border-violet-200 rounded-xl px-4 py-3 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-300/50 focus:border-violet-400 transition-all text-sm"
                      placeholder="••••••••"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full mt-6 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-amber-300/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLogin ? (
                      <>Masuk <LogIn className="w-4 h-4" /></>
                    ) : (
                      <>Daftar <UserPlus className="w-4 h-4" /></>
                    )}
                  </motion.button>
                </form>

                <div className="flex flex-col gap-3 items-center text-center mt-6">
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    {isLogin ? "Belum punya akun? Daftar di sini" : "Sudah punya akun? Masuk"}
                  </button>
                  <button
                    onClick={() => setViewMode("profiles")}
                    className="text-xs text-amber-500 hover:text-amber-600 font-semibold transition-colors mt-2"
                  >
                    ← Kembali ke Pilih Profil Anak
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

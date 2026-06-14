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
      bgGradient: "from-teal-400 to-emerald-500", 
      textColor: "text-teal-400",
      description: "Sobat Hijaiyah 🌟" 
    },
    { 
      uid: "emily-uid", 
      name: "Emily", 
      avatar: "👧", 
      bgGradient: "from-pink-400 to-rose-500", 
      textColor: "text-pink-400",
      description: "Sobat Doa ✨" 
    },
    { 
      uid: "emier-uid", 
      name: "Emier", 
      avatar: "👶", 
      bgGradient: "from-blue-400 to-sky-500", 
      textColor: "text-blue-400",
      description: "Sobat Kuis 🎮" 
    },
    { 
      uid: "bunda-uma-uid", 
      name: "Bunda Uma", 
      avatar: "🧕", 
      bgGradient: "from-amber-400 to-orange-500", 
      textColor: "text-amber-400",
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
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 relative overflow-hidden bg-[#0B0F19]">
      {/* Decorative Glowing Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[180px] pointer-events-none" />

      {/* Main Glass Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-5xl glass-panel rounded-[32px] overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-2xl border border-slate-800/80 backdrop-blur-xl relative z-10"
      >
        {/* Left Column: Kids-friendly Quran reading Illustration */}
        <div className="lg:col-span-6 bg-gradient-to-br from-slate-900/60 to-slate-900/20 p-6 md:p-12 flex flex-col justify-between items-center text-center border-b lg:border-b-0 lg:border-r border-slate-800/80">
          <div className="flex items-center gap-2 mb-6 lg:mb-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-wider">NgajiYuk</span>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="my-4 relative w-64 h-64 md:w-80 md:h-80 lg:w-[350px] lg:h-[350px] rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-700/30"
          >
            <Image
              src="/images/quran-kids.png"
              alt="Anak Belajar Quran"
              fill
              className="object-cover object-center"
              priority
            />
            {/* Soft Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
          </motion.div>

          <div className="mt-4">
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide flex items-center justify-center gap-2">
              Belajar Qur'an Jadi Seru! <Sparkles className="w-5 h-5 text-yellow-400 fill-yellow-400 animate-pulse" />
            </h2>
            <p className="text-slate-400 text-sm mt-2 max-w-sm">
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
                  <span className="text-teal-400 text-sm font-semibold tracking-widest uppercase">Auto Login Profil</span>
                  <h1 className="text-3xl font-extrabold text-white mt-1">Siapa yang mau belajar?</h1>
                  <p className="text-slate-400 text-sm mt-2">Pilih profil anak di bawah ini untuk langsung masuk</p>
                </div>

                {/* Profiles Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {profiles.map((profile, i) => (
                    <motion.button
                      key={profile.uid}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * i, type: "spring", stiffness: 100 }}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleProfileSelect(profile.uid, profile.name)}
                      className="glass-panel p-5 rounded-2xl border border-slate-700/50 hover:border-slate-500/80 transition-all flex flex-col items-center text-center group relative overflow-hidden"
                    >
                      {/* Avatar Orb with custom gradient */}
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${profile.bgGradient} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                        {profile.avatar}
                      </div>

                      {/* Sparkle effects on hover */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Sparkles className="w-4 h-4 text-amber-300" />
                      </div>

                      <span className="text-white font-bold text-lg mt-4 block relative z-10">{profile.name}</span>
                      <span className={`text-xs mt-1 block font-medium ${profile.textColor} relative z-10`}>
                        {profile.description}
                      </span>
                    </motion.button>
                  ))}
                </div>

                <div className="text-center pt-2">
                  <button
                    onClick={() => setViewMode("email-login")}
                    className="text-xs text-slate-400 hover:text-white transition-colors py-2 px-4 rounded-full border border-slate-800 hover:border-slate-700 bg-slate-900/30 flex items-center gap-1 mx-auto"
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
                  <h1 className="text-3xl font-extrabold text-white">Masuk Aplikasi</h1>
                  <p className="text-slate-400 text-sm mt-2">Gunakan email & password terdaftar</p>
                </div>

                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 ml-1">Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all text-sm"
                      placeholder="nama@email.com"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 ml-1">Password</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all text-sm"
                      placeholder="••••••••"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full mt-6 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-teal-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
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
                    className="text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    {isLogin ? "Belum punya akun? Daftar di sini" : "Sudah punya akun? Masuk"}
                  </button>
                  <button
                    onClick={() => setViewMode("profiles")}
                    className="text-xs text-teal-400 hover:text-teal-300 font-semibold transition-colors mt-2"
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


"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, LogIn, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to Supabase Auth. For now, bypass to dashboard.
    console.log("Submitting:", { email, password, isLogin });
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="glass-panel rounded-3xl p-8 relative overflow-hidden">
          {/* Decorative gradients inside the card */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex flex-col items-center mb-8">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/30 mb-4"
            >
              <BookOpen className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white tracking-tight">NgajiYuk</h1>
            <p className="text-slate-400 mt-2 text-center text-sm">
              Mulai perjalanan spiritualmu dengan cara yang lebih menyenangkan
            </p>
          </div>

          <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 ml-1">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                placeholder="nama@email.com"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 ml-1">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                placeholder="••••••••"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full mt-6 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-teal-500/25 transition-all flex items-center justify-center gap-2"
            >
              {isLogin ? (
                <>Masuk <LogIn className="w-4 h-4" /></>
              ) : (
                <>Daftar <UserPlus className="w-4 h-4" /></>
              )}
            </motion.button>
          </form>

          <div className="relative z-10 mt-6 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              {isLogin ? "Belum punya akun? Daftar di sini" : "Sudah punya akun? Masuk"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

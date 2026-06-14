"use client";

import { ArrowLeft } from 'lucide-react';

export function Header({ title, onBack }: { title: string, onBack: () => void }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 glass-panel sticky top-0 z-50 w-full select-none border-b border-white/40 backdrop-blur-2xl">
      <div className="flex items-center justify-start w-12">
        <button 
          onClick={onBack} 
          className="p-2.5 bg-white/60 rounded-2xl hover:bg-white/80 active:scale-95 transition-all cursor-pointer flex items-center justify-center border border-slate-200 focus:outline-none shadow-sm"
        >
          <ArrowLeft className="text-slate-500 hover:text-slate-700 transition-colors" size={20} />
        </button>
      </div>
      <h2 
        className="text-xl md:text-2xl font-bold text-slate-700 text-center px-2 flex-1 tracking-wide"
      >
        {title}
      </h2>
      <div className="w-12 h-6" />
    </div>
  );
}

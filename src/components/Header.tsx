import { ArrowLeft } from 'lucide-react';

export function Header({ title, onBack }: { title: string, onBack: () => void }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-emerald-50/80 backdrop-blur-md shadow-sm sticky top-0 z-50 h-16 w-full select-none border-b border-emerald-100/50">
      <div className="flex items-center justify-start w-12">
        <button 
          id="header-back-btn" 
          onClick={onBack} 
          className="p-2.5 bg-white rounded-2xl shadow-[0_4px_10px_-2px_rgba(16,185,129,0.15)] hover:bg-emerald-50 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center border-2 border-emerald-100 focus:outline-none"
        >
          <ArrowLeft className="text-emerald-600 stroke-[3px]" size={20} />
        </button>
      </div>
      <h2 
        id="header-title" 
        className="text-xl md:text-2xl font-black text-emerald-800 text-center line-clamp-1 truncate px-2 flex-1 tracking-wide"
      >
        {title}
      </h2>
      <div className="w-12 h-6" /> {/* Perfect spacing proxy to center title perfectly */}
    </div>
  );
}

import { ArrowLeft } from 'lucide-react';

export function Header({ title, onBack }: { title: string, onBack: () => void }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white/70 backdrop-blur-md shadow-sm sticky top-0 z-50 h-16 w-full select-none border-b border-white/20">
      <div className="flex items-center justify-start w-12">
        <button 
          id="header-back-btn" 
          onClick={onBack} 
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center border border-gray-100 focus:outline-none"
        >
          <ArrowLeft className="text-[var(--primary-color)]" size={20} />
        </button>
      </div>
      <h2 
        id="header-title" 
        className="text-lg md:text-2xl font-extrabold text-[var(--primary-color)] text-center line-clamp-1 truncate px-2 flex-1 tracking-tight"
      >
        {title}
      </h2>
      <div className="w-12 h-6" /> {/* Perfect spacing proxy to center title perfectly */}
    </div>
  );
}

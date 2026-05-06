import { ArrowLeft } from 'lucide-react';

export function Header({ title, onBack }: { title: string, onBack: () => void }) {
  return (
    <div className="flex items-center p-4 bg-white/50 backdrop-blur shadow-sm sticky top-0 z-10">
      <button onClick={onBack} className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all">
        <ArrowLeft className="text-[var(--primary-color)]" size={24} />
      </button>
      <h2 className="text-2xl font-black text-[var(--primary-color)] ml-4 flex-1 text-center pr-10">{title}</h2>
    </div>
  );
}

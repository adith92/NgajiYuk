export interface HijaiyahData {
  id: string;
  name: string;
  arabic: string;
  color: string;
  audioUrl?: string; // fallback if needed
  audioText: string;
}

export const hijaiyahData: HijaiyahData[] = [
  { id: 'alif', name: 'Alif', arabic: 'ا', color: 'bg-red-400', audioText: 'Alif' },
  { id: 'ba', name: 'Ba', arabic: 'ب', color: 'bg-orange-400', audioText: 'Ba' },
  { id: 'ta', name: 'Ta', arabic: 'ت', color: 'bg-amber-400', audioText: 'Ta' },
  { id: 'tsa', name: 'Tsa', arabic: 'ث', color: 'bg-yellow-400', audioText: 'Tsa' },
  { id: 'jim', name: 'Jim', arabic: 'ج', color: 'bg-lime-400', audioText: 'Jim' },
  { id: 'ha', name: 'Ha', arabic: 'ح', color: 'bg-green-400', audioText: 'Ha' },
  { id: 'kho', name: 'Kho', arabic: 'خ', color: 'bg-emerald-400', audioText: 'Kho' },
  { id: 'dal', name: 'Dal', arabic: 'د', color: 'bg-teal-400', audioText: 'Dal' },
  { id: 'dzal', name: 'Dzal', arabic: 'ذ', color: 'bg-cyan-400', audioText: 'Dzal' },
  { id: 'ro', name: 'Ro', arabic: 'ر', color: 'bg-sky-400', audioText: 'Ro' },
  { id: 'zai', name: 'Zai', arabic: 'ز', color: 'bg-blue-400', audioText: 'Zai' },
  { id: 'sin', name: 'Sin', arabic: 'س', color: 'bg-indigo-400', audioText: 'Sin' },
  { id: 'syin', name: 'Syin', arabic: 'ش', color: 'bg-violet-400', audioText: 'Syin' },
  { id: 'shod', name: 'Shod', arabic: 'ص', color: 'bg-purple-400', audioText: 'Shod' },
  { id: 'dhod', name: 'Dhod', arabic: 'ض', color: 'bg-fuchsia-400', audioText: 'Dhod' },
  { id: 'tho', name: 'Tho', arabic: 'ط', color: 'bg-pink-400', audioText: 'Tho' },
  { id: 'zho', name: 'Zho', arabic: 'ظ', color: 'bg-rose-400', audioText: 'Zho' },
  { id: 'ain', name: 'Ain', arabic: 'ع', color: 'bg-red-500', audioText: 'Ain' },
  { id: 'ghoin', name: 'Ghoin', arabic: 'غ', color: 'bg-orange-500', audioText: 'Ghoin' },
  { id: 'fa', name: 'Fa', arabic: 'ف', color: 'bg-amber-500', audioText: 'Fa' },
  { id: 'qof', name: 'Qof', arabic: 'ق', color: 'bg-yellow-500', audioText: 'Qof' },
  { id: 'kaf', name: 'Kaf', arabic: 'ك', color: 'bg-lime-500', audioText: 'Kaf' },
  { id: 'lam', name: 'Lam', arabic: 'ل', color: 'bg-green-500', audioText: 'Lam' },
  { id: 'mim', name: 'Mim', arabic: 'م', color: 'bg-emerald-500', audioText: 'Mim' },
  { id: 'nun', name: 'Nun', arabic: 'ن', color: 'bg-teal-500', audioText: 'Nun' },
  { id: 'wawu', name: 'Wawu', arabic: 'و', color: 'bg-cyan-500', audioText: 'Wawu' },
  { id: 'ha_besar', name: 'Ha', arabic: 'هـ', color: 'bg-sky-500', audioText: 'Ha besar' },
  { id: 'hamzah', name: 'Hamzah', arabic: 'ء', color: 'bg-blue-500', audioText: 'Hamzah' },
  { id: 'ya', name: 'Ya', arabic: 'ي', color: 'bg-indigo-500', audioText: 'Ya' }
];

import Link from "next/link";
import { Home, MapPinOff } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-sky-50 to-violet-50 p-6">
      <section className="app-card w-full max-w-lg p-7 text-center sm:p-9">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.6rem] bg-sky-100 text-sky-600"><MapPinOff size={34} /></div>
        <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-violet-500">404</p>
        <h1 className="mt-2 text-2xl font-black text-[#21164a]">Halaman ini belum ada</h1>
        <p className="mt-3 text-sm font-medium leading-6 text-slate-500">Mungkin bintangnya berpindah tempat. Yuk kembali ke halaman utama.</p>
        <Link href="/dashboard" className="kid-button mx-auto mt-6 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-purple-700 px-6 py-3 text-white shadow-lg shadow-violet-300/35"><Home size={18} /> Kembali ke dashboard</Link>
      </section>
    </main>
  );
}

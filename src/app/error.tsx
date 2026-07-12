"use client";

import { useEffect } from "react";
import { RefreshCcw, TriangleAlert } from "lucide-react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[route-error]", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-rose-50 to-violet-50 p-6">
      <section className="app-card w-full max-w-lg p-7 text-center sm:p-9">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.6rem] bg-rose-100 text-rose-600"><TriangleAlert size={34} /></div>
        <h1 className="mt-5 text-2xl font-black text-[#21164a]">Ada halaman yang tersandung</h1>
        <p className="mt-3 text-sm font-medium leading-6 text-slate-500">Data belajar kamu tetap aman di perangkat. Coba muat ulang bagian ini.</p>
        {error.digest ? <p className="mt-3 text-[11px] font-semibold text-slate-400">Kode laporan: {error.digest}</p> : null}
        <button type="button" onClick={reset} className="kid-button mx-auto mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-purple-700 px-6 py-3 text-white shadow-lg shadow-violet-300/35"><RefreshCcw size={18} /> Coba lagi</button>
      </section>
    </main>
  );
}

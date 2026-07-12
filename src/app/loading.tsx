export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-violet-50 to-sky-50 p-6" aria-live="polite" aria-busy="true">
      <div className="app-card w-full max-w-sm p-8 text-center">
        <div className="mx-auto flex h-20 w-20 animate-pulse items-center justify-center rounded-[1.6rem] bg-gradient-to-br from-violet-500 to-purple-700 text-4xl shadow-lg shadow-violet-300/35">🌙</div>
        <h1 className="mt-5 text-xl font-black text-[#21164a]">Menyiapkan petualangan belajar...</h1>
        <p className="mt-2 text-sm font-medium text-slate-500">Sebentar ya, bintang-bintangnya sedang dirapikan ✨</p>
        <div className="mt-6 h-2 overflow-hidden rounded-full bg-violet-50"><div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-violet-500 to-sky-400" /></div>
      </div>
    </main>
  );
}

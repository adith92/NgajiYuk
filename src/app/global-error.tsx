"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="id">
      <body>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "#f7f6ff", color: "#21164a", fontFamily: "Arial, sans-serif" }}>
          <section style={{ maxWidth: 480, padding: 32, borderRadius: 28, background: "white", textAlign: "center", boxShadow: "0 20px 60px rgba(55,30,130,.15)" }}>
            <div style={{ fontSize: 56 }}>🌙</div>
            <h1 style={{ marginTop: 16, fontSize: 28 }}>NgajiYuk perlu dimuat ulang</h1>
            <p style={{ marginTop: 12, color: "#64748b", lineHeight: 1.6 }}>Terjadi masalah pada aplikasi utama. Data lokal tidak otomatis dihapus.</p>
            <button type="button" onClick={reset} style={{ marginTop: 24, border: 0, borderRadius: 16, padding: "13px 22px", background: "#6d3cdf", color: "white", fontWeight: 800, cursor: "pointer" }}>Muat ulang aplikasi</button>
          </section>
        </main>
      </body>
    </html>
  );
}

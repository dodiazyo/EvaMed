export default function HomePage() {
  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div className="app-header">
        <div>
          <div className="logo">Eva<span>Med</span></div>
          <div style={{ fontSize: 11, opacity: .75, marginTop: 2 }}>Evaluación Psicológica para Seguridad</div>
        </div>
      </div>

      {/* Hero */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{ textAlign: "center", maxWidth: 520 }}>
          <div style={{
            width: 80, height: 80, borderRadius: 20, background: "var(--primary-bg)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 36, margin: "0 auto 24px",
          }}>🧠</div>

          <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--text1)", marginBottom: 12, lineHeight: 1.3 }}>
            Evaluación Psicológica<br />para Personal de Seguridad
          </h1>

          <p style={{ color: "var(--text3)", fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
            Si recibiste un enlace personalizado de evaluación, ábrelo directamente desde ese enlace.
            Si eres administrador, accede al panel de control para gestionar evaluaciones.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/admin" className="btn btn-primary btn-lg">
              🔐 Panel Administrador
            </a>
          </div>

          <hr className="divider" style={{ margin: "40px auto", maxWidth: 300 }} />

          {/* Features */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, textAlign: "left" }}>
            {[
              { icon: "📱", title: "Mobile-first", desc: "Diseñada para completarse desde cualquier dispositivo" },
              { icon: "💾", title: "Auto-guardado", desc: "Si cierras y vuelves, continúas donde quedaste" },
              { icon: "📊", title: "Resultado inmediato", desc: "Reporte visual con gráficas al finalizar" },
              { icon: "🔒", title: "Confidencial", desc: "Solo el administrador accede a los resultados" },
            ].map(f => (
              <div key={f.title} className="card" style={{ padding: "14px 16px" }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{f.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text1)", marginBottom: 4 }}>{f.title}</div>
                <div style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

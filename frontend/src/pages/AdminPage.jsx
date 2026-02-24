import { useState, useEffect } from "react";

const STATUS_LABELS = { pending: "Pendiente", in_progress: "En curso", completed: "Completada" };
const STATUS_CLASS  = { pending: "pill-pending", in_progress: "pill-progress", completed: "pill-completed" };

const VERDICT_COLORS = {
  "APTO":                 { color: "var(--success)", bg: "#dcfce7" },
  "CONDICIONALMENTE APTO":{ color: "#854d0e",         bg: "#fef9c3" },
  "NO APTO":              { color: "var(--danger)",   bg: "#fee2e2" },
};

function copyToClipboard(text) {
  navigator.clipboard?.writeText(text).catch(() => {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  });
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  const [evaluations, setEvaluations] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [copied, setCopied] = useState(null);

  // Create form
  const [form, setForm] = useState({ candidate_name: "", candidate_email: "", candidate_phone: "", position: "", company: "" });
  const [creating, setCreating] = useState(false);
  const [createdLink, setCreatedLink] = useState(null);

  async function login(e) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(false);
    try {
      const r = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await r.json();
      if (data.ok) { setAuthed(true); }
      else { setAuthError(true); }
    } finally {
      setAuthLoading(false);
    }
  }

  async function loadList() {
    setListLoading(true);
    try {
      const r = await fetch("/api/evaluations");
      const data = await r.json();
      setEvaluations(data);
    } finally {
      setListLoading(false);
    }
  }

  useEffect(() => { if (authed) loadList(); }, [authed]);

  async function createEval(e) {
    e.preventDefault();
    if (!form.candidate_name.trim()) return;
    setCreating(true);
    setCreatedLink(null);
    try {
      const r = await fetch("/api/evaluations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await r.json();
      const link = `${window.location.origin}/eval/${data.token}`;
      setCreatedLink(link);
      setForm({ candidate_name: "", candidate_email: "", candidate_phone: "", position: "", company: "" });
      await loadList();
    } finally {
      setCreating(false);
    }
  }

  function handleCopy(text, id) {
    copyToClipboard(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  // ── Login screen ────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
        <div className="app-header">
          <div>
            <div className="logo">Eva<span>Med</span></div>
            <div style={{ fontSize: 11, opacity: .75, marginTop: 2 }}>Panel Administrador</div>
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div className="container" style={{ maxWidth: 380 }}>
            <div className="card" style={{ padding: "32px 28px" }}>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>🔐</div>
                <h2 style={{ fontSize: 20, fontWeight: 800 }}>Acceso al Panel</h2>
                <p style={{ color: "var(--text3)", fontSize: 13, marginTop: 6 }}>Ingresa la contraseña de administrador</p>
              </div>
              <form onSubmit={login}>
                <div className="field">
                  <label>Contraseña</label>
                  <input
                    className="input"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoFocus
                  />
                  {authError && (
                    <p style={{ color: "var(--danger)", fontSize: 12, marginTop: 6 }}>Contraseña incorrecta</p>
                  )}
                </div>
                <button className="btn btn-primary btn-full" type="submit" disabled={authLoading || !password}>
                  {authLoading ? "Verificando..." : "Ingresar"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Admin dashboard ─────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)" }}>
      <div className="app-header">
        <div style={{ flex: 1 }}>
          <div className="logo">Eva<span>Med</span></div>
          <div style={{ fontSize: 11, opacity: .75, marginTop: 2 }}>Panel Administrador</div>
        </div>
        <button className="btn btn-ghost" style={{ fontSize: 12, padding: "6px 14px" }} onClick={() => setAuthed(false)}>
          Salir
        </button>
      </div>

      <div style={{ padding: "24px 16px 60px" }}>
        <div className="container-wide">
          {/* Create evaluation */}
          <div className="card" style={{ padding: "24px", marginBottom: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 20, color: "var(--text1)" }}>
              ➕ Nueva Evaluación
            </h2>
            <form onSubmit={createEval}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="field">
                  <label>Nombre completo *</label>
                  <input className="input" value={form.candidate_name} placeholder="Juan García"
                    onChange={e => setForm(f => ({ ...f, candidate_name: e.target.value }))} />
                </div>
                <div className="field">
                  <label>Correo electrónico</label>
                  <input className="input" type="email" value={form.candidate_email} placeholder="juan@email.com"
                    onChange={e => setForm(f => ({ ...f, candidate_email: e.target.value }))} />
                </div>
                <div className="field">
                  <label>Teléfono</label>
                  <input className="input" value={form.candidate_phone} placeholder="+504 9999-9999"
                    onChange={e => setForm(f => ({ ...f, candidate_phone: e.target.value }))} />
                </div>
                <div className="field">
                  <label>Cargo al que aplica</label>
                  <input className="input" value={form.position} placeholder="Oficial de Seguridad"
                    onChange={e => setForm(f => ({ ...f, position: e.target.value }))} />
                </div>
                <div className="field" style={{ gridColumn: "1 / -1" }}>
                  <label>Empresa</label>
                  <input className="input" value={form.company} placeholder="SEGASA"
                    onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 8, flexWrap: "wrap" }}>
                <button className="btn btn-primary" type="submit" disabled={creating || !form.candidate_name.trim()}>
                  {creating ? "Creando..." : "Generar enlace de evaluación"}
                </button>
                {createdLink && (
                  <div style={{
                    flex: 1, display: "flex", gap: 10, alignItems: "center",
                    background: "var(--success-bg)", border: "1px solid #86efac",
                    borderRadius: 8, padding: "10px 14px", minWidth: 0,
                  }}>
                    <span style={{ fontSize: 13, color: "var(--success)", fontWeight: 600, flex: 1, wordBreak: "break-all" }}>
                      {createdLink}
                    </span>
                    <button
                      className="btn btn-ghost"
                      style={{ fontSize: 12, padding: "6px 12px", whiteSpace: "nowrap" }}
                      onClick={() => handleCopy(createdLink, "new")}
                      type="button"
                    >
                      {copied === "new" ? "✓ Copiado" : "📋 Copiar"}
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Evaluations table */}
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
              <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text1)", flex: 1 }}>
                📋 Evaluaciones ({evaluations.length})
              </h2>
              <button className="btn btn-ghost" style={{ fontSize: 12, padding: "6px 14px" }} onClick={loadList}>
                {listLoading ? "..." : "↻ Actualizar"}
              </button>
            </div>

            {listLoading ? (
              <div className="spinner" />
            ) : evaluations.length === 0 ? (
              <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--text3)" }}>
                No hay evaluaciones aún. Crea la primera arriba.
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Candidato</th>
                      <th>Cargo / Empresa</th>
                      <th>Estado</th>
                      <th>Resultado</th>
                      <th>Fecha</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evaluations.map(ev => {
                      const link = `${window.location.origin}/eval/${ev.token}`;
                      const resultLink = `${window.location.origin}/result/${ev.token}`;
                      const vc = ev.verdict ? VERDICT_COLORS[ev.verdict] : null;
                      return (
                        <tr key={ev.id}>
                          <td>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>{ev.candidate_name}</div>
                            {ev.candidate_email && <div style={{ fontSize: 11, color: "var(--text4)" }}>{ev.candidate_email}</div>}
                          </td>
                          <td style={{ fontSize: 13, color: "var(--text3)" }}>
                            {ev.position || "—"}<br />
                            <span style={{ fontSize: 12 }}>{ev.company || ""}</span>
                          </td>
                          <td>
                            <span className={`pill ${STATUS_CLASS[ev.status]}`}>
                              {STATUS_LABELS[ev.status]}
                            </span>
                          </td>
                          <td>
                            {ev.overall_pct != null ? (
                              <div>
                                <div style={{ fontWeight: 800, fontSize: 15 }}>{ev.overall_pct}%</div>
                                {vc && (
                                  <span style={{
                                    fontSize: 10, fontWeight: 700, padding: "2px 8px",
                                    borderRadius: 99, background: vc.bg, color: vc.color,
                                    display: "inline-block", marginTop: 2,
                                  }}>
                                    {ev.verdict}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span style={{ color: "var(--text4)", fontSize: 13 }}>—</span>
                            )}
                          </td>
                          <td style={{ fontSize: 12, color: "var(--text3)" }}>
                            {new Date(ev.created_at).toLocaleDateString("es", { day: "2-digit", month: "short", year: "numeric" })}
                          </td>
                          <td>
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                              <button
                                className="btn btn-ghost"
                                style={{ fontSize: 11, padding: "5px 10px" }}
                                onClick={() => handleCopy(link, `link-${ev.id}`)}
                              >
                                {copied === `link-${ev.id}` ? "✓" : "📋"} Link
                              </button>
                              {ev.status === "completed" && (
                                <a
                                  href={resultLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="btn btn-primary"
                                  style={{ fontSize: 11, padding: "5px 10px" }}
                                >
                                  Ver resultado
                                </a>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

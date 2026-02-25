import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip,
} from "recharts";

const AREA_COLORS = {
  personalidad: "#7c3aed",
  integridad:   "#d97706",
  emocional:    "#059669",
  aptitud:      "#1d4ed8",
};

const AREA_ICONS = {
  personalidad: "🧩",
  integridad:   "⚖️",
  emocional:    "💙",
  aptitud:      "🛡️",
};

const VERDICTS = {
  green:  { label: "APTO",                 icon: "✅", cls: "verdict-green" },
  yellow: { label: "CONDICIONALMENTE APTO", icon: "⚠️", cls: "verdict-yellow" },
  red:    { label: "NO APTO",              icon: "❌", cls: "verdict-red" },
};

const AREA_DESCRIPTIONS = {
  personalidad: {
    green:  "Muestra una personalidad estable, organizada y con buen manejo de la presión.",
    yellow: "Presenta algunas inconsistencias que podrían afectar el desempeño en situaciones de alta exigencia.",
    red:    "Se identifican rasgos de personalidad que podrían dificultar el trabajo en entornos de seguridad.",
  },
  integridad: {
    green:  "Demuestra altos niveles de honestidad, resistencia a la corrupción y transparencia.",
    yellow: "Presenta un perfil de integridad aceptable con áreas de mejora.",
    red:    "Se detectan indicadores de riesgo en honestidad y resistencia a situaciones de corrupción.",
  },
  emocional: {
    green:  "Posee buenas habilidades para controlar sus emociones, empatizar y manejar el estrés.",
    yellow: "Su inteligencia emocional es moderada; puede mejorar en control emocional o manejo del estrés.",
    red:    "Muestra dificultades significativas en el manejo emocional que pueden afectar el desempeño.",
  },
  aptitud: {
    green:  "Muestra sólida capacidad de decisión, respeto a la autoridad y preparación para emergencias.",
    yellow: "Tiene aptitud básica para seguridad, pero con aspectos que requieren refuerzo.",
    red:    "Presenta deficiencias importantes en aptitud operativa para funciones de seguridad.",
  },
};

function getAreaDesc(areaKey, pct) {
  const level = pct >= 70 ? "green" : pct >= 50 ? "yellow" : "red";
  return AREA_DESCRIPTIONS[areaKey]?.[level] || "";
}

function pctColor(pct) {
  if (pct >= 70) return "var(--success)";
  if (pct >= 50) return "var(--warning)";
  return "var(--danger)";
}

function ScoreCircle({ pct, color }) {
  const r = 52;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference - (pct / 100) * circumference;

  return (
    <div style={{ position: "relative", width: 140, height: 140, margin: "0 auto" }}>
      <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="70" cy="70" r={r} fill="none" stroke="var(--border)" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: 32, fontWeight: 800, color, lineHeight: 1 }}>{pct}%</span>
        <span style={{ fontSize: 10, color: "var(--text4)", fontWeight: 600, letterSpacing: ".05em", marginTop: 2 }}>PUNTAJE</span>
      </div>
    </div>
  );
}

export default function ResultPage() {
  const { token } = useParams();
  // token available for print footer
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/result/${token}`)
      .then(r => { if (!r.ok) throw new Error("No se pudo cargar el resultado"); return r.json(); })
      .then(setResult)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return (
    <div style={{ minHeight: "100dvh" }}>
      <div className="app-header"><div className="logo">Eva<span>Med</span></div></div>
      <div className="spinner" />
    </div>
  );

  if (error) return (
    <div style={{ minHeight: "100dvh" }}>
      <div className="app-header"><div className="logo">Eva<span>Med</span></div></div>
      <div style={{ padding: 32, textAlign: "center", color: "var(--danger)" }}>
        <p>{error}</p>
        <Link to={`/eval/${token}`} className="btn btn-primary mt-16" style={{ display: "inline-flex" }}>
          Volver a la evaluación
        </Link>
      </div>
    </div>
  );

  const { candidate_name, position, company, overall_pct, verdict, verdict_color, areas } = result;
  const vd = VERDICTS[verdict_color];

  // Radar data
  const radarData = areas.map(a => ({
    subject: a.name.replace("Inteligencia Emocional", "I. Emocional").replace("Personalidad", "Personalidad").replace("Integridad y Honestidad", "Integridad").replace("Aptitud para Seguridad", "Aptitud"),
    value: a.pct,
    fullMark: 100,
  }));

  const completedDate = result.completed_at
    ? new Date(result.completed_at).toLocaleDateString("es", { day: "2-digit", month: "long", year: "numeric" })
    : null;

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)" }}>
      {/* Header — hidden in print */}
      <div className="app-header no-print">
        <div style={{ flex: 1 }}>
          <div className="logo">Eva<span>Med</span></div>
          <div style={{ fontSize: 11, opacity: .75, marginTop: 2 }}>Resultado de Evaluación</div>
        </div>
        {completedDate && (
          <div style={{ fontSize: 11, color: "#93c5fd" }}>{completedDate}</div>
        )}
      </div>

      {/* Print-only header */}
      <div className="print-only print-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#1d4ed8" }}>EvaMed</div>
            <div style={{ fontSize: 11, color: "#64748b" }}>Evaluación Psicológica para Personal de Seguridad</div>
          </div>
          <div style={{ textAlign: "right", fontSize: 12, color: "#64748b" }}>
            <div>Fecha: {completedDate || new Date().toLocaleDateString("es")}</div>
            <div>Documento de evidencia — Confidencial</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "24px 16px 60px" }}>
        {/* Print action button */}
        <div className="container no-print" style={{ marginBottom: 16 }}>
          <button
            className="btn btn-primary"
            onClick={() => window.print()}
            style={{ gap: 8 }}
          >
            🖨️ Imprimir / Guardar PDF
          </button>
        </div>

        <div className="container print-container">
          {/* Candidate info + score */}
          <div className="card" style={{ padding: "28px 24px", textAlign: "center", marginBottom: 20 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text1)", marginBottom: 4 }}>
              {candidate_name}
            </h2>
            {(position || company) && (
              <p style={{ color: "var(--text3)", fontSize: 13, marginBottom: 20 }}>
                {position}{position && company ? " · " : ""}{company}
              </p>
            )}

            <ScoreCircle pct={overall_pct} color={pctColor(overall_pct)} />

            <div className="mt-16">
              <div className={`verdict-badge ${vd.cls}`}>
                {vd.icon} {vd.label}
              </div>
            </div>

            <p style={{ fontSize: 13, color: "var(--text3)", marginTop: 14, lineHeight: 1.6 }}>
              Respondió {result.answered_questions} de {result.total_questions} preguntas
            </p>
          </div>

          {/* Radar chart */}
          <div className="card" style={{ padding: "20px 16px", marginBottom: 20 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "var(--text3)", marginBottom: 16, textAlign: "center" }}>
              Perfil por Área
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "var(--text3)", fontSize: 11, fontWeight: 600 }}
                />
                <Tooltip
                  contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 13 }}
                  formatter={(v) => [`${v}%`, "Puntaje"]}
                />
                <Radar
                  name="Puntaje"
                  dataKey="value"
                  stroke="var(--primary)"
                  fill="var(--primary)"
                  fillOpacity={0.18}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Area cards */}
          <div className="area-grid" style={{ marginBottom: 20 }}>
            {areas.map(area => {
              const color = AREA_COLORS[area.key] || "var(--primary)";
              const desc = getAreaDesc(area.key, area.pct);
              return (
                <div key={area.key} className="area-card">
                  <div className="area-name">{AREA_ICONS[area.key]} {area.name}</div>
                  <div className="area-pct" style={{ color }}>{area.pct}%</div>
                  <div className="area-bar-track">
                    <div className="area-bar-fill" style={{ width: `${area.pct}%`, background: color }} />
                  </div>

                  {/* Dimensions */}
                  <div className="dim-list">
                    {Object.entries(area.dimensions).map(([dk, dv]) => (
                      <div key={dk} className="dim-row">
                        <span className="dim-name">{dv.name}</span>
                        <div className="dim-mini-bar">
                          <div className="dim-mini-fill" style={{ width: `${dv.pct}%`, background: color }} />
                        </div>
                        <span className="dim-pct" style={{ color }}>{dv.pct}%</span>
                      </div>
                    ))}
                  </div>

                  {desc && (
                    <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 10, lineHeight: 1.5 }}>
                      {desc}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Interpretation guide */}
          <div className="card" style={{ padding: "18px 20px" }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "var(--text3)", marginBottom: 14 }}>
              Guía de Interpretación
            </h3>
            {[
              { color: "var(--success)", bg: "var(--success-bg)", border: "#86efac", icon: "✅", label: "APTO", desc: "Puntaje general ≥70% sin área por debajo del 40%. El candidato muestra el perfil psicológico adecuado para funciones de seguridad." },
              { color: "#854d0e", bg: "#fef9c3", border: "#fde047", icon: "⚠️", label: "COND. APTO", desc: "Puntaje general 50-69%. Apto con condiciones o necesidad de seguimiento en áreas específicas." },
              { color: "var(--danger)", bg: "var(--danger-bg)", border: "#fca5a5", icon: "❌", label: "NO APTO", desc: "Puntaje general <50% o algún área crítica con indicadores de riesgo." },
            ].map(v => (
              <div key={v.label} style={{
                display: "flex", gap: 12, alignItems: "flex-start",
                padding: "10px 12px", borderRadius: 8,
                background: v.bg, border: `1px solid ${v.border}`,
                marginBottom: 10,
              }}>
                <span style={{ fontSize: 16, lineHeight: 1.4 }}>{v.icon}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: v.color, marginBottom: 2 }}>{v.label}</div>
                  <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5 }}>{v.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <p style={{ textAlign: "center", fontSize: 12, color: "var(--text4)", marginTop: 24 }}>
            Evaluación generada por EvaMed · {new Date().getFullYear()}
          </p>

          {/* Print footer */}
          <div className="print-only" style={{ marginTop: 32, borderTop: "1px solid #e2e8f0", paddingTop: 16, fontSize: 11, color: "#94a3b8", display: "flex", justifyContent: "space-between" }}>
            <span>EvaMed — Plataforma de Evaluación Psicológica</span>
            <span>Token: {token}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

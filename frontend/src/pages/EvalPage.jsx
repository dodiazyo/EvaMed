import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

const AREA_LABELS = {
  personalidad: "Personalidad",
  integridad:   "Integridad",
  emocional:    "Inteligencia Emocional",
  aptitud:      "Aptitud para Seguridad",
};

const AREA_ICONS = {
  personalidad: "🧩",
  integridad:   "⚖️",
  emocional:    "💙",
  aptitud:      "🛡️",
};

async function fetchNext(token) {
  const r = await fetch(`/api/eval/${token}/next-question`);
  if (!r.ok) throw new Error("Error al cargar la evaluación");
  return r.json();
}

async function postAnswer(token, question_id, answer_value) {
  const r = await fetch(`/api/eval/${token}/response`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question_id, answer_value }),
  });
  if (!r.ok) throw new Error("Error al guardar respuesta");
  return r.json();
}

export default function EvalPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [evalData, setEvalData] = useState(null);  // { evaluation, answered, total, next_question }
  const [selected, setSelected] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [started, setStarted] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await fetchNext(token);
      setEvalData(data);
      setSelected(null);

      if (data.evaluation?.status === "completed") {
        navigate(`/result/${token}`, { replace: true });
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => { load(); }, [load]);

  async function handleAnswer(optionIndex) {
    if (saving || animating) return;
    setSelected(optionIndex);

    // Short delay for visual feedback, then save
    setTimeout(async () => {
      setSaving(true);
      try {
        const result = await postAnswer(token, evalData.next_question.id, optionIndex);
        if (result.status === "completed") {
          navigate(`/result/${token}`);
          return;
        }
        // Animate transition
        setAnimating(true);
        setTimeout(() => {
          setEvalData(prev => ({
            ...prev,
            answered: result.answered,
            total: result.total,
            next_question: result.next_question,
          }));
          setSelected(null);
          setAnimating(false);
        }, 200);
      } catch (e) {
        setError(e.message);
      } finally {
        setSaving(false);
      }
    }, 350);
  }

  if (loading) return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <div className="app-header">
        <div className="logo">Eva<span>Med</span></div>
      </div>
      <div className="spinner" />
    </div>
  );

  if (error) return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <div className="app-header"><div className="logo">Eva<span>Med</span></div></div>
      <div style={{ padding: 32, textAlign: "center", color: "var(--danger)" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
        <p>{error}</p>
      </div>
    </div>
  );

  const { evaluation, answered, total, next_question: q } = evalData;
  const pct = total > 0 ? Math.round((answered / total) * 100) : 0;

  // Welcome screen (not started yet and no current question answered)
  if (!started && evaluation.status === "pending" && answered === 0) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
        <div className="app-header">
          <div>
            <div className="logo">Eva<span>Med</span></div>
            <div style={{ fontSize: 11, opacity: .75, marginTop: 2 }}>Evaluación Psicológica</div>
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 20px" }}>
          <div className="container">
            <div className="card" style={{ padding: "32px 28px", textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>👋</div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text1)", marginBottom: 8 }}>
                Hola, {evaluation.candidate_name}
              </h1>
              {evaluation.position && (
                <p style={{ color: "var(--text3)", fontSize: 14, marginBottom: 4 }}>
                  Cargo: <strong>{evaluation.position}</strong>
                </p>
              )}
              {evaluation.company && (
                <p style={{ color: "var(--text3)", fontSize: 14, marginBottom: 20 }}>
                  Empresa: <strong>{evaluation.company}</strong>
                </p>
              )}

              <hr className="divider" />

              <p style={{ fontSize: 15, color: "var(--text2)", lineHeight: 1.7, marginBottom: 20 }}>
                Esta evaluación consta de <strong>{total} preguntas</strong> que exploran aspectos
                de tu personalidad, integridad, inteligencia emocional y aptitud para el trabajo de seguridad.
              </p>

              <div style={{ background: "var(--bg)", borderRadius: 10, padding: "16px 20px", marginBottom: 24, textAlign: "left" }}>
                {[
                  "No hay respuestas correctas o incorrectas — sé honesto/a.",
                  "Tu progreso se guarda automáticamente en cada respuesta.",
                  "Puedes cerrar y retomar la evaluación en cualquier momento.",
                  "Al terminar verás tu resultado de forma inmediata.",
                ].map((tip, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: i < 3 ? 10 : 0, fontSize: 13, color: "var(--text2)" }}>
                    <span style={{ color: "var(--primary)", fontWeight: 700 }}>✓</span>
                    {tip}
                  </div>
                ))}
              </div>

              <button className="btn btn-primary btn-lg btn-full" onClick={() => setStarted(true)}>
                Comenzar evaluación →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      {/* Header */}
      <div className="app-header">
        <div style={{ flex: 1 }}>
          <div className="logo" style={{ fontSize: 17 }}>Eva<span>Med</span></div>
          <div style={{ fontSize: 11, opacity: .75, marginTop: 1 }}>{evaluation.candidate_name}</div>
        </div>
        <div style={{ fontSize: 12, color: "#93c5fd", fontWeight: 600 }}>
          {answered}/{total}
        </div>
      </div>

      {/* Progress */}
      <div className="progress-wrap">
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="progress-label">
          <span>{pct}% completado</span>
          <span>{total - answered} preguntas restantes</span>
        </div>
      </div>

      {/* Question */}
      <div style={{
        flex: 1,
        padding: "24px 16px 40px",
        opacity: animating ? 0 : 1,
        transition: "opacity .2s ease",
      }}>
        <div className="container">
          {q ? (
            <div>
              {/* Area badge */}
              <div className={`question-area-badge badge-${q.area}`}>
                {AREA_ICONS[q.area]} {AREA_LABELS[q.area]}
              </div>

              {/* Question number */}
              <div className="question-num">Pregunta {answered + 1} de {total}</div>

              {/* Question text */}
              <div className="question-text">{q.text}</div>

              {/* Options */}
              <div className="options-list">
                {q.options.map((opt, idx) => (
                  <button
                    key={idx}
                    className={`option-card${selected === idx ? " selected" : ""}`}
                    onClick={() => handleAnswer(idx)}
                    disabled={saving}
                  >
                    <div className="option-dot" />
                    <span>{opt}</span>
                  </button>
                ))}
              </div>

              {saving && (
                <div style={{ textAlign: "center", marginTop: 20, color: "var(--text4)", fontSize: 13 }}>
                  Guardando...
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: "center", paddingTop: 40 }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>✅</div>
              <p style={{ color: "var(--text2)" }}>Cargando resultado...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

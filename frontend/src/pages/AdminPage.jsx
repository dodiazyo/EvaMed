import { useState, useEffect } from "react";

const STATUS_LABELS = {
  pending: "Pendiente",
  in_progress: "En curso",
  completed: "Completada",
};
const STATUS_CLASS = {
  pending: "pill-pending",
  in_progress: "pill-progress",
  completed: "pill-completed",
};

const VERDICT_COLORS = {
  APTO: { color: "var(--success)", bg: "#dcfce7" },
  "CONDICIONALMENTE APTO": { color: "#854d0e", bg: "#fef9c3" },
  "NO APTO": { color: "var(--danger)", bg: "#fee2e2" },
};

const ROLE_LABELS = {
  admin: "Administrador completo",
  creator: "Solo creación",
  evaluator: "Evaluador",
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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [userRole, setUserRole] = useState(null); // "admin" | "creator"
  const [displayName, setDisplayName] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [authError, setAuthError] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  const [evaluations, setEvaluations] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [copied, setCopied] = useState(null);

  // Active tab: "evaluations" | "users"
  const [tab, setTab] = useState("evaluations");

  // Create evaluation form
  const [form, setForm] = useState({
    candidate_name: "",
    candidate_id: "",
    candidate_email: "",
    candidate_phone: "",
    position: "",
    company: "",
  });
  const [creating, setCreating] = useState(false);
  const [createdLink, setCreatedLink] = useState(null);

  // User management
  const [adminUsers, setAdminUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userForm, setUserForm] = useState({
    username: "",
    password: "",
    display_name: "",
    role: "creator",
  });
  const [creatingUser, setCreatingUser] = useState(false);
  const [userError, setUserError] = useState(null);

  async function login(e) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(false);
    try {
      const r = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await r.json();
      if (data.ok) {
        setAuthed(true);
        setUserRole(data.role);
        setDisplayName(data.display_name || data.username);
        setCurrentUserId(data.user_id);
      } else {
        setAuthError(true);
      }
    } finally {
      setAuthLoading(false);
    }
  }

  async function loadList() {
    setListLoading(true);
    try {
      const r = await fetch("/api/evaluations");
      setEvaluations(await r.json());
    } finally {
      setListLoading(false);
    }
  }

  async function loadUsers() {
    setUsersLoading(true);
    try {
      const r = await fetch("/api/admin/users");
      setAdminUsers(await r.json());
    } finally {
      setUsersLoading(false);
    }
  }

  useEffect(() => {
    if (authed) {
      loadList();
      if (userRole === "admin") loadUsers();
    }
  }, [authed, userRole]);

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
      setForm({
        candidate_name: "",
        candidate_id: "",
        candidate_email: "",
        candidate_phone: "",
        position: "",
        company: "",
      });
      await loadList();
    } finally {
      setCreating(false);
    }
  }

  async function handleCreateUser(e) {
    e.preventDefault();
    setUserError(null);
    if (!userForm.username.trim() || !userForm.password) {
      setUserError("Usuario y contraseña son requeridos");
      return;
    }
    setCreatingUser(true);
    try {
      const r = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userForm),
      });
      if (!r.ok) {
        const err = await r.json();
        setUserError(err.detail || "Error al crear usuario");
        return;
      }
      setUserForm({
        username: "",
        password: "",
        display_name: "",
        role: "creator",
      });
      await loadUsers();
    } finally {
      setCreatingUser(false);
    }
  }

  async function handleDeleteUser(userId) {
    if (!confirm("¿Eliminar este usuario?")) return;
    const r = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
    if (!r.ok) {
      const err = await r.json();
      alert(err.detail || "Error al eliminar");
      return;
    }
    await loadUsers();
  }

  function handleCopy(text, id) {
    copyToClipboard(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  function logout() {
    setAuthed(false);
    setUserRole(null);
    setDisplayName("");
    setUsername("");
    setPassword("");
    setTab("evaluations");
  }

  // ── Login screen ────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div
        style={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="app-header">
          <div>
            <div className="logo">
              Eva<span>Med</span>
            </div>
            <div style={{ fontSize: 11, opacity: 0.75, marginTop: 2 }}>
              Panel Administrador
            </div>
          </div>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <div className="container" style={{ maxWidth: 380 }}>
            <div className="card" style={{ padding: "32px 28px" }}>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>🔐</div>
                <h2 style={{ fontSize: 20, fontWeight: 800 }}>
                  Acceso al Panel
                </h2>
                <p
                  style={{ color: "var(--text3)", fontSize: 13, marginTop: 6 }}
                >
                  Ingresa tus credenciales
                </p>
              </div>
              <form onSubmit={login}>
                <div className="field">
                  <label>Usuario</label>
                  <input
                    className="input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin"
                    autoFocus
                    autoComplete="username"
                  />
                </div>
                <div className="field">
                  <label>Contraseña</label>
                  <input
                    className="input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  {authError && (
                    <p
                      style={{
                        color: "var(--danger)",
                        fontSize: 12,
                        marginTop: 6,
                      }}
                    >
                      Usuario o contraseña incorrectos
                    </p>
                  )}
                </div>
                <button
                  className="btn btn-primary btn-full"
                  type="submit"
                  disabled={authLoading || !username || !password}
                >
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
          <div className="logo">
            Eva<span>Med</span>
          </div>
          <div style={{ fontSize: 11, opacity: 0.75, marginTop: 2 }}>
            {displayName}
            {" · "}
            <span
              style={{
                color:
                  userRole === "admin"
                    ? "#93c5fd"
                    : userRole === "evaluator"
                      ? "#fcd34d"
                      : "#86efac",
                fontWeight: 600,
              }}
            >
              {ROLE_LABELS[userRole]}
            </span>
          </div>
        </div>
        <button
          className="btn btn-ghost"
          style={{ fontSize: 12, padding: "6px 14px" }}
          onClick={logout}
        >
          Salir
        </button>
      </div>

      {/* Tabs — only admin can see Users tab */}
      {userRole === "admin" && (
        <div
          style={{
            borderBottom: "1px solid var(--border)",
            background: "white",
            padding: "0 16px",
          }}
        >
          <div className="container-wide" style={{ display: "flex", gap: 4 }}>
            {[
              { key: "evaluations", label: "📋 Evaluaciones" },
              { key: "users", label: "👥 Gestionar usuarios" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  padding: "12px 16px",
                  fontSize: 13,
                  fontWeight: tab === t.key ? 700 : 400,
                  color: tab === t.key ? "var(--primary)" : "var(--text3)",
                  borderBottom:
                    tab === t.key
                      ? "2px solid var(--primary)"
                      : "2px solid transparent",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  transition: "all .15s",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ padding: "24px 16px 60px" }}>
        <div className="container-wide">
          {/* ── Evaluations tab ─────────────────────────────────────────── */}
          {tab === "evaluations" && (
            <>
              {/* Create evaluation */}
              {
                <div
                  className="card"
                  style={{ padding: "24px", marginBottom: 24 }}
                >
                  <h2
                    style={{
                      fontSize: 16,
                      fontWeight: 800,
                      marginBottom: 20,
                      color: "var(--text1)",
                    }}
                  >
                    ➕ Nueva Evaluación
                  </h2>
                  <form onSubmit={createEval}>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 16,
                      }}
                    >
                      <div className="field">
                        <label>Nombre completo *</label>
                        <input
                          className="input"
                          value={form.candidate_name}
                          placeholder="Juan García"
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              candidate_name: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="field">
                        <label>Cédula de identidad</label>
                        <input
                          className="input"
                          value={form.candidate_id}
                          placeholder="0801-1990-12345"
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              candidate_id: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="field">
                        <label>Correo electrónico</label>
                        <input
                          className="input"
                          type="email"
                          value={form.candidate_email}
                          placeholder="juan@email.com"
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              candidate_email: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="field">
                        <label>Teléfono</label>
                        <input
                          className="input"
                          value={form.candidate_phone}
                          placeholder="+504 9999-9999"
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              candidate_phone: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="field">
                        <label>Cargo al que aplica</label>
                        <input
                          className="input"
                          value={form.position}
                          placeholder="Analista de Recursos Humanos"
                          onChange={(e) =>
                            setForm((f) => ({ ...f, position: e.target.value }))
                          }
                        />
                      </div>
                      <div className="field">
                        <label>Empresa</label>
                        <input
                          className="input"
                          value={form.company}
                          placeholder="Mi Empresa S.A."
                          onChange={(e) =>
                            setForm((f) => ({ ...f, company: e.target.value }))
                          }
                        />
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        alignItems: "center",
                        marginTop: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        className="btn btn-primary"
                        type="submit"
                        disabled={creating || !form.candidate_name.trim()}
                      >
                        {creating
                          ? "Creando..."
                          : "Generar enlace de evaluación"}
                      </button>
                      {createdLink && (
                        <div
                          style={{
                            flex: 1,
                            display: "flex",
                            gap: 10,
                            alignItems: "center",
                            background: "var(--success-bg)",
                            border: "1px solid #86efac",
                            borderRadius: 8,
                            padding: "10px 14px",
                            minWidth: 0,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 13,
                              color: "var(--success)",
                              fontWeight: 600,
                              flex: 1,
                              wordBreak: "break-all",
                            }}
                          >
                            {createdLink}
                          </span>
                          <button
                            className="btn btn-ghost"
                            style={{
                              fontSize: 12,
                              padding: "6px 12px",
                              whiteSpace: "nowrap",
                            }}
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
              }

              {/* Evaluations table */}
              <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <div
                  style={{
                    padding: "16px 20px",
                    borderBottom: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <h2
                    style={{
                      fontSize: 15,
                      fontWeight: 800,
                      color: "var(--text1)",
                      flex: 1,
                    }}
                  >
                    📋 Evaluaciones ({evaluations.length})
                  </h2>
                  <button
                    className="btn btn-ghost"
                    style={{ fontSize: 12, padding: "6px 14px" }}
                    onClick={loadList}
                  >
                    {listLoading ? "..." : "↻ Actualizar"}
                  </button>
                </div>

                {listLoading ? (
                  <div className="spinner" />
                ) : evaluations.length === 0 ? (
                  <div
                    style={{
                      padding: "40px 20px",
                      textAlign: "center",
                      color: "var(--text3)",
                    }}
                  >
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
                          {(userRole === "admin" ||
                            userRole === "evaluator") && <th>Resultado</th>}
                          <th>Fecha</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {evaluations.map((ev) => {
                          const link = `${window.location.origin}/eval/${ev.token}`;
                          const resultLink = `${window.location.origin}/result/${ev.token}`;
                          const vc = ev.verdict
                            ? VERDICT_COLORS[ev.verdict]
                            : null;
                          return (
                            <tr key={ev.id}>
                              <td>
                                <div style={{ fontWeight: 600, fontSize: 14 }}>
                                  {ev.candidate_name}
                                </div>
                                {ev.candidate_id && (
                                  <div
                                    style={{
                                      fontSize: 11,
                                      color: "var(--text3)",
                                      fontWeight: 600,
                                    }}
                                  >
                                    CI: {ev.candidate_id}
                                  </div>
                                )}
                                {ev.candidate_email && (
                                  <div
                                    style={{
                                      fontSize: 11,
                                      color: "var(--text4)",
                                    }}
                                  >
                                    {ev.candidate_email}
                                  </div>
                                )}
                              </td>
                              <td
                                style={{ fontSize: 13, color: "var(--text3)" }}
                              >
                                {ev.position || "—"}
                                <br />
                                <span style={{ fontSize: 12 }}>
                                  {ev.company || ""}
                                </span>
                              </td>
                              <td>
                                <span
                                  className={`pill ${STATUS_CLASS[ev.status]}`}
                                >
                                  {STATUS_LABELS[ev.status]}
                                </span>
                              </td>
                              {/* Results column — admin and evaluator roles */}
                              {(userRole === "admin" ||
                                userRole === "evaluator") && (
                                <td>
                                  {ev.overall_pct != null ? (
                                    <div>
                                      <div
                                        style={{
                                          fontWeight: 800,
                                          fontSize: 15,
                                        }}
                                      >
                                        {ev.overall_pct}%
                                      </div>
                                      {vc && (
                                        <span
                                          style={{
                                            fontSize: 10,
                                            fontWeight: 700,
                                            padding: "2px 8px",
                                            borderRadius: 99,
                                            background: vc.bg,
                                            color: vc.color,
                                            display: "inline-block",
                                            marginTop: 2,
                                          }}
                                        >
                                          {ev.verdict}
                                        </span>
                                      )}
                                      {userRole === "evaluator" && (
                                        <div style={{ marginTop: 6 }}>
                                          <a
                                            href={resultLink}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="btn btn-primary"
                                            style={{
                                              fontSize: 10,
                                              padding: "4px 8px",
                                            }}
                                          >
                                            Ver reporte
                                          </a>
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <span
                                      style={{
                                        color: "var(--text4)",
                                        fontSize: 13,
                                      }}
                                    >
                                      —
                                    </span>
                                  )}
                                </td>
                              )}
                              <td
                                style={{ fontSize: 12, color: "var(--text3)" }}
                              >
                                {new Date(ev.created_at).toLocaleDateString(
                                  "es",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                              </td>
                              <td>
                                <div
                                  style={{
                                    display: "flex",
                                    gap: 6,
                                    flexWrap: "wrap",
                                  }}
                                >
                                  <button
                                    className="btn btn-ghost"
                                    style={{
                                      fontSize: 11,
                                      padding: "5px 10px",
                                    }}
                                    onClick={() =>
                                      handleCopy(link, `link-${ev.id}`)
                                    }
                                  >
                                    {copied === `link-${ev.id}` ? "✓" : "📋"}{" "}
                                    Link
                                  </button>
                                  {/* Ver resultado — admin and evaluators */}
                                  {(userRole === "admin" ||
                                    userRole === "evaluator") &&
                                    ev.status === "completed" && (
                                      <a
                                        href={resultLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn btn-primary"
                                        style={{
                                          fontSize: 11,
                                          padding: "5px 10px",
                                        }}
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
            </>
          )}

          {/* ── Users tab (admin only) ────────────────────────────────── */}
          {tab === "users" && userRole === "admin" && (
            <>
              {/* Create user form */}
              <div
                className="card"
                style={{ padding: "24px", marginBottom: 24 }}
              >
                <h2
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    marginBottom: 20,
                    color: "var(--text1)",
                  }}
                >
                  👤 Nuevo usuario
                </h2>
                <form onSubmit={handleCreateUser}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 16,
                    }}
                  >
                    <div className="field">
                      <label>Usuario (login) *</label>
                      <input
                        className="input"
                        value={userForm.username}
                        placeholder="rrhh"
                        onChange={(e) =>
                          setUserForm((f) => ({
                            ...f,
                            username: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="field">
                      <label>Nombre para mostrar</label>
                      <input
                        className="input"
                        value={userForm.display_name}
                        placeholder="María López"
                        onChange={(e) =>
                          setUserForm((f) => ({
                            ...f,
                            display_name: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="field">
                      <label>Contraseña *</label>
                      <input
                        className="input"
                        type="password"
                        value={userForm.password}
                        placeholder="••••••••"
                        onChange={(e) =>
                          setUserForm((f) => ({
                            ...f,
                            password: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="field">
                      <label>Rol</label>
                      <select
                        className="input"
                        value={userForm.role}
                        onChange={(e) =>
                          setUserForm((f) => ({ ...f, role: e.target.value }))
                        }
                      >
                        <option value="creator">
                          Solo creación (no ve resultados)
                        </option>
                        <option value="evaluator">Evaluador</option>
                        <option value="admin">Administrador completo</option>
                      </select>
                    </div>
                  </div>
                  {userError && (
                    <p
                      style={{
                        color: "var(--danger)",
                        fontSize: 12,
                        marginTop: 8,
                      }}
                    >
                      {userError}
                    </p>
                  )}
                  <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={creatingUser}
                    style={{ marginTop: 8 }}
                  >
                    {creatingUser ? "Creando..." : "Crear usuario"}
                  </button>
                </form>
              </div>

              {/* Users list */}
              <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <div
                  style={{
                    padding: "16px 20px",
                    borderBottom: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <h2
                    style={{
                      fontSize: 15,
                      fontWeight: 800,
                      color: "var(--text1)",
                      flex: 1,
                    }}
                  >
                    👥 Usuarios ({adminUsers.length})
                  </h2>
                  <button
                    className="btn btn-ghost"
                    style={{ fontSize: 12, padding: "6px 14px" }}
                    onClick={loadUsers}
                  >
                    {usersLoading ? "..." : "↻ Actualizar"}
                  </button>
                </div>
                {usersLoading ? (
                  <div className="spinner" />
                ) : (
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Usuario</th>
                          <th>Rol</th>
                          <th>Creado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {adminUsers.map((u) => (
                          <tr key={u.id}>
                            <td>
                              <div style={{ fontWeight: 600, fontSize: 14 }}>
                                {u.display_name}
                              </div>
                              <div
                                style={{ fontSize: 11, color: "var(--text4)" }}
                              >
                                @{u.username}
                              </div>
                            </td>
                            <td>
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 700,
                                  padding: "3px 10px",
                                  borderRadius: 99,
                                  background:
                                    u.role === "admin"
                                      ? "#dbeafe"
                                      : u.role === "evaluator"
                                        ? "#fef9c3"
                                        : "#dcfce7",
                                  color:
                                    u.role === "admin"
                                      ? "#1e40af"
                                      : u.role === "evaluator"
                                        ? "#854d0e"
                                        : "#166534",
                                }}
                              >
                                {ROLE_LABELS[u.role]}
                              </span>
                            </td>
                            <td style={{ fontSize: 12, color: "var(--text3)" }}>
                              {u.created_at
                                ? new Date(u.created_at).toLocaleDateString(
                                    "es",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    },
                                  )
                                : "—"}
                            </td>
                            <td>
                              {u.id !== currentUserId ? (
                                <button
                                  className="btn btn-ghost"
                                  style={{
                                    fontSize: 11,
                                    padding: "5px 10px",
                                    color: "var(--danger)",
                                  }}
                                  onClick={() => handleDeleteUser(u.id)}
                                >
                                  Eliminar
                                </button>
                              ) : (
                                <span
                                  style={{
                                    fontSize: 11,
                                    color: "var(--text4)",
                                  }}
                                >
                                  Tú
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

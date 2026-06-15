import { useState } from "react";
import { api } from "../api.js";
import { CATALOGO, GRUPOS } from "../catalogo.js";

// Genera un prompt profesional para que una IA cree una propuesta de contenido
// para un recurso, usando la marca + briefing + definición del día.
export default function PromptIA({ programaId, numero, onClose }) {
  const [tipo, setTipo] = useState("reflexion");
  const [titulo, setTitulo] = useState("");
  const [prompt, setPrompt] = useState("");
  const [cargando, setCargando] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const generar = async () => {
    setCargando(true);
    try {
      const { prompt } = await api.post("/ia/prompt", { programaId, numero, tipo, titulo });
      setPrompt(prompt);
      setCopiado(false);
    } finally {
      setCargando(false);
    }
  };

  const copiar = async () => {
    try { await navigator.clipboard.writeText(prompt); setCopiado(true); } catch { /* ignore */ }
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div className="card fade-in" style={modal} onClick={(e) => e.stopPropagation()}>
        <div className="row between" style={{ marginBottom: 12 }}>
          <strong>🪄 Prompt IA — Día {numero}</strong>
          <button className="btn btn-sm btn-ghost" style={{ width: "auto" }} onClick={onClose}>✕</button>
        </div>
        <p className="muted" style={{ fontSize: 13, marginTop: 0 }}>
          Arma un prompt listo para crear/buscar contenido según la marca y el briefing del cliente.
        </p>

        <div className="row" style={{ gap: 10 }}>
          <div className="field" style={{ flex: 1, margin: 0 }}>
            <label>Tipo de recurso</label>
            <select className="input" value={tipo} onChange={(e) => setTipo(e.target.value)}>
              {GRUPOS.map((g) => (
                <optgroup key={g} label={g}>
                  {Object.entries(CATALOGO).filter(([, m]) => m.grupo === g).map(([t, m]) => (
                    <option key={t} value={t}>{m.icon} {m.label}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>
        <div className="field">
          <label>Título de trabajo (opcional)</label>
          <input className="input" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
        </div>

        <button className="btn" onClick={generar} disabled={cargando}>
          {cargando ? "Generando…" : "Generar prompt"}
        </button>

        {prompt && (
          <div className="fade-in" style={{ marginTop: 16 }}>
            <div className="row between" style={{ marginBottom: 6 }}>
              <span className="eyebrow" style={{ margin: 0 }}>Prompt</span>
              <button className="btn btn-sm" style={{ width: "auto", background: copiado ? "var(--verde)" : undefined }} onClick={copiar}>
                {copiado ? "✓ Copiado" : "Copiar"}
              </button>
            </div>
            <pre className="card-soft mono" style={{ whiteSpace: "pre-wrap", fontSize: 12, padding: 14, borderRadius: 12, maxHeight: 300, overflow: "auto" }}>
              {prompt}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed", inset: 0, background: "rgba(19,21,42,0.45)",
  display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 50,
};
const modal = { width: "100%", maxWidth: 540, maxHeight: "90vh", overflow: "auto" };

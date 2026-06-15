import { useState } from "react";
import { api } from "../api.js";

// Editor del "manual de marca mínimo" + briefing del cliente.
export default function MarcaEditor({ programa, onSaved }) {
  const [abierto, setAbierto] = useState(false);
  const [f, setF] = useState(() => pick(programa));
  const [guardando, setGuardando] = useState(false);
  const [ok, setOk] = useState(false);

  const set = (k) => (e) => { setF({ ...f, [k]: e.target.value }); setOk(false); };

  const subirLogo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setF({ ...f, logoData: reader.result }); setOk(false); };
    reader.readAsDataURL(file);
  };

  const guardar = async () => {
    setGuardando(true);
    try {
      const { programa: p } = await api.put(`/programas/${programa.id}`, f);
      setOk(true);
      onSaved?.(p);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <button className="row between" style={{ width: "100%", background: "none", border: "none", padding: 0 }}
        onClick={() => setAbierto(!abierto)}>
        <strong>🎨 Marca y briefing del cliente</strong>
        <span className="muted">{abierto ? "▲" : "▼"}</span>
      </button>

      {abierto && (
        <div className="fade-in" style={{ marginTop: 16 }}>
          {/* Logo */}
          <div className="field">
            <label>Logo del cliente</label>
            <div className="row" style={{ gap: 14 }}>
              <div style={{ width: 64, height: 64, borderRadius: 12, border: "1.5px dashed var(--borde)", display: "grid", placeItems: "center", overflow: "hidden", background: "var(--surface)" }}>
                {f.logoData ? <img src={f.logoData} alt="logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : <span className="muted" style={{ fontSize: 11 }}>sin logo</span>}
              </div>
              <label className="btn btn-sm btn-ghost" style={{ width: "auto" }}>
                Subir imagen
                <input type="file" accept="image/*" onChange={subirLogo} style={{ display: "none" }} />
              </label>
              {f.logoData && (
                <button className="btn btn-sm btn-ghost" style={{ width: "auto" }} onClick={() => setF({ ...f, logoData: "" })}>Quitar</button>
              )}
            </div>
          </div>

          {/* Colores */}
          <div className="field">
            <label>Colores de marca</label>
            <div className="row" style={{ gap: 10 }}>
              <Color label="Primario" value={f.colorPrimario} onChange={set("colorPrimario")} />
              <Color label="Secundario" value={f.colorSecundario} onChange={set("colorSecundario")} />
              <Color label="Acento" value={f.colorAcento} onChange={set("colorAcento")} />
            </div>
          </div>

          <div className="field">
            <label>Tipografía</label>
            <input className="input" placeholder="Ej: Nunito Sans" value={f.tipografia || ""} onChange={set("tipografia")} />
          </div>
          <div className="field">
            <label>Notas del manual de marca</label>
            <textarea className="textarea" style={{ minHeight: 70 }} placeholder="Link al manual, reglas de uso, estilo…" value={f.manualNotas || ""} onChange={set("manualNotas")} />
          </div>

          <hr style={{ border: "none", borderTop: "1px solid var(--borde)", margin: "8px 0 18px" }} />
          <p className="eyebrow" style={{ margin: "0 0 12px" }}>Briefing (alimenta a la IA)</p>

          <div className="field">
            <label>Público objetivo</label>
            <input className="input" value={f.publicoObjetivo || ""} onChange={set("publicoObjetivo")} />
          </div>
          <div className="field">
            <label>Tono de comunicación</label>
            <input className="input" value={f.tono || ""} onChange={set("tono")} />
          </div>
          <div className="field">
            <label>Objetivo general</label>
            <input className="input" value={f.objetivoGeneral || ""} onChange={set("objetivoGeneral")} />
          </div>
          <div className="field">
            <label>¿Qué se quiere transmitir?</label>
            <textarea className="textarea" value={f.briefing || ""} onChange={set("briefing")} />
          </div>

          <button className="btn" onClick={guardar} disabled={guardando} style={{ background: ok ? "var(--verde)" : undefined }}>
            {ok ? "✓ Guardado" : guardando ? "Guardando…" : "Guardar marca y briefing"}
          </button>
        </div>
      )}
    </div>
  );
}

const Color = ({ label, value, onChange }) => (
  <div style={{ flex: 1 }}>
    <div className="muted" style={{ fontSize: 11, marginBottom: 4 }}>{label}</div>
    <div className="row" style={{ gap: 6 }}>
      <input type="color" value={value || "#1B56D6"} onChange={onChange} style={{ width: 36, height: 36, border: "none", background: "none", padding: 0 }} />
      <input className="input mono" style={{ padding: "8px 10px", fontSize: 12 }} value={value || ""} onChange={onChange} placeholder="#______" />
    </div>
  </div>
);

const pick = (p) => ({
  logoData: p.logoData || "",
  colorPrimario: p.colorPrimario || "",
  colorSecundario: p.colorSecundario || "",
  colorAcento: p.colorAcento || "",
  tipografia: p.tipografia || "",
  manualNotas: p.manualNotas || "",
  publicoObjetivo: p.publicoObjetivo || "",
  tono: p.tono || "",
  objetivoGeneral: p.objetivoGeneral || "",
  briefing: p.briefing || "",
});

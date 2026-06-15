import { useState } from "react";

// Config por defecto al crear un recurso de cada tipo.
export function configInicial(tipo) {
  switch (tipo) {
    case "lectura": return { texto: "", autor: "" };
    case "video": return { url: "" };
    case "audio": return { url: "" };
    case "imagen": return { url: "", alt: "" };
    case "meditacion": return { instrucciones: "", duracionSeg: 120 };
    case "reflexion": return { consigna: "" };
    case "compromiso": return { plantilla: "Si ____, entonces yo ____." };
    case "reto": return { texto: "" };
    case "checklist": return { opciones: ["", ""] };
    case "escala": return { min: 1, max: 5, etiquetaMin: "", etiquetaMax: "" };
    case "selector_foco": return { opciones: [{ id: "a", label: "", desc: "", color: "#1B56D6" }] };
    case "formulario": return { pasos: [{ label: "", placeholder: "" }] };
    case "quiz": return { preguntas: [{ pregunta: "", opciones: ["", ""], correcta: 0 }] };
    case "flashcards": return { tarjetas: [{ frente: "", dorso: "" }] };
    default: return {};
  }
}

const Campo = ({ label, children }) => (
  <div className="field"><label>{label}</label>{children}</div>
);

export default function ConfigEditor({ tipo, config, onChange }) {
  const set = (patch) => onChange({ ...config, ...patch });

  switch (tipo) {
    case "lectura":
      return (
        <>
          <Campo label="Texto / frase">
            <textarea className="textarea" value={config.texto || ""} onChange={(e) => set({ texto: e.target.value })} />
          </Campo>
          <Campo label="Autor (opcional)">
            <input className="input" value={config.autor || ""} onChange={(e) => set({ autor: e.target.value })} />
          </Campo>
        </>
      );

    case "video":
    case "audio":
    case "imagen":
      return (
        <Campo label={tipo === "imagen" ? "URL de la imagen" : tipo === "audio" ? "URL del audio (mp3)" : "URL del video (embed)"}>
          <input className="input mono" placeholder="https://…" value={config.url || ""} onChange={(e) => set({ url: e.target.value })} />
        </Campo>
      );

    case "meditacion":
      return (
        <>
          <Campo label="Instrucciones">
            <textarea className="textarea" value={config.instrucciones || ""} onChange={(e) => set({ instrucciones: e.target.value })} />
          </Campo>
          <Campo label="Duración (segundos)">
            <input className="input" type="number" value={config.duracionSeg || 120} onChange={(e) => set({ duracionSeg: +e.target.value })} />
          </Campo>
        </>
      );

    case "reflexion":
      return (
        <Campo label="Consigna">
          <input className="input" value={config.consigna || ""} onChange={(e) => set({ consigna: e.target.value })} />
        </Campo>
      );

    case "compromiso":
      return (
        <Campo label="Plantilla">
          <input className="input" value={config.plantilla || ""} onChange={(e) => set({ plantilla: e.target.value })} />
        </Campo>
      );

    case "reto":
      return (
        <Campo label="Texto del reto">
          <textarea className="textarea" value={config.texto || ""} onChange={(e) => set({ texto: e.target.value })} />
        </Campo>
      );

    case "checklist":
      return (
        <Campo label="Opciones (una por línea)">
          <textarea className="textarea" value={(config.opciones || []).join("\n")}
            onChange={(e) => set({ opciones: e.target.value.split("\n").filter((x) => x.trim()) })} />
        </Campo>
      );

    case "escala":
      return (
        <>
          <div className="row" style={{ gap: 12 }}>
            <Campo label="Mínimo"><input className="input" type="number" value={config.min ?? 1} onChange={(e) => set({ min: +e.target.value })} /></Campo>
            <Campo label="Máximo"><input className="input" type="number" value={config.max ?? 5} onChange={(e) => set({ max: +e.target.value })} /></Campo>
          </div>
          <Campo label="Etiqueta mínima"><input className="input" value={config.etiquetaMin || ""} onChange={(e) => set({ etiquetaMin: e.target.value })} /></Campo>
          <Campo label="Etiqueta máxima"><input className="input" value={config.etiquetaMax || ""} onChange={(e) => set({ etiquetaMax: e.target.value })} /></Campo>
        </>
      );

    default:
      return <JsonEditor config={config} onChange={onChange} />;
  }
}

// Editor JSON para tipos avanzados (selector_foco, formulario, quiz, flashcards…)
function JsonEditor({ config, onChange }) {
  const [texto, setTexto] = useState(JSON.stringify(config, null, 2));
  const [error, setError] = useState("");
  return (
    <Campo label="Configuración (JSON)">
      <textarea className="textarea mono" style={{ minHeight: 160, fontSize: 13 }} value={texto}
        onChange={(e) => {
          setTexto(e.target.value);
          try { onChange(JSON.parse(e.target.value)); setError(""); }
          catch { setError("JSON inválido"); }
        }} />
      {error && <span style={{ color: "var(--rojo)", fontSize: 12 }}>{error}</span>}
    </Campo>
  );
}

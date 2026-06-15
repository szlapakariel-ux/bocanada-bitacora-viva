import { useEffect, useRef, useState } from "react";
import { tipoMeta } from "../catalogo.js";

// Renderiza un bloque del recorrido según su tipo y captura la respuesta.
export default function Bloque({ bloque, onGuardar }) {
  const meta = tipoMeta(bloque.tipo);
  const [valor, setValor] = useState(() => inicial(bloque));
  const [guardado, setGuardado] = useState(!!bloque.respuesta);
  const [guardando, setGuardando] = useState(false);

  const guardar = async () => {
    setGuardando(true);
    try {
      await onGuardar(bloque.id, valor);
      setGuardado(true);
    } finally {
      setGuardando(false);
    }
  };

  const Cuerpo = RENDERERS[bloque.tipo] || RENDERERS._default;

  return (
    <div className="card fade-in" style={{ marginBottom: 18 }}>
      <div className="row" style={{ gap: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 22 }}>{meta.icon}</span>
        <div>
          <strong>{bloque.titulo}</strong>
          {bloque.descripcion && (
            <div className="muted" style={{ fontSize: 13 }}>{bloque.descripcion}</div>
          )}
        </div>
      </div>

      <Cuerpo config={bloque.config} valor={valor} setValor={setValor} />

      <button
        className="btn btn-sm"
        style={{ width: "100%", marginTop: 18, background: guardado ? "var(--verde)" : undefined }}
        onClick={guardar}
        disabled={guardando}
      >
        {guardado ? "✓ Guardado" : guardando ? "Guardando…" : "Guardar"}
      </button>
    </div>
  );
}

// Valor inicial según respuesta previa o por tipo
function inicial(b) {
  if (b.respuesta) return b.respuesta;
  switch (b.tipo) {
    case "checklist": return { seleccion: [] };
    case "selector_foco": return { opcion: null };
    case "escala": return { valor: null };
    case "formulario": return { campos: (b.config.pasos || []).map(() => "") };
    case "quiz": return { respuestas: {}, puntaje: 0 };
    case "reflexion":
    case "compromiso":
    case "voz": return { texto: "" };
    default: return { visto: false };
  }
}

/* ── Renderers por tipo ───────────────────────────────────────── */
const RENDERERS = {
  lectura: ({ config }) => (
    <blockquote style={{ margin: 0, fontSize: 22, fontWeight: 800, lineHeight: 1.25 }}>
      “{config.texto}”
      {config.autor && <footer className="muted mono" style={{ fontSize: 13, marginTop: 10 }}>— {config.autor}</footer>}
    </blockquote>
  ),

  video: ({ config }) => (
    <div style={{ position: "relative", paddingTop: "56%", borderRadius: 12, overflow: "hidden" }}>
      <iframe
        src={config.url}
        title="video"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
      />
    </div>
  ),

  audio: ({ config }) => <audio controls src={config.url} style={{ width: "100%" }} />,

  imagen: ({ config }) => (
    <img src={config.url} alt={config.alt || ""} style={{ width: "100%", borderRadius: 12 }} />
  ),

  meditacion: ({ config }) => <Meditacion config={config} />,

  reflexion: ({ config, valor, setValor }) => (
    <textarea
      className="textarea"
      placeholder={config.consigna || "Escribí lo que surja…"}
      value={valor.texto || ""}
      onChange={(e) => setValor({ texto: e.target.value })}
    />
  ),

  compromiso: ({ config, valor, setValor }) => (
    <>
      <p className="muted mono" style={{ fontSize: 13, marginTop: 0 }}>{config.plantilla}</p>
      <textarea
        className="textarea"
        placeholder="Escribí tu compromiso…"
        value={valor.texto || ""}
        onChange={(e) => setValor({ texto: e.target.value })}
      />
    </>
  ),

  voz: ({ valor, setValor }) => (
    <textarea
      className="textarea"
      placeholder="Grabá una nota mental y escribila acá en una línea…"
      value={valor.texto || ""}
      onChange={(e) => setValor({ texto: e.target.value })}
    />
  ),

  checklist: ({ config, valor, setValor }) => {
    const sel = valor.seleccion || [];
    const toggle = (op) =>
      setValor({ seleccion: sel.includes(op) ? sel.filter((x) => x !== op) : [...sel, op] });
    return (
      <div className="stack">
        {(config.opciones || []).map((op) => {
          const on = sel.includes(op);
          return (
            <button
              key={op}
              type="button"
              className="card-soft card row between"
              onClick={() => toggle(op)}
              style={{ textAlign: "left", border: on ? "1.5px solid var(--azul)" : "1.5px solid transparent", background: on ? "var(--azul-suave)" : "var(--surface)" }}
            >
              <span>{op}</span>
              <span className="mono" style={{ color: on ? "var(--azul)" : "var(--muted)" }}>{on ? "✓" : "+"}</span>
            </button>
          );
        })}
      </div>
    );
  },

  selector_foco: ({ config, valor, setValor }) => (
    <div className="stack">
      {(config.opciones || []).map((op) => {
        const on = valor.opcion === op.id;
        return (
          <button
            key={op.id}
            type="button"
            onClick={() => setValor({ opcion: op.id })}
            className="card"
            style={{
              textAlign: "left",
              borderColor: on ? op.color : "var(--borde)",
              borderWidth: on ? 2 : 1.5,
              background: on ? "var(--surface)" : "var(--blanco)",
            }}
          >
            <div className="row" style={{ gap: 10 }}>
              <span style={{ width: 12, height: 12, borderRadius: 99, background: op.color }} />
              <strong>{op.label}</strong>
            </div>
            <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>{op.desc}</div>
          </button>
        );
      })}
    </div>
  ),

  escala: ({ config, valor, setValor }) => {
    const min = config.min ?? 1, max = config.max ?? 5;
    const nums = Array.from({ length: max - min + 1 }, (_, i) => min + i);
    return (
      <>
        <div className="row" style={{ gap: 8, justifyContent: "space-between" }}>
          {nums.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setValor({ valor: n })}
              className="mono"
              style={{
                flex: 1,
                aspectRatio: "1",
                borderRadius: 12,
                border: "1.5px solid var(--borde)",
                fontWeight: 700,
                fontSize: 18,
                background: valor.valor === n ? "var(--azul)" : "var(--blanco)",
                color: valor.valor === n ? "#fff" : "var(--tinta)",
              }}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="row between muted" style={{ fontSize: 12, marginTop: 8 }}>
          <span>{config.etiquetaMin}</span><span>{config.etiquetaMax}</span>
        </div>
      </>
    );
  },

  formulario: ({ config, valor, setValor }) => (
    <div className="stack">
      {(config.pasos || []).map((paso, i) => (
        <div key={i} className="field" style={{ marginBottom: 0 }}>
          <label>{i + 1}. {paso.label}</label>
          <textarea
            className="textarea"
            style={{ minHeight: 80 }}
            placeholder={paso.placeholder || ""}
            value={valor.campos?.[i] || ""}
            onChange={(e) => {
              const campos = [...(valor.campos || [])];
              campos[i] = e.target.value;
              setValor({ campos });
            }}
          />
        </div>
      ))}
    </div>
  ),

  quiz: ({ config, valor, setValor }) => {
    const preguntas = config.preguntas || [];
    const elegir = (qi, oi) => {
      const respuestas = { ...valor.respuestas, [qi]: oi };
      const correctas = preguntas.filter((q, i) => respuestas[i] === q.correcta).length;
      setValor({ respuestas, puntaje: Math.round((correctas / preguntas.length) * 100) });
    };
    return (
      <div className="stack">
        {preguntas.map((q, qi) => (
          <div key={qi} className="card-soft card">
            <strong style={{ fontSize: 15 }}>{q.pregunta}</strong>
            <div className="stack" style={{ marginTop: 10 }}>
              {q.opciones.map((op, oi) => {
                const on = valor.respuestas?.[qi] === oi;
                return (
                  <button key={oi} type="button" onClick={() => elegir(qi, oi)}
                    className="btn btn-sm btn-ghost"
                    style={{ width: "100%", justifyContent: "flex-start", borderColor: on ? "var(--azul)" : "var(--borde)", background: on ? "var(--azul-suave)" : "#fff" }}>
                    {op}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  },

  flashcards: ({ config }) => <Flashcards config={config} />,

  clasificar: ({ config }) => (
    <p className="muted">{config.consigna || "Ordená los conceptos en el orden correcto."}</p>
  ),

  reto: ({ config, valor, setValor }) => (
    <button type="button" onClick={() => setValor({ visto: !valor.visto })}
      className="card-soft card row between" style={{ textAlign: "left", width: "100%", border: valor.visto ? "1.5px solid var(--verde)" : "1.5px solid transparent" }}>
      <span>{config.texto}</span>
      <span className="mono">{valor.visto ? "✓ Lo hice" : "Marcar"}</span>
    </button>
  ),

  _default: ({ config }) => <p className="muted">{config.texto || "Contenido."}</p>,
};

function Meditacion({ config }) {
  const total = config.duracionSeg || 120;
  const [seg, setSeg] = useState(0);
  const [corriendo, setCorriendo] = useState(false);
  const ref = useRef();
  useEffect(() => () => clearInterval(ref.current), []);
  const toggle = () => {
    if (corriendo) { clearInterval(ref.current); setCorriendo(false); }
    else {
      setCorriendo(true);
      ref.current = setInterval(() => setSeg((s) => (s + 1 >= total ? (clearInterval(ref.current), setCorriendo(false), total) : s + 1)), 1000);
    }
  };
  const pct = Math.round((seg / total) * 100);
  return (
    <div>
      <p className="muted">{config.instrucciones}</p>
      <div style={{ height: 6, borderRadius: 99, background: "var(--surface)", overflow: "hidden", margin: "14px 0" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: "var(--azul)", transition: "width 1s linear" }} />
      </div>
      <div className="row between">
        <span className="mono muted">{fmt(seg)} / {fmt(total)}</span>
        <button type="button" className="btn btn-sm" style={{ width: "auto" }} onClick={toggle}>
          {corriendo ? "Pausar" : seg >= total ? "Repetir" : "Empezar"}
        </button>
      </div>
    </div>
  );
}
const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

function Flashcards({ config }) {
  const [i, setI] = useState(0);
  const [flip, setFlip] = useState(false);
  const cards = config.tarjetas || [];
  if (!cards.length) return null;
  const c = cards[i];
  return (
    <div>
      <button type="button" onClick={() => setFlip(!flip)}
        className="card-soft card" style={{ width: "100%", minHeight: 120, display: "grid", placeItems: "center", textAlign: "center", fontSize: flip ? 16 : 22, fontWeight: 800 }}>
        {flip ? c.dorso : c.frente}
      </button>
      <div className="row between" style={{ marginTop: 12 }}>
        <span className="mono muted">{i + 1}/{cards.length}</span>
        <button type="button" className="btn btn-sm" style={{ width: "auto" }}
          onClick={() => { setFlip(false); setI((i + 1) % cards.length); }}>
          Siguiente →
        </button>
      </div>
    </div>
  );
}

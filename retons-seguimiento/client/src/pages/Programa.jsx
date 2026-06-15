import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api.js";
import { tipoMeta } from "../catalogo.js";
import MarcaEditor from "../components/MarcaEditor.jsx";
import PromptIA from "../components/PromptIA.jsx";

export default function Programa() {
  const { id } = useParams();
  const [programa, setPrograma] = useState(null);
  const [recursos, setRecursos] = useState([]);
  const [eligiendo, setEligiendo] = useState(null); // número de día (asignar recurso)
  const [editandoDia, setEditandoDia] = useState(null); // { numero, titulo, tema, intencion }
  const [promptDia, setPromptDia] = useState(null); // número de día (modal IA)
  const [aviso, setAviso] = useState("");

  const cargar = () =>
    Promise.all([
      api.get(`/programas/${id}`).then((d) => setPrograma(d.programa)),
      api.get("/recursos").then((d) => setRecursos(d.recursos)),
    ]);
  useEffect(() => { cargar(); }, [id]);

  const asignar = async (numero, recursoId) => {
    try {
      await api.post(`/programas/${id}/dias/${numero}/bloques`, { recursoId });
      setEligiendo(null);
      setAviso("");
      cargar();
    } catch (err) {
      setAviso(err.message);
    }
  };

  const quitar = async (bloqueId) => {
    await api.del(`/programas/bloques/${bloqueId}`);
    cargar();
  };

  const toggleMulti = async () => {
    const { programa: p } = await api.put(`/programas/${id}`, { multiPorDia: !programa.multiPorDia });
    setPrograma({ ...programa, multiPorDia: p.multiPorDia });
  };

  const guardarDia = async () => {
    const { numero, titulo, tema, intencion } = editandoDia;
    await api.put(`/programas/${id}/dias/${numero}`, { titulo, tema, intencion });
    setEditandoDia(null);
    cargar();
  };

  if (!programa) return <div className="app center-screen pad muted">Cargando…</div>;

  return (
    <div className="app app-wide">
      <div className="topbar">
        <Link to="/formador" style={{ textDecoration: "none", color: "inherit" }}>← Panel</Link>
        <Link to={`/formador/programa/${id}/panel`} className="pill" style={{ textDecoration: "none" }}>📈 Ver pulso</Link>
      </div>

      <div className="pad grow">
        <p className="eyebrow">Constructor</p>
        <h1>{programa.nombre}</h1>

        <div className="card card-soft row between" style={{ marginBottom: 12 }}>
          <div>
            <div className="muted" style={{ fontSize: 12 }}>Código de acceso</div>
            <strong className="mono" style={{ fontSize: 20, letterSpacing: 2 }}>{programa.codigoAcceso}</strong>
          </div>
          <span className="muted" style={{ fontSize: 13, maxWidth: 160, textAlign: "right" }}>
            Compartilo con los participantes
          </span>
        </div>

        <label className="card row between" style={{ marginBottom: 16 }}>
          <div>
            <strong>Multi-recurso por día</strong>
            <div className="muted" style={{ fontSize: 13 }}>Premium · permite más de un recurso diario</div>
          </div>
          <input type="checkbox" checked={programa.multiPorDia} onChange={toggleMulti} style={{ transform: "scale(1.4)" }} />
        </label>

        <MarcaEditor programa={programa} onSaved={(p) => setPrograma({ ...programa, ...p })} />

        {aviso && <div className="error-msg">{aviso}</div>}

        <div className="stack">
          {programa.dias.map((dia) => (
            <div key={dia.id} className="card">
              <div className="row between" style={{ marginBottom: 4 }}>
                <strong>Día {dia.numero}{dia.titulo ? ` · ${dia.titulo}` : ""}</strong>
                <span className="muted mono" style={{ fontSize: 12 }}>
                  {dia.bloques.length} recurso{dia.bloques.length !== 1 ? "s" : ""}
                </span>
              </div>
              {dia.tema && <div className="muted" style={{ fontSize: 13, marginBottom: 4 }}>🎯 {dia.tema}</div>}
              {dia.intencion && <div className="muted" style={{ fontSize: 12, marginBottom: 10, fontStyle: "italic" }}>{dia.intencion}</div>}

              <div className="row" style={{ gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                <button className="btn btn-sm btn-ghost" style={{ width: "auto" }}
                  onClick={() => setEditandoDia({ numero: dia.numero, titulo: dia.titulo || "", tema: dia.tema || "", intencion: dia.intencion || "" })}>
                  ✏️ Definir día
                </button>
                <button className="btn btn-sm btn-ghost" style={{ width: "auto" }} onClick={() => setPromptDia(dia.numero)}>
                  🪄 Prompt IA
                </button>
              </div>

              {editandoDia?.numero === dia.numero && (
                <div className="card-soft card fade-in" style={{ marginBottom: 12 }}>
                  <div className="field" style={{ marginBottom: 10 }}>
                    <label>Nombre del día</label>
                    <input className="input" value={editandoDia.titulo} onChange={(e) => setEditandoDia({ ...editandoDia, titulo: e.target.value })} />
                  </div>
                  <div className="field" style={{ marginBottom: 10 }}>
                    <label>Tema a tratar</label>
                    <input className="input" value={editandoDia.tema} onChange={(e) => setEditandoDia({ ...editandoDia, tema: e.target.value })} />
                  </div>
                  <div className="field" style={{ marginBottom: 10 }}>
                    <label>¿Qué se quiere transmitir?</label>
                    <textarea className="textarea" style={{ minHeight: 60 }} value={editandoDia.intencion} onChange={(e) => setEditandoDia({ ...editandoDia, intencion: e.target.value })} />
                  </div>
                  <div className="row" style={{ gap: 10 }}>
                    <button className="btn btn-sm" style={{ width: "auto" }} onClick={guardarDia}>Guardar</button>
                    <button className="btn btn-sm btn-ghost" style={{ width: "auto" }} onClick={() => setEditandoDia(null)}>Cancelar</button>
                  </div>
                </div>
              )}

              <div className="stack">
                {dia.bloques.map((b) => (
                  <div key={b.id} className="card-soft card row between">
                    <span>{tipoMeta(b.recurso.tipo).icon} {b.recurso.titulo}</span>
                    <button className="btn btn-sm btn-ghost" style={{ width: "auto" }} onClick={() => quitar(b.id)}>✕</button>
                  </div>
                ))}
              </div>

              {eligiendo === dia.numero ? (
                <div className="card-soft card" style={{ marginTop: 12 }}>
                  <div className="row between" style={{ marginBottom: 8 }}>
                    <strong style={{ fontSize: 14 }}>Elegí un recurso</strong>
                    <button className="btn btn-sm btn-ghost" style={{ width: "auto" }} onClick={() => setEligiendo(null)}>✕</button>
                  </div>
                  {recursos.length === 0 && (
                    <p className="muted" style={{ fontSize: 13 }}>
                      No tenés recursos. <Link to="/formador/biblioteca">Creá uno</Link>.
                    </p>
                  )}
                  <div className="stack">
                    {recursos.map((r) => (
                      <button key={r.id} className="btn btn-sm btn-ghost" style={{ width: "100%", justifyContent: "flex-start" }}
                        onClick={() => asignar(dia.numero, r.id)}>
                        {tipoMeta(r.tipo).icon} {r.titulo}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <button className="btn btn-sm btn-ghost" style={{ marginTop: 12 }} onClick={() => { setEligiendo(dia.numero); setAviso(""); }}>
                  + Asignar recurso
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {promptDia !== null && (
        <PromptIA programaId={id} numero={promptDia} onClose={() => setPromptDia(null)} />
      )}
    </div>
  );
}

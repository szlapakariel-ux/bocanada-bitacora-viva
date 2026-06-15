import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api.js";
import { tipoMeta } from "../catalogo.js";

export default function Programa() {
  const { id } = useParams();
  const [programa, setPrograma] = useState(null);
  const [recursos, setRecursos] = useState([]);
  const [eligiendo, setEligiendo] = useState(null); // número de día
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

        <label className="card row between" style={{ marginBottom: 24 }}>
          <div>
            <strong>Multi-recurso por día</strong>
            <div className="muted" style={{ fontSize: 13 }}>Premium · permite más de un recurso diario</div>
          </div>
          <input type="checkbox" checked={programa.multiPorDia} onChange={toggleMulti} style={{ transform: "scale(1.4)" }} />
        </label>

        {aviso && <div className="error-msg">{aviso}</div>}

        <div className="stack">
          {programa.dias.map((dia) => (
            <div key={dia.id} className="card">
              <div className="row between" style={{ marginBottom: 12 }}>
                <strong>Día {dia.numero}</strong>
                <span className="muted mono" style={{ fontSize: 12 }}>
                  {dia.bloques.length} recurso{dia.bloques.length !== 1 ? "s" : ""}
                </span>
              </div>

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
    </div>
  );
}

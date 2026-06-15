import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { CATALOGO, GRUPOS, tipoMeta } from "../catalogo.js";
import ConfigEditor, { configInicial } from "../components/ConfigEditor.jsx";

export default function Biblioteca() {
  const [recursos, setRecursos] = useState(null);
  const [nuevo, setNuevo] = useState(null);

  const cargar = () => api.get("/recursos").then((d) => setRecursos(d.recursos));
  useEffect(() => { cargar(); }, []);

  const empezar = (tipo) =>
    setNuevo({ tipo, titulo: "", descripcion: "", config: configInicial(tipo) });

  const guardar = async () => {
    await api.post("/recursos", nuevo);
    setNuevo(null);
    cargar();
  };

  const borrar = async (id) => {
    if (!confirm("¿Eliminar este recurso?")) return;
    await api.del(`/recursos/${id}`);
    cargar();
  };

  return (
    <div className="app app-wide">
      <div className="topbar">
        <Link to="/formador" style={{ textDecoration: "none", color: "inherit" }}>← Panel</Link>
        <span className="brand">📚 Biblioteca</span>
      </div>

      <div className="pad grow">
        <p className="eyebrow">Depósito de recursos</p>
        <h1>Tus bloques reutilizables</h1>
        <p className="lead" style={{ marginBottom: 24 }}>
          Creá recursos una vez y usalos (o repetilos) en cualquier programa.
        </p>

        {/* Selector de tipo para crear */}
        {!nuevo && (
          <div className="card-soft card" style={{ marginBottom: 24 }}>
            <strong style={{ display: "block", marginBottom: 12 }}>+ Crear recurso</strong>
            {GRUPOS.map((g) => (
              <div key={g} style={{ marginBottom: 12 }}>
                <div className="muted mono" style={{ fontSize: 11, marginBottom: 6 }}>{g.toUpperCase()}</div>
                <div className="row" style={{ flexWrap: "wrap", gap: 8 }}>
                  {Object.entries(CATALOGO).filter(([, m]) => m.grupo === g).map(([tipo, m]) => (
                    <button key={tipo} className="btn btn-sm btn-ghost" style={{ width: "auto" }} onClick={() => empezar(tipo)}>
                      {m.icon} {m.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Formulario de creación */}
        {nuevo && (
          <div className="card fade-in" style={{ marginBottom: 24, borderColor: "var(--azul)" }}>
            <div className="row between" style={{ marginBottom: 14 }}>
              <strong>{tipoMeta(nuevo.tipo).icon} {tipoMeta(nuevo.tipo).label}</strong>
              <button className="btn btn-sm btn-ghost" style={{ width: "auto" }} onClick={() => setNuevo(null)}>✕</button>
            </div>
            <div className="field">
              <label>Título</label>
              <input className="input" autoFocus value={nuevo.titulo}
                onChange={(e) => setNuevo({ ...nuevo, titulo: e.target.value })} />
            </div>
            <div className="field">
              <label>Descripción <span className="muted">(opcional)</span></label>
              <input className="input" value={nuevo.descripcion}
                onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })} />
            </div>
            <ConfigEditor tipo={nuevo.tipo} config={nuevo.config}
              onChange={(config) => setNuevo({ ...nuevo, config })} />
            <button className="btn" style={{ marginTop: 8 }} onClick={guardar} disabled={!nuevo.titulo}>
              Guardar recurso
            </button>
          </div>
        )}

        {/* Lista */}
        {!recursos ? <p className="muted">Cargando…</p> : (
          <div className="stack">
            {recursos.map((r) => (
              <div key={r.id} className="card row between">
                <div className="row" style={{ gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{tipoMeta(r.tipo).icon}</span>
                  <div>
                    <strong>{r.titulo}</strong>
                    <div className="muted" style={{ fontSize: 13 }}>{tipoMeta(r.tipo).label}</div>
                  </div>
                </div>
                <button className="btn btn-sm btn-ghost btn-danger" style={{ width: "auto", color: "#fff" }}
                  onClick={() => borrar(r.id)}>Eliminar</button>
              </div>
            ))}
            {recursos.length === 0 && <p className="muted">Todavía no creaste recursos.</p>}
          </div>
        )}
      </div>
    </div>
  );
}

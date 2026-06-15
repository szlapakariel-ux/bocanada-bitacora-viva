import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, clearToken } from "../api.js";

export default function Formador() {
  const nav = useNavigate();
  const [programas, setProgramas] = useState(null);
  const [creando, setCreando] = useState(false);
  const [form, setForm] = useState({ nombre: "", duracionDias: 6, multiPorDia: false });

  const cargar = () => api.get("/programas").then((d) => setProgramas(d.programas));
  useEffect(() => { cargar(); }, []);

  const crear = async (e) => {
    e.preventDefault();
    const { programa } = await api.post("/programas", form);
    nav(`/formador/programa/${programa.id}`);
  };

  const salir = () => { clearToken(); nav("/"); };

  return (
    <div className="app app-wide">
      <div className="topbar">
        <span className="brand">RETO<b>N</b>S · Formador</span>
        <button className="btn btn-sm btn-ghost" style={{ width: "auto" }} onClick={salir}>Salir</button>
      </div>

      <div className="pad grow">
        <div className="row between" style={{ marginBottom: 6 }}>
          <p className="eyebrow" style={{ margin: 0 }}>Tus programas</p>
          <Link to="/formador/biblioteca" className="pill" style={{ textDecoration: "none" }}>📚 Biblioteca</Link>
        </div>
        <h1>Pulso del proceso</h1>

        {!programas ? (
          <p className="muted">Cargando…</p>
        ) : (
          <div className="stack" style={{ marginTop: 20 }}>
            {programas.map((p) => (
              <Link key={p.id} to={`/formador/programa/${p.id}`} className="card row between"
                style={{ textDecoration: "none", color: "inherit" }}>
                <div>
                  <strong>{p.nombre}</strong>
                  <div className="muted" style={{ fontSize: 13 }}>
                    {p.duracionDias} días · {p._count.participantes} participantes
                    {p.multiPorDia && " · multi-recurso"}
                  </div>
                </div>
                <span className="pill mono">{p.codigoAcceso}</span>
              </Link>
            ))}

            {creando ? (
              <form className="card stack" onSubmit={crear}>
                <div className="field" style={{ margin: 0 }}>
                  <label>Nombre del programa</label>
                  <input className="input" autoFocus value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
                </div>
                <div className="field" style={{ margin: 0 }}>
                  <label>Duración (días)</label>
                  <input className="input" type="number" min="1" max="30" value={form.duracionDias}
                    onChange={(e) => setForm({ ...form, duracionDias: +e.target.value })} />
                </div>
                <label className="row" style={{ gap: 10, fontSize: 14 }}>
                  <input type="checkbox" checked={form.multiPorDia}
                    onChange={(e) => setForm({ ...form, multiPorDia: e.target.checked })} />
                  <span>Multi-recurso por día <span className="muted">(premium)</span></span>
                </label>
                <div className="row" style={{ gap: 10 }}>
                  <button className="btn">Crear programa</button>
                  <button type="button" className="btn btn-ghost" onClick={() => setCreando(false)}>Cancelar</button>
                </div>
              </form>
            ) : (
              <button className="btn btn-ghost" onClick={() => setCreando(true)}>+ Nuevo programa</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

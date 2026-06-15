import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, clearToken } from "../api.js";

export default function Admin() {
  const nav = useNavigate();
  const [clientes, setClientes] = useState(null);
  const [creando, setCreando] = useState(false);
  const [form, setForm] = useState({ nombre: "", email: "", password: "" });
  const [nuevo, setNuevo] = useState(null); // { email, password } recién creado
  const [error, setError] = useState("");
  const [copiado, setCopiado] = useState(false);

  const cargar = () => api.get("/admin/clientes").then((d) => setClientes(d.clientes));
  useEffect(() => { cargar(); }, []);

  const crear = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { cliente, password } = await api.post("/admin/clientes", form);
      setNuevo({ email: cliente.email, password });
      setForm({ nombre: "", email: "", password: "" });
      setCreando(false);
      setCopiado(false);
      cargar();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggle = async (c) => {
    await api.put(`/admin/clientes/${c.id}`, { activo: !c.activo });
    cargar();
  };

  const copiar = async (c) => {
    try { await navigator.clipboard.writeText(`Usuario: ${c.email}\nContraseña: ${c.password}`); setCopiado(true); } catch { /* ignore */ }
  };

  const salir = () => { clearToken(); nav("/"); };

  return (
    <div className="app app-wide">
      <div className="topbar">
        <span className="brand">Bitácora <b>Viva</b> · Dueño</span>
        <button className="btn btn-sm btn-ghost" style={{ width: "auto" }} onClick={salir}>Salir</button>
      </div>

      <div className="pad grow">
        <p className="eyebrow">Panel del dueño</p>
        <h1>Tus clientes</h1>
        <p className="lead" style={{ marginBottom: 24 }}>
          Cada cliente es una cuenta de formador con su propia marca y programas.
        </p>

        {/* Credenciales del cliente recién creado */}
        {nuevo && (
          <div className="card fade-in" style={{ marginBottom: 20, borderColor: "var(--verde)", background: "var(--verde-suave)" }}>
            <strong>✓ Cliente creado</strong>
            <p className="muted" style={{ fontSize: 13, margin: "6px 0 12px" }}>
              Entregale estas credenciales. La contraseña no se vuelve a mostrar.
            </p>
            <div className="card" style={{ marginBottom: 12 }}>
              <div className="mono" style={{ fontSize: 14 }}>Usuario: <b>{nuevo.email}</b></div>
              <div className="mono" style={{ fontSize: 14 }}>Contraseña: <b>{nuevo.password}</b></div>
            </div>
            <div className="row" style={{ gap: 10 }}>
              <button className="btn btn-sm" style={{ width: "auto", background: copiado ? "var(--verde)" : undefined }} onClick={() => copiar(nuevo)}>
                {copiado ? "✓ Copiado" : "Copiar credenciales"}
              </button>
              <button className="btn btn-sm btn-ghost" style={{ width: "auto" }} onClick={() => setNuevo(null)}>Cerrar</button>
            </div>
          </div>
        )}

        {error && <div className="error-msg">{error}</div>}

        {/* Alta de cliente */}
        {creando ? (
          <form className="card stack" style={{ marginBottom: 20 }} onSubmit={crear}>
            <strong>Nuevo cliente</strong>
            <div className="field" style={{ margin: 0 }}>
              <label>Nombre del cliente / estudio</label>
              <input className="input" autoFocus value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label>Email (usuario de acceso)</label>
              <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label>Contraseña <span className="muted">(vacío = se genera sola)</span></label>
              <input className="input mono" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <div className="row" style={{ gap: 10 }}>
              <button className="btn">Crear cliente</button>
              <button type="button" className="btn btn-ghost" onClick={() => setCreando(false)}>Cancelar</button>
            </div>
          </form>
        ) : (
          <button className="btn" style={{ marginBottom: 20 }} onClick={() => setCreando(true)}>+ Dar de alta un cliente</button>
        )}

        {/* Lista de clientes */}
        {!clientes ? <p className="muted">Cargando…</p> : (
          <div className="stack">
            {clientes.map((c) => (
              <div key={c.id} className="card row between" style={{ opacity: c.activo ? 1 : 0.55 }}>
                <div>
                  <strong>{c.nombre}</strong>
                  <div className="muted mono" style={{ fontSize: 12 }}>{c.email}</div>
                  <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
                    {c._count.programas} programas · {c._count.recursos} recursos · {c.participantes} participantes
                  </div>
                </div>
                <button className="btn btn-sm btn-ghost" style={{ width: "auto" }} onClick={() => toggle(c)}>
                  {c.activo ? "Deshabilitar" : "Habilitar"}
                </button>
              </div>
            ))}
            {clientes.length === 0 && <p className="muted">Todavía no diste de alta clientes.</p>}
          </div>
        )}
      </div>
    </div>
  );
}

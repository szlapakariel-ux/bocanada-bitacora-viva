import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api.js";

export default function Entrar() {
  const nav = useNavigate();
  const [form, setForm] = useState({ codigo: "", nombre: "", clave: "" });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const entrar = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      const { participante, programa } = await api.post("/part/join", form);
      localStorage.setItem(
        "retons_part",
        JSON.stringify({ ...participante, programa })
      );
      nav("/viaje");
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="app center-screen">
      <form className="pad fade-in" onSubmit={entrar}>
        <Link to="/" className="brand" style={{ textDecoration: "none", color: "inherit" }}>
          Bitácora <b>Viva</b>
        </Link>
        <h1 style={{ marginTop: 24 }}>Entrá a tu recorrido</h1>
        <p className="lead" style={{ marginBottom: 28 }}>
          Usá el código que te compartió tu formador/a.
        </p>

        {error && <div className="error-msg">{error}</div>}

        <div className="field">
          <label>Código del programa</label>
          <input
            className="input mono"
            placeholder="Ej: LIDER1"
            value={form.codigo}
            onChange={set("codigo")}
            autoCapitalize="characters"
            required
          />
        </div>
        <div className="field">
          <label>Tu nombre</label>
          <input className="input" placeholder="Cómo te llamás" value={form.nombre} onChange={set("nombre")} required />
        </div>
        <div className="field">
          <label>Tu clave personal <span className="muted">(para volver a entrar)</span></label>
          <input
            className="input mono"
            placeholder="Elegí una clave"
            value={form.clave}
            onChange={set("clave")}
          />
        </div>

        <button className="btn" disabled={cargando}>
          {cargando ? "Entrando…" : "Comenzar"}
        </button>
      </form>
    </div>
  );
}

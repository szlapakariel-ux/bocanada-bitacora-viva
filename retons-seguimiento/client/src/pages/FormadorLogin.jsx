import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api, setToken } from "../api.js";

export default function FormadorLogin() {
  const nav = useNavigate();
  const [modo, setModo] = useState("login");
  const [form, setForm] = useState({ nombre: "", email: "demo@retons.com", password: "demo1234" });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const enviar = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      const { token } = await api.post(`/auth/${modo === "login" ? "login" : "register"}`, form);
      setToken(token);
      nav("/formador");
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="app center-screen">
      <form className="pad fade-in" onSubmit={enviar}>
        <Link to="/" className="brand" style={{ textDecoration: "none", color: "inherit" }}>
          RETO<b>N</b>S
        </Link>
        <h1 style={{ marginTop: 24 }}>{modo === "login" ? "Panel del formador" : "Crear cuenta"}</h1>
        <p className="lead" style={{ marginBottom: 28 }}>El pulso del proceso, en un solo lugar.</p>

        {error && <div className="error-msg">{error}</div>}

        {modo === "registro" && (
          <div className="field">
            <label>Nombre</label>
            <input className="input" value={form.nombre} onChange={set("nombre")} required />
          </div>
        )}
        <div className="field">
          <label>Email</label>
          <input className="input" type="email" value={form.email} onChange={set("email")} required />
        </div>
        <div className="field">
          <label>Contraseña</label>
          <input className="input" type="password" value={form.password} onChange={set("password")} required />
        </div>

        <button className="btn" disabled={cargando}>
          {cargando ? "…" : modo === "login" ? "Entrar" : "Crear cuenta"}
        </button>

        <button
          type="button"
          className="btn btn-ghost"
          style={{ marginTop: 12 }}
          onClick={() => setModo(modo === "login" ? "registro" : "login")}
        >
          {modo === "login" ? "Crear una cuenta nueva" : "Ya tengo cuenta"}
        </button>

        {modo === "login" && (
          <p className="muted mono" style={{ fontSize: 12, marginTop: 20, textAlign: "center" }}>
            Demo: demo@retons.com / demo1234
          </p>
        )}
      </form>
    </div>
  );
}

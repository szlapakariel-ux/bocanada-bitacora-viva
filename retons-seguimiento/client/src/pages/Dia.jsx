import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../api.js";
import Bloque from "../components/Bloque.jsx";

const part = () => JSON.parse(localStorage.getItem("retons_part") || "null");

export default function Dia() {
  const { numero } = useParams();
  const nav = useNavigate();
  const [dia, setDia] = useState(null);
  const p = part();

  useEffect(() => {
    if (!p) return nav("/entrar");
    api.get(`/part/${p.id}/dia/${numero}`).then((d) => setDia(d.dia)).catch(() => nav("/viaje"));
  }, [numero]);

  const guardar = (bloqueId, payload) =>
    api.post(`/part/${p.id}/respuesta`, { bloqueId, payload });

  if (!dia) return <div className="app center-screen pad muted">Cargando…</div>;

  return (
    <div className="app">
      <div className="topbar">
        <Link to="/viaje" style={{ textDecoration: "none", color: "inherit" }}>← Volver</Link>
        <span className="pill">Día {dia.numero}</span>
      </div>

      <div className="pad grow">
        <p className="eyebrow">La estación de hoy</p>
        <h1 style={{ marginBottom: 24 }}>{dia.titulo || `Día ${dia.numero}`}</h1>

        {dia.bloques.length === 0 && (
          <div className="card card-soft muted">Este día todavía no tiene contenido.</div>
        )}

        {dia.bloques.map((b) => (
          <Bloque key={b.id} bloque={b} onGuardar={guardar} />
        ))}

        <Link to="/viaje" className="btn btn-ghost" style={{ marginTop: 12 }}>
          Terminar por hoy
        </Link>
      </div>
    </div>
  );
}

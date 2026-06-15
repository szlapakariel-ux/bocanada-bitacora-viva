import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api.js";
import { aplicarMarca } from "../marca.js";

const part = () => JSON.parse(localStorage.getItem("retons_part") || "null");

export default function Viaje() {
  const nav = useNavigate();
  const [data, setData] = useState(null);
  const p = part();

  useEffect(() => {
    if (!p) return nav("/entrar");
    api
      .get(`/part/${p.id}/progreso`)
      .then((d) => { aplicarMarca(d.programa.marca); setData(d); })
      .catch(() => nav("/entrar"));
  }, []);

  if (!data) return <div className="app center-screen pad muted">Cargando…</div>;
  const marca = data.programa.marca || {};

  const hechos = data.dias.filter((d) => d.completo).length;
  const conContenido = data.dias.filter((d) => !d.vacio);

  return (
    <div className="app">
      <div className="topbar">
        {marca.logoData ? (
          <img src={marca.logoData} alt="logo" style={{ height: 28, maxWidth: 140, objectFit: "contain" }} />
        ) : (
          <Link to="/" className="brand" style={{ textDecoration: "none", color: "inherit" }}>
            Bitácora <b>Viva</b>
          </Link>
        )}
        <span className="pill">{hechos}/{conContenido.length} días</span>
      </div>

      <div className="pad grow fade-in">
        <p className="eyebrow">{data.programa.nombre}</p>
        <h1>Hola, {p.nombre.split(" ")[0]}.</h1>
        <p className="lead" style={{ marginBottom: 28 }}>“{data.programa.fraseAncla}”</p>

        <div className="stack">
          {data.dias.map((d) => {
            const bloqueado = d.vacio;
            const Item = bloqueado ? "div" : Link;
            return (
              <Item
                key={d.numero}
                to={bloqueado ? undefined : `/dia/${d.numero}`}
                className="card row between"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  opacity: bloqueado ? 0.45 : 1,
                  borderColor: d.completo ? "var(--verde)" : "var(--borde)",
                  background: d.completo ? "var(--verde-suave)" : "var(--blanco)",
                }}
              >
                <div className="row" style={{ gap: 14 }}>
                  <span
                    className="mono"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      display: "grid",
                      placeItems: "center",
                      fontWeight: 700,
                      background: d.completo ? "var(--verde)" : "var(--surface)",
                      color: d.completo ? "#fff" : "var(--muted)",
                    }}
                  >
                    {d.completo ? "✓" : d.numero}
                  </span>
                  <div>
                    <strong>{d.tema || `Día ${d.numero}`}</strong>
                    <div className="muted" style={{ fontSize: 13 }}>
                      Día {d.numero} · {bloqueado ? "Próximamente" : d.completo ? "Completado" : "Tocá para empezar"}
                    </div>
                  </div>
                </div>
                {!bloqueado && <span className="muted">→</span>}
              </Item>
            );
          })}
        </div>
      </div>
    </div>
  );
}

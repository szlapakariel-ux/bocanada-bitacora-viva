import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList,
} from "recharts";
import { api } from "../api.js";

const FOCO = {
  posibilidad: { label: "Posibilidad", color: "#1B56D6" },
  aventura: { label: "Aventura", color: "#D63030" },
  agua: { label: "Agua", color: "#1A7A3C" },
  tierra: { label: "Tierra", color: "#13152A" },
};

export default function Panel() {
  const { id } = useParams();
  const [d, setD] = useState(null);

  useEffect(() => { api.get(`/panel/${id}`).then(setD); }, [id]);
  if (!d) return <div className="app center-screen pad muted">Cargando…</div>;

  const focos = Object.entries(d.focos).map(([k, v]) => ({
    name: FOCO[k]?.label || k, value: v, color: FOCO[k]?.color || "#6A6F8E",
  }));
  const checklist = Object.entries(d.checklist).map(([k, v]) => ({ name: k, value: v }));
  const dias = d.porDia.map((x) => ({ name: `D${x.numero}`, value: x.respuestas }));

  return (
    <div className="app app-wide">
      <div className="topbar">
        <Link to={`/formador/programa/${id}`} style={{ textDecoration: "none", color: "inherit" }}>← Constructor</Link>
        <span className="pill mono">{d.programa.codigoAcceso}</span>
      </div>

      <div className="pad grow">
        <p className="eyebrow">Pulso del proceso</p>
        <h1>{d.programa.nombre}</h1>

        <div className="row" style={{ gap: 12, marginBottom: 24 }}>
          <Metric n={d.resumen.participantes} label="Participantes" />
          <Metric n={d.resumen.respuestas} label="Señales" />
        </div>

        {/* Foco de gestión: el gráfico clave */}
        <div className="card" style={{ marginBottom: 18 }}>
          <h3>Foco de gestión del grupo</h3>
          <p className="muted" style={{ fontSize: 13, marginTop: -4 }}>
            ¿Dónde estuvo la energía? Te dice si el equipo está atascado en la acción,
            mirando al futuro o cuidando las relaciones.
          </p>
          {focos.length ? (
            <div style={{ height: 240 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={focos} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={2}>
                    {focos.map((f, i) => <Cell key={i} fill={f.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : <Vacio />}
          <div className="row" style={{ flexWrap: "wrap", gap: 12, marginTop: 8 }}>
            {focos.map((f) => (
              <span key={f.name} className="row" style={{ gap: 6, fontSize: 13 }}>
                <span style={{ width: 10, height: 10, borderRadius: 99, background: f.color }} />
                {f.name} · <b>{f.value}</b>
              </span>
            ))}
          </div>
        </div>

        {/* Participación por día */}
        <div className="card" style={{ marginBottom: 18 }}>
          <h3>Participación por día</h3>
          <div style={{ height: 180 }}>
            <ResponsiveContainer>
              <BarChart data={dias}>
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip cursor={{ fill: "var(--surface)" }} />
                <Bar dataKey="value" fill="#1B56D6" radius={[6, 6, 0, 0]}>
                  <LabelList dataKey="value" position="top" fontSize={12} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Palabras limitantes */}
        {checklist.length > 0 && (
          <div className="card" style={{ marginBottom: 18 }}>
            <h3>Palabras limitantes más usadas</h3>
            <div style={{ height: 40 + checklist.length * 42 }}>
              <ResponsiveContainer>
                <BarChart data={checklist} layout="vertical" margin={{ left: 0, right: 24 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={150} tickLine={false} axisLine={false} fontSize={11} />
                  <Tooltip cursor={{ fill: "var(--surface)" }} />
                  <Bar dataKey="value" fill="#D63030" radius={[0, 6, 6, 0]}>
                    <LabelList dataKey="value" position="right" fontSize={12} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Escalas */}
        {d.escalas.length > 0 && (
          <div className="card" style={{ marginBottom: 18 }}>
            <h3>Promedios de escala</h3>
            {d.escalas.map((e, i) => (
              <div key={i} className="row between" style={{ padding: "6px 0" }}>
                <span>{e.titulo}</span>
                <span className="mono"><b>{e.promedio}</b> <span className="muted">(n={e.n})</span></span>
              </div>
            ))}
          </div>
        )}

        {/* Reflexiones recientes */}
        {d.reflexiones.length > 0 && (
          <div className="card">
            <h3>Señales suaves <span className="muted" style={{ fontWeight: 400, fontSize: 13 }}>(reflexiones recientes)</span></h3>
            <div className="stack">
              {d.reflexiones.map((r, i) => (
                <div key={i} className="card-soft card">
                  <div className="muted mono" style={{ fontSize: 11, marginBottom: 4 }}>{r.titulo}</div>
                  <span>“{r.texto}”</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const Metric = ({ n, label }) => (
  <div className="card" style={{ flex: 1, textAlign: "center" }}>
    <div style={{ fontSize: 32, fontWeight: 800 }}>{n}</div>
    <div className="muted" style={{ fontSize: 13 }}>{label}</div>
  </div>
);
const Vacio = () => <p className="muted" style={{ textAlign: "center", padding: 30 }}>Todavía no hay respuestas.</p>;

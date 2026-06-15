import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="app center-screen">
      <div className="pad fade-in">
        <p className="eyebrow">Bitácora Viva · Acompañamiento entre encuentros</p>
        <h1 style={{ fontSize: 34 }}>Una pausa<br />en medio del caos.</h1>
        <p className="lead" style={{ marginBottom: 36 }}>
          Acompañamiento entre encuentros. Pequeñas estaciones diarias que
          sostienen lo aprendido y devuelven señales a tu formador.
        </p>

        <div className="stack">
          <Link to="/entrar" className="btn">Entrar a mi recorrido</Link>
          <Link to="/formador/login" className="btn btn-ghost">Soy formador/a</Link>
        </div>
      </div>

      <div className="pad muted mono" style={{ fontSize: 12 }}>
        Somos lo que hacemos repetidamente.
      </div>
    </div>
  );
}

import { Routes, Route, Navigate } from "react-router-dom";
import { getToken } from "./api.js";

import Home from "./pages/Home.jsx";
import Entrar from "./pages/Entrar.jsx";
import Viaje from "./pages/Viaje.jsx";
import Dia from "./pages/Dia.jsx";
import FormadorLogin from "./pages/FormadorLogin.jsx";
import Formador from "./pages/Formador.jsx";
import Biblioteca from "./pages/Biblioteca.jsx";
import Programa from "./pages/Programa.jsx";
import Panel from "./pages/Panel.jsx";

const Privada = ({ children }) =>
  getToken() ? children : <Navigate to="/formador/login" replace />;

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/entrar" element={<Entrar />} />
      <Route path="/viaje" element={<Viaje />} />
      <Route path="/dia/:numero" element={<Dia />} />

      <Route path="/formador/login" element={<FormadorLogin />} />
      <Route path="/formador" element={<Privada><Formador /></Privada>} />
      <Route path="/formador/biblioteca" element={<Privada><Biblioteca /></Privada>} />
      <Route path="/formador/programa/:id" element={<Privada><Programa /></Privada>} />
      <Route path="/formador/programa/:id/panel" element={<Privada><Panel /></Privada>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

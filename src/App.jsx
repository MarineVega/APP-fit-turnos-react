// src/App.jsx
import { Routes, Route } from "react-router-dom";
import "./styles/style.css";

// Layouts
import LayoutPublic from "../src/components/layouts/LayoutPublic";
import LayoutPrivate from "../src/components/layouts/LayoutPrivate";

// Páginas
import MainPrincipal from "./components/MainPrincipal";
import Cuenta from "./pages/Cuenta";
import Reservas from "./pages/Reservas";
import Administrar from "./pages/Administrar";
import Actividad from "./pages/Actividad";
import Horario from "./pages/Horario";
import Profesor from "./pages/Profesor";
import PerfilUsuario from "./pages/PerfilUsuario";
import Usuario from "./pages/Usuario";
import CuentaVerificada from "./pages/cuentaverificada.jsx";
import VerificarCuenta from "./pages/VerificarCuenta";  // <-- IMPORTANTE

function App() {
  return (
    <Routes>

      {/* Layout público */}
      <Route element={<LayoutPublic />}>
        <Route path="/" element={<MainPrincipal />} />
        <Route path="/cuenta" element={<Cuenta />} />

        {/* Verificación de email */}
        <Route path="/verificar/:token" element={<VerificarCuenta />} />
        <Route path="/verificada" element={<CuentaVerificada />} />
      </Route>

      {/* Layout privado */}
      <Route element={<LayoutPrivate />}>
        <Route path="/reservas" element={<Reservas />} />
        <Route path="/administrar" element={<Administrar />} />
        <Route path="/actividad" element={<Actividad />} />
        <Route path="/horario" element={<Horario />} />
        <Route path="/profesor" element={<Profesor />} />
        <Route path="/perfil" element={<PerfilUsuario />} />
        <Route path="/usuario" element={<Usuario />} />
      </Route>

    </Routes>
  );
}

export default App;

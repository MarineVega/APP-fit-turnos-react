import React from 'react'
import { Routes, Route } from "react-router-dom";
import './styles/style.css';

// Componentes comunes
import Header from './components/Header';
import Footer from './components/Footer';
// import Navbar from './components/Navbar';

// Páginas
import MainPrincipal from './components/MainPrincipal';
import Administrar from "./pages/Administrar";
import Turnos from "./pages/Turnos";
import Cuenta from "./pages/Cuenta";

function App() {
  return (
    <>      
      <Header />
      
      {/* Ahora solo se renderiza la ruta activa */}
      <Routes>
        <Route path="/" element={<MainPrincipal />} />
        <Route path="/cuenta" element={<Cuenta />} />
        <Route path="/administrar" element={<Administrar />} />
        <Route path="/turnos" element={<Turnos />} />
      </Routes>
          
      <Footer />
    </>
  );
}

export default App;

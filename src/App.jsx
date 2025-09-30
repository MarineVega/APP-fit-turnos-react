import React from 'react'
import { Routes, Route } from "react-router-dom";
import './styles/style.css';

// Componentes comunes
import Header from './components/Header';
import Footer from './components/Footer';
//import Navbar from './components/Navbar';

// Páginas
//import Index from "./pages/";
import MainPrincipal from './components/MainPrincipal';
import Administrar from "./pages/Administrar";
import Turnos from "./pages/Turnos";
import Cuenta from "./pages/Cuenta";
import Actividad from './pages/Actividad';

function App() {
  return (

    <>      
      <Header />
       {/* <Navbar></Navbar> */}     
      
      {/* Acá van las páginas según la ruta */}
      <Routes>
        <Route path="/" element={<MainPrincipal />} />
        <Route path="/cuenta" element={<Cuenta />} />
        <Route path="/administrar" element={<Administrar />} />
        <Route path="/turnos" element={<Turnos />} />        
        <Route path="/actividad" element={<Actividad />} />
      </Routes>
          
      <Footer />
    </>

  );
}

export default App

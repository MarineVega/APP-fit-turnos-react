import React, { useEffect } from "react";
import Header from "../Header";
import Footer from "../Footer";
import { Outlet } from "react-router-dom";

export default function LayoutPublic() {

  // Escucha si cambia el estado de sesión
  useEffect(() => {
    const handleUpdate = () => {}; // solo para disparar re-render
    window.addEventListener("usuarioActualizado", handleUpdate);
    return () => window.removeEventListener("usuarioActualizado", handleUpdate);
  }, []);

  return (
    //<div className="layout-public">
    <div className="App">
      <Header />
      <main className="contenido">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

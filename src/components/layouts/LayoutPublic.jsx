// src/layouts/LayoutPublic.jsx
import React from "react";
import Header from "../Header";
import Footer from "../Footer";
import { Outlet } from "react-router-dom";

export default function LayoutPublic() {
  return (
    <div className="layout-public">
      {/* Mantenemos el Header porque tu Navbar ya maneja el estado del usuario */}
      <Header />
      <main className="contenido">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

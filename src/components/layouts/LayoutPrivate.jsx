// src/layouts/LayoutPrivate.jsx
import React, { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";

export default function LayoutPrivate() {
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    if (!usuarioActivo) navigate("/cuenta");
  }, [navigate]);

  return (
    <div className="layout-private">
      <Header />
      <main className="contenido">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

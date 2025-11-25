import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";

export default function LayoutPrivate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [autenticado, setAutenticado] = useState(false);

  const verificarSesion = async () => {
    const token = localStorage.getItem("token");
    const usuarioGuardado = localStorage.getItem("usuarioActivo");

    // Si NO hay token y NO hay usuario → sin sesión
    if (!token && !usuarioGuardado) {
      setAutenticado(false);
      setLoading(false);
      navigate("/cuenta");
      return;
    }

    // Si hay token → validar backend
    if (token) {
      try {
        const res = await fetch("http://localhost:3000/auth/perfil", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Token inválido");

        const usuario = await res.json();
        localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
        setAutenticado(true);
      } catch (err) {
        // Token inválido → borrar sesión
        localStorage.removeItem("token");
        localStorage.removeItem("usuarioActivo");
        setAutenticado(false);
        navigate("/cuenta");
      } finally {
        setLoading(false);
      }
      return;
    }

    //  Si no hay token pero sí un usuario guardado válido → sesión activa
    try {
      const usuarioParsed = JSON.parse(usuarioGuardado);
      if (usuarioParsed) {
        setAutenticado(true);
      } else {
        setAutenticado(false);
        navigate("/cuenta");
      }
    } catch {
      setAutenticado(false);
      navigate("/cuenta");
    }

    setLoading(false);
  };

  useEffect(() => {
    verificarSesion();

    //  ESCUCHA cuando se cierra sesión desde Navbar
    const handler = () => verificarSesion();
    window.addEventListener("usuarioActualizado", handler);

    return () => {
      window.removeEventListener("usuarioActualizado", handler);
    };
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <p>Verificando sesión...</p>
      </div>
    );
  }

  if (!autenticado) return null;

  return (
    //<div className="layout-private">    
    <div className="App">    
      <Header />
      <main className="contenido">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

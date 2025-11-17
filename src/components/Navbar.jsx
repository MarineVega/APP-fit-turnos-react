import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Navbar.css";

import Logo_Fit_Home from "../assets/img/Logo_Fit_Home.png";
import menuIcon from "../assets/img/menu.png";
import buscar from "../assets/img/buscar.png";
import notif from "../assets/img/notif.png";

function Navbar() {
  const navigate = useNavigate();
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);

  // ============================
  //  Cargar usuario logueado
  // ============================
  useEffect(() => {
    const actualizarUsuario = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        localStorage.removeItem("usuarioActivo");
        setUsuarioActivo(null);
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/auth/perfil", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Token inválido o expirado");

        const usuario = await res.json();
        localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
        setUsuarioActivo(usuario);

      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("usuarioActivo");
        setUsuarioActivo(null);
      }
    };

    actualizarUsuario();
    window.addEventListener("storage", actualizarUsuario);
    window.addEventListener("usuarioActualizado", actualizarUsuario);

    return () => {
      window.removeEventListener("storage", actualizarUsuario);
      window.removeEventListener("usuarioActualizado", actualizarUsuario);
    };
  }, []);

  // ============================
  //  Cerrar sesión
  // ============================
  const cerrarSesion = () => {
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "¿Querés salir de tu cuenta?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton: "btnAceptar",
        cancelButton: "btnCancelar",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("usuarioActivo");
        localStorage.removeItem("token");
        setUsuarioActivo(null);
        setMenuAbierto(false);
        window.dispatchEvent(new Event("usuarioActualizado"));
        navigate("/");
      }
    });
  };

  // -----------------------------------
  //  Rol visible
  // -----------------------------------
  const obtenerRol = () => {
    const tipo = usuarioActivo?.persona?.tipoPersona_id;
    if (tipo === 1) return "Administrador";
    if (tipo === 2) return "Profesor";
    if (tipo === 3) return "Cliente";
    return "";
  };

  const esAdmin = usuarioActivo?.persona?.tipoPersona_id === 1;

  // -----------------------------------
  //  Nombre visible (con prioridad)
  // -----------------------------------
  const nombreVisible =
    usuarioActivo?.persona?.nombre?.trim()
      ? `${usuarioActivo.persona.nombre} ${usuarioActivo.persona.apellido}`
      : usuarioActivo?.usuario?.trim()
      ? usuarioActivo.usuario
      : usuarioActivo?.email;

  const toggleMenu = () => setMenuAbierto((prev) => !prev);

  // ============================
  //  Menú Mobile
  // ============================
  const MobileMenu = () => (
    <div className={`menu-desplegable ${menuAbierto ? "mostrar" : ""}`}>
      {usuarioActivo ? (
        <>
          <span
            className="menu-link nombre"
            onClick={() => {
              navigate("/perfil");
              setMenuAbierto(false);
            }}
          >
            {nombreVisible} {obtenerRol() && `(${obtenerRol()})`}
          </span>

          <Link to="/reservas" onClick={() => setMenuAbierto(false)}>
            Turnos
          </Link>

          {esAdmin && (
            <Link to="/administrar" onClick={() => setMenuAbierto(false)}>
              Administrar
            </Link>
          )}

          <span className="menu-link logout" onClick={cerrarSesion}>
            Cerrar sesión
          </span>
        </>
      ) : (
        <>
          <Link to="/cuenta" onClick={() => setMenuAbierto(false)}>
            Iniciar Sesión
          </Link>
          <Link to="/cuenta?form=crear" onClick={() => setMenuAbierto(false)}>
            Crear Cuenta
          </Link>
        </>
      )}
    </div>
  );

  // ============================
  //  Render principal
  // ============================
  return (
    <header className="header">
      <div className="navbar">
        {/* IZQUIERDA */}
        <div className="nav-left">
          <Link to="/" className="logo">
            <img src={Logo_Fit_Home} alt="Logo" loading="lazy" />
          </Link>

          <div className="desktop-only">
            {usuarioActivo && (
              <>
                <Link className="menu-link" to="/reservas">
                  Turnos
                </Link>

                {esAdmin && (
                  <Link className="menu-link" to="/administrar">
                    Administrar
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Botón hamburguesa mobile */}
          <button
            id="btnMenu"
            className="icon btnMenu mobile-only"
            onClick={toggleMenu}
          >
            <img src={menuIcon} alt="Menú" />
          </button>
        </div>

        {/* DERECHA */}
        <div className="nav-right">
          {usuarioActivo && (
            <div className="desktop-only user-info">
              <span
                className="menu-link nombre"
                onClick={() => navigate("/perfil")}
              >
                {nombreVisible} {obtenerRol() && `(${obtenerRol()})`}
              </span>

              <span className="menu-link logout" onClick={cerrarSesion}>
                Cerrar sesión
              </span>
            </div>
          )}

          {/* Iconos */}
          <a href="#" className="icon">
            <img src={buscar} alt="Buscar" />
          </a>
          <a href="#" className="icon">
            <img src={notif} alt="Notificaciones" />
          </a>
        </div>
      </div>

      <MobileMenu />
    </header>
  );
}

export default Navbar;

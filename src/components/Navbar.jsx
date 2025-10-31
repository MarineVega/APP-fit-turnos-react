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

  useEffect(() => {
    const actualizarUsuario = () => {
      const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
      setUsuarioActivo(usuario);
    };

    actualizarUsuario();
    window.addEventListener("storage", actualizarUsuario);
    window.addEventListener("usuarioActualizado", actualizarUsuario);

    return () => {
      window.removeEventListener("storage", actualizarUsuario);
      window.removeEventListener("usuarioActualizado", actualizarUsuario);
    };
  }, []);

  const toggleMenu = () => setMenuAbierto((prev) => !prev);

  const cerrarSesion = (e) => {
    e?.preventDefault();
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
        setUsuarioActivo(null);
        setMenuAbierto(false);
        window.dispatchEvent(new Event("usuarioActualizado"));
        navigate("/");
      }
    });
  };

  // 🧭 Función auxiliar para identificar el rol
  const obtenerRol = () => {
    const tipo = usuarioActivo?.persona?.tipoPersona_id;
    if (tipo === 1) return "Administrador";
    if (tipo === 2) return "Profesor";
    if (tipo === 3) return "Cliente";
    return "";
  };

  const esAdmin = usuarioActivo?.persona?.tipoPersona_id === 1;

  // ===== Menú móvil desplegable =====
  const MobileMenu = () => (
    <div className={`menu-desplegable ${menuAbierto ? "mostrar" : ""}`}>
      {usuarioActivo ? (
        <>
          <span
            className="menu-link nombre"
            onClick={() => navigate("/perfil")}
            style={{ cursor: "pointer" }}>
            {usuarioActivo.nombre || usuarioActivo.usuario}{" "}
            {obtenerRol() && `(${obtenerRol()})`}
          </span>

          <Link to="/turnos" onClick={() => setMenuAbierto(false)}>
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

  return (
    <header className="header">
      <div className="navbar">
        {/* === IZQUIERDA === */}
        <div className="nav-left">
          {/* Logo siempre visible */}
          <Link to="/" className="logo">
            <img src={Logo_Fit_Home} alt="Logo Fit Turnos" loading="lazy" />
          </Link>

          {/* Links Turnos y Administrar solo en escritorio */}
          <div className="desktop-only">
            {usuarioActivo && (
              <>
                <Link className="menu-link" to="/turnos">
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

          {/* Botón menú hamburguesa solo en mobile */}
          <button
            id="btnMenu"
            className="icon btnMenu mobile-only"
            onClick={toggleMenu}
            aria-label="Abrir menú"
          >
            <img src={menuIcon} alt="Menú" loading="lazy" />
          </button>
        </div>

        {/* === DERECHA === */}
        <div className="nav-right">
          {/* Nombre y cerrar sesión solo si logueado (escritorio) */}
          {usuarioActivo && (
            <div className="desktop-only user-info">
              <span
                className="menu-link nombre"
                onClick={() => navigate("/perfil")}
                style={{ cursor: "pointer" }}>
                {usuarioActivo.nombre || usuarioActivo.usuario}{" "}
                {obtenerRol() && `(${obtenerRol()})`}
              </span>
              <span className="menu-link logout" onClick={cerrarSesion}>
                Cerrar sesión
              </span>
            </div>
          )}

          {/* Íconos siempre visibles */}
          <a href="#" className="icon" aria-label="Buscar">
            <img src={buscar} alt="Buscar" loading="lazy" />
          </a>
          <a href="#" className="icon" aria-label="Notificaciones">
            <img src={notif} alt="Notificaciones" loading="lazy" />
          </a>
        </div>
      </div>

      {/* Menú móvil */}
      <MobileMenu />
    </header>
  );
}

export default Navbar;

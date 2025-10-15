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

  // ===== Menú de escritorio =====
  const DesktopMenu = () => (
    <>
      <div className="nav-left desktop-only">
        {/* Logo */}
        <Link to="/" className="logo">
          <img src={Logo_Fit_Home} alt="Logo" loading="lazy" />
        </Link>

        {/* Turnos y Administrar si está logueado */}
        {usuarioActivo && (
          <>
            <Link className="menu-link" to="/turnos">
              Turnos
            </Link>
            {usuarioActivo.esAdmin && (
              <Link className="menu-link" to="/administrar">
                Administrar
              </Link>
            )}
          </>
        )}
      </div>

      <div className="nav-right desktop-only">
        {/* Nombre y Cerrar sesión si está logueado */}
        {usuarioActivo && (
          <>
            <span
              className="menu-link"
              style={{ fontSize: "1.1rem", fontWeight: 600, color: "white" }}
            >
              {usuarioActivo.nombre} {usuarioActivo.esAdmin && "(Admin)"}
            </span>
            <span
              className="menu-link logout"
              style={{ cursor: "pointer" }}
              onClick={cerrarSesion}
            >
              Cerrar sesión
            </span>
          </>
        )}

        {/* Iconos siempre visibles */}
        <a href="#" className="icon" aria-label="Buscar">
          <img src={buscar} alt="Buscar" loading="lazy" />
        </a>
        <a href="#" className="icon" aria-label="Notificaciones">
          <img src={notif} alt="Notificaciones" loading="lazy" />
        </a>
      </div>
    </>
  );

  // ===== Menú mobile =====
  const MobileMenu = () => (
    <div className={`menu-desplegable ${menuAbierto ? "mostrar" : ""}`}>
      {usuarioActivo ? (
        <>
          <span className="menu-link">
            {usuarioActivo.nombre} {usuarioActivo.esAdmin && "(Admin)"}
          </span>
          <Link to="/turnos" onClick={() => setMenuAbierto(false)}>
            Turnos
          </Link>
          {usuarioActivo.esAdmin && (
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
        {/* Botón de menú móvil */}
        <button
          id="btnMenu"
          className="icon btnMenu desktop-hidden"
          onClick={toggleMenu}
          aria-label="Abrir menú"
        >
          <img src={menuIcon} alt="Menú" loading="lazy" />
        </button>

        {/* Menú de escritorio */}
        <DesktopMenu />
      </div>

      {/* Menú móvil */}
      <MobileMenu />
    </header>
  );
}

export default Navbar;

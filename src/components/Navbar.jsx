import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

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

  // Menu de escritorio
  const DesktopMenu = () => (
    <>
      {/* Lado izquierdo */}
      <div className="nav-left desktop-only">
        {usuarioActivo && (
          <>
            <Link to="/turnos" id="menuTurnos">
              Turnos
            </Link>
            {usuarioActivo.esAdmin && (
              <Link to="/administrar" id="menuAdmin">
                Administrar
              </Link>
            )}
          </>
        )}
      </div>

      {/* Lado derecho */}
      <div className="nav-right desktop-only">
        {usuarioActivo ? (
          <>
            <span
              id="nombreUsuario"
              style={{ color: "white", fontSize: "18px", fontWeight: "bold" }}
            >
              {usuarioActivo.nombre} {usuarioActivo.esAdmin && "(Admin)"}
            </span>
            <button
              className="btn-link"
              onClick={cerrarSesion}
              id="menuCerrarSesion"
            >
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/cuenta" id="menuIniciarSesion">
              Iniciar Sesión
            </Link>
            <Link to="/cuenta?form=crear" id="menuCrearCuenta">
              Crear Cuenta
            </Link>
          </>
        )}
        <a href="#" className="icon" aria-label="Buscar">
           <img src={buscar} alt="Buscar" loading="lazy" />
        </a>
        <a href="#" className="icon" aria-label="Notificaciones">
          <img src={notif} alt="Notificaciones" loading="lazy" />
        </a>

      </div>
    </>
  );

  // Menu mobile
  const MobileMenu = () => (
    <div className={`menu-desplegable ${menuAbierto ? "mostrar" : ""}`}>
      {usuarioActivo ? (
        <>
          <span id="nombreUsuarioMobile">
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
          <button className="btn-link" onClick={cerrarSesion}>
            Cerrar Sesión
          </button>
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
        {/* Logo izquierda */}
        <div className="nav-left">
          <Link to="/" className="logo">
            <img src={Logo_Fit_Home} alt="Logo" loading="lazy" />
          </Link>
        </div>

        {/* Menu de escritorio */}
        <DesktopMenu />

        {/* Botón menú mobile */}
        <button
          id="btnMenu"
          className="icon btnMenu desktop-hidden"
          onClick={toggleMenu}
          aria-label="Abrir menú"
        >
          <img src={menuIcon} alt="Menú" loading="lazy" />
        </button>
      </div>

      {/* Menu mobile */}
      <MobileMenu />
    </header>
  );
}

export default Navbar;

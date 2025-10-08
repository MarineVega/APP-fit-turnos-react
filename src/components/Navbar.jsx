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
    const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
    setUsuarioActivo(usuario);
  }, []);

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

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
        setUsuarioActivo(null);
        setMenuAbierto(false);
        navigate("/");
      }
    });
  };

  return (
    <header className="header">
      <div className="navbar">
        {/* === Zona izquierda === */}
        <div className="nav-left">
          {/* Logo */}
          <Link to="/" className="logo">
            <img src={Logo_Fit_Home} alt="Logo" loading="lazy" />
          </Link>

          {/* Icono hamburguesa SOLO visible en mobile */}
          <button id="btnMenu" className="icon btnMenu" onClick={toggleMenu}>
            <img src={menuIcon} alt="Menú" loading="lazy" />
          </button>

          {/* Menú de escritorio */}
          <div className="nav-links desktop-only">
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
        </div>

        {/* === Zona derecha === */}
        <div className="nav-right">
          <div className="nav-links desktop-only">
            {usuarioActivo ? (
              <>
                <span id="nombreUsuario">
                  {usuarioActivo.nombre}
                  {usuarioActivo.esAdmin && " (Admin)"}
                </span>
                <a href="#" onClick={cerrarSesion} id="menuCerrarSesion">
                  Cerrar Sesión
                </a>
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
          </div>

          {/* Iconos búsqueda y notificaciones */}
          <a href="#" className="icon">
            <img src={buscar} alt="Buscar" loading="lazy" />
          </a>
          <a href="#" className="icon">
            <img src={notif} alt="Notificaciones" loading="lazy" />
          </a>
        </div>
      </div>

      {/* === Menú desplegable mobile === */}
      <div
        id="menuDesplegable"
        className={`menu-desplegable ${menuAbierto ? "mostrar" : ""}`}
      >
        {usuarioActivo ? (
          <>
            <span id="nombreUsuarioMobile">
              {usuarioActivo.nombre}
              {usuarioActivo.esAdmin && " (Admin)"}
            </span>
            {usuarioActivo.esAdmin && (
              <Link
                to="/administrar"
                id="menuHamburguesaAdmin"
                onClick={() => setMenuAbierto(false)}
              >
                Administrar
              </Link>
            )}
            <Link
              to="/turnos"
              id="menuHamburguesaTurnos"
              onClick={() => setMenuAbierto(false)}
            >
              Turnos
            </Link>
            <a
              href="#"
              onClick={cerrarSesion}
              id="menuHamburguesaCerrarSesion"
            >
              Cerrar Sesión
            </a>
          </>
        ) : (
          <>
            <Link
              to="/cuenta"
              id="menuHamburguesaIniciarSesion"
              onClick={() => setMenuAbierto(false)}
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/cuenta?form=crear"
              id="menuHamburguesaCrearCuenta"
              onClick={() => setMenuAbierto(false)}
            >
              Crear Cuenta
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;

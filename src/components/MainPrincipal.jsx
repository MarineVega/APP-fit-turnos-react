
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";       

import Logo_Fit from "../assets/img/Logo_Fit.png";
import Logo_Medusa from "../assets/img/Logo_Medusa.jpg";
import icono_pilates from "../assets/img/icono_pilates.png";
import icono_padel from "../assets/img/icono_padel.png";
import icono_club from "../assets/img/icono_club.png";
import icono_yoga from "../assets/img/icono_yoga.png";
import icono_pesas from "../assets/img/icono_pesas.png";
import icono_instructor from "../assets/img/icono_instructor.png";
import icono_rehabilitacion from "../assets/img/icono_rehabilitacion.png";
import icono_natacion from "../assets/img/icono_natacion.png";
import videoIzquierda from "../assets/video/izquierda.mp4";
import videoDerecha from "../assets/video/derecha.mp4";

function MainPrincipal() {
  const navigate = useNavigate();     
  const [usuarioActivo, setUsuarioActivo] = useState(null);

  useEffect(() => {
    // Verifica si hay usuario logueado en localStorage
    const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
    setUsuarioActivo(usuario);

    // Escucha cambios de sesión (login/logout)
    const actualizarUsuario = () => {
      const nuevoUsuario = JSON.parse(localStorage.getItem("usuarioActivo"));
      setUsuarioActivo(nuevoUsuario);
    };

    window.addEventListener("usuarioActualizado", actualizarUsuario);
    return () => {
      window.removeEventListener("usuarioActualizado", actualizarUsuario);
    };
  }, []);

  return (
    <main className="mainPrincipal">
      <img className="logoFit" src={Logo_Fit} alt="Logo FIT Turnos" />

      <div className="contenedorIconos_1">
        <img src={icono_pilates} alt="Pilates" />
        <img src={icono_padel} alt="Pádel" />
        <img src={icono_club} alt="Club" />
        <img src={icono_yoga} alt="Yoga" />
      </div>

      <div className="contenedorIconos_2">
        <img src={icono_pesas} alt="Pesas" />
        <img src={icono_instructor} alt="Instructor" />
        <img src={icono_rehabilitacion} alt="Rehabilitación" />
        <img src={icono_natacion} alt="Natación" />
      </div>

      <div className="slogan">
        <p>Tu entrenamiento, tu horario, tu control</p>
      </div>        

      {/* 👇 Ocultar los botones si hay usuario activo */}
      {!usuarioActivo && (
        <>
          {/* Botón que navega a Cuenta */}
          <button
            id="botonIniciarSesion"
            className="btnAceptar"
            type="button"
            onClick={() => navigate("/cuenta")}
          >
            INICIAR SESIÓN
          </button>

          {/* Link que abre directo el formulario de registro */}
          <Link
            id="linkRegistrarse"
            to="/cuenta?form=crear"
            className="btnAceptar"
          >
            REGISTRARSE
          </Link>
        </>
      )}

      <img className="logoMedusa" src={Logo_Medusa} alt="Logo Medusa Soft" />

     {/* Video izquierdo */}
        <video
          className="video-lateral izquierda"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={videoIzquierda} type="video/mp4" />
        </video>

        {/* Video derecho */}
        <video
          className="video-lateral derecha"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={videoDerecha} type="video/mp4" />
        </video>

     
    </main>
  );
}

export default MainPrincipal;

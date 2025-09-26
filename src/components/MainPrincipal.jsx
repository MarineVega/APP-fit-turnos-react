
/*
import Logo_Fit from "../../public/assets/img/Logo_Fit.png"
import Logo_Medusa from "../../public/assets/img/Logo_Medusa.jpg"
import icono_pilates from "../../public/assets/img/icono_pilates.png"
import icono_padel from "../../public/assets/img/icono_padel.png"
import icono_club from "../../public/assets/img/icono_club.png"
import icono_yoga from "../../public/assets/img/icono_yoga.png"
import icono_pesas from "../../public/assets/img/icono_pesas.png"
import icono_instructor from "../../public/assets/img/icono_instructor.png"
import icono_rehabilitacion from "../../public/assets/img/icono_rehabilitacion.png"
import icono_natacion from "../../public/assets/img/icono_natacion.png"
*/
import React from 'react'
import { useNavigate, Link } from "react-router-dom";       // importa React Router

import Logo_Fit from "../assets/img/Logo_Fit.png"
import Logo_Medusa from "../assets/img/Logo_Medusa.jpg"
import icono_pilates from "../assets/img/icono_pilates.png"
import icono_padel from "../assets/img/icono_padel.png"
import icono_club from "../assets/img/icono_club.png"
import icono_yoga from "../assets/img/icono_yoga.png"
import icono_pesas from "../assets/img/icono_pesas.png"
import icono_instructor from "../assets/img/icono_instructor.png"
import icono_rehabilitacion from "../assets/img/icono_rehabilitacion.png"
import icono_natacion from "../assets/img/icono_natacion.png"

function MainPrincipal() {
    const navigate = useNavigate();     // hook de navegación

    return (
        
        <main className="mainPrincipal">
            
            <img className="logoFit" src={Logo_Fit} alt="Logo FIT Turnos" />

            <div className="contenedorIconos_1">
                <img src={icono_pilates} alt="Pilates"/>
                <img src={icono_padel} alt="Pádel"/>
                <img src={icono_club} alt="Club"/>
                <img src={icono_yoga} alt="Yoga"/>
            </div>

            <div className="contenedorIconos_2">
                <img src={icono_pesas} alt="Pesas"/>
                <img src={icono_instructor} alt="Instructor"/>
                <img src={icono_rehabilitacion} alt="Rehabilitación"/>
                <img src={icono_natacion} alt="Natación"/>
            </div>

            <div className="slogan">
                <p>Tu entrenamiento, tu horario, tu control</p>
            </div>        
            
            {/* <button id="botonIniciarSesion" className="btnAceptar" type="button" onclick="location.href='./pages/cuenta.html'">INICIAR SESIÓN</button>
                */}

            {/* <button id="botonIniciarSesion" className="btnAceptar" type="button" onclick={() => window.location.href=""} >INICIAR SESIÓN</button> */}

            {/* Botones */}

             {/* Botón que navega a Cuenta */}
            <button
                id="botonIniciarSesion"
                className="btnAceptar"
                type="button"
                onClick={() => navigate("/Cuenta")}
            >INICIAR SESIÓN
            </button>
{/* 
            <button
                id="botonIniciarSesion"
                className="btnAceptar"
                type="button"
                onClick={() => (window.location.href = "../pages/Cuenta.jsx")}
            >
                INICIAR SESIÓN
            </button> */}

            {/* <a id="linkRegistrarse" href="./pages/cuenta.html?form=crear" className="btnAceptar">REGISTRARSE</a> */}

            <Link id="linkRegistrarse" to="/cuenta?form=crear" className="btnAceptar">REGISTRARSE</Link>

{/* 
            <a
                id="linkRegistrarse"
                href="./pages/cuenta.html?form=crear"
                className="btnAceptar"
            >
            REGISTRARSE
            </a> */}

            <img className="logoMedusa" src={Logo_Medusa} alt="Logo Medusa Soft"/>
    
            {/* <!-- Video izquierdo --> */}
            
            {/* <video className="video-lateral izquierda" autoplay muted loop playsinline>
                <source src="../assets/video/izquierda.mp4" type="video/mp4" />       
            </video> */}

            {/* <video
                className="video-lateral izquierda"
                autoPlay
                muted
                loop
                playsInline
            >
                <source src="/assets/video/izquierda.mp4" type="video/mp4" />
            </video> */}

            {/* <!-- Video derecho --> */}
            {/* <video className="video-lateral derecha" autoplay muted loop playsinline>
                <source src="../assets/video/derecha.mp4" type="video/mp4" />    
            </video>  */}
{/* 
            <video
                className="video-lateral derecha"
                autoPlay
                muted
                loop
                playsInline
            >
                <source src="/assets/video/derecha.mp4" type="video/mp4" />
            </video> */}
            
        </main>

       
    )
 
}

export default MainPrincipal
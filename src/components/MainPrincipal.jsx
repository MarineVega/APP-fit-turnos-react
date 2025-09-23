import React from 'react'
import Logo_Fit from "../assets/img/Logo_Fit.png"
import icono_pilates from "../assets/img/icono_pilates.png"
import icono_padel from "../assets/img/icono_padel.png"
import icono_club from "../assets/img/icono_club.png"
import icono_yoga from "../assets/img/icono_yoga.png"
import icono_pesas from "../assets/img/icono_pesas.png"
import icono_instructor from "../assets/img/icono_instructor.png"
import icono_rehabilitacion from "../assets/img/icono_rehabilitacion.png"
import icono_natacion from "../assets/img/icono_natacion.png"

 function MainPrincipal() {
    return (
        <>
            <div className="mainPrincipal">
               
                <img className="logoFit" src={Logo_Fit} alt="Logo FIT Turnos" />

                <div className="contenedorIconos_1">
                    <img src={icono_pilates} alt=""/>
                    <img src={icono_padel} alt=""/>
                    <img src={icono_club} alt=""/>
                    <img src={icono_yoga} alt=""/>
                </div>

                <div className="contenedorIconos_2">
                    <img src={icono_pesas} alt=""/>
                    <img src={icono_instructor} alt=""/>
                    <img src={icono_rehabilitacion} alt=""/>
                    <img src={icono_natacion} alt=""/>
                </div>
{/* 
                <div className="slogan">
                    <p>Tu entrenamiento, tu horario, tu control</p>
                </div>        
                
                <button id="botonIniciarSesion" className="btnAceptar" type="button" onclick="location.href='./pages/cuenta.html'">INICIAR SESIÓN</button>
                <a id="linkRegistrarse" href="./pages/cuenta.html?form=crear" className="btnAceptar">REGISTRARSE</a>        

                <img className="logoMedusa" src={Logo_Medusa} alt="Logo Medusa Soft"/> */}
        
                {/* <!-- Video izquierdo --> */}
{/*                 
                <video className="video-lateral izquierda" autoplay muted loop playsinline>
                    <source src="./assets/video/izquierda.mp4" type="video/mp4" />       
                </video> */}

                {/* <!-- Video derecho --> */}
{/*                 
                <video className="video-lateral derecha" autoplay muted loop playsinline>
                    <source src="./assets/video/derecha.mp4" type="video/mp4" />    
                </video>  */}
            </div>

        </>
    )
 
}

export default MainPrincipal
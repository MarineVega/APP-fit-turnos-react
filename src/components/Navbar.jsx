import React from 'react'
import Logo_Fit_Home from "../assets/img/Logo_Fit_Home.png"
import menu from "../assets/img/menu.png"
import buscar from "../assets/img/buscar.png"
import notif from "../assets/img/notif.png"

function Navbar (){
    return (
        <>
            <div className="navbar">
                {/* Zona izquierda */}
                <div className="nav-left">
                
                    {/* <!-- Logo --> */}
                    <a href="#" className="logo">
                        <img src={Logo_Fit_Home} alt="Logo" loading="lazy" />
                    </a>
                    {/* <!-- icono hamburguesa SOLO en mobile --> */}
                    <a href="#" className="icon" id="btnMenu">
                        <img src={menu} alt="Menú" loading="lazy" />
                    </a>

                    {/* <!-- menu visible solo en escritorio --> */}
                    <div className="nav-links desktop-only">
                        <a href="./pages/turnos.html" id="menuTurnos">Turnos</a>
                        <a href="./pages/administrar.html" id="menuAdmin">Administrar</a>
                    </div>

                </div>

                {/* <!-- Zona derecha --> */}
                <div className="nav-right">
                    {/* <!-- Menú visible solo en escritorio --> */}
                    <div className="nav-links desktop-only">

                        <a href="#" id="nombreUsuario" style={{display: "none"}}></a> 

                        <a href="./pages/cuenta.html" id="menuIniciarSesion">Iniciar Sesión</a>
                        <a href="./pages/cuenta.html?form=crear" id="menuCrearCuenta">Crear Cuenta</a>
                        
                        <a href="./index.html" id="menuCerrarSesion">Cerrar Sesión</a> 
                    </div>

                    {/* <!-- iconos --> */}
                    <a href="#" className="icon">
                        <img src={buscar} alt="Buscar" loading="lazy" />
                    </a>
                    <a href="#" className="icon">
                        <img src={notif} alt="Notificaciones" loading="lazy" />
                    </a>
                </div>

            </div>
        </>
    )
}

export default Navbar
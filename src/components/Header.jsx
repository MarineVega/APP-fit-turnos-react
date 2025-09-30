import React from 'react'
import Navbar from './Navbar'

export default function Header (){
    return (
       
        <div className="header">
            <Navbar></Navbar>

            {/* <!-- Menú desplegable mobile --> */}
            <div className="menu-desplegable" id="menuDesplegable">

                <a href="#" id="nombreUsuarioMobile" style={{display: "none"}}></a>

                <a href="./pages/cuenta.html" id="menuHamburguesaIniciarSesion">Iniciar Sesión</a>
                <a href="./pages/cuenta.html?form=crear" id="menuHamburguesaCrearCuenta">Crear Cuenta</a>
            
                <a href="./pages/administrar.html" id="menuHamburguesaAdmin">Administrar</a>        
                <a href="./pages/turnos.html" id="menuHamburguesaTurnos">Turnos</a>
                
                <a href="./index.html" id="menuHamburguesaCerrarSesion">Cerrar Sesión</a> 
            </div> 
        </div>       
    )
}


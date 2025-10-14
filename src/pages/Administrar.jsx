import React from 'react';
import { useNavigate, Link } from "react-router-dom";       // importa React Router

export default function Administrar() {
  const navigate = useNavigate();     // hook de navegación
  
  return (
    <>      
      <main className="mainAdministrar">

        <section className="card">          
          <button
            className="btnAceptar"
            type="button"
            onClick={() => navigate("/Actividad?modo=agregar")}
          >Agregar Actividad
          </button>

          <button
            className="btnAceptar"
            type="button"
            onClick={() => navigate("/Actividad?modo=editar")}
          >Modificar Actividad
          </button>

          <button
            className="btnAceptar"
            type="button"
            onClick={() => navigate("/Actividad?modo=eliminar")}
          >Eliminar Actividad
          </button>

          <button
            className="btnAceptar"
            type="button"
            onClick={() => navigate("/Actividad?modo=consultar")}
          >Actividades
          </button>          
        </section>

        <section className="card">
          <button
            className="btnAceptar"
            type="button"
            onClick={() => navigate("/Horario?modo=agregar")}
          >Agregar Horario
          </button>

          <button
            className="btnAceptar"
            type="button"
            onClick={() => navigate("/Horario?modo=editar")}
          >Modificar Horario
          </button>

          <button
            className="btnAceptar"
            type="button"
            onClick={() => navigate("/Horario?modo=eliminar")}
          >Eliminar Horario
          </button>

          <button
            className="btnAceptar"
            type="button"
            onClick={() => navigate("/Horario?modo=consultar")}
          >Horarios
          </button>       
        </section>
        
        
      </main>

    </>
  )
}
import React from 'react'
import { useNavigate } from "react-router-dom";
import flecha from "../assets/img/icono_flecha_atras.png";
import "../styles/style.css";

const TituloConFlecha = ({ children, destino = null }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (destino) {
      navigate(destino);  // va al destino pasado por props
    } else {
      navigate(-1);       // comportamiento por defecto (volver)
    }
  };

  return (
    <div className="tituloConFlecha">
        <img 
          id="flechaVolver"
          className="flecha"
          src={flecha}
          alt="Volver"
          onClick={handleClick}
          style={{ width: "20px", height: "20px" }}
        />
        <p id="titulo">{children}</p>
      
      <span className="flechaInvisible">&#x2192;</span>
    </div>
  );
};

export default TituloConFlecha;


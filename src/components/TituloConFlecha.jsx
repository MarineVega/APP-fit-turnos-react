import React from 'react'
import { useNavigate } from "react-router-dom";
import flecha from "../assets/img/icono_flecha_atras.png";
import "../styles/style.css";

const TituloConFlecha = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className="tituloConFlecha">
        <img 
          id="flechaVolver"
          className="flecha"
          src={flecha}
          alt="Volver"
          onClick={() => navigate(-1)}
          style={{ width: "20px", height: "20px" }}
        />
        <p id="titulo">{children}</p>
      
      <span className="flechaInvisible">&#x2192;</span>
    </div>
  );
};

export default TituloConFlecha;


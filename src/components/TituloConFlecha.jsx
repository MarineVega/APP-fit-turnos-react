import React from 'react'
import { useNavigate } from "react-router-dom";
import flecha from "../assets/img/icono_flecha_atras.png";
import "../styles/style.css";

const TituloConFlecha = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className="tituloConFlecha">
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <img
          id="flechaVolver"
          className="flecha"
          src={flecha}
          alt="Volver"
          onClick={() => navigate(-1)}
          style={{ width: "20px", height: "20px" }}
        />
        <h1 id="modoTitulo">{children}</h1>
      </div>
      
      <span className="flechaInvisible">&#x2192;</span>
    </div>
  );
};

export default TituloConFlecha;



{/* 
const TituloConFlecha = ({ titulo = "", destino = -1 }) => {
  const navigate = useNavigate();

  return (
    <div className="tituloConFlecha">
      {/* Flecha izquierda 
      <img
        id="flechaVolver"
        className="flecha"
        src={flecha}
        alt="Volver"
        onClick={() => navigate(destino)}
        style={{ width: "24px", height: "24px", cursor: "pointer" }}
      />

      {/* Título centrado 
      <h2 id="modoTitulo" style={{ margin: "0 auto", textAlign: "center" }}>
        {titulo}
      </h2>

      {/* Flecha invisible para mantener simetría 
      <span className="flechaInvisible">&#x2192;</span>
    </div>
  );
};

export default TituloConFlecha;
*/}
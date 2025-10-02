import { useNavigate } from "react-router-dom";
import flecha from "../assets/img/icono_flecha_atras.png";
import "../styles/style.css";


const TituloConFlecha = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className="tituloConFlecha">
      {/* Contenedor izquierdo */}
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

      {/* Para balancear y que el título quede centrado */}
      <span className="flechaInvisible">&#x2192;</span>
    </div>
  );
};

export default TituloConFlecha;



import React from "react";
import "../components/Card.css";

import { useNavigate } from "react-router-dom";

export default function Card({ titulo, tipo, imagen, contenido, acciones, base }) {
  const navigate = useNavigate();

  /*
  Cuando voy desde una card de Administrar (por ejemplo, “Horarios → Agregar”), y luego hago clic en la flecha de “volver” (TituloConFlecha), la página vuelva a la misma posición de scroll donde estaba esa card, en lugar de volver al principio de la página.
  */

  const handleAccion = (modo) => {
    // guardo la posición del scroll actual
    sessionStorage.setItem("scrollY_admin", window.scrollY);

    // navego normalmente
    navigate(`${base}?modo=${modo}`);
  };

  return (
    <section className="card">
      <h2>{titulo}</h2>

      {/* 🔹 Tarjeta informativa */}
      {tipo === "info" && (
        <>
          {contenido}
          <img src={imagen} alt={titulo} />
        </>
      )}

      {/* 🔹 Tarjeta de acciones */}
      {tipo === "acciones" && (
        <>
          <ul>
            {acciones.map((accion, i) => (
              <li key={i}>
                <button
                  className="botonLink"
                  //onClick={() => navigate(`${base}?modo=${accion.modo}`)}
                  onClick={() => handleAccion(accion.modo)}
                >
                  {accion.texto}
                </button>
                <button
                  className="icon"
                  //onClick={() => navigate(`${base}?modo=${accion.modo}`)}
                  onClick={() => handleAccion(accion.modo)}
                >
                  {accion.icono}
                </button>
              </li>
            ))}
          </ul>

          <img src={imagen} alt={titulo} />
        </>
      )}
    </section>
  );
}

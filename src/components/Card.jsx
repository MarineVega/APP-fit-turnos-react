import React from "react";
import "../components/Card.css";

import { useNavigate } from "react-router-dom";

export default function Card({ titulo, tipo, imagen, contenido, acciones, base }) {
  const navigate = useNavigate();

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
                  onClick={() => navigate(`${base}?modo=${accion.modo}`)}
                >
                  {accion.texto}
                </button>
                <button
                  className="icon"
                  onClick={() => navigate(`${base}?modo=${accion.modo}`)}
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

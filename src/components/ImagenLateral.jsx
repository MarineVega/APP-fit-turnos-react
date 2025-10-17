import React from "react";

export default function ImagenLateral({ imgIzquierda, imgDerecha, altIzq, altDer }) {
  return (
    <div className="contenedor-lateral desktop-only">
      {imgIzquierda && (
        <img
          src={imgIzquierda}
          alt={altIzq || "Imagen lateral izquierda"}
          className="imagen-lateral-actividad izquierda"
        />
      )}
      {imgDerecha && (
        <img
          src={imgDerecha}
          alt={altDer || "Imagen lateral derecha"}
          className="imagen-lateral-actividad derecha"
        />
      )}
    </div>
  );
}

import imgIzquierda from "../assets/img/cuenta2.png";
import imgDerecha from "../assets/img/cuenta1.png";

export default function ImagenLateral({ altIzq, altDer }) {
  return (
    <div className="contenedor-lateral desktop-only">
      <img
        src={imgIzquierda}
        alt={altIzq || "Imagen lateral izquierda"}
        className="imagen-lateral-actividad izquierda"
      />
      <img
        src={imgDerecha}
        alt={altDer || "Imagen lateral derecha"}
        className="imagen-lateral-actividad derecha"
      />
    </div>
  );
}

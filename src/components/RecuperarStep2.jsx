import { useState } from "react";
import FormCampos from "./FormCampos.jsx";
import FormBotones from "./FormBotones.jsx";
import TituloConFlecha from "./TituloConFlecha.jsx";

export default function RecuperarStep2({ onSwitch }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleNext = (e) => {
    e.preventDefault();
    if (!code) return setError("Ingresá el código recibido");
    onSwitch("recuperar3");
  };

  return (
    <form onSubmit={handleNext} className="formCuenta">
      <TituloConFlecha>Recuperar Cuenta</TituloConFlecha>

      <FormCampos
        label="Código"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        name="codigo"
        className="inputCuenta"
      />

      {error && <p className="advertencia">{error}</p>}
      <div className="contenedorBotones">
      <FormBotones
        boton1={{
          id: "btnSiguiente",
          label: "Siguiente",
          className: "btnAceptar",
          onClick: handleNext,
        }}
         boton2={{
          id: "btnCancelar",
          label: "Cancelar",
          className: "btnCancelar",
          onClick: () => navigate("/"),
        }}
      />

      {/* 🔗 Link */}
      <p className="link" onClick={() => onSwitch("login")}>
        Volver al login
      </p>
      </div>
    </form>
  );
}

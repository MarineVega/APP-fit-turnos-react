import { useState } from "react";
import FormCampos from "./FormCampos.jsx";
import FormBotones from "./FormBotones.jsx";

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
      <FormCampos
        label="Código"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        name="codigo"
      />

      {error && <p className="advertencia">{error}</p>}

      <FormBotones
        boton1={{
          id: "btnSiguiente",
          label: "Siguiente",
          className: "btnAceptar",
          onClick: handleNext,
        }}
      />

      {/* 🔗 Link */}
      <p className="link" onClick={() => onSwitch("login")}>
        Volver al login
      </p>
    </form>
  );
}

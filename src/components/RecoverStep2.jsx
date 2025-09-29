// src/components/RecoverStep2.jsx
import { useState } from "react";

export default function RecoverStep2({ onSwitch }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleNext = (e) => {
    e.preventDefault();
    if (!code) return setError("Ingresá el código recibido");
    // Simulación verificación
    onSwitch("recover3");
  };

  return (
    <form onSubmit={handleNext} className="formCuenta">
      <label>Código</label>
      <input value={code} onChange={(e) => setCode(e.target.value)} />
      {error && <p className="advertencia">{error}</p>}
      <button type="submit">Siguiente</button>
      <p onClick={() => onSwitch("login")}>Volver al login</p>
    </form>
  );
}

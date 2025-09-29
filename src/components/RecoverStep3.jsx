// src/components/RecoverStep3.jsx
import { useState } from "react";
import Swal from "sweetalert2";

export default function RecoverStep3({ onSwitch }) {
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");

  const handleReset = (e) => {
    e.preventDefault();
    setError("");
    if (!password || !password2) return setError("Completá todos los campos");
    if (password !== password2) return setError("Las contraseñas no coinciden");

    Swal.fire({
      title: "Contraseña actualizada",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    }).then(() => onSwitch("login"));
  };

  return (
    <form onSubmit={handleReset} className="formCuenta">
      <label>Nueva Contraseña</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <label>Repetir Contraseña</label>
      <input
        type="password"
        value={password2}
        onChange={(e) => setPassword2(e.target.value)}
      />
      {error && <p className="advertencia">{error}</p>}
      <button type="submit">Actualizar</button>
      <p onClick={() => onSwitch("login")}>Volver al login</p>
    </form>
  );
}

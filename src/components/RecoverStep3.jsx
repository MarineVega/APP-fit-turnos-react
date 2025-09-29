import { useState } from "react";
import Swal from "sweetalert2";

export default function RecoverStep3({ onSwitch }) {
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmar) {
      setError("Completá todos los campos.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    Swal.fire("¡Contraseña actualizada!", "Ya podés iniciar sesión", "success");
    localStorage.removeItem("codigoRecuperacion");
    onSwitch("login");
  };

  return (
    <form className="formCuenta" onSubmit={handleSubmit}>
      <div>
        <label>Nueva Contraseña</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div>
        <label>Confirmar Nueva Contraseña</label>
        <input type="password" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} />
      </div>
      <p className="advertencia">{error}</p>
      <button type="submit">CONFIRMAR</button>
    </form>
  );
}

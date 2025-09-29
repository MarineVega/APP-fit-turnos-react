import { useState } from "react";
import Swal from "sweetalert2";

export default function RecoverStep2({ onSwitch }) {
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const codigoGuardado = localStorage.getItem("codigoRecuperacion");
    if (!codigo) {
      setError("Ingresá el código de seguridad.");
      return;
    }
    if (codigo !== codigoGuardado) {
      Swal.fire("Código incorrecto", "Revisá tu correo", "error");
      return;
    }

    onSwitch("recover3");
  };

  const reenviarCodigo = () => {
    const nuevoCodigo = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem("codigoRecuperacion", nuevoCodigo);
    Swal.fire("Código reenviado", "Revisá tu correo nuevamente", "info");
  };

  return (
    <form className="formCuenta" onSubmit={handleSubmit}>
      <div>
        <label>Código de Seguridad</label>
        <input type="text" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
      </div>
      <p className="advertencia">{error}</p>
      <button type="submit">CONFIRMAR</button>
      <p><a href="#" onClick={reenviarCodigo}>Reenviar código</a></p>
    </form>
  );
}

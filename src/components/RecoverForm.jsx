// src/components/RecoverForm.jsx
import { useState } from "react";
import Swal from "sweetalert2";

export default function RecoverForm({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRecover = async (e) => {
    e.preventDefault();
    setError("");
    if (!email) return setError("Ingresá tu correo.");

    setLoading(true);
    try {
      // Simulación envío de código
      Swal.fire({
        title: "Código enviado",
        text: "Revisá tu correo",
        icon: "success",
      }).then(() => onSwitch("recover2"));
    } catch (err) {
      setError("Error al enviar el correo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRecover} className="formCuenta">
      <label>Email</label>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      {error && <p className="advertencia">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? "Cargando..." : "Enviar código"}
      </button>
      <p onClick={() => onSwitch("login")}>Volver al login</p>
    </form>
  );
}

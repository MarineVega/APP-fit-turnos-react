import { useState } from "react";
import Swal from "sweetalert2";

export default function RecuperarForm({ onSwitch }) {
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
      }).then(() => {
        setLoading(false);
        onSwitch("recuperar2");
      });
    } catch (err) {
      setError("Error al enviar el correo");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRecover} className="formCuenta">
      <label>Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {error && <p className="advertencia">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? "Cargando..." : "Enviar código"}
      </button>
      <p onClick={() => onSwitch("login")}>Volver al login</p>
    </form>
  );
}

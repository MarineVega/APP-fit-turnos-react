// src/components/RegisterForm.jsx
import { useState } from "react";
import Swal from "sweetalert2";

export default function RegisterForm({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password || !password2)
      return setError("Completá todos los campos.");
    if (password !== password2) return setError("Las contraseñas no coinciden.");

    setLoading(true);
    try {
      // Simulación registro
      Swal.fire({
        title: "¡Usuario registrado!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => onSwitch("login"));
    } catch (err) {
      setError("Error al registrar el usuario");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="formCuenta">
      <label>Email</label>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />

      <label>Contraseña</label>
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

      <button type="submit" disabled={loading}>
        {loading ? "Cargando..." : "Registrar"}
      </button>

      <p onClick={() => onSwitch("login")}>Volver al login</p>
    </form>
  );
}

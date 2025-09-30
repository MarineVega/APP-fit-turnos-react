// src/components/LoginForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginForm({ onSwitch }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) return setError("Completá todos los campos.");

    setLoading(true);
    try {
      const res = await login(email, password);
      if (!res.ok) return setError(res.msg);

      Swal.fire({
        title: "¡Bienvenido!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => navigate("/"));
    } catch (err) {
      setError("No se pudo conectar con el servidor");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="formCuenta">
      <div>
      <label>Email</label>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />

      <label>Contraseña</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="advertencia">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Cargando..." : "Ingresar"}
      </button>

      <p onClick={() => onSwitch("registrar")}>Crear cuenta</p>
      <p onClick={() => onSwitch("recuperar1")}>Olvidé mi contraseña</p>
      </div>
    </form>
  );
}

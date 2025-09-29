import { useState } from "react";
import Swal from "sweetalert2";
import { registerUser } from "../services/api";

export default function RegisterForm({ onSwitch }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [esAdmin, setEsAdmin] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!nombre || !email || !password || !confirmar) {
      setError("Completá todos los campos.");
      return;
    }
    if (/\s/.test(nombre)) {
      setError("El nombre de usuario no puede contener espacios.");
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

    try {
      await registerUser({ nombre, email, password, esAdmin });
      Swal.fire("¡Operación Exitosa!", "Tu cuenta ha sido creada", "success");
      onSwitch("login");
    } catch (err) {
      setError(err.message || "Error al registrar usuario");
    }
  };

  return (
    <form className="formCuenta" onSubmit={handleSubmit}>
      <div>
        <label>Nombre de Usuario</label>
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
      </div>
      <div>
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Contraseña</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div>
        <label>Confirmar Contraseña</label>
        <input type="password" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} />
      </div>
      <div>
        <label>
          <input type="checkbox" checked={esAdmin} onChange={(e) => setEsAdmin(e.target.checked)} />
          Crear como administrador
        </label>
      </div>
      <p className="advertencia">{error}</p>
      <button type="submit">REGISTRARSE</button>
      <p><a href="#" onClick={() => onSwitch("login")}>Ya tenés cuenta? Iniciar sesión</a></p>
    </form>
  );
}

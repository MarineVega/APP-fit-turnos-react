import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
//import { useAuth } from "../../context/AuthContext";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) return setError("Completá todos los campos.");

    const res = await login(email, password);
    if (!res.ok) return setError(res.msg);

    Swal.fire({ title: "¡Bienvenido!", icon: "success" }).then(() =>
      navigate("/")
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Email</label>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />

      <label>Contraseña</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="adventencia">{error}</p>}
      <button type="submit">CONFIRMAR</button>
    </form>
  );
}
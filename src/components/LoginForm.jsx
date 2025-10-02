import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import FormCampos from "./FormCampos.jsx";
import FormBotones from "./FormBotones.jsx";
import TituloConFlecha from "./TituloConFlecha.jsx";

export default function LoginForm({ onSwitch }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Verificar si ya hay usuario logueado
  useEffect(() => {
    const usuarioActivo = JSON.parse(localStorage.getItem("user"));
    if (usuarioActivo) navigate("/"); // Redirige si ya está logueado
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) return setError("Completá todos los campos.");

    setLoading(true);

    setTimeout(() => {
      // Buscar usuario en localStorage
      const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
      const usuario = usuarios.find(u => u.email === email && u.password === password);

      if (usuario) {
        localStorage.setItem("user", JSON.stringify({ name: usuario.name, email: usuario.email }));
        Swal.fire({
          title: "¡Bienvenido!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => navigate("/"));
      } else {
        setError("Usuario o contraseña incorrecta");
      }

      setLoading(false);
    }, 300); // Simula espera de servidor
  };

  return (
    <form onSubmit={handleSubmit} className="formCuenta">
      <TituloConFlecha>Iniciar Sesión</TituloConFlecha>

      <FormCampos
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        name="email"
        className="inputCuenta"
      />

      <FormCampos
        label="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        name="password"
        className="inputCuenta"
      />

      {error && (
        <div className="contenedorError">
          <p className="adventencia">{error}</p>
        </div>
      )}

      <div className="contenedorBotones">
        <FormBotones
          boton1={{
            id: "btnIngresar",
            label: loading ? "Cargando..." : "Ingresar",
            className: "btnAceptar",
            onClick: handleSubmit,
          }}
          boton2={{
            id: "btnCancelar",
            label: "Cancelar",
            className: "btnCancelar",
            onClick: () => navigate("/"),
          }}
        />

        <p className="link" onClick={() => onSwitch("registrar")}>
          Crear cuenta
        </p>
        <p className="link" onClick={() => onSwitch("recuperar1")}>
          Olvidé mi contraseña
        </p>
      </div>
    </form>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext.jsx";
import FormCampos from "./FormCampos.jsx";
import FormBotones from "./FormBotones.jsx";
import TituloConFlecha from "./TituloConFlecha.jsx";

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

       {/* Aquí el error */}
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

      {/* 🔗 Links */}
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

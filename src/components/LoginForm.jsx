import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import FormCampos from "./FormCampos.jsx";
import FormBotones from "./FormBotones.jsx";
import TituloConFlecha from "./TituloConFlecha.jsx";
import checkmark from "../assets/img/exito.png"   

export default function LoginForm({ onSwitch }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Si ya hay usuario logueado, redirige
  useEffect(() => {
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    if (usuarioActivo) navigate("/turnos");
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Completá todos los campos.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
      const usuario = usuarios.find(
        (u) => u.email === email && u.password === password
      );

      if (usuario) {
        localStorage.setItem("usuarioActivo", JSON.stringify(usuario));

        // Notificar a otros componentes
        window.dispatchEvent(new Event("usuarioActualizado"));

        Swal.fire({
          title: "¡Bienvenido!"+ (usuario.esAdmin ? " Administrador" : ""),
          imageUrl: checkmark,
          imageHeight: 100,
          imageAlt: "Checkmark",
          icon: "success",
          confirmButtonText: "Cerrar"

        }).then(() => navigate("/turnos"));
            
      
      } else {
        setError("Usuario o contraseña incorrecta");
      }

      setLoading(false);
    }, 300);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError("");
  };

  return (
    <form onSubmit={handleSubmit} className="formCuenta">
      <TituloConFlecha>Iniciar Sesión</TituloConFlecha>

      <FormCampos
        label="Email"
        type="email"
        value={email}
        onChange={handleEmailChange}
        name="email"
        className="inputCuenta"
      />

      <FormCampos
        label="Contraseña"
        type="password"
        value={password}
        onChange={handlePasswordChange}
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
            type: "submit",
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

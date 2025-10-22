import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import FormCampos from "./FormCampos.jsx";
import FormBotones from "./FormBotones.jsx";
import TituloConFlecha from "./TituloConFlecha.jsx";
import "../styles/style.css";

export default function RecuperarStep3({ onSwitch }) {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = (e) => {
    e.preventDefault();
    setError("");

    // Validaciones
    if (!password || !password2)
      return setError("Completá todos los campos.");

    if (password.length < 6)
      return setError("La contraseña debe tener al menos 6 caracteres.");

    if (password !== password2)
      return setError("Las contraseñas no coinciden.");

    setLoading(true);

    // Recuperar usuarios y correo en recuperación
    const email = localStorage.getItem("emailRecuperacion");
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const usuarioIndex = usuarios.findIndex((u) => u.email === email);

    if (usuarioIndex === -1) {
      setError("No se encontró el usuario asociado al correo.");
      setLoading(false);
      return;
    }

    // Actualizar contraseña
    usuarios[usuarioIndex].password = password;
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    // Limpiar datos temporales
    localStorage.removeItem("codigoRecuperacion");
    localStorage.removeItem("emailRecuperacion");

    Swal.fire({
      title: "Contraseña actualizada",
      text: "Tu nueva contraseña fue guardada con éxito.",
      icon: "success",
      confirmButtonColor: "#6edc8c",
      confirmButtonText: "Iniciar sesión",
    }).then(() => {
      onSwitch("login");
      setLoading(false);
    });
  };

  return (
    <>
      <TituloConFlecha>Restablecer Contraseña</TituloConFlecha>

      <form onSubmit={handleReset} className="formCuenta">
        <FormCampos
          label="Nueva Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          className="inputCuenta"
        />

        <FormCampos
          label="Repetir Contraseña"
          type="password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          name="password2"
          className="inputCuenta"
        />

        {/* Error en rojo debajo del campo */}
        {error && (
          <div className="contenedorError">
            <p className="adventencia">{error}</p>
          </div>
        )}

        <div className="contenedorBotones">
          <FormBotones
            boton1={{
              id: "btnActualizar",
              label: loading ? "Cargando..." : "Actualizar",
              className: "btnCuentaLogin",
              type: "submit",
            }}
            boton2={{
              id: "btnCancelar",
              label: "Cancelar",
              className: "btnCancelar",
              onClick: () => navigate("/"),
            }}
          />

          {/* 🔗 Link */}
          <p className="link" onClick={() => onSwitch("login")}>
            Volver al login
          </p>
        </div>
      </form>
    </>
  );
}

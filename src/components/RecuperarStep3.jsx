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

  const handleReset = async (e) => {
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

    const email = localStorage.getItem("emailRecuperacion");
    if (!email) {
      setError("No se encontró el email para recuperación.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
   });
   

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Error al actualizar la contraseña.");
        setLoading(false);
        return;
      }

      // Limpiar
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
    } catch (err) {
      setError("Error al conectar con el servidor.");
      setLoading(false);
    }
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

          <p className="link" onClick={() => onSwitch("login")}>
            Volver al login
          </p>
        </div>
      </form>
    </>
  );
}

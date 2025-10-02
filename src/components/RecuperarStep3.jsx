import { useState } from "react";
import Swal from "sweetalert2";
import FormCampos from "./FormCampos.jsx";
import FormBotones from "./FormBotones.jsx";
import TituloConFlecha from "./TituloConFlecha.jsx";

export default function RecuperarStep3({ onSwitch }) {
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");

  const handleReset = (e) => {
    e.preventDefault();
    setError("");
    if (!password || !password2) return setError("Completá todos los campos");
    if (password !== password2) return setError("Las contraseñas no coinciden");

    Swal.fire({
      title: "Contraseña actualizada",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    }).then(() => onSwitch("login"));
  };

  return (
    <form onSubmit={handleReset} className="formCuenta">
      <TituloConFlecha>Recuperar Cuenta</TituloConFlecha>

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
 {/* Aquí el error */}
      {error && (
        <div className="contenedorError">
          <p className="adventencia">{error}</p>
        </div>
      )}
      
      <div className="contenedorBotones">
      <FormBotones
        boton1={{
          id: "btnActualizar",
          label: "Actualizar",
          className: "btnAceptar",
          onClick: handleReset,
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
  );
}

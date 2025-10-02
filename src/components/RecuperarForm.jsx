import { useState } from "react";
import Swal from "sweetalert2";
import FormCampos from "./FormCampos.jsx";
import FormBotones from "./FormBotones.jsx";
import TituloConFlecha from "./TituloConFlecha.jsx";

export default function RecuperarForm({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRecover = async (e) => {
    e.preventDefault();
    setError("");
    if (!email) return setError("Ingresá tu correo.");

    setLoading(true);
    try {
      Swal.fire({
        title: "Código enviado",
        text: "Revisá tu correo",
        icon: "success",
      }).then(() => {
        setLoading(false);
        onSwitch("recuperar2");
      });
    } catch (err) {
      setError("Error al enviar el correo");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRecover} className="formCuenta">
      <TituloConFlecha>Recuperar Cuenta</TituloConFlecha>

      <FormCampos
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        name="email"
        className="inputCuenta"
      />

      {error && <p className="advertencia">{error}</p>}
     <div className="contenedorBotones">
      <FormBotones
        boton1={{
          id: "btnEnviarCodigo",
          label: loading ? "Cargando..." : "Enviar código",
          className: "btnAceptar",
          onClick: handleRecover,
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

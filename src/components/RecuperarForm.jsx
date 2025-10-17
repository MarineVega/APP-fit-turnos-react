import { useState } from "react";
import Swal from "sweetalert2";
import emailjs from "@emailjs/browser";
import FormCampos from "./FormCampos.jsx";
import FormBotones from "./FormBotones.jsx";
import TituloConFlecha from "./TituloConFlecha.jsx";

export default function RecuperarForm({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const generarCodigo = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

  const handleRecover = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) return setError("Ingresá tu correo.");
    setLoading(true);

    const codigo = generarCodigo();
    localStorage.setItem("codigoRecuperacion", codigo);

    try {
      await emailjs.send(
        "service_vq2s3hg",
        "template_tth5c7f",
        { email, codigo },
        "K_tWHwFkHy42ZpWnU"
      );

      Swal.fire({
        title: "Código enviado",
        text: "Revisá tu correo para continuar",
        icon: "success",
      }).then(() => {
        setLoading(false);
        onSwitch("recuperar2");
      });
    } catch (err) {
      console.error("Error:", err);
      setError("No se pudo enviar el correo. Intentalo más tarde.");
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

       {/* Aquí el error */}
      {error && (
        <div className="contenedorError">
          <p className="adventencia">{error}</p>
        </div>
      )}

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
            onClick: () => onSwitch("login"),
          }}
        />
      </div>
    </form>
  );
}

import { useState } from "react";
import Swal from "sweetalert2";
import emailjs from "@emailjs/browser";
import FormCampos from "./FormCampos.jsx";
import FormBotones from "./FormBotones.jsx";
import TituloConFlecha from "./TituloConFlecha.jsx";
import "../styles/style.css";

export default function RecuperarStep2({ onSwitch }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNext = (e) => {
    e.preventDefault();
    setError("");

    if (!code) return setError("Ingresá el código recibido.");

    const codigoGuardado = localStorage.getItem("codigoRecuperacion");
    if (code === codigoGuardado) {
      Swal.fire({
        title: "Código verificado ✅",
        text: "Podés crear una nueva contraseña.",
        icon: "success",
        confirmButtonColor: "#6edc8c",
      }).then(() => onSwitch("recuperar3"));
    } else {
      setError("El código ingresado no es correcto.");
    }
  };

  const handleResend = async () => {
    const email = localStorage.getItem("emailRecuperacion"); // 👈 lo guardamos en Step1
    if (!email) return;

    const nuevoCodigo = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem("codigoRecuperacion", nuevoCodigo);

    setLoading(true);
    try {
      await emailjs.send(
        "service_vq2s3hg", // tu ID de servicio
        "template_tth5c7f", // tu plantilla
        { email, codigo: nuevoCodigo },
        "K_tWHwFkHy42ZpWnU" // tu clave pública
      );

      Swal.fire({
        title: "Código reenviado ✉️",
        text: "Revisá tu correo nuevamente.",
        icon: "info",
        confirmButtonColor: "#6edc8c",
      });
    } catch (err) {
      console.error("Error al reenviar:", err);
      setError("No se pudo reenviar el código. Intentalo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TituloConFlecha>Verificación de Código</TituloConFlecha>

      <form onSubmit={handleNext} className="formCuenta">
        <FormCampos
          label="Código de verificación"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            if (error) setError("");
          }}
          name="codigo"
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
              id: "btnSiguiente",
              label: loading ? "Cargando..." : "Siguiente",
              className: "btnCuentaLogin",
              type: "submit",
            }}
            boton2={{
              id: "btnCancelar",
              label: "Cancelar",
              className: "btnCancelar",
              onClick: () => onSwitch("login"),
            }}
          />

          {/* Reenviar código */}
          <p className="link" onClick={handleResend}>
            Reenviar código
          </p>
        </div>
      </form>
    </>
  );
}

import { useState } from "react";
import Swal from "sweetalert2";
import emailjs from "@emailjs/browser";
import FormCampos from "./FormCampos.jsx";
import FormBotones from "./FormBotones.jsx";
import TituloConFlecha from "./TituloConFlecha.jsx";

export default function RecuperarStep2({ onSwitch }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleNext = (e) => {
    e.preventDefault();
    if (!code) return setError("Ingresá el código recibido");

    if (code === localStorage.getItem("codigoRecuperacion")) {
      onSwitch("recuperar3");
    } else {
      Swal.fire({
        title: "¡Ups!",
        text: "Código incorrecto. Revisá tu correo.",
        icon: "error",
      });
    }
  };

  const handleResend = async () => {
    const email = localStorage.getItem("lastEmail"); // guardalo en Step1
    if (!email) return;
    
    const nuevoCodigo = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem("codigoRecuperacion", nuevoCodigo);

    await emailjs.send(
       "service_vq2s3hg",
        "template_tth5c7f",
        { email, codigo: nuevoCodigo },
        "K_tWHwFkHy42ZpWnU"
    );

    Swal.fire({
      title: "Código reenviado",
      text: "Revisá tu correo nuevamente",
      icon: "info",
    });
  };

  return (
    <form onSubmit={handleNext} className="formCuenta">
      <TituloConFlecha>Recuperar Cuenta</TituloConFlecha>

      <FormCampos
        label="Código"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        name="codigo"
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
            id: "btnSiguiente",
            label: "Siguiente",
            className: "btnAceptar",
            onClick: handleNext,
          }}
          boton2={{
            id: "btnCancelar",
            label: "Cancelar",
            className: "btnCancelar",
            onClick: () => onSwitch("login"),
          }}
        />
      

      {/* Reenviar */}
      <p className="link" onClick={handleResend}>
        Reenviar código
      </p>
      </div>
    </form>
  );
}

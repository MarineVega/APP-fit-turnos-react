import { useState } from "react";
import Swal from "sweetalert2";
import emailjs from "@emailjs/browser";
import FormCampos from "./FormCampos.jsx";
import FormBotones from "./FormBotones.jsx";
import TituloConFlecha from "./TituloConFlecha.jsx";
import usuariosData from "../data/usuarios.json"; // 👈 respaldo local opcional
import "../styles/style.css";

export default function RecuperarForm({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const generarCodigo = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

  const handleRecover = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) return setError("Ingresá tu correo electrónico.");

    setLoading(true);

    // 1️⃣ Buscar usuario en localStorage o JSON
    const usuariosLS = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuarios = usuariosLS.length > 0 ? usuariosLS : usuariosData.usuarios;
    const usuarioExiste = usuarios.find((u) => u.email === email);

    if (!usuarioExiste) {
      setError("No existe una cuenta con ese correo.");
      setLoading(false);
      return;
    }

    // 2️⃣ Generar y guardar código de recuperación
    const codigo = generarCodigo();
    localStorage.setItem("codigoRecuperacion", codigo);
    localStorage.setItem("emailRecuperacion", email);

    try {
      await emailjs.send(
        "service_vq2s3hg", // Tu ID de servicio
        "template_tth5c7f", // Tu ID de plantilla
        { email, codigo },
        "K_tWHwFkHy42ZpWnU" // Tu clave pública
      );

      Swal.fire({
        title: "Código enviado ✉️",
        text: "Revisá tu correo para continuar con la recuperación.",
        icon: "success",
        confirmButtonColor: "#6edc8c",
      }).then(() => {
        setLoading(false);
        onSwitch("recuperar2"); // pasa al siguiente paso
      });
    } catch (err) {
      console.error("Error:", err);
      setError("No se pudo enviar el correo. Intentalo más tarde.");
      setLoading(false);
    }
  };

  return (
    <>
      <TituloConFlecha>Recuperar Cuenta</TituloConFlecha>
      <form onSubmit={handleRecover} className="formCuenta">
        <FormCampos
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError("");
          }}
          name="email"
          className="inputCuenta"
        />

        {/* Error debajo del campo */}
        {error && (
          <div className="contenedorError">
            <p className="adventencia">{error}</p>
          </div>
        )}

        <div className="contenedorBotones">
          <FormBotones
            boton1={{
              id: "btnEnviarCodigo",
              label: loading ? "Enviando..." : "Enviar código",
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
        </div>
      </form>
    </>
  );
}

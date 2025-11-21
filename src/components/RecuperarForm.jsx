import { useState } from "react";
import Swal from "sweetalert2";
import FormCampos from "./FormCampos.jsx";
import FormBotones from "./FormBotones.jsx";
import TituloConFlecha from "./TituloConFlecha.jsx";
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

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      // 1. Buscar usuarios en backend
      const response = await fetch(`${API_URL}/usuarios`);
      if (!response.ok) {
        throw new Error("No se pudo obtener usuarios del backend");
      }

      let usuarios = await response.json();

      if (!Array.isArray(usuarios)) {
        if (usuarios && Array.isArray(usuarios.usuarios)) {
          usuarios = usuarios.usuarios;
        } else {
          throw new Error("Formato inesperado del backend");
        }
      }

      const usuarioExiste = usuarios.find((u) => u.email === email);

      if (!usuarioExiste) {
        setError("No existe una cuenta con ese correo.");
        setLoading(false);
        return;
      }
      // Chequear si está verificado
      if (!usuarioExiste.verificado) {
        setError("Tu cuenta aún no está verificada. Revisá tu correo para activarla.");
        setLoading(false);
        return;
} 
      // 2. Generar código
      const codigo = generarCodigo();
      localStorage.setItem("codigoRecuperacion", codigo);
      localStorage.setItem("emailRecuperacion", email);

      // 3. Enviar código al backend (Nodemailer)
      const mailRes = await fetch(`${API_URL}/auth/send-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, codigo }),
      });

      if (!mailRes.ok) {
        throw new Error("No se pudo enviar el código por email");
      }

      Swal.fire({
        title: "Código enviado ✉️",
        text: "Revisá tu correo para continuar con la recuperación.",
        icon: "success",
        confirmButtonColor: "#6edc8c",
      }).then(() => {
        setLoading(false);
        onSwitch("recuperar2");
      });
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "No se pudo procesar la recuperación.");
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

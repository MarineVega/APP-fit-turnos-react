import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import FormCampos from "./FormCampos.jsx";
import FormBotones from "./FormBotones.jsx";
import "../styles/style.css";
import TituloConFlecha from "./TituloConFlecha.jsx";

export default function RegistrarForm({ onSwitch }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const swalEstilo = Swal.mixin({
    imageWidth: 160,
    background: "#bababa",
    confirmButtonColor: "#6edc8c",
    customClass: {
      confirmButton: "btnCuentaLogin",
      cancelButton: "btnCancelar",
    },
  });

  const handleRegister = async (e) => {
  e.preventDefault();
  setError("");

  // VALIDACIONES
  if (!username || !email || !password || !password2)
    return setError("Completá todos los campos.");

  if (/\s/.test(username))
    return setError("El nombre de usuario no puede contener espacios.");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return setError("El email no es válido.");

  if (password.length < 6)
    return setError("La contraseña debe tener al menos 6 caracteres.");

  if (password !== password2)
    return setError("Las contraseñas no coinciden.");

  setLoading(true);

  const nuevoUsuario = {
    usuario: username,
    email,
    password,
    persona: {
      tipoPersona_id: 3,
      activo: false,
    },
  };

  try {
    const API_URL = import.meta.env.VITE_API_URL;

    //  Validación si no hay URL configurada
    if (!API_URL) {
      throw new Error("Error interno: falta configurar la URL del servidor.");
    }

    //  Timeout (si el back no responde)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoUsuario),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error("El servidor no respondió correctamente.");
    }

    if (!res.ok) {
      throw new Error(data.message || "No se pudo registrar el usuario.");
    }

    await swalEstilo.fire({
      title: "¡Registración exitosa!",
      text: "Te enviamos un correo para activar tu cuenta.",
      icon: "success",
      confirmButtonText: "Ir al Login",
    });

    onSwitch("login");

  } catch (err) {
    console.error("Error en registro:", err);

    //  Manejos específicos de error
    if (err.name === "AbortError") {
      setError("El servidor tardó demasiado en responder. Intentá más tarde.");
    } else if (err.message === "Ocurrio un error de red") {
      setError("No hay conexión con el servidor.");
    } else {
      setError(err.message);
    }

  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <TituloConFlecha>Crear Cuenta</TituloConFlecha>

      <form onSubmit={handleRegister} className="formCuenta">
        <FormCampos
          label="Nombre de Usuario *"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          name="username"
          className="inputCuenta"
        />

        <FormCampos
          label="Correo electrónico (Email) *"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          name="email"
          className="inputCuenta"
        />

        <FormCampos
          label="Contraseña *"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          className="inputCuenta"
        />

        <FormCampos
          label="Repetir Contraseña *"
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
              id: "btnRegistrar",
              label: loading ? "Cargando..." : "REGISTRARSE",
              className: "btnCuentaLogin",
              type: "submit",
            }}
            boton2={{
              id: "btnCancelar",
              label: "CANCELAR",
              className: "btnCancelar",
              onClick: () => navigate("/"),
            }}
          />
        </div>

        <div className="contenedorError">
          <p className="link" onClick={() => onSwitch("login")}>
            ¿Ya tenés cuenta? Iniciar sesión
          </p>
        </div>
      </form>
    </>
  );
}

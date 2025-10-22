import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import FormCampos from "./FormCampos.jsx";
import FormBotones from "./FormBotones.jsx";
import "../styles/style.css";
import exito from "../assets/img/exito.png";
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
    imageWidth: 200,
    imageHeight: 200,
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

    // Validaciones básicas
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

    // Recuperar usuarios existentes
    const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios")) || [];
    const existe = usuariosGuardados.some(
      (u) => u.email === email || u.usuario === username
    );

    if (existe)
      return setError(
        "Ya existe una cuenta registrada con ese email o nombre de usuario."
      );

    // Crear nuevo usuario (tipo CLIENTE)
    const nuevoUsuario = {
      usuario_id: usuariosGuardados.length + 1,
      usuario: username,
      nombre: username,
      apellido: "",
      email,
      password: password,
      tipoUsuario: "Cliente",
      rol: "Cliente",
      activo: true,
      esAdmin: false,
    };

    usuariosGuardados.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuariosGuardados));

    setLoading(true);
    try {
      await swalEstilo.fire({
        title: "¡Cuenta creada con éxito!",
        text: "Bienvenid@ a Fit Turnos. Ya podés iniciar sesión.",
        imageUrl: exito,
        imageHeight: 100,
        imageAlt: "Éxito",
        icon: "success",
        confirmButtonText: "Ir al inicio",
      });
      onSwitch("login");
    } catch (err) {
      setError("Error al registrar el usuario");
      console.error(err);
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
              onClick: handleRegister,
            }}
            boton2={{
              id: "btnCancelar",
              label: "CANCELAR",
              className: "btnCancelar",
              onClick: () => navigate("/"),
            }}
            contenedorClass="contenedorBotones"
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

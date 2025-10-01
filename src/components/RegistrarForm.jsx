import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import FormCampos from "./FormCampos.jsx";
import FormBotones from "./FormBotones.jsx";

export default function RegistrarForm({ onSwitch }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const swalEstilo = Swal.mixin({
    imageWidth: 200,
    imageHeight: 200,
    background: "#bababa",
    confirmButtonColor: "#6edc8c",
    customClass: {
      confirmButton: "btnAceptar",
      cancelButton: "btnCancelar",
    },
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Validaciones
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
      (u) => u.email === email || u.nombre === username
    );

    if (existe)
      return setError(
        "Ya existe una cuenta registrada con ese email o nombre de usuario."
      );

    // Crear nuevo usuario
    const nuevoUsuario = {
      nombre: username,
      email,
      password,
      esAdmin: isAdmin,
    };

    usuariosGuardados.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuariosGuardados));

    setLoading(true);
    try {
      swalEstilo
        .fire({
          title: "¡Operación Exitosa!",
          text: "Bienvenid@, ya está todo listo, alcanza tus objetivos con nosotros.",
          imageUrl: "../assets/img/exito.png",
          imageHeight: 100,
          imageAlt: "Éxito",
          icon: "success",
          confirmButtonText: "Inicio",
        })
        .then((result) => {
          if (result.isConfirmed) {
            onSwitch("login");
          }
        });
    } catch (err) {
      setError("Error al registrar el usuario");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="formCuenta">
      <h2>Crear Cuenta</h2>

      <FormCampos
        label="Nombre de Usuario"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        name="username"
      />

      <FormCampos
        label="Ingresa tu correo electrónico (Email)"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        name="email"
      />

      <FormCampos
        label="Ingresa tu contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        name="password"
      />

      <FormCampos
        label="Confirmar Contraseña"
        type="password"
        value={password2}
        onChange={(e) => setPassword2(e.target.value)}
        name="password2"
      />

      <div className="check-admin">
        <input
          type="checkbox"
          id="isAdmin"
          checked={isAdmin}
          onChange={(e) => setIsAdmin(e.target.checked)}
        />
        <label htmlFor="isAdmin">Crear como administrador</label>
      </div>

      {error && <p className="advertencia">{error}</p>}

      <FormBotones
        boton1={{
          id: "btnRegistrar",
          label: loading ? "Cargando..." : "REGISTRARSE",
          className: "btnAceptar",
          onClick: handleRegister,
        }}
        boton2={{
          id: "btnCancelar",
          label: "Cancelar",
          className: "btnCancelar",
          onClick: () => navigate("/"),
        }}
      />

      {/* 🔗 Link subrayado y azul */}
      <a
        href="#"
        className="link"
        onClick={(e) => {
          e.preventDefault();
          onSwitch("login");
        }}
      >
        Ya tenés cuenta? Iniciar sesión
      </a>
    </form>
  );
}

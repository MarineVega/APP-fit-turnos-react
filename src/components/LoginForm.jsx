import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import FormCampos from "./FormCampos.jsx";
import FormBotones from "./FormBotones.jsx";
import TituloConFlecha from "./TituloConFlecha.jsx";
import checkmark from "../assets/img/exito.png";
import usuariosData from "../data/usuarios.json"; // 👈 respaldo inicial
import "../styles/style.css";

export default function LoginForm({ onSwitch }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Si ya hay usuario logueado, redirige a la página principal
  useEffect(() => {
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    if (usuarioActivo) navigate("/");
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Completá todos los campos.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // 1️⃣ Trae usuarios desde localStorage o desde el JSON local
      const usuariosLS = JSON.parse(localStorage.getItem("usuarios")) || [];
      const usuarios = usuariosLS.length > 0 ? usuariosLS : usuariosData.usuarios;

      // 2️⃣ Busca el usuario por email y contraseña
      const usuario = usuarios.find(
        (u) => u.email === email && u.password === password
      );

      // 🔸 Si no existe el usuario
      if (!usuario) {
        setError("Usuario o contraseña incorrecta.");
        setLoading(false);
        return;
      }

      // 🔒 Si el usuario está inactivo, no permitir login
      if (!usuario.activo) {
        setError("Tu cuenta está inactiva. Contactá con el administrador.");
        setLoading(false);
        return;
      }

      // 3️⃣ Guarda el usuario logueado
      localStorage.setItem("usuarioActivo", JSON.stringify(usuario));

      // Notificar a otros componentes
      window.dispatchEvent(new Event("usuarioActualizado"));

      // 4️⃣ Determinar el tipo de persona
      const tipo = usuario?.persona?.tipoPersona_id;

      let rol = "";
      if (tipo === 1) rol = "Administrador";
      else if (tipo === 2) rol = "Profesor";
      else if (tipo === 3) rol = "Cliente";

      Swal.fire({
        title: `¡Bienvenido${rol ? ", " + rol : ""}!`,
        imageUrl: checkmark,
        imageHeight: 100,
        imageAlt: "Checkmark",
        icon: "success",
        confirmButtonText: "Cerrar",
      }).then(() => navigate("/"));

      setLoading(false);
    }, 300);
  };

  return (
    <>
      <TituloConFlecha>Iniciar Sesión</TituloConFlecha>
      <form onSubmit={handleSubmit} className="formCuenta">
        <FormCampos
          label="Email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError("");
          }}
          name="email"
          className="inputCuenta"
        />

        <FormCampos
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (error) setError("");
          }}
          name="password"
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
              id: "btnIngresar",
              label: loading ? "Cargando..." : "INGRESAR",
              className: "btnCuentaLogin",
              type: "submit",
            }}
            boton2={{
              id: "btnCancelar",
              label: "CANCELAR",
              className: "btnCancelar",
              onClick: () => navigate("/"),
            }}
            contenedorClass="contenedorBotones"
          />

          <p className="link" onClick={() => onSwitch("registrar")}>
            Crear cuenta
          </p>
          <p className="link" onClick={() => onSwitch("recuperar1")}>
            Olvidé mi contraseña
          </p>
        </div>
      </form>
    </>
  );
}

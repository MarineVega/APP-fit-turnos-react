import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import FormCampos from "./FormCampos.jsx";
import FormBotones from "./FormBotones.jsx";
import TituloConFlecha from "./TituloConFlecha.jsx";
import checkmark from "../assets/img/exito.png";
import { loginUser } from "../services/api";
import "../styles/style.css";

export default function LoginForm({ onSwitch }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Si ya hay token guardado, validar usuario activo
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:3000/auth/perfil", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Token inválido");
          return res.json();
        })
        .then((user) => {
          localStorage.setItem("usuarioActivo", JSON.stringify(user));
          navigate("/");
        })
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("usuarioActivo");
        });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Completá todos los campos.");
      return;
    }

    setLoading(true);

    try {
      // Intentamos login con la función centralizada en services/api.js
      const usuarioBackend = await loginUser({ email, password });

      if (usuarioBackend) {
        // Si el backend devuelve estructura con token, guardarla
        if (usuarioBackend.access_token) {
          localStorage.setItem("token", usuarioBackend.access_token);
          localStorage.setItem(
            "usuarioActivo",
            JSON.stringify(usuarioBackend.usuario || usuarioBackend)
          );
          // Disparar evento para que Navbar se actualice
          window.dispatchEvent(new Event("usuarioActualizado"));
          await mostrarBienvenida(usuarioBackend.usuario || usuarioBackend);
          setTimeout(() => navigate("/"), 100);
          return;
        }

        // Caso común: loginUser devolvió el usuario (sin token)
        localStorage.setItem("usuarioActivo", JSON.stringify(usuarioBackend));
        // Disparar evento para que Navbar se actualice
        window.dispatchEvent(new Event("usuarioActualizado"));
        await mostrarBienvenida(usuarioBackend);
        setTimeout(() => navigate("/"), 100);
        return;
      }

      throw new Error("Usuario o contraseña incorrecta");
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  const mostrarBienvenida = async (usuario) => {
  const nombreUsuario = usuario?.usuario?.trim();
  const tipo = usuario?.persona?.tipoPersona_id;

  let rol = "";
  if (tipo === 1) rol = "Administrador";
  else if (tipo === 2) rol = "Profesor";
  else if (tipo === 3) rol = "Cliente";

      // ▶ Lógica del título
      let titulo = "¡Bienvenid@!";

      if (nombreUsuario) {
        titulo = `¡Bienvenid@ ${nombreUsuario}!`;
      } else if (rol) {
        titulo = `¡Bienvenid@ ${rol}!`;
      }

      return Swal.fire({
        title: titulo,
        imageUrl: checkmark,
        imageHeight: 100,
        imageAlt: "Checkmark",
        icon: "success",
        confirmButtonText: "Cerrar",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
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

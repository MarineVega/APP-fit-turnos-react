import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import TituloConFlecha from "../components/TituloConFlecha.jsx";
import FormBotones from "../components/FormBotones.jsx";
import "../styles/style.css";
import checkmark from "../assets/img/exito.png";
import error from "../assets/img/error.png";

export default function PerfilUsuario() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");

  // 🔹 Cargar usuario activo desde localStorage
  useEffect(() => {
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    if (usuarioActivo) {
      setUsuario(usuarioActivo);
    } else {
      Swal.fire("Atención", "No hay usuario activo", "warning");
      navigate("/login");
    }
  }, [navigate]);

  // 🧭 Función para obtener el rol a partir de tipoPersona_id
  const obtenerRol = () => {
    const tipo = usuario?.persona?.tipoPersona_id;
    if (tipo === 1) return "Administrador";
    if (tipo === 2) return "Profesor";
    if (tipo === 3) return "Cliente";
    return "Usuario";
  };

  // 🔹 Cambiar contraseña
  const handleCambiarPassword = (e) => {
    e.preventDefault();

    if (nueva !== confirmar) {
      Swal.fire({
        title: "Las contraseñas no coinciden",
        imageUrl: error,
        imageHeight: 100,
        imageAlt: "Error",
        icon: "error",
        confirmButtonText: "Cerrar",
      });
      return;
    }

    if (actual !== usuario.password) {
      Swal.fire({
        title: "La contraseña actual no es correcta",
        imageUrl: error,
        imageHeight: 100,
        imageAlt: "Error",
        icon: "error",
        confirmButtonText: "Cerrar",
      });
      return;
    }

    const usuarioActualizado = { ...usuario, password: nueva };
    localStorage.setItem("usuarioActivo", JSON.stringify(usuarioActualizado));

    // Actualizar también el listado general
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const actualizados = usuarios.map((u) =>
      u.email === usuario.email ? usuarioActualizado : u
    );
    localStorage.setItem("usuarios", JSON.stringify(actualizados));

    setUsuario(usuarioActualizado);
    setEditando(false);

    Swal.fire({
      title: "La contraseña se cambió correctamente",
      imageUrl: checkmark,
      imageHeight: 100,
      imageAlt: "Checkmark",
      icon: "success",
      confirmButtonText: "Cerrar",
    });
  };

  if (!usuario) return null;

  return (
    <main className="mainAdministrar">
      <TituloConFlecha>Mi perfil</TituloConFlecha>

      <div className="perfilCard">
        <section className="perfilDatos">
          <p>
            <strong>Nombre:</strong>{" "}
            <span>{usuario?.persona?.nombre || usuario.nombre || "-"}</span>
          </p>
          <p>
            <strong>Email:</strong> <span>{usuario.email}</span>
          </p>
          <p>
            <strong>Rol:</strong> <span>{obtenerRol()}</span>
          </p>
        </section>

        {/* 🔹 línea separadora */}
        <hr className="lineaPerfil" />

        {!editando ? (
          <button className="btnCambiar" onClick={() => setEditando(true)}>
            Cambiar contraseña
          </button>
        ) : (
          <form onSubmit={handleCambiarPassword} className="formCambiarPassword">
            <label>
              Contraseña actual:
              <input
                type="password"
                value={actual}
                onChange={(e) => setActual(e.target.value)}
                required
                className="inputCuenta"
              />
            </label>

            <label>
              Nueva contraseña:
              <input
                type="password"
                value={nueva}
                onChange={(e) => setNueva(e.target.value)}
                required
                className="inputCuenta"
              />
            </label>

            <label>
              Confirmar nueva contraseña:
              <input
                type="password"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                required
                className="inputCuenta"
              />
            </label>

            {/* ✅  FormBotones */}
            <FormBotones
              boton1={{
                label: "Guardar",
                className: "btnAceptar",
                onClick: handleCambiarPassword,
              }}
              boton2={{
                label: "Cancelar",
                className: "btnCancelar",
                onClick: () => setEditando(false),
              }}
            />
          </form>
        )}
      </div>
    </main>
  );
}

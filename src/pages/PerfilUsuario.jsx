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

  useEffect(() => {
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    if (!usuarioActivo) {
      Swal.fire("Atención", "No hay usuario activo", "warning");
      navigate("/cuenta");
      return;
    }
    setUsuario(usuarioActivo);
  }, [navigate]);

  const obtenerRol = () => {
    const tipo = usuario?.persona?.tipoPersona_id;
    if (tipo === 1) return "Administrador";
    if (tipo === 2) return "Profesor";
    if (tipo === 3) return "Cliente";
    return "Usuario";
  };

  const handleCambiarPassword = async (e) => {
    e.preventDefault();

    if (nueva !== confirmar) {
      Swal.fire({
        title: "Las contraseñas no coinciden",
        imageUrl: error,
        imageHeight: 100,
        icon: "error",
      });
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: actual,
          newPassword: nueva,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al actualizar contraseña");
      }

      Swal.fire({
        title: "Contraseña actualizada",
        text: "Se cambió correctamente",
        imageUrl: checkmark,
        imageHeight: 100,
        icon: "success",
      });

      setActual("");
      setNueva("");
      setConfirmar("");
      setEditando(false);
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.message,
        imageUrl: error,
        imageHeight: 100,
        icon: "error",
      });
    }
  };

  if (!usuario) return null;

  return (
    <main className="mainAdministrar">
      <TituloConFlecha>Mi perfil</TituloConFlecha>

      <div className="perfilCard">
        <section className="perfilDatos">
          <p>
            <strong>Nombre:</strong>{" "}
            <span>{usuario?.persona?.nombre || "-"}</span>
          </p>
          <p>
            <strong>Email:</strong> <span>{usuario.email}</span>
          </p>
          <p>
            <strong>Rol:</strong> <span>{obtenerRol()}</span>
          </p>
        </section>

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

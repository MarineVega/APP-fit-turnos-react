import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import FormBotones from "./FormBotones";
import "../styles/style.css";

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

export default function UsuarioList({ modo, onEditar }) {
  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
  const [usuarios, setUsuarios] = useState([]);

  // ───────────────────────────────────────────────
  //   Traer usuarios
  // ───────────────────────────────────────────────
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const headers = {};
        const token = localStorage.getItem("token");
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const response = await fetch("http://localhost:3000/usuarios", {
          headers,
        });

        if (!response.ok) throw new Error("Error al obtener los usuarios");

        const data = await response.json();
        setUsuarios(data);
      } catch (error) {
        console.error("Error cargando usuarios:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar los usuarios desde el servidor.",
        });
      }
    };

    fetchUsuarios();
  }, []);

  const obtenerTipo = (u) => {
    const tipo = u?.tipoUsuario_id || u?.persona?.tipoPersona_id;
    if (tipo === 1) return "Administrador";
    if (tipo === 2) return "Profesor";
    if (tipo === 3) return "Cliente";
    return "—";
  };

    // ───────────────────────────────────────────────
    //   EDITAR — AHORA INCLUYE TIENE_RESERVAS
    // ───────────────────────────────────────────────
    const handleEditar = async (usuario) => {
      let tieneReservas = false;

      // Solo necesito verificar reservas si el usuario es CLIENTE
      if (usuario?.persona?.tipoPersona_id === 3) {
        try {
          const headers = {};
          const token = localStorage.getItem("token");
          if (token) headers["Authorization"] = `Bearer ${token}`;

          const resp = await fetch(
            `http://localhost:3000/reservas/usuario/${usuario.persona.persona_id}`,
            { headers }
          );

          if (resp.ok) {
            const data = await resp.json();
            tieneReservas = data.tieneReservas; // true o false
          }
        } catch (err) {
          console.error("Error verificando reservas:", err);
        }
      }

      // 👉 Enviamos al formulario el usuario pero ahora con "tieneReservas"
      const usuarioCompleto = { ...usuario, tieneReservas };

      if (onEditar) onEditar(usuarioCompleto);
    };


  // ───────────────────────────────────────────────
  //   ELIMINAR USUARIO
  // ───────────────────────────────────────────────
  const handleEliminar = async (usuario) => {
    if (usuarioActivo && usuario.usuario_id === usuarioActivo.usuario_id) {
      swalEstilo.fire({
        icon: "warning",
        title: "No permitido",
        text: "No puedes eliminar tu propio usuario.",
      });
      return;
    }

    // verifica reservas si es cliente
    const tipo = usuario?.persona?.tipoPersona_id;
    if (tipo === 3) {
      try {
        const headers = {};
        const token = localStorage.getItem("token");
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const resp = await fetch(
          `http://localhost:3000/reservas/usuario/${usuario.persona.persona_id}`,
          { headers }
        );

        if (resp.ok) {
          const { tieneReservas } = await resp.json();
          if (tieneReservas) {
            swalEstilo.fire({
              icon: "warning",
              title: "No se puede eliminar",
              text: "Este cliente tiene reservas activas y no puede ser eliminado.",
            });
            return;
          }
        }
      } catch (err) {
        console.error("Error verificando reservas:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo verificar si el usuario tiene reservas.",
        });
        return;
      }
    }

    const confirm = await swalEstilo.fire({
      title: "¿Eliminar usuario?",
      text: `El usuario "${usuario.usuario}" será eliminado permanentemente.`,
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Sí, eliminar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6edc8c",
    });

    if (!confirm.isConfirmed) return;

    try {
      const headers = {};
      const token = localStorage.getItem("token");
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(
        `http://localhost:3000/usuarios/${usuario.usuario_id}`,
        { method: "DELETE", headers }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        let mensaje = "No se pudo eliminar el usuario.";

        if (errorData?.message) {
          if (Array.isArray(errorData.message)) {
            mensaje = errorData.message.join(" ");
          } else {
            mensaje = errorData.message;
          }
        }

        throw new Error(mensaje);
      }

      swalEstilo.fire({
        title: "Eliminado",
        text: "El usuario se eliminó correctamente.",
        icon: "success",
        confirmButtonText: "Cerrar",
      });

      setUsuarios((prev) =>
        prev.filter((u) => u.usuario_id !== usuario.usuario_id)
      );
    } catch (error) {
      console.error("Error eliminando usuario:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "No se pudo eliminar el usuario.",
      });
    }
  };

  // Ordenar usuarios
  const usuariosOrdenados = [...usuarios].sort((a, b) =>
    a.usuario.localeCompare(b.usuario)
  );

  return (
    <main className="mainProfesor">
      <section id="tablaProfesores" style={{ marginBottom: "60px" }}>
        <table>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Tipo</th>
              <th>Verificado</th>
              <th>Activo</th>
              {modo !== "consultar" && <th>Acciones</th>}
            </tr>
          </thead>

          <tbody>
            {usuariosOrdenados.length > 0 ? (
              usuariosOrdenados.map((u) => {
                const esAdminPrincipal =
                  u.usuario === "admin@fitturnos.com" ||
                  u.email === "admin@fitturnos.com";

                return (
                  <tr key={u.usuario_id}>
                    <td>{u.usuario}</td>
                    <td>{u.email}</td>
                    <td>{u.persona?.nombre || "—"}</td>
                    <td>{u.persona?.apellido || "—"}</td>
                    <td>{obtenerTipo(u)}</td>
                    <td>{u.verificado ? "Sí" : "No"}</td>
                    <td>{u.persona?.activo ? "Sí" : "No"}</td>

                    {modo !== "consultar" && (
                      <td>
                        {!esAdminPrincipal && (
                          <>
                            {modo === "editar" && (
                              <button
                                className="btnTabla"
                                onClick={() => handleEditar(u)}
                              >
                                <img
                                  src={
                                    new URL(
                                      "../assets/img/icono_editar.png",
                                      import.meta.url
                                    ).href
                                  }
                                  alt="Editar"
                                  width="30"
                                />
                              </button>
                            )}

                            {modo === "eliminar" && (
                              <button
                                className="btnTabla"
                                onClick={() => handleEliminar(u)}
                              >
                                <img
                                  src={
                                    new URL(
                                      "../assets/img/icono_eliminar.png",
                                      import.meta.url
                                    ).href
                                  }
                                  alt="Eliminar"
                                  width="30"
                                />
                              </button>
                            )}
                          </>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={modo !== "consultar" ? 7 : 6}>
                  No hay usuarios registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {modo === "postAlta" && (
        <FormBotones
          boton1={{
            id: "agregar",
            label: "AGREGAR",
            className: "btnAceptar",
            onClick: () => (window.location.href = "/usuario?modo=agregar"),
          }}
          boton2={{
            id: "cancelar",
            label: "VOLVER",
            className: "btnCancelar",
            onClick: () => (window.location.href = "/administrar"),
          }}
          contenedorClass="contenedorBotones"
        />
      )}
    </main>
  );
}

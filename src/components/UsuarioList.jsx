import React from "react";
import Swal from "sweetalert2";
import FormBotones from "./FormBotones";
import "../styles/style.css";

// ✅ Configuro el estilo del SweetAlert (igual al ProfesorList)
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

export default function UsuarioList({ usuarios, modo, onEditar }) {
  // ✅ Supongamos que el usuario logueado se guarda en localStorage
  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

  const handleEliminar = (usuario) => {
    // 🔒 Validar si es el usuario activo
    if (usuarioActivo && usuario.usuario_id === usuarioActivo.usuario_id) {
      swalEstilo.fire({
        icon: "warning",
        title: "No se puede eliminar",
        text: "No puedes eliminar tu propio usuario mientras esté activo.",
        confirmButtonText: "Cerrar",
      });
      return;
    }

    swalEstilo
      .fire({
        title: "¿Eliminar usuario?",
        text: `Se eliminará el usuario "${usuario.usuario}" de forma permanente.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Sí, eliminar",
      })
      .then((result) => {
        if (result.isConfirmed) {
          const actualizados = usuarios.filter(
            (u) => u.usuario_id !== usuario.usuario_id
          );
          localStorage.setItem("usuarios", JSON.stringify(actualizados));

          swalEstilo.fire({
            title: "Eliminado",
            text: "El usuario ha sido eliminado correctamente.",
            icon: "success",
            confirmButtonText: "Cerrar",
          });

          window.location.reload();
        }
      });
  };

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
              <th>Rol</th>
              <th>Activo</th>
              {modo !== "consultar" && <th>Acciones</th>}
            </tr>
          </thead>

          <tbody>
            {usuarios.length > 0 ? (
              usuarios.map((u) => (
                <tr key={u.usuario_id}>
                  <td>{u.usuario}</td>
                  <td>{u.email}</td>
                  <td>{u.nombre}</td>
                  <td>{u.apellido}</td>
                  <td>{u.tipoUsuario}</td>
                  <td>{u.rol}</td>
                  <td>{u.activo ? "Sí" : "No"}</td>

                  {modo !== "consultar" && (
                    <td>
                      {modo === "editar" && (
                        <button
                          className="btnTabla"
                          onClick={() => onEditar && onEditar(u)}
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
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={modo !== "consultar" ? 8 : 7}>
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

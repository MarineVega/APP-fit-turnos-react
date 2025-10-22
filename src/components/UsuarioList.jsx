import React from "react";
import Swal from "sweetalert2";

export default function UsuarioList({ usuarios, modo, onEditar }) {
  const handleEliminar = (usuario) => {
    Swal.fire({
      title: "¿Eliminar usuario?",
      text: `Se eliminará el usuario "${usuario.usuario}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const actualizados = usuarios.filter((u) => u.usuario_id !== usuario.usuario_id);
        localStorage.setItem("usuarios", JSON.stringify(actualizados));
        Swal.fire("Eliminado", "El usuario fue eliminado correctamente", "success");
        window.location.reload();
      }
    });
  };

  return (
    <div className="tablaGeneral">
      <table>
        <thead>
          <tr>
            <th>ID</th>
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
          {usuarios.map((u) => (
            <tr key={u.usuario_id}>
              <td>{u.usuario_id}</td>
              <td>{u.usuario}</td>
              <td>{u.email}</td>
              <td>{u.nombre}</td>
              <td>{u.apellido}</td>
              <td>{u.tipoUsuario}</td>
              <td>{u.rol}</td>
              <td>{u.activo ? "Sí" : "No"}</td>
              {modo === "editar" && (
                <td>
                  <button
                    className="icon"
                    onClick={() => onEditar(u)}
                    title="Editar"
                  >
                    📝
                  </button>
                </td>
              )}
              {modo === "eliminar" && (
                <td>
                  <button
                    className="icon"
                    onClick={() => handleEliminar(u)}
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

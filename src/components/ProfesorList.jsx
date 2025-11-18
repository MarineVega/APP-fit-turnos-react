import React, { useEffect, useState } from "react";
import FormBotones from "./FormBotones";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../utils/apiConfig";

// configuro estilos para sweetalert
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

export default function ProfesorList({ profesores = [], modo, onEditar, setProfesores }) {
  const [reservas, setReservas] = useState([]);
  const [horarios, setHorarios] = useState([]);

   // Cargar reservas y horarios desde la base de datos
   useEffect(() => {
    // Cargar reservas
    fetch(`${API_BASE_URL}/reservas`)
      .then((res) => res.json())
      .then((data) => setReservas(data))
      .catch((err) => console.error("Error al cargar reservas:", err));

    // Cargar horarios
    fetch(`${API_BASE_URL}/horarios`)
      .then((res) => res.json())
      .then((data) => setHorarios(data))
      .catch((err) => console.error("Error al cargar horarios:", err));
  }, []);

  const tieneReservasActivas = (profesorId) => {
    return reservas.some(
      (r) => Number(r.profesor_id) === Number(profesorId) && r.activo === true
    );
  };

  const tieneHorariosAsignados = (profesorId) => {
    return horarios.some((h) => Number(h.profesor_id) === Number(profesorId));
  };

  const editarProfesor = (profesor) => {
    if (tieneReservasActivas(profesor.profesor_id)) {
      swalEstilo.fire({
        icon: "warning",
        title: "No se puede modificar",
        text: `El profesor "${profesor.persona.nombre} ${profesor.persona.apellido}" tiene reservas activas.`,
        confirmButtonText: "Cerrar",
      });
      return;
    }
    if (onEditar) onEditar(profesor);
  };

  const eliminarProfesor = (profesor) => {
    if (tieneReservasActivas(profesor.profesor_id)) {
      swalEstilo.fire({
        icon: "warning",
        title: "No se puede eliminar",
        text: `El profesor "${profesor.persona.nombre} ${profesor.persona.apellido}" tiene reservas activas.`,
        confirmButtonText: "Cerrar",
      });
      return;
    }

    if (tieneHorariosAsignados(profesor.profesor_id)) {
      swalEstilo.fire({
        icon: "warning",
        title: "No se puede eliminar",
        text: `El profesor "${profesor.persona.nombre} ${profesor.persona.apellido}" tiene horarios asignados.`,
        confirmButtonText: "Cerrar",
      });
      return;
    }

    swalEstilo
      .fire({
        title: "¿Eliminar profesor?",
        text: `Esta acción dará de baja a "${profesor.persona.nombre} ${profesor.persona.apellido}".`,
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#6edc8c",
        customClass: {
          cancelButton: "btnAceptar",
        },
        confirmButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      })
      .then((result) => {
        if (result.isConfirmed) {
          // Baja lógica (PATCH) — opcional:
          // fetch(`${API_BASE_URL}/profesores/${profesor.profesor_id}`, { method: "PATCH", body: JSON.stringify({ activo: false }) })

          fetch(`${API_BASE_URL}/profesores/${profesor.profesor_id}`, {
            method: "DELETE",
          })
            .then((res) => {
              if (!res.ok) throw new Error("Error en la eliminación");
              setProfesores((prev) =>
                prev.filter((p) => p.profesor_id !== profesor.profesor_id)
              );
              swalEstilo.fire({
                title: "Eliminado",
                text: "El profesor ha sido eliminado.",
                icon: "success",
                confirmButtonColor: "#6edc8c",
                confirmButtonText: "Cerrar",
              });
            })
            .catch((err) => console.error("Error eliminando:", err));
        }
      });
  };

  // Si el modo es "postAlta", lo trato como "consultar"
  const modoEfectivo = modo === "postAlta" ? "consultar" : modo;

  return (
    <main className="mainProfesor">
      <section id="tablaProfesores">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Documento</th>
              <th>Título</th>
              <th>Activo</th>
              {modoEfectivo !== "consultar" && <th>Acciones</th>}
            </tr>
          </thead>

          <tbody>
            {profesores.length > 0 ? (
              profesores.map((profesor) => (
                <tr key={profesor.profesor_id}>
                  <td>{profesor.persona.nombre}</td>
                  <td>{profesor.persona.apellido}</td>
                  <td>{profesor.persona.documento}</td>
                  <td>{profesor.titulo}</td>
                  <td>{profesor.persona.activo ? "Sí" : "No"}</td>

                  {modoEfectivo !== "consultar" && (
                    <td>
                      {modoEfectivo === "editar" && (
                        <button
                          className="btnTabla"
                          onClick={() => editarProfesor(profesor)}
                        >
                          <img
                            src={
                              new URL("../assets/img/icono_editar.png", import.meta.url).href
                            }
                            alt="Editar"
                            width="30"
                          />
                        </button>
                      )}

                      {modoEfectivo === "eliminar" && (
                        <button
                          className="btnTabla"
                          onClick={() => eliminarProfesor(profesor)}
                        >
                          <img
                            src={
                              new URL("../assets/img/icono_eliminar.png", import.meta.url).href
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
                <td colSpan={modoEfectivo !== "consultar" ? 6 : 5}>
                  No hay profesores registrados
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
            onClick: () => (window.location.href = "/profesor?modo=agregar"),
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

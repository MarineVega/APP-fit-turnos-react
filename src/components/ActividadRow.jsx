import React, { useState } from "react";
import Swal from "sweetalert2";
import ActividadForm from "./ActividadForm";

import icono_default from "../assets/img/icono_default.png"

export default function ActividadRow({ actividad, index, modo, setActividades }) {
  const [editando, setEditando] = useState(false);

  const eliminarActividad = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la actividad permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const actividades = JSON.parse(localStorage.getItem("actividades")) || [];
        actividades.splice(index, 1);
        localStorage.setItem("actividades", JSON.stringify(actividades));
        setActividades([...actividades]);
        Swal.fire("Eliminada", "La actividad ha sido eliminada.", "success");
      }
    });
  };

  const guardarCambios = (nuevaActividad) => {
    const actividades = JSON.parse(localStorage.getItem("actividades")) || [];
    actividades[index] = nuevaActividad;
    localStorage.setItem("actividades", JSON.stringify(actividades));
    setActividades([...actividades]);
    setEditando(false);
    Swal.fire("Actualizada", "La actividad ha sido modificada.", "success");
  };

  if (editando) {
    return (
      <tr>
        <td colSpan="5">
          <ActividadForm initialData={actividad} onSave={guardarCambios} />
          <button onClick={() => setEditando(false)}>Cancelar</button>
        </td>
      </tr>
    );
  }

  return (
    <tr>
        <td>{actividad.nombre}</td>
        <td>{actividad.descripcion}</td>
        <td id="cupo">{actividad.cupoMaximo}</td>
        <td>
            {/* <img src={actividad.imagen || "../assets/img/icono_default.png"} alt="img" width="60" /> */}
            <img src={actividad.imagen || {icono_default} } alt="img" width="60" id="imagen" />
        </td>
        {modo !== "consultar" && (
            <td>
            {modo === "eliminar" && (
                <button onClick={eliminarActividad}>Eliminar</button>
            )}
            {modo === "editar" && (
                <button onClick={() => setEditando(true)}>Editar</button>
            )}
            </td>
        )}
    </tr>

    );
}

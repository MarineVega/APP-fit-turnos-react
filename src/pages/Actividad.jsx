import React, { useState } from "react";    // React no se importa con llaves, solo el hook useState
import { useSearchParams } from "react-router-dom";
import "../styles/style.css";

import ActividadForm from "../components/ActividadForm"
import ActividadList from "../components/ActividadList"
import ImagenLateral from "../components/ImagenLateral"

import actividadesData from "../data/actividades.json";   // 👈 importa el JSON local (provisorio hasta que levante los datos de la BD)


export default function Actividad() {
  //actividad → se mostrará "consultar"
  //actividad?modo=agregar → mostrará el formulario para agregar
  //actividad?modo=editar → mostrará la lista en modo edición
  //actividad?modo=eliminar → mostrará la lista en modo eliminar
  //http://localhost:5173/actividad?modo=agregar

  const [params] = useSearchParams();
  const modo = params.get("modo") || "consultar";

  // Estado de actividades, inicia con las del JSON
  const [actividades, setActividades] = useState(actividadesData);

  // Función para agregar actividad
  const guardarActividad = (nuevaActividad) => {
    setActividades((prev) => [...prev, { id: prev.length + 1, ...nuevaActividad }]);

    /* Cuando pase a MySQL
    puedo hacerlo con axios
    axios.post("http://localhost:3000/api/actividades", nueva)
      .then(res => setActividades(prev => [...prev, res.data]))
      .catch(err => console.error(err));
    
    o con fetch
      */

    /*
    const guardarActividad = async (nueva) => {
      try {
        const response = await fetch("http://localhost:3000/api/actividades", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(nueva)
        });

        if (!response.ok) {
          throw new Error("Error al guardar actividad");
        }

        const data = await response.json(); // 👈 lo que devuelva tu backend
        setActividades((prev) => [...prev, data]);
      } catch (error) {
        console.error("Error en fetch:", error);
      }
    };
  */
  };

  return (
    <main className="mainActividad">
       
      {modo === "agregar" && (
        <>
          <h2>Agregar Actividad</h2>
          <ImagenLateral />
          <ActividadForm guardar={guardarActividad} />
        </>
      )}

      {modo === "editar" && (
        <>
          <h2>Modificar Actividad</h2>
          <ActividadList actividades={actividades} modo="editar" />
        </>
      )}

      {modo === "eliminar" && (
        <>
          <h2>Eliminar Actividad</h2>
          <ActividadList actividades={actividades} modo="eliminar" />
        </>
      )}

      {modo === "consultar" && (
        <>
          <h2>Listado de Actividades</h2>
          <ActividadList actividades={actividades} modo="consultar" />
        </>
      )}
      
    </main>
  );
}

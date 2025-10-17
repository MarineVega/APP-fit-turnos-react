import React, { useState } from "react";         // React no se importa con llaves, solo el hook useState
import { useSearchParams } from "react-router-dom";
import "../styles/style.css";

import imgIzquierda from "../assets/img/actividad1.png";
import imgDerecha from "../assets/img/actividad2.png";

import ActividadForm from "../components/ActividadForm";
import ActividadList from "../components/ActividadList";
import ImagenLateral from "../components/ImagenLateral";
import TituloConFlecha from "../components/TituloConFlecha";

import actividadesData from "../data/actividades.json";     // 👈 importo el JSON local (provisorio hasta que levante los datos

export default function Actividad() {
  //actividad → se mostrará "consultar"
  //actividad?modo=agregar → mostrará el formulario para agregar
  //actividad?modo=editar → mostrará la lista en modo edición
  //actividad?modo=eliminar → mostrará la lista en modo eliminar
  //http://localhost:5173/actividad?modo=agregar

  const [params, setParams] = useSearchParams();
  const modo = params.get("modo") || "consultar";
  const id = parseInt(params.get("id"));            // 👈 identificador de la actividad a editar (si existe)
  const [actividades, setActividades] = useState(actividadesData);
  const [datoInicial, setDatoInicial] = useState(null);     // actividad seleccionada para editar

  // Detectar si hay una actividad seleccionada para editar  
  React.useEffect(() => {
    if (modo === "editar" && id) {
      const act = actividades.find((a) => a.id === id);
      setDatoInicial(act || null);
    } else {
      setDatoInicial(null);
    }
  }, [modo, id, actividades]);

  // Guardar actividad nueva o editada
  const guardarActividad = (actividad) => {
    if (modo === "editar" && datoInicial) {
      const actualizadas = actividades.map((a) =>
        a.id === datoInicial.id ? { ...a, ...actividad } : a
      );
      setActividades(actualizadas);
    } else {
      setActividades((prev) => [
        ...prev,
        { id: prev.length + 1, ...actividad },
      ]);
    }
  };

  // Cuando clickeo en el botón editar de la tabla
  const handleEditar = (actividad) => {
    setDatoInicial(actividad);
    setParams({ modo: "editar", id: actividad.id }); 
  };

  return (
    <main className="mainActividad">

      {modo === "agregar" && (
        <>
          <TituloConFlecha destino="/administrar"> Agregar Actividad </TituloConFlecha>

          <ImagenLateral
            imgIzquierda={imgIzquierda}
            imgDerecha={imgDerecha}
            altIzq="Actividad izquierda"
            altDer="Actividad derecha"
          />

          {/* 👇 Le paso también las actividades existentes, para la validación de nombre existente */}
          <ActividadForm guardar={guardarActividad} actividades={actividades} />          
        </>
      )}

      {/* Primero muestro la tabla, y al hacer clic en editar se abre el form */}
      {modo === "editar" && !datoInicial && (
        <>          
          <TituloConFlecha destino="/administrar"> Modificar Actividad </TituloConFlecha>
          <ActividadList
            actividades={actividades}
            modo="editar"
            onEditar={handleEditar}
          />
        </>
      )}

      {modo === "editar" && datoInicial && (
        <>
          <TituloConFlecha destino="/administrar"> Modificar Actividad </TituloConFlecha>
           <ImagenLateral
            imgIzquierda={imgIzquierda}
            imgDerecha={imgDerecha}
            altIzq="Actividad izquierda"
            altDer="Actividad derecha"
          />
          <ActividadForm
            guardar={guardarActividad}
            datoInicial={datoInicial}
            actividades={actividades}
          />
        </>
      )}

      {modo === "eliminar" && (
        <>          
          <TituloConFlecha destino="/administrar"> Eliminar Actividad </TituloConFlecha>
          <ActividadList actividades={actividades} modo="eliminar" />
        </>
      )}

      {modo === "consultar" && (
        <>
          <TituloConFlecha destino="/administrar"> Listado de Actividades </TituloConFlecha>
          <ActividadList actividades={actividades} modo="consultar" />
        </>
      )}

      {modo === "postAlta" && (
        <>
          <TituloConFlecha destino="/administrar"> Listado de Actividades </TituloConFlecha>
          <ActividadList actividades={actividades} modo="postAlta" />     {/* 👈 le paso este modo para que muestre el botón*/}
        </>
    )}

    </main>
  );
}
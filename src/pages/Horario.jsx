import React, { useState } from "react";                // React no se importa con llaves, solo el hook useState
import { useSearchParams } from "react-router-dom";
import "../styles/style.css";

import HorarioForm from "../components/HorarioForm";
import HorarioList from "../components/HorarioList";
import ImagenLateral from "../components/ImagenLateral";
import TituloConFlecha from "../components/TituloConFlecha";

import imgIzquierda from "../assets/img/horario1.png";
import imgDerecha from "../assets/img/horario2.png";

import horariosData from "../data/horarios.json";         // 👈 importo el JSON local (provisorio hasta que levante los datos

export default function Horario() {
  //horario → se mostrará "consultar"
  //horario?modo=agregar → mostrará el formulario para agregar
  //horario?modo=editar → mostrará la lista en modo edición
  //horario?modo=eliminar → mostrará la lista en modo eliminar
  //http://localhost:5173/horario?modo=agregar

  const [params, setParams] = useSearchParams();
  const modo = params.get("modo") || "consultar";
  const id = parseInt(params.get("id"));                    // 👈 identificador del horario a editar (si existe)
  const [horarios, setHorarios] = useState(horariosData);
  const [datoInicial, setDatoInicial] = useState(null);     // horario seleccionado para editar

  // Detecto si hay un horario seleccionado para editar  
  React.useEffect(() => {
    if (modo === "editar" && id) {
      const act = horarios.find((a) => a.id === id);
      setDatoInicial(act || null);
    } else {
      setDatoInicial(null);
    }
  }, [modo, id, horarios]);

  // Guardar horario nuevo o editado
  const guardarHorario = (horario) => {
    if (modo === "editar" && datoInicial) {
      const actualizados = horarios.map((h) =>
        h.id === datoInicial.id ? { ...h, ...horario } : h
      );
      setHorarios(actualizados);
    } else {
      setHorarios((prev) => [
        ...prev,
        { id: prev.length + 1, ...horario },
      ]);
    }
  };

  // Cuando clickeo en el botón editar de la tabla
  const handleEditar = (horario) => {
    setDatoInicial(horario);
    setParams({ modo: "editar", id: horario.id }); 
  };

  console.log(horarios)

  return (
    <main className="mainHorario">

      {modo === "agregar" && (
        <>
          <TituloConFlecha>Agregar Horario</TituloConFlecha>

          <ImagenLateral
            imgIzquierda={imgIzquierda}
            imgDerecha={imgDerecha}
            altIzq="Horario izquierdo"
            altDer="Horario derecho"
          />         

          {/* 👇 Le paso también los horarios existentes, para la validaciones */}
          <HorarioForm 
            guardar={guardarHorario} 
            datoInicial={datoInicial}
            horarios={horarios} 
          />
        </>
      )}

      {/* Primero muestro la tabla, y al hacer clic en editar se abre el form */}
      {modo === "editar" && !datoInicial && (
        <>
          <TituloConFlecha>Modificar Horario</TituloConFlecha>
          <HorarioList
            horarios={horarios}
            modo="editar"
            onEditar={handleEditar}
          />
        </>
      )}

      {modo === "editar" && datoInicial && (
        <>          
          <TituloConFlecha>Modificar Horario</TituloConFlecha>
          <ImagenLateral />
          <HorarioForm
            guardar={guardarHorario}
            datoInicial={datoInicial}
            horarios={horarios}
          />
        </>
      )}

      {modo === "eliminar" && (
        <>
          <TituloConFlecha>Eliminar Horario</TituloConFlecha>
          <HorarioList horarios={horarios} modo="eliminar" />
        </>
      )}

      {modo === "consultar" && (
        <>
          <TituloConFlecha>Listado de Horarios</TituloConFlecha>
          <HorarioList horarios={horarios} modo="consultar" />
        </>
      )}

      {modo === "postAlta" && (
        <>
          <TituloConFlecha>Listado de Horarios</TituloConFlecha>
          <HorarioList horarios={horarios} modo="postAlta" />     {/* 👈 le paso este modo para que muestre el botón*/}
        </>
    )}

    </main>
  );
}


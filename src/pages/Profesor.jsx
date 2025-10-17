import React, { useState } from "react";         // React no se importa con llaves, solo el hook useState
import { useSearchParams } from "react-router-dom";
import "../styles/style.css";

import imgIzquierda from "../assets/img/profesor1.png";
import imgDerecha from "../assets/img/profesor2.png";

import ProfesorForm from "../components/ProfesorForm";
import ProfesorList from "../components/ProfesorList";
import ImagenLateral from "../components/ImagenLateral";
import TituloConFlecha from "../components/TituloConFlecha";

import profesoresData from "../data/profesores.json";     // 👈 importo el JSON local (provisorio hasta que levante los datos

export default function Profesor() {
  const [params, setParams] = useSearchParams();
  const modo = params.get("modo") || "consultar";
  const profesor_id = parseInt(params.get("id"));            // 👈 identificador del profesor a editar (si existe)
  const [profesores, setProfesores] = useState(profesoresData);
  const [datoInicial, setDatoInicial] = useState(null);     // profesor seleccionado para editar

  // Detectar si hay un profesor seleccionado para editar  
  React.useEffect(() => {
    if (modo === "editar" && profesor_id) {
      const profesor = profesores.find((p) => p.id === profesor_id);
      setDatoInicial(profesor || null);
    } else {
      setDatoInicial(null);
    }
  }, [modo, profesor_id, profesores]);

  // Guardar profesor nuevo o editado
  const guardarProfesor = (profesor) => {
    if (modo === "editar" && datoInicial) {
      const actualizados = profesores.map((p) =>
        p.id === datoInicial.id ? { ...p, ...profesor } : p
      );
      setProfesores(actualizados);
    } else {
      setProfesores((prev) => [
        ...prev,
        { id: prev.length + 1, ...profesor },
      ]);
    }
  };

  // Cuando clickeo en el botón editar de la tabla
  const handleEditar = (profesor) => {
    setDatoInicial(profesor);
    setParams({ modo: "editar", profesor_id: profesor.id }); 
  };

  return (
    <main className="mainProfesor">

      {modo === "agregar" && (
        <>
          <TituloConFlecha> Agregar Profesor </TituloConFlecha>
          
          <ImagenLateral
            imgIzquierda={imgIzquierda}
            imgDerecha={imgDerecha}
            altIzq="Profesor izquierda"
            altDer="Profesor derecha"
          />

          {/* 👇 Le paso también los profesores existentes, para validaciones */}
          <ProfesorForm guardar={guardarProfesor} profesores={profesores} />          
        </>
      )}

      {/* Primero muestro la tabla, y al hacer clic en editar se abre el form */}
      {modo === "editar" && !datoInicial && (
        <>          
          <TituloConFlecha> Modificar Profesor </TituloConFlecha>
          <ProfesorList
            profesores={profesores}
            modo="editar"
            onEditar={handleEditar}
          />
        </>
      )}

      {modo === "editar" && datoInicial && (
        <>
          <TituloConFlecha> Modificar Profesor </TituloConFlecha>
           <ImagenLateral
            imgIzquierda={imgIzquierda}
            imgDerecha={imgDerecha}
            altIzq="Profesor izquierda"
            altDer="Profesor derecha"
          />
          <ProfesorForm
            guardar={guardarProfesor}
            datoInicial={datoInicial}            
            profesores={profesores}
          />
        </>
      )}

      {modo === "eliminar" && (
        <>          
          <TituloConFlecha> Eliminar Profesor </TituloConFlecha>
          <ProfesorList profesores={profesores} modo="eliminar" />
        </>
      )}

      {modo === "consultar" && (
        <>
          <TituloConFlecha> Listado de Profesores </TituloConFlecha>
          <ProfesorList profesores={profesores} modo="consultar" />
        </>
      )}

      {modo === "postAlta" && (
        <>
          <TituloConFlecha> Listado de Profesores </TituloConFlecha>
          <ProfesorList profesores={profesores} modo="postAlta" />     {/* 👈 le paso este modo para que muestre el botón*/}
        </>
    )}

    </main>
  );
}

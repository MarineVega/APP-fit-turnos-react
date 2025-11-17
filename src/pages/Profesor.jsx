import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/style.css";

import imgIzquierda from "../assets/img/profesor1.png";
import imgDerecha from "../assets/img/profesor2.png";

import ProfesorForm from "../components/ProfesorForm";
import ProfesorList from "../components/ProfesorList";
import ImagenLateral from "../components/ImagenLateral";
import TituloConFlecha from "../components/TituloConFlecha";

import { API_BASE_URL } from "../utils/apiConfig";

export default function Profesor() {
  const [params, setParams] = useSearchParams();
  const modo = params.get("modo") || "consultar";
  const profesor_id = parseInt(params.get("profesor_id"));

  const [profesores, setProfesores] = useState([]);
  const [datoInicial, setDatoInicial] = useState(null);

  // ⬇️ Fetch de profesores desde backend
  useEffect(() => {
    fetch(`${API_BASE_URL}/profesores`)
      .then((res) => res.json())
      .then(setProfesores)
      .catch((err) => console.error("Error al cargar profesores:", err));
  }, []);

  // Detectar si hay un profesor seleccionado para editar
  useEffect(() => {
    if (modo === "editar" && profesor_id) {
      const profesor = profesores.find((p) => p.profesor_id === profesor_id);
      setDatoInicial(profesor || null);
    } else {
      setDatoInicial(null);
    }
  }, [modo, profesor_id, profesores]);

  // Guardar profesor nuevo o editado
  const guardarProfesor = (profesor) => {
    const isEdit = modo === "editar" && datoInicial;

    const method = isEdit ? "PATCH" : "POST";
    const url = isEdit
      ? `${API_BASE_URL}/profesores/${datoInicial.profesor_id}`
      : `${API_BASE_URL}/profesores`;

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profesor),
    })
      .then((res) => res.json())
      .then((data) => {
        if (isEdit) {
          setProfesores((prev) =>
            prev.map((p) => (p.profesor_id === datoInicial.profesor_id ? data : p))
          );
        } else {
          setProfesores((prev) => [...prev, data]);
        }

        setParams({ modo: "postAlta" }); // redirige según flujo del front
      })
      .catch((err) => console.error("Error al guardar profesor:", err));
  };

  // Cuando clickeo en el botón editar de la tabla
  const handleEditar = (profesor) => {
    setDatoInicial(profesor);
    setParams({ modo: "editar", profesor_id: profesor.profesor_id });
  };

  return (
    <main className="mainProfesor">
      {modo === "agregar" && (
        <>
          <TituloConFlecha destino="/administrar"> Agregar Profesor </TituloConFlecha>
          
          <ImagenLateral
            imgIzquierda={imgIzquierda}
            imgDerecha={imgDerecha}
            altIzq="Profesor izquierda"
            altDer="Profesor derecha"
          />

          <ProfesorForm guardar={guardarProfesor} />
        </>
      )}

      {modo === "editar" && !datoInicial && (
        <>
          <TituloConFlecha destino="/administrar"> Modificar Profesor </TituloConFlecha>
          <ProfesorList profesores={profesores} modo="editar" onEditar={handleEditar} />
        </>
      )}

      {modo === "editar" && datoInicial && (
        <>
          <TituloConFlecha destino="/administrar"> Modificar Profesor </TituloConFlecha>
          <ImagenLateral imgIzquierda={imgIzquierda} imgDerecha={imgDerecha} />
          <ProfesorForm guardar={guardarProfesor} datoInicial={datoInicial} />
        </>
      )}

      {modo === "eliminar" && (
        <>
          <TituloConFlecha destino="/administrar"> Eliminar Profesor </TituloConFlecha>
          <ProfesorList profesores={profesores} modo="eliminar" setProfesores={setProfesores} />
        </>
      )}

      {modo === "consultar" && (
        <>
          <TituloConFlecha destino="/administrar"> Listado de Profesores </TituloConFlecha>
          <ProfesorList profesores={profesores} modo="consultar" />
        </>
      )}
    </main>
  );
}

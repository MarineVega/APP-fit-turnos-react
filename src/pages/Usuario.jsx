import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/style.css";

import imgIzquierda from "../assets/img/soga.png";
import imgDerecha from "../assets/img/abdominales.png";

import UsuarioForm from "../components/UsuarioForm";
import UsuarioList from "../components/UsuarioList";
import ImagenLateral from "../components/ImagenLateral";
import TituloConFlecha from "../components/TituloConFlecha";

export default function Usuario() {
  const [params, setParams] = useSearchParams();
  const modo = params.get("modo") || "consultar";
  const usuario_id = parseInt(params.get("id"));
  const [usuarios, setUsuarios] = useState([]);
  const [datoInicial, setDatoInicial] = useState(null);

  //  Cargar usuarios desde el backend
  useEffect(() => {
    fetch("http://localhost:3000/usuarios")
      .then((res) => res.json())
      .then((data) => {
        setUsuarios(data);
      })
      .catch((err) => console.error("Error al cargar usuarios:", err));
  }, []);

  //  Detectar si hay usuario seleccionado para editar
  useEffect(() => {
    if (modo === "editar" && usuario_id) {
      const usuario = usuarios.find((u) => u.usuario_id === usuario_id);
      setDatoInicial(usuario || null);
    } else {
      setDatoInicial(null);
    }
  }, [modo, usuario_id, usuarios]);

  // Guardar usuario nuevo o editado (llamando al backend)
  const guardarUsuario = async (usuario) => {
    try {
      if (modo === "editar" && datoInicial) {
        // PUT: actualizar usuario existente
        const res = await fetch(`http://localhost:3000/usuarios/${datoInicial.usuario_id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(usuario),
        });
        if (!res.ok) throw new Error("Error al actualizar usuario");
      } else {
        // POST: crear nuevo usuario
        const res = await fetch("http://localhost:3000/usuarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(usuario),
        });
        if (!res.ok) throw new Error("Error al crear usuario");
      }

      //  Volver a cargar la lista
      const nuevos = await fetch("http://localhost:3000/usuarios").then((r) => r.json());
      setUsuarios(nuevos);
    } catch (error) {
      console.error("Error guardando usuario:", error);
    }
  };

  const handleEditar = (usuario) => {
    setDatoInicial(usuario);
    setParams({ modo: "editar", id: usuario.usuario_id });
  };

  return (
    <main className="mainProfesor">
      {modo === "agregar" && (
        <>
          <TituloConFlecha>Agregar Usuario</TituloConFlecha>
          <ImagenLateral
            imgIzquierda={imgIzquierda}
            imgDerecha={imgDerecha}
            altIzq="Usuario izquierda"
            altDer="Usuario derecha"
          />
          <UsuarioForm guardar={guardarUsuario} usuarios={usuarios} />
        </>
      )}

      {modo === "editar" && !datoInicial && (
        <>
          <TituloConFlecha>Modificar Usuario</TituloConFlecha>
          <UsuarioList usuarios={usuarios} modo="editar" onEditar={handleEditar} />
        </>
      )}

      {modo === "editar" && datoInicial && (
        <>
          <TituloConFlecha>Modificar Usuario</TituloConFlecha>
          <ImagenLateral
            imgIzquierda={imgIzquierda}
            imgDerecha={imgDerecha}
            altIzq="Usuario izquierda"
            altDer="Usuario derecha"
          />
          <UsuarioForm
            guardar={guardarUsuario}
            datoInicial={datoInicial}
            usuarios={usuarios}
          />
        </>
      )}

      {modo === "eliminar" && (
        <>
          <TituloConFlecha>Eliminar Usuario</TituloConFlecha>
          <UsuarioList usuarios={usuarios} modo="eliminar" />
        </>
      )}

      {modo === "consultar" && (
        <>
          <TituloConFlecha>Listado de Usuarios</TituloConFlecha>
          <UsuarioList usuarios={usuarios} modo="consultar" />
        </>
      )}

      {modo === "postAlta" && (
        <>
          <TituloConFlecha>Listado de Usuarios</TituloConFlecha>
          <UsuarioList usuarios={usuarios} modo="postAlta" />
        </>
      )}
    </main>
  );
}

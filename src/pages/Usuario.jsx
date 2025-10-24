import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/style.css";

import imgIzquierda from "../assets/img/soga.png";
import imgDerecha from "../assets/img/abdominales.png";

import UsuarioForm from "../components/UsuarioForm";
import UsuarioList from "../components/UsuarioList";
import ImagenLateral from "../components/ImagenLateral";
import TituloConFlecha from "../components/TituloConFlecha";

import usuariosData from "../data/usuarios.json";

export default function Usuario() {
  const [params, setParams] = useSearchParams();
  const modo = params.get("modo") || "consultar";
  const usuario_id = parseInt(params.get("id"));
  const [usuarios, setUsuarios] = useState(
    JSON.parse(localStorage.getItem("usuarios")) || usuariosData.usuarios
  );
  const [datoInicial, setDatoInicial] = useState(null);

  // 🔹 Asegurar compatibilidad: si los usuarios antiguos no tienen estructura "persona"
  useEffect(() => {
    const actualizados = usuarios.map((u) => {
      if (!u.persona) {
        return {
          ...u,
          persona: {
            persona_id: u.usuario_id,
            nombre: u.nombre || u.usuario || "",
            apellido: "",
            documento: "",
            telefono: "",
            domicilio: "",
            fecha_nac: "",
            tipoPersona_id: u.esAdmin ? 1 : 3, // 1=Admin, 3=Cliente (por compatibilidad)
            activo: true,
          },
        };
      }
      return u;
    });

    if (JSON.stringify(actualizados) !== JSON.stringify(usuarios)) {
      setUsuarios(actualizados);
      localStorage.setItem("usuarios", JSON.stringify(actualizados));
    }
  }, []); // se ejecuta solo una vez al cargar

  // 🔹 Detectar si hay usuario seleccionado para editar
  useEffect(() => {
    if (modo === "editar" && usuario_id) {
      const usuario = usuarios.find((u) => u.usuario_id === usuario_id);
      setDatoInicial(usuario || null);
    } else {
      setDatoInicial(null);
    }
  }, [modo, usuario_id, usuarios]);

  // 🔹 Guardar usuario nuevo o editado
  const guardarUsuario = (usuario) => {
    if (modo === "editar" && datoInicial) {
      const actualizados = usuarios.map((u) =>
        u.usuario_id === datoInicial.usuario_id ? { ...u, ...usuario } : u
      );
      setUsuarios(actualizados);
      localStorage.setItem("usuarios", JSON.stringify(actualizados));
    } else {
      const nuevo = {
        ...usuario,
        usuario_id: usuarios.length + 1,
        persona: usuario.persona || {
          persona_id: usuarios.length + 1,
          nombre: usuario.nombre || usuario.usuario || "",
          apellido: "",
          documento: "",
          telefono: "",
          domicilio: "",
          fecha_nac: "",
          tipoPersona_id: 3, // por defecto Cliente
          activo: true,
        },
      };
      const actualizados = [...usuarios, nuevo];
      setUsuarios(actualizados);
      localStorage.setItem("usuarios", JSON.stringify(actualizados));
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
    </main>
  );
}

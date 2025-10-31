import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import exitoImg from "../assets/img/exito.png";
import FormCampos from "./FormCampos";
import FormBotones from "./FormBotones";
import { useSearchParams } from "react-router-dom";
import "../styles/style.css";

// ✅ Configuración del SweetAlert
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

export default function UsuarioForm({ guardar, usuarios = [], datoInicial = null }) {
  const [params] = useSearchParams();
  const modo = params.get("modo") || "agregar";
  const usuario_id = datoInicial?.usuario_id || null;

  // Estados del formulario
  const [usuario, setUsuario] = useState({
    nombre: datoInicial?.persona?.nombre || datoInicial?.nombre || "",
    apellido: datoInicial?.persona?.apellido || datoInicial?.apellido || "",
    email: datoInicial?.email || datoInicial?.persona?.email || "",
    usuario: datoInicial?.usuario || "",
    contrasenia: datoInicial?.password || datoInicial?.contrasenia || "",
    repetirContrasenia: "", // se completa abajo si es edición
    tipoPersona_id: datoInicial?.persona?.tipoPersona_id || "",
    activo: datoInicial?.activo ?? true,
  });

  const [errores, setErrores] = useState({});

  // ✅ Si está en modo edición, repetirContrasenia toma el valor de contrasenia
  useEffect(() => {
    if (modo === "editar" && usuario.contrasenia && !usuario.repetirContrasenia) {
      setUsuario((prev) => ({
        ...prev,
        repetirContrasenia: prev.contrasenia,
      }));
    }
  }, [modo, usuario.contrasenia]);

  const limpiarError = (campo) => setErrores((prev) => ({ ...prev, [campo]: "" }));

  //  Manejo de cambios
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUsuario({
      ...usuario,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ✅ Validación y guardado
  const validarGuardar = (e) => {
    e.preventDefault();

    const nuevosErrores = {};
    let esValido = true;

    // 🔹 Validaciones básicas
    if (!usuario.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio.";
      esValido = false;
    }
    if (!usuario.apellido.trim()) {
      nuevosErrores.apellido = "El apellido es obligatorio.";
      esValido = false;
    }
    if (!usuario.email.trim()) {
      nuevosErrores.email = "El email es obligatorio.";
      esValido = false;
    }
    if (!usuario.usuario.trim()) {
      nuevosErrores.usuario = "El nombre de usuario es obligatorio.";
      esValido = false;
    }
    if (!usuario.contrasenia.trim()) {
      nuevosErrores.contrasenia = "La contraseña es obligatoria.";
      esValido = false;
    }
    if (!usuario.repetirContrasenia.trim()) {
      nuevosErrores.repetirContrasenia = "Debe repetir la contraseña.";
      esValido = false;
    } else if (usuario.contrasenia !== usuario.repetirContrasenia) {
      nuevosErrores.repetirContrasenia = "Las contraseñas no coinciden.";
      esValido = false;
    }
    if (!usuario.tipoPersona_id) {
      nuevosErrores.tipoPersona_id = "Debe seleccionar un tipo de usuario.";
      esValido = false;
    }

    //  Evita duplicados de usuario y email
    const usuarioDuplicado = usuarios.some(
      (u) =>
        u.usuario?.toLowerCase().trim() === usuario.usuario.toLowerCase().trim() &&
        u.usuario_id !== usuario_id
    );

    const emailDuplicado = usuarios.some(
      (u) =>
        u.email?.toLowerCase().trim() === usuario.email.toLowerCase().trim() &&
        u.usuario_id !== usuario_id
    );

    if (usuarioDuplicado && emailDuplicado) {
      nuevosErrores.usuario = "Ya existe un usuario con ese nombre.";
      nuevosErrores.email = "Ya existe un usuario con ese correo electrónico.";
      esValido = false;
    } else if (usuarioDuplicado) {
      nuevosErrores.usuario = "Ya existe un usuario con ese nombre.";
      esValido = false;
    } else if (emailDuplicado) {
      nuevosErrores.email = "Ya existe un usuario con ese correo electrónico.";
      esValido = false;
    }

    setErrores(nuevosErrores);
    if (!esValido) return;

    // Estructura compatible 
    const usuarioFormateado = {
      usuario_id: usuario_id || usuarios.length + 1,
      usuario: usuario.usuario,
      email: usuario.email,
      password: usuario.contrasenia,
      activo: usuario.activo,
      persona: {
        persona_id: usuario_id || usuarios.length + 1,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        documento: "",
        telefono: "",
        domicilio: "",
        fecha_nac: "",
        tipoPersona_id: parseInt(usuario.tipoPersona_id),
        activo: true,
      },
    };

    guardar(usuarioFormateado);

    const mensaje =
      modo === "editar"
        ? "El usuario ha sido actualizado."
        : "El usuario ha sido creado.";

    swalEstilo
      .fire({
        title: "¡Operación Exitosa!",
        text: mensaje,
        imageUrl: exitoImg,
        imageAlt: "Éxito",
        icon: "success",
        confirmButtonText: "Volver",
      })
      .then(() => {
        limpiarFormulario();
        window.location.href =
          modo === "editar" ? "/usuario?modo=editar" : "/usuario?modo=postAlta";
      });
  };

  const limpiarFormulario = () => {
    setUsuario({
      nombre: "",
      apellido: "",
      email: "",
      usuario: "",
      contrasenia: "",
      repetirContrasenia: "",
      tipoPersona_id: "",
      activo: true,
    });
    setErrores({});
  };

  const cancelar = () => {
    limpiarFormulario();
    if (modo === "agregar") {
      window.location.href = "/administrar";
    } else if (modo === "editar") {
      window.location.href = "/usuario?modo=editar";
    } else {
      window.location.href = "/usuario?modo=consultar";
    }
  };

  return (
    
    <section className="seccionProfesor">
      <form onSubmit={validarGuardar} className="formProfesor">
        <FormCampos
          label="Nombre *"
          name="nombre"
          placeholder="Nombre"
          value={usuario.nombre}
          onChange={handleChange}
          onFocus={() => limpiarError("nombre")}
          className="inputProfesor"
          error={errores.nombre}
        />

        <FormCampos
          label="Apellido *"
          name="apellido"
          placeholder="Apellido"
          value={usuario.apellido}
          onChange={handleChange}
          onFocus={() => limpiarError("apellido")}
          className="inputProfesor"
          error={errores.apellido}
        />

        <FormCampos
          label="Email *"
          name="email"
          type="email"
          placeholder="usuario@email.com"
          value={usuario.email}
          onChange={handleChange}
          onFocus={() => limpiarError("email")}
          className="inputProfesor"
          error={errores.email}
        />

        <FormCampos
          label="Usuario *"
          name="usuario"
          placeholder="Nombre de usuario"
          value={usuario.usuario}
          onChange={handleChange}
          onFocus={() => limpiarError("usuario")}
          className="inputProfesor"
          error={errores.usuario}
        />

        <FormCampos
          label="Contraseña *"
          name="contrasenia"
          type="password"
          placeholder="Ingrese una contraseña"
          value={usuario.contrasenia}
          onChange={handleChange}
          onFocus={() => limpiarError("contrasenia")}
          className="inputProfesor"
          error={errores.contrasenia}
        />

        <FormCampos
          label="Repetir Contraseña *"
          name="repetirContrasenia"
          type="password"
          placeholder="Repita la contraseña"
          value={usuario.repetirContrasenia}
          onChange={handleChange}
          onFocus={() => limpiarError("repetirContrasenia")}
          className="inputProfesor"
          error={errores.repetirContrasenia}
        />

        {/* 🔹 Selector de Tipo de Usuario */}
        <label className="labelGeneral">Tipo de Usuario *</label>
        <select
          name="tipoPersona_id"
          value={usuario.tipoPersona_id}
          onChange={handleChange}
          className="inputProfesor"
          required
        >
          <option value="">Seleccione...</option>
          <option value="1">Administrador</option>
          <option value="2">Profesor</option>
          <option value="3">Cliente</option>
        </select>
        {errores.tipoPersona_id && (
          <p className="adventencia">{errores.tipoPersona_id}</p>
        )}

        <label className="checkAdmin">
          <input
            type="checkbox"
            name="activo"
            checked={usuario.activo}
            onChange={handleChange}
          />{" "}
          Activo
        </label>

        <label className="advertencia">* Campos obligatorios</label>
      </form>
     
      {/* ✅ Botones */}
      <FormBotones
        
        boton1={{
          id: "agregar",
          label: modo === "editar" ? "GUARDAR" : "AGREGAR",
          className: "btnAceptar",
          onClick: validarGuardar,
        }}
        boton2={{
          id: "cancelar",
          label: "CANCELAR",
          className: "btnCancelar",
          onClick: cancelar,
        }}
        
      />
     </section>
  );
}

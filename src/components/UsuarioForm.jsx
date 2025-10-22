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
    nombre: datoInicial?.nombre || "",
    apellido: datoInicial?.apellido || "",
    email: datoInicial?.email || "",
    usuario: datoInicial?.usuario || "",
    contrasenia: datoInicial?.contrasenia || "",
    repetirContrasenia: "", // 👈 campo adicional
    tipoUsuario: datoInicial?.tipoUsuario || "",
    rol: datoInicial?.rol || "",
    activo: datoInicial?.activo ?? true,
    esAdmin: datoInicial?.esAdmin ?? false,
  });

  const [errores, setErrores] = useState({});

  const limpiarError = (campo) => setErrores((prev) => ({ ...prev, [campo]: "" }));

  // ✅ Manejo del cambio de campos
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "tipoUsuario") {
      setUsuario({
        ...usuario,
        tipoUsuario: value,
        esAdmin: value === "Administrador", // 👑 si elije admin, se activa
      });
    } else {
      setUsuario({
        ...usuario,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  // ✅ Validación y guardado
  const validarGuardar = (e) => {
    e.preventDefault();

    const nuevosErrores = {};
    let esValido = true;

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

    // Evita duplicados
    const existe = usuarios.some(
      (u) =>
        u.usuario.toLowerCase() === usuario.usuario.toLowerCase() &&
        u.usuario_id !== usuario_id
    );
    if (existe) {
      nuevosErrores.usuario = "Ya existe un usuario con ese nombre.";
      esValido = false;
    }

    setErrores(nuevosErrores);
    if (!esValido) return;

    guardar(usuario);

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
      tipoUsuario: "",
      rol: "",
      activo: true,
      esAdmin: false,
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
          name="tipoUsuario"
          value={usuario.tipoUsuario}
          onChange={handleChange}
          className="inputProfesor"
          required
        >
          <option value="">Seleccione...</option>
          <option value="Administrador">Administrador</option>
          <option value="Profesor">Profesor</option>
          <option value="Cliente">Cliente</option>
        </select>

        <FormCampos
          label="Rol"
          name="rol"
          placeholder="Ejemplo: Coordinador, Profesor, Alumno..."
          value={usuario.rol}
          onChange={handleChange}
          className="inputProfesor"
        />

        <label className="checkLabel">
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
        {/* ✅ Botones alineados horizontalmente */}
        
          <FormBotones className="contenedorBotones"
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

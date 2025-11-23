import React, { useEffect, useState } from "react";
import { registerUser } from "../services/api";
import Swal from "sweetalert2";
import exitoImg from "../assets/img/exito.png";
import FormCampos from "./FormCampos";
import FormBotones from "./FormBotones";
import { useSearchParams } from "react-router-dom";
import "../styles/style.css";

// SweetAlert
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

  const [usuario, setUsuario] = useState({
    nombre: datoInicial?.persona?.nombre || datoInicial?.nombre || "",
    apellido: datoInicial?.persona?.apellido || datoInicial?.apellido || "",
    email: datoInicial?.email || datoInicial?.persona?.email || "",
    usuario: datoInicial?.usuario || "",
    contrasenia: datoInicial?.password || datoInicial?.contrasenia || "",
    repetirContrasenia: "",
    tipoPersona_id: datoInicial?.persona?.tipoPersona_id || "",
    activo: datoInicial?.activo ?? true,
  });

  const [errores, setErrores] = useState({});

  // Auto-completa repetir contraseña en modo edición
  useEffect(() => {
    if (modo === "editar" && usuario.contrasenia && !usuario.repetirContrasenia) {
      setUsuario((prev) => ({
        ...prev,
        repetirContrasenia: prev.contrasenia,
      }));
    }
  }, [modo, usuario.contrasenia]);

  const limpiarError = (campo) =>
    setErrores((prev) => ({ ...prev, [campo]: "" }));

  // 🔥 BLOQUEO DEL SELECT — añadido
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (
      name === "tipoPersona_id" &&
      modo === "editar" &&
      datoInicial?.persona?.tipoPersona_id === 3 &&
      datoInicial?.tieneReservas &&
      parseInt(value) !== 3
    ) {
      Swal.fire(
        "No permitido",
        "Este usuario es Cliente y tiene reservas activas. No puede cambiarse a otro tipo.",
        "warning"
      );
      return;
    }

    setUsuario({
      ...usuario,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validarGuardar = async (e) => {
    e.preventDefault();

    // 🔥 VALIDACIÓN EXTRA REAL a backend antes de guardar
    if (modo === "editar" && datoInicial?.persona?.tipoPersona_id === 3) {
      try {
        const headers = {};
        const token = localStorage.getItem("token");
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const resp = await fetch(
          `http://localhost:3000/reservas/usuario/${datoInicial.persona.persona_id}`,
          { headers }
        );

        if (resp.ok) {
          const data = await resp.json();

          if (data.tieneReservas && parseInt(usuario.tipoPersona_id) !== 3) {
            Swal.fire(
              "No permitido",
              "Este usuario tiene reservas activas y no puede cambiarse de Cliente.",
              "warning"
            );
            return;
          }
        }
      } catch (err) {
        console.error("Error validando reservas antes de guardar:", err);
      }
    }

    // 🔥 BLOQUEO ANTERIOR (por si acaso)
    if (
      modo === "editar" &&
      datoInicial?.persona?.tipoPersona_id === 3 &&
      datoInicial?.tieneReservas &&
      parseInt(usuario.tipoPersona_id) !== 3
    ) {
      Swal.fire(
        "No permitido",
        "Este usuario tiene reservas activas y no puede cambiarse de Cliente.",
        "warning"
      );
      return;
    }

    const nuevosErrores = {};
    let esValido = true;

    // Validaciones
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

    // Usuario duplicado
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

    if (usuarioDuplicado) {
      nuevosErrores.usuario = "Ya existe un usuario con ese nombre.";
      esValido = false;
    }
    if (emailDuplicado) {
      nuevosErrores.email = "Ya existe un usuario con ese correo electrónico.";
      esValido = false;
    }

    setErrores(nuevosErrores);
    if (!esValido) return;

    // --- Guardar en backend ---
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const token = localStorage.getItem("token");

    if (modo === "editar" && usuario_id) {
      const body = {
        usuario: usuario.usuario,
        email: usuario.email,
        password: usuario.contrasenia,
        persona: {
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

      try {
        const res = await fetch(`${API_URL}/usuarios/${usuario_id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Error al actualizar usuario");
        }
      } catch (error) {
        Swal.fire("Error", error.message, "error");
        return;
      }
    } else {
      try {
        await registerUser({
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          password: usuario.contrasenia,
          tipoPersona_id: parseInt(usuario.tipoPersona_id),
        });
      } catch (error) {
        Swal.fire("Error", error.message, "error");
        return;
      }
    }

    swalEstilo
      .fire({
        title: "¡Operación Exitosa!",
        text: modo === "editar" ? "El usuario ha sido actualizado." : "El usuario ha sido creado.",
        imageUrl: exitoImg,
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
    if (modo === "agregar") window.location.href = "/administrar";
    else window.location.href = "/usuario?modo=editar";
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

        {/* SELECT tipo de usuario */}
        <label className="labelGeneral" htmlFor="tipoPersona_id">
          Tipo de Usuario *
        </label>

        <select
          id="tipoPersona_id"
          name="tipoPersona_id"
          value={usuario.tipoPersona_id}
          onChange={handleChange}
          className="inputProfesor"
          required
          disabled={
            usuario.tipoPersona_id === "2" ||
            (
              modo === "editar" && 
              datoInicial?.persona?.tipoPersona_id === 3 &&
              datoInicial?.tieneReservas
            )
          }
        >
          <option value="">Seleccione...</option>

          <option
            value="1"
            disabled={
              modo === "editar" &&
              datoInicial?.persona?.tipoPersona_id === 3 &&
              datoInicial?.tieneReservas
            }
          >
            Administrador
          </option>

          <option
            value="2"
            disabled={modo === "agregar" || usuario.tipoPersona_id !== "2"}
          >
            Profesor (próximamente)
          </option>

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

        <p className="advertencia">* Campos obligatorios</p>
      </form>

      <FormBotones
        boton1={{
          id: "agregar",
          label: modo === "editar" ? "GUARDAR" : "AGREGAR",
          className: "btnAceptar",
          type: "button",
          onClick: validarGuardar,
        }}
        boton2={{
          id: "cancelar",
          label: "CANCELAR",
          className: "btnCancelar",
          type: "button",
          onClick: cancelar,
        }}
      />
    </section>
  );
}

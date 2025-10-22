import React, { useState, useEffect } from "react";
import FormCampos from "./FormCampos";
import FormBotones from "./FormBotones";
import Swal from "sweetalert2";

export default function UsuarioForm({ guardar, datoInicial, usuarios }) {
  const [usuario, setUsuario] = useState({
    usuario: "",
    email: "",
    tipoUsuario: "",
    nombre: "",
    apellido: "",
    rol: "",
    activo: true,
  });

  useEffect(() => {
    if (datoInicial) setUsuario(datoInicial);
  }, [datoInicial]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUsuario({
      ...usuario,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar usuario único
    const existe = usuarios.some(
      (u) => u.usuario.toLowerCase() === usuario.usuario.toLowerCase() && u.usuario_id !== datoInicial?.usuario_id
    );
    if (existe) {
      Swal.fire("Error", "Ya existe un usuario con ese nombre", "error");
      return;
    }

    guardar(usuario);
    Swal.fire("Éxito", "Usuario guardado correctamente", "success");
  };

  return (
    <form className="formGeneral" onSubmit={handleSubmit}>
      <FormCampos
        label="Usuario"
        name="usuario"
        value={usuario.usuario}
        onChange={handleChange}
        required
      />

      <FormCampos
        label="Email"
        name="email"
        type="email"
        value={usuario.email}
        onChange={handleChange}
        required
      />

      <FormCampos
        label="Nombre"
        name="nombre"
        value={usuario.nombre}
        onChange={handleChange}
        required
      />

      <FormCampos
        label="Apellido"
        name="apellido"
        value={usuario.apellido}
        onChange={handleChange}
        required
      />

      <label>Tipo de Usuario:</label>
      <select
        name="tipoUsuario"
        value={usuario.tipoUsuario}
        onChange={handleChange}
        className="inputGeneral"
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
        value={usuario.rol}
        onChange={handleChange}
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

      <FormBotones
        boton1={{ label: "Guardar", onClick: handleSubmit }}
        boton2={{ label: "Cancelar", onClick: () => window.history.back() }}
      />
    </form>
  );
}

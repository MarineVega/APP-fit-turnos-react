import React, { useEffect, useState } from "react";
import profesoresData from "../data/profesores.json";       // 👈 Datos mock

export default function ComboProfesores({ 
    value, 
    onChange = () => {},
    onFocus,
    incluirTodos = true,
    className="",
    label,
    error,
    }) {
  const [profesores, setProfesores] = useState([]);

  useEffect(() => {
    // simulo una carga asincrónica (como si viniera del backend)
    const cargarProfesores = async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));             // pequeño delay
      const activos = profesoresData.filter((p) => p.activo);
      setProfesores(activos);
    };

    cargarProfesores();
  }, []);

  return (
    <div className="campoFormulario">
      {/* <label htmlFor="profesor">Profesor *</label> */}
      <label htmlFor="profesor"> {label} </label>
      <select
        id="profesor"
        name="profesor"
        value={value ?? ""} // si value es null/undefined mostramos ""
        onChange={(e) => {
          const val = e.target.value;
          // convierto "" a null para que el padre reciba null si selecciona "(Todos)"
          onChange(val === "" ? null : val);
        }}
        onFocus={onFocus}       
        className={className}
      >
        {/* 👇 Opción por defecto */}
        {incluirTodos && (
          <option value="">(Todos)</option>
        )}

        {/* 👇 Lista de profesores activos */}
        {/* <option value="">Profesor</option> */}
        {profesores.map((p) => (
          <option key={p.profesor_id} value={p.profesor_id}>
            {`${p.apellido}, ${p.nombre} (${p.titulo})`}
          </option>
        ))}
      </select>
      
      {/* 👇 Mostramos el mensaje de error, si existe */}
      {error && <div className="mensaje-error">{error}</div>}

    </div>
  );
}

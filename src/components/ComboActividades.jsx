import React, { useEffect, useState } from "react";

export default function ComboActividades({  
    value, 
    onChange = () => {},
    opciones = [],
    onFocus,
    incluirTodos = true, 
    className="",
    label,
    error,
}) {

  return (
    <div className="campoFormulario">
      <label htmlFor="actividad"> {label} </label>
      <select
        id="actividad"
        name="actividad"
        value={value ?? ""} // si value es null/undefined mostramos ""
        onChange={(e) => {
            const val = e.target.value;
            // convertimos "" a null para que el padre reciba null si selecciona "(Todos)"
            onChange(val === "" ? null : val);
        }}   
        onFocus={onFocus}       
        className={className}
      >
        {/* 👇 Opción por defecto */}
        {incluirTodos && (
          <option value="">(Todas)</option>
        )}
       
        {/* 👇 Lista de actividades activas (desde BD) */}
        {opciones
          .filter((a) => a.activa)         // muestro solo activas
          .sort((a, b) => a.nombre.localeCompare(b.nombre))   // ordeno por nombre (localeCompare -> respeta acentos y orden textual correcto en español)
          .map((a) => (
            <option key={a.actividad_id} value={a.actividad_id}>
              {`${a.nombre}`}
            </option>
          ))
        }    
          
      </select>

      {/* 👇 Mostramos el mensaje de error, si existe */}
      {error && <div className="mensaje-error">{error}</div>}

    </div>
  );
}

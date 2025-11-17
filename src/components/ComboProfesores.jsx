import React, { useEffect, useState } from "react";

export default function ComboProfesores({ 
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

          {/* 👇 Lista de profesores activos (desde BD) */}
          {opciones
            .filter((p) => p.persona?.activo)       // muestro solo activos
            .sort((a, b) => {
              const nombreA = `${a.persona?.nombre ?? ""} ${a.persona?.apellido ?? ""}`.toLowerCase();
              const nombreB = `${b.persona?.nombre ?? ""} ${b.persona?.apellido ?? ""}`.toLowerCase();
              /*
              const nombreA = `${a.persona.nombre} ${a.persona.apellido}`.toLowerCase();    // de esta manera ordeno por nombre y apellido
              const nombreB = `${b.persona.nombre} ${b.persona.apellido}`.toLowerCase();
              */
              return nombreA.localeCompare(nombreB);
            })
            .map((p) => (
              <option key={p.profesor_id} value={p.profesor_id}>
                {`${p.persona?.nombre ?? ""} ${p.persona?.apellido ?? ""}`}
                {/* {`${p.persona.nombre}, ${p.persona.apellido}`} */}
              </option>
            ))
          }          

        </select>
        
        {/* 👇 Mostramos el mensaje de error, si existe */}
        {error && <div className="mensaje-error">{error}</div>}

      </div>
    );
}

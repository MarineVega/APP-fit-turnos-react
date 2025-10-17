import React, { useEffect, useState } from "react";
import actividadesData from "../data/actividades.json";       // 👈 Datos mock

export default function ComboActividades({  
    value, 
    onChange = () => {},
    onFocus,
    incluirTodos = true, 
    className="",
    label,
    error,
}) {
  const [actividades, setActividades] = useState([]);

  useEffect(() => {
    // simulo una carga asincrónica (como si viniera del backend)
    const cargarActividades = async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));             // pequeño delay
      const activas = actividadesData.filter((a) => a.activa);
      setActividades(activas);
    };

    cargarActividades();
  }, []);

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

        {/* 👇 Lista de actividades activas */}
        <option value="">Elegir una actividad</option>
        {actividades.map((a) => (
          <option key={a.actividad_id} value={a.actividad_id}>
            {`${a.nombre}`}
          </option>
        ))}
      </select>

      {/* 👇 Mostramos el mensaje de error, si existe */}
      {error && <div className="mensaje-error">{error}</div>}

    </div>
  );
}

import React, { useEffect, useState } from "react";
//import horasData from "../data/horas.json";       // 👈 Datos mock

export default function ComboHoras({
  value,
  onChange = () => {},
  opciones = [],
  onFocus,
  //incluirTodos = true,
  className = "",
  label,
  error,
}) {
/*
  const [horas, setHoras] = useState([]);

  useEffect(() => {
    // simulo una carga asincrónica (como si viniera del backend)
    const cargarHoras = async () => {
      await new Promise((resolve) => setTimeout(resolve, 300)); // pequeño delay
      const activas = horasData.filter((h) => h.activa);
      setHoras(activas);
    };

    cargarHoras();
  }, []);
*/
  return (
    <div className="etiquetaHoras">
      <label htmlFor="hora"> {label} </label>
      <select
        id="hora"
        name="hora"
        value={value ?? ""} // si value es null/undefined mostramos ""
        onChange={(e) => {
          const val = e.target.value;
          // convierto "" a null para que el padre reciba null
          onChange(val === "" ? null : val);
        }}
        onFocus={onFocus}
        className={className}
      >        
        <option value="">Elegir un horario</option>

        {opciones.map((h) => (
          <option key={h.hora_id} value={h.hora_id}>
            {`${h.horaInicio.slice(0, 5)} a ${h.horaFin.slice(0, 5)}`}        
          </option>
        ))}
      </select>

      {/* Muestro el mensaje de error, si existe */}
      {error && <div className="mensaje-error">{error}</div>}
    </div>
  );
}

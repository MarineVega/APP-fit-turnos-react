import React from "react";

export default function DiasSemana({ 
  diasSeleccionados = [], 
  onChange, 
  onFocus,
  error = "" 
}) {
  const dias = [
    { id: "lunes", label: "Lunes" },
    { id: "martes", label: "Martes" },
    { id: "miercoles", label: "Miércoles" },
    { id: "jueves", label: "Jueves" },
    { id: "viernes", label: "Viernes" },
    { id: "sabado", label: "Sábado" },
  ];

  // Maneja el clic en cada checkbox
  const handleCheckboxChange = (dia) => {
    if (diasSeleccionados.includes(dia)) {
      // Si ya estaba seleccionado, lo saco
      onChange(diasSeleccionados.filter((d) => d !== dia));
    } else {
      // Si no estaba, lo agrego
      onChange([...diasSeleccionados, dia]);
    }
  };

  return (
    <div className="contenedorDias">
      <label className="etiquetaDias">Días *</label>
      <div className="grillaDias">
        <div className="columnaDias">
          {dias.slice(0, 3).map((dia) => (
            <div key={dia.id}>
              <input
                type="checkbox"
                id={dia.id}
                checked={diasSeleccionados.includes(dia.id)}
                onChange={() => handleCheckboxChange(dia.id)}
              />
              <label htmlFor={dia.id}>{dia.label}</label>
            </div>
          ))}
        </div>
        <div className="columnaDias">
          {dias.slice(3).map((dia) => (
            <div key={dia.id}>
              <input
                type="checkbox"
                id={dia.id}
                checked={diasSeleccionados.includes(dia.id)}
                onChange={() => handleCheckboxChange(dia.id)}
              />
              <label htmlFor={dia.id}>{dia.label}</label>
            </div>
          ))}
        </div>
      </div>

       {/* 👇 muestra el mensaje de error si existe */}
      {error && <div className="mensaje-error">{error}</div>}

    </div>
  );
}

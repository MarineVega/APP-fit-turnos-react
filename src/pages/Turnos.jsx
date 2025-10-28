import React, { useState, useEffect } from "react";
import CarruselActividades from "../components/CarruselActividades";
import CalendarioTurnos from "../components/CalendarioTurnos";
import actividadesData from "../data/actividades.json";

export default function Turnos() {
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);

  // Al cargar la página, selecciona la primera actividad activa
  useEffect(() => {
    const actividadesActivas = actividadesData.filter(a => a.activa);
    if (actividadesActivas.length > 0) {
      setActividadSeleccionada(actividadesActivas[0]);
    }
  }, []); // solo una vez al montar

  // Para debug
  // console.log("🎯 Actividad seleccionada:", actividadSeleccionada);
  

  return (
    <>
      {/* <div className="turnos-container"> */}

      <CarruselActividades
        seleccion={actividadSeleccionada}
        onSeleccion={(actividad) => setActividadSeleccionada(actividad)}
        />

      <CalendarioTurnos actividadSeleccionada={actividadSeleccionada} />

    </>
  );
}

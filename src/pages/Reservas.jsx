import React, { useState, useEffect } from "react";
import ReservasCarrusel from "../components/ReservasCarrusel";
import ReservasCalendario from "../components/ReservasCalendario";
import TituloConFlecha from "../components/TituloConFlecha";
import actividadesData from "../data/actividades.json";

// antes Turnos ahora Reservas
export default function Reservas() {
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);

  // Al cargar la página, selecciona la primera actividad activa
  useEffect(() => {
    const actividadesActivas = actividadesData.filter(a => a.activa);
    if (actividadesActivas.length > 0) {
      setActividadSeleccionada(actividadesActivas[0]);
    }
  }, []); // solo una vez al montar

  // console.log("Actividad seleccionada:", actividadSeleccionada);
  

  return (
    <>
      {/* <div className="turnos-container"> */}
      <TituloConFlecha destino="/"> Reserva tu Turno </TituloConFlecha>
        <ReservasCarrusel
          seleccion={actividadSeleccionada}
          onSeleccion={(actividad) => setActividadSeleccionada(actividad)}
        />

        <ReservasCalendario actividadSeleccionada={actividadSeleccionada} />

    </>
  );
}

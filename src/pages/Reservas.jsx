import React, { useState, useEffect } from "react";
import ReservasCarrusel from "../components/ReservasCarrusel";
import ReservasCalendario from "../components/ReservasCalendario";
import TituloConFlecha from "../components/TituloConFlecha";

// antes Turnos ahora Reservas
export default function Reservas() {
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);  

  // Cargo actividades desde la BD
  useEffect(() => {
    const fetchActividades = async () => {
        try {
            const response = await fetch("http://localhost:3000/actividades");
            const data = await response.json();

            // Filtro solo las activas
            const activas = data.filter(a => a.activa === true);

              // Ordeno por nombre
            const ordenadas = activas.sort((a, b) => {
                const nomA = a.nombre.toLowerCase();
                const nomB = b.nombre.toLowerCase();

                if (nomA < nomB) return -1;
                if (nomA > nomB) return 1;
                return 0;
            });
            
            setActividadSeleccionada(ordenadas);

        } catch (error) {
            console.error("Error cargando actividades:", error);
        }
    };

    fetchActividades();
  }, []); 

/*
  // Al cargar la página, selecciona la primera actividad activa
  useEffect(() => {
    const actividadesActivas = fetchActividades.filter(a => a.activa);
    if (actividadesActivas.length > 0) {
      setActividadSeleccionada(actividadesActivas[0]);
    }
  }, []); // solo una vez al montar
*/
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

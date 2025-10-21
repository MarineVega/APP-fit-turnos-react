import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
/*
import { Calendar } from "@fullcalendar/core";
import timeGridPlugin from "@fullcalendar/timegrid";
import esLocale from "@fullcalendar/core/locales/es";
*/
import TituloConFlecha from "../components/TituloConFlecha";
import CarruselActividades from "../components/CarruselActividades";
import CalendarioTurnos from "../components/CalendarioTurnos";

import actividadesData from "../data/actividades.json";
import profesoresData from "../data/profesores.json";
import horariosData from "../data/horarios.json";
import horasData from "../data/horas.json";
import reservasData from "../data/reservas.json";


/* Turnos.jsx -> es el contenedor general:
    Carga el FullCalendar.
    Coordina el estado global: actividades, horarios, reservas, usuario, etc.
    Renderiza los subcomponentes.
*/

export default function Turnos() {
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
  const [usuario, setUsuario] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [horas, setHoras] = useState([]);

  useEffect(() => {
    setProfesores(profesoresData);
    setHorarios(horariosData);
    setHoras(horasData);
    setReservas(reservasData);
  });

  // Filtro horarios por la actividad seleccionada
  const horariosFiltrados = actividadSeleccionada
    ? horariosData.filter(
        (h) =>
          Number(h.actividad_id) === Number(actividadSeleccionada.actividad_id)
      )
    : [];

  /*
   // 🔹 Función para reservar un turno
  const reservarTurno = (horario) => {
    const profesor = profesores.find(
      (p) => Number(p.profesor_id) === Number(horario.profesor_id)
    );
    const hora = horas.find((hr) => Number(hr.hora_id) === Number(horario.hora_id));

    // Verificar si ya hay una reserva activa en ese horario
    const existeReserva = reservas.some(
      (r) =>
        r.horario_id === horario.horario_id &&
        r.activo === true
    );

    if (existeReserva) {
      Swal.fire({
        icon: "warning",
        title: "Turno no disponible",
        text: "Este horario ya está reservado. Por favor, elegí otro.",
      });
      return;
    }

    // Simula guardar la reserva
    const nuevaReserva = {
      reserva_id: reservas.length + 1,
      horario_id: horario.horario_id,
      profesor_id: horario.profesor_id,
      actividad_id: horario.actividad_id,
      activo: true,
    };

    setReservas((prev) => [...prev, nuevaReserva]);

    Swal.fire({
      icon: "success",
      title: "¡Turno reservado!",
      text: `Tu turno para ${actividadSeleccionada.nombre} con ${profesor.nombre} ${profesor.apellido} (${hora.horaInicio} - ${hora.horaFin}) fue reservado correctamente.`,
      confirmButtonColor: "#6edc8c",
    });
  };
  */

  return (
    <>      
      <main className="mainTurnos">
        <TituloConFlecha destino="/">Reservá tu Turno</TituloConFlecha>

         {/* Carrusel de actividades */}
        <CarruselActividades
          seleccion={actividadSeleccionada}
          onSeleccion={setActividadSeleccionada}
        />
        

        {/* OJO!!!!!!!!!! REVISAR */}

          {/* Listado de horarios según la actividad */}
      {/* {actividadSeleccionada && (
        <section className="listadoHorarios">
          <h3 className="subtituloTurnos">
            Horarios disponibles para {actividadSeleccionada.nombre}
          </h3>

          {horariosFiltrados.length > 0 ? (
            <table className="tablaTurnos">
              <thead>
                <tr>
                  <th>Días</th>
                  <th>Horario</th>
                  <th>Profesor</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {horariosFiltrados.map((h) => {
                  const profesor = profesores.find(
                    (p) => Number(p.profesor_id) === Number(h.profesor_id)
                  );
                  const hora = horas.find(
                    (hr) => Number(hr.hora_id) === Number(h.hora_id)
                  );

                  return (
                    <tr key={h.horario_id}>
                      <td>{h.dias}</td>
                      <td>
                        {hora ? `${hora.horaInicio} - ${hora.horaFin}` : ""}
                      </td>
                      <td>
                        {profesor
                          ? `${profesor.nombre} ${profesor.apellido}`
                          : "Sin asignar"}
                      </td>
                      <td>
                        <button
                          className="btnAceptar"
                          onClick={() => reservarTurno(h)}
                        >
                          Reservar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="mensaje-vacio">
              No hay horarios disponibles para esta actividad.
            </p>
          )}
        </section>
      )}

       */}
      </main>
    </>
  )
}


/*
 componente layaut -> header y footer
 en app las rutas quedan dentro del layaut
 copyrigth en footer del login
*/
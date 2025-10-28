import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Swal from "sweetalert2";

import actividadesData from "../data/actividades.json";
import profesoresData from "../data/profesores.json";
import horasData from "../data/horas.json";
import horariosData from "../data/horarios.json";
import reservasData from "../data/reservas.json";

import imgPensando from "../assets/img/pensando.png";

const swalEstilo = Swal.mixin({
    imageWidth: 200,       // ancho en píxeles
    imageHeight: 200,      // alto en píxeles 
    background: '#bababa',
    confirmButtonColor: '#6edc8c',
    customClass: {
        confirmButton: 'btnAceptar',
        cancelButton: 'btnCancelar'
    }
});

// mapeo de nombre de día -> número (JS Date.getDay)
const diasSemana = {
  domingo: 0,
  lunes: 1,
  martes: 2,
  miercoles: 3,
  miércoles: 3,
  jueves: 4,
  viernes: 5,
  sabado: 6,
  sábado: 6,
};

// Normaliza distintos formatos de días
function parseDias(diasCampo) {
  // acepta: array ["lunes","martes"] o string '["lunes","martes"]' o "Lunes, Miércoles"
  if (!diasCampo) return [];
  if (Array.isArray(diasCampo)) return diasCampo.map((d) => d.toLowerCase());
  if (typeof diasCampo === "string") {
    try {
      const parsed = JSON.parse(diasCampo);
      if (Array.isArray(parsed)) return parsed.map((d) => d.toLowerCase());
    } catch {
      // no es JSON: tratar como coma-separado
      return diasCampo
        .split(",")
        .map((d) => d.trim().toLowerCase())
        .filter(Boolean);
    }
  }
  return [];
}

// Convierte horas a formato HH:mm
function normalizeHora(h) {
  // acepta formatos distintos: "08:00", "8.00", numbers 8 or "8" o objetos con horaInicio/hora_inicio
  if (!h) return null;
  if (typeof h === "string" && /^\d{1,2}:\d{2}$/.test(h)) return h;       // si viene "08:00" lo devolvemos tal cual                            
  if (typeof h === "number") return `${String(h).padStart(2, "0")}:00`;   // si viene "8.00" o "8.0" o "8" => convertir a "08:00"
  return null;
}

export default function CalendarioTurnos({ actividadSeleccionada }) {
  const [eventos, setEventos] = useState([]);
  const [reservas, setReservas] = useState(reservasData);

  // Levanto usuario activo
  //const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
  const usuario = { usuario_id: 2, nombre: "Mariné" };

  // Generar eventos según actividad
  useEffect(() => {

    // si no recibimos actividad seleccionada, limpiamos
    if (!actividadSeleccionada) {
      setEventos([]);
      return;
    }

    const eventosGenerados = [];
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

    // Recorro horarios y genero eventos solamente para la actividad seleccionada
    horariosData.forEach((horario) => {
      if (Number(horario.actividad_id) !== Number(actividadSeleccionada.actividad_id)) return;
      if (!horario.activo) return;

      const horaObj = horasData.find((h) => Number(h.hora_id) === Number(horario.hora_id)) || {};
      const horaInicio = normalizeHora(horaObj.horaInicio || horaObj.hora_inicio);
      const horaFin = normalizeHora(horaObj.horaFin || horaObj.hora_fin);
      if (!horaInicio || !horaFin) return;

      const profesor = profesoresData.find(
        (p) => Number(p.profesor_id) === Number(horario.profesor_id)
      );
      const dias = parseDias(horario.dias_id || horario.dias);

      dias.forEach((dia) => {
        for (let d = new Date(inicioMes); d <= finMes; d.setDate(d.getDate() + 1)) {
          const nombreDia = Object.keys(diasSemana).find(
            (key) => diasSemana[key] === d.getDay()
          );
          if (!nombreDia) continue;

          const diaNorm = dia.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          const diaActualNorm = nombreDia.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          if (diaNorm !== diaActualNorm) continue;

          const fechaISO = d.toISOString().split("T")[0];
          const start = `${fechaISO}T${horaInicio}`;

          const reservasHorario = reservas.filter(
            (r) => Number(r.horario_id) === Number(horario.horario_id) && r.activo
          );
          const cuposDisponibles = Math.max(horario.cupoMaximo - reservasHorario.length, 0);
          const yaReservado = reservasHorario.some(
            (r) => r.usuario_id === usuario.usuario_id
          );

          //const titulo = `${profesor ? profesor.nombre + " " + profesor.apellido : ""} \nCupo: ${cuposDisponibles}/${horario.cupoMaximo}`; 
          const titulo = `${profesor ? profesor.nombre + " " + profesor.apellido : ""} \nCupo: ${cuposDisponibles}`; 

          // asigno colores según el estado de las reservas
          const colorEvento = yaReservado
            ? "#5cb85c"         // verde si está reservado por el usuario logueado
            : (cuposDisponibles > 0 ? "#3788d8" : "#d9534f"); 

          eventosGenerados.push({
            // creo un id para cada evento del calendario
            // horario.horario_id → es el ID del horario al que pertenece el evento (por ejemplo, el horario de Crossfit de 8:00 a 9:00).
            // fechaISO → es la fecha específica del día en el que se da ese horario, por ejemplo "2025-10-25".
            // Y se combinan con una interpolación de string
            // El mismo horario (por ejemplo, “Crossfit 08:00”) se repite varios días (lunes, miércoles, viernes).
            // Entonces, no basta con usar solo horario_id como ID, porque eso generaría IDs repetidos en FullCalendar.
            // Al combinarlo con la fecha del día específico, cada evento es único (no se pisan entre sí).
            id: `${horario.horario_id}-${fechaISO}`,
            title: titulo,
            start,
            backgroundColor: colorEvento,
            borderColor: colorEvento,
            extendedProps: {
              horario_id: horario.horario_id,
              fecha: fechaISO,
              cuposDisponibles,
              profesor: profesor
                ? `${profesor.nombre} ${profesor.apellido}`
                : "Sin profesor",
              yaReservado,
              horaInicio,
              horaFin,
            },
          });
        }
      });
    });

    setEventos(eventosGenerados);
  }, [actividadSeleccionada, reservas]);

  // Manejador de clics
  const manejarClick = (info) => {
    const evento = info.event.extendedProps;
    console.log(evento)
    const { horario_id, fecha, yaReservado, cuposDisponibles, horaInicio, profesor } = evento;

    if (yaReservado) {
      // Cancelar reserva
      swalEstilo.fire({
        title: "¿Querés cancelar tu reserva?",
        imageUrl: imgPensando,  
         html: `
          <p><b>Actividad:</b> ${actividadSeleccionada.nombre}</p>
          <p><b>Profesor:</b> ${profesor} </p>
          <p><b>Fecha y hora:</b> ${fecha}  ⏱  ${horaInicio} hs</p>
        `,        
        showCancelButton: true,
        confirmButtonText: "Sí, cancelar",
        cancelButtonText: "No",
        confirmButtonColor: "#d33",
        cancelButtonColor: '#6edc8c',customClass: {
          cancelButton: 'btnAceptar'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          setReservas((prev) =>
            prev.map((r) =>
              r.usuario_id === 1 && r.horario_id === horario_id && r.activo
                ? { ...r, activo: false }
                : r
            )
          );
          Swal.fire("Cancelada", "Tu reserva ha sido cancelada.", "success");
        }
      });
    } else {
      // Crear reserva
      if (cuposDisponibles <= 0) {
        Swal.fire("Sin cupos", "No hay lugares disponibles en este horario.", "error");
        return;
      }

      Swal.fire({
        title: "Reservar turno",
        text: `¿Querés reservar este horario (${evento.horaInicio} - ${evento.horaFin})?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, reservar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#6edc8c",
      }).then((result) => {
        if (result.isConfirmed) {
          const nuevaReserva = {
            reserva_id: reservas.length + 1,
            horario_id,
            usuario_id: usuario.usuario_id,
            activo: true,
            fecha,
          };
          setReservas((prev) => [...prev, nuevaReserva]);
          Swal.fire("¡Listo!", "Tu reserva fue confirmada.", "success");
        }
      });
    }
  };

  // Configuración visual del calendario
  // Levanto la hora mínima configurada para esta app
  const horaMin = horasData.map((h) => h.horaInicio).sort()[0] || "08:00";
  // Levanto la hora máxima configurada para esta app
  const horaMax = horasData.map((h) => h.horaFin).sort().slice(-1)[0] || "22:00";

  return (
    <section id="seccionCalendarioTurnos">
      <div className="calendar-wrapper">        
        <div className="calendar-scroll">

          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
          //  initialDate={new Date()}    // centra el calendario en el día actual
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "timeGridWeek,timeGridDay",
            }}
            
            allDaySlot={false}
            locale="es"
            buttonText={{
              today: "hoy",
              month: "mes",
              week: "semana",
              day: "día"
            }}
            
            // cambio el puntero del mous en aquellas celdas que tienen info, para poder reservar/cancelar
            dayCellDidMount={function(info) {
              info.el.style.cursor = 'pointer'
            }}  
            events={eventos}
            height="auto"
            nowIndicator={true}
            slotMinTime={horaMin}
            slotMaxTime={horaMax}
            firstDay={1}
            eventClick={manejarClick}
          />
        </div>
      </div>
    </section>
  );
}

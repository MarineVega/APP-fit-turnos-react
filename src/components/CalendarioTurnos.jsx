import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Swal from "sweetalert2";

//import actividadesData from "../data/actividades.json";
import profesoresData from "../data/profesores.json";
import horasData from "../data/horas.json";
import horariosData from "../data/horarios.json";
import reservasData from "../data/reservas.json";

import imgPensando from "../assets/img/pensando.png";
import error from "../assets/img/error.png";
import chica_ok from "../assets/img/chica_ok.png";

const swalEstilo = Swal.mixin({
  imageWidth: 200, // ancho en píxeles
  imageHeight: 200, // alto en píxeles
  background: "#bababa",
  confirmButtonColor: "#6edc8c",
  customClass: {
    confirmButton: "btnAceptar",
    cancelButton: "btnCancelar",
  },
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
  if (typeof h === "string" && /^\d{1,2}:\d{2}$/.test(h)) return h; // si viene "08:00" lo devolvemos tal cual
  if (typeof h === "number") return `${String(h).padStart(2, "0")}:00`; // si viene "8.00" o "8.0" o "8" => convertir a "08:00"
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

    // Mostrar turnos desde 1 mes antes hasta 2 meses después
    const inicioRango = new Date(hoy);
    inicioRango.setMonth(hoy.getMonth() - 1);
    inicioRango.setDate(1);

    const finRango = new Date(hoy);
    finRango.setMonth(hoy.getMonth() + 2);
    finRango.setDate(30);

    /*
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
    */

    // Recorro horarios y genero eventos solamente para la actividad seleccionada
    horariosData.forEach((horario) => {
      if (
        Number(horario.actividad_id) !==
        Number(actividadSeleccionada.actividad_id)
      )
        return;
      if (!horario.activo) return;

      const horaObj =
        horasData.find((h) => Number(h.hora_id) === Number(horario.hora_id)) ||
        {};
      const horaInicio = normalizeHora(
        horaObj.horaInicio || horaObj.hora_inicio
      );
      const horaFin = normalizeHora(horaObj.horaFin || horaObj.hora_fin);
      if (!horaInicio || !horaFin) return;

      const profesor = profesoresData.find(
        (p) => Number(p.profesor_id) === Number(horario.profesor_id)
      );
      const dias = parseDias(horario.dias_id || horario.dias);

      dias.forEach((dia) => {
        for (
          let d = new Date(inicioRango);
          d <= finRango;
          d.setDate(d.getDate() + 1)
        ) {
          const nombreDia = Object.keys(diasSemana).find(
            (key) => diasSemana[key] === d.getDay()
          );
          if (!nombreDia) continue;

          const diaNorm = dia.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          const diaActualNorm = nombreDia
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
          if (diaNorm !== diaActualNorm) continue;

          const fechaISO = d.toISOString().split("T")[0]; // toISOString -> convierte un objeto de fecha (d) a una cadena de fecha y hora en formato ISO 8601, separa esa cadena por la letra 'T' y luego toma el primer elemento, obteniendo así la fecha en formato YYYY-MM-DD. Ej: 2025-10-29T10:30:00.000Z, se dividiría en dos partes: ["2025-10-29", "10:30:00.000Z"].
          // [0]: Al agregar [0] al final, se accede al primer elemento de ese array. En el ejemplo anterior, esto devolvería solo la fecha: "2025-10-29".

          const start = `${fechaISO}T${horaInicio}`;

          const reservasHorario = reservas.filter(
            (r) =>
              Number(r.horario_id) === Number(horario.horario_id) && 
              r.fecha.substring(0, 10) === fechaISO &&
              r.activo
          );

          const cuposDisponibles = Math.max(
            horario.cupoMaximo - reservasHorario.length,
            0
          );
/*
          const yaReservado = reservas.some(
            (r) =>
              r.usuario_id === usuario.usuario_id &&
              Number(r.horario_id) === Number(horario.horario_id) &&
              r.fecha === fechaISO &&
              r.activo
          );
*/

          const yaReservado = reservas.some((r) => {
            // Definimos la fecha de la reserva extrayendo los primeros 10 caracteres (YYYY-MM-DD)
            const fechaReservaNorm = r.fecha.substring(0, 10);
          /*
            if (r.usuario_id === usuario.usuario_id && Number(r.horario_id) === Number(horario.horario_id) && fechaISO === "2025-10-31") {
              console.log(`--- DEBUG RESERVA EXISTENTE --- Usuario ${usuario.usuario_id}`);
              console.log(`Evento (fechaISO): ${fechaISO}`);
              //console.log(`Reserva (r.fecha): ${r.fecha}`);
              console.log(`Reserva (r.fecha): ${fechaReservaNorm}`);
              //console.log(`Reserva (r.fecha str): ${r.fecha.toString().split("T")[0]}`);
              console.log(`Horario ID: ${r.horario_id}`);
              //console.log(`¿Coinciden fechas?: ${r.fecha.toString().split("T")[0] === fechaISO}`);
              console.log(`¿Coinciden fechas?: ${fechaReservaNorm === fechaISO}`);

              console.log(`¿Reserva Activa?: ${r.activo}`);
              console.log("Tipo de r.activo:", typeof r.activo);
              console.log("-------------------------------");
            }                        
            */

            return (
              r.usuario_id === usuario.usuario_id &&
              Number(r.horario_id) === Number(horario.horario_id) &&
              fechaReservaNorm === fechaISO &&
              r.activo
            );
          });


          //const titulo = `${profesor ? profesor.nombre + " " + profesor.apellido : ""} \nCupo: ${cuposDisponibles}/${horario.cupoMaximo}`;
          const titulo = `${profesor ? profesor.nombre + " " + profesor.apellido : ""} \nCupo: ${cuposDisponibles}`;

          // asigno colores según el estado de las reservas
          const colorEvento = yaReservado
            ? "#5cb85c" // verde si está reservado por el usuario logueado
            : cuposDisponibles > 0
            ? "#3788d8"
            : "#d9534f";

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

    const {
      horario_id,
      fecha,
      yaReservado,
      cuposDisponibles,
      horaInicio,
      profesor,
    } = evento;

    if (yaReservado) {
      // Cancelar reserva
      swalEstilo
        .fire({
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
          cancelButtonColor: "#6edc8c",
          customClass: {
            cancelButton: "btnAceptar",
          },
        })
        .then((result) => {
          if (result.isConfirmed) {
            setReservas((prev) =>
              prev.map((r) =>
                r.usuario_id === usuario.usuario_id &&
                r.horario_id === horario_id &&
                r.fecha === fecha &&                
                r.activo
                  ? { ...r, activo: false }
                  : r                  
              )
            );
            swalEstilo.fire({
              title: "Reserva cancelada",
              icon: "success",
              confirmButtonColor: "#6edc8c",
              customClass: {
                confirmButton: "btnAceptar",
              },
            });
          }
        });
      return;
    }

    // Si no está reservado y no hay cupos
    if (cuposDisponibles <= 0) {
      swalEstilo.fire({
        title: "",
        text: "Sin cupos disponibles",
        imageUrl: error,
      });
      return;
    }

    // Confirmar reserva
    swalEstilo
      .fire({
        title: "¿Confirmás tu reserva?",
        html: `
      <p><b>Actividad:</b> ${actividadSeleccionada.nombre}</p>
      <p><b>Profesor:</b> ${profesor} </p>
      <p><b>Fecha y hora:</b> ${fecha}  ⏱  ${horaInicio} hs</p>
      <p><b>Cupos disponibles:</b> ${cuposDisponibles}</p>
      `,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, reservar",
        cancelButtonText: "Cancelar",
        // confirmButtonColor: "#6edc8c",

        // cambio dinámicamente el color del texto del botón Cancelar; tengo que agregar el bloque didRender dentro del swalEstilo... porque es una función que se ejecuta cuando se muestra el alerta, y el mixin solo define una configuración base.
        didRender: () => {
          const cancelButton = Swal.getCancelButton();
          if (cancelButton) {
            cancelButton.style.color = "#222222"; // cambio el color de texto del botón Cancelar
            // cambia de color la letra cuando paso el mouse (sería el hover)
            cancelButton.addEventListener("mouseover", () => {
              cancelButton.style.color = "#f5f5f5";
            });
            cancelButton.addEventListener("mouseout", () => {
              cancelButton.style.color = "#222222";
            });
          }
        },
      })
      .then((result) => {
        // Verifico si el usuario ya tiene una reserva en ese horario
        const conflicto = reservas.find(
          (r) =>
            r.usuario_id === usuario.usuario_id &&
            r.fecha === fecha &&
            r.activo &&
            r.horario_id !== horario_id // que no sea el mismo horario
          /*
            eventos.some(
              (e) =>
                e.extendedProps.horaInicio === horaInicio &&
                e.extendedProps.fecha === r.fecha
            )
                /*/
        );

        if (conflicto) {
          swalEstilo.fire({
            // icon: 'error',
            title: "Conflicto de horario",
            imageUrl: error,
            html: `
            Ya tenés una reserva para ese día y hora.<br>
            No podés reservar más de una actividad al mismo tiempo.
          `,
            confirmButtonColor: "#d33",
            confirmButtonText: "Cerrar",
            customClass: {
              confirmButton: "", // elimino la clase
            },
          });
          return;
        }

        if (result.isConfirmed) {
          const nuevaReserva = {
            reserva_id: reservas.length + 1,
            horario_id,
            usuario_id: usuario.usuario_id,
            activo: true,
            fecha,
          };
          setReservas((prev) => [...prev, nuevaReserva]);
          swalEstilo.fire({
            title: "¡Reserva confirmada!",
            text: "",
            icon: "success",
            imageUrl: chica_ok,
          });
        }
      });
  };

  // Configuración visual del calendario
  // Levanto la hora mínima configurada para esta app
  const horaMin = horasData.map((h) => h.horaInicio).sort()[0] || "08:00";
  // Levanto la hora máxima configurada para esta app
  const horaMax =
    horasData
      .map((h) => h.horaFin)
      .sort()
      .slice(-1)[0] || "22:00";

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
              day: "día",
            }}
            // cambio el puntero del mous en aquellas celdas que tienen info, para poder reservar/cancelar
            dayCellDidMount={function (info) {
              info.el.style.cursor = "pointer";
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

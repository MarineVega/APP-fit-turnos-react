import React, { useEffect, useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import Swal from "sweetalert2";

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
  // acepta formatos distintos: "08:00", "8.00", numbers 8 o "8", "08:00:00" o "8:00:00"
  if (!h) return null;

  // si viene con segundos, "08:00:00" -> "08:00" 
  if (typeof h === "string" && /^\d{1,2}:\d{2}:\d{2}$/.test(h)) return h.slice(0, 5);

  // si viene "08:00" lo devolvemos tal cual
  if (typeof h === "string" && /^\d{1,2}:\d{2}$/.test(h)) return h; 
  
  // si viene "8.00" o "8.0" o "8" => convertir a "08:00"
  if (typeof h === "number") return `${String(h).padStart(2, "0")}:00`; 
  
  return null;
}

// antes CalendarioTurnos ahora ReservasCalendario
export default function ReservasCalendario ({ actividadSeleccionada }) {
  const [eventos, setEventos] = useState([]);  

  // creo estados para cada colección
  const [profesoresData, setProfesoresData] = useState([]);
  const [horasData, setHorasData] = useState([]);
  const [horariosData, setHorariosData] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [actividadesData, setActividadesData] = useState([]);
  const [clientesData, setClientesData] = useState([]);

  // Levanto usuario activo
  const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));  
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profesoresRes, horasRes, horariosRes, reservasRes, actividadesRes, clientesRes] =
          await Promise.all([
            fetch("http://localhost:3000/profesores"),
            fetch("http://localhost:3000/horas"),
            fetch("http://localhost:3000/horarios"),
            fetch("http://localhost:3000/reservas"),
            fetch("http://localhost:3000/actividades"),
            fetch("http://localhost:3000/clientes"),
          ]);

        const profesoresJson = await profesoresRes.json();
        const horasJson = await horasRes.json();
        const horariosJson = await horariosRes.json();
        const reservasJson = await reservasRes.json();
        const actividadesJson = await actividadesRes.json();
        const clientesJson = await clientesRes.json();


        setProfesoresData(profesoresJson);
        setHorasData(horasJson);
        setHorariosData(horariosJson);
        setReservas(reservasJson);
        setActividadesData(actividadesJson);
        setClientesData(clientesJson);

      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };

    fetchData();

  }, []);

  const [clienteActual, setClienteActual] = useState(null);  
  
  // Obtengo el ID de persona que corresponde al usuario, para después obtener el ID de cliente
  useEffect(() => {
    
    if (clientesData.length > 0 && usuario) {      
      const cliente = clientesData.find(
        (c) => Number(c.persona.persona_id) === Number(usuario.persona.persona_id) && usuario.persona.activo
      );

      setClienteActual(cliente);
    }
  }, [clientesData, usuario]);
 
  // Si el usuario no es un cliente, asigno -1 para que solo pueda ver las reservas sin editar
  const cliente_id = clienteActual?.cliente_id ?? -1;

  // Generar eventos según actividad
  useEffect(() => {
    // si no recibimos actividad seleccionada, limpiamos
    if (!actividadSeleccionada) {
      setEventos([]);
      return;
    }

    if (
      horariosData.length === 0 ||
      profesoresData.length === 0 ||
      horasData.length === 0
    ) return;

    const eventosGenerados = [];
    const hoy = new Date();

    // Mostrar turnos desde 1 mes antes hasta 2 meses después
    const inicioRango = new Date(hoy);
    inicioRango.setMonth(hoy.getMonth() - 1);
    inicioRango.setDate(1);

    const finRango = new Date(hoy);
    finRango.setMonth(hoy.getMonth() + 2);
    finRango.setDate(30);

    // Recorro horarios y genero eventos solamente para la actividad seleccionada
    horariosData.forEach((horario) => {
     
      // Descarto horario por actividad -> actividad seleccionada es <> a la actividad del horario
      if (Number(horario.actividad.actividad_id) !== Number(actividadSeleccionada.actividad_id)) return;

      // Descarto horario por estar desactivado
      if (!horario.activo) return;

      const horaObj =
        horasData.find((h) => Number(h.hora_id) === Number(horario.hora.hora_id)) ||
        {};

      const horaInicio = normalizeHora(horaObj.horaInicio || horaObj.hora_inicio);
      const horaFin = normalizeHora(horaObj.horaFin || horaObj.hora_fin);
      
      if (!horaInicio || !horaFin) return;

      const profesor = profesoresData.find(
        (p) => 
          horario.profesor &&                     // verificamos que horario.profesor exista ya que profesor puede ser null
          Number(p.profesor_id) === Number(horario.profesor.profesor_id)
      );

      const dias = parseDias(horario.dias_id || horario.dias);

      dias.forEach((dia) => {
        for (
          let d = new Date(inicioRango.getTime()); 
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

          /* esto ya no sirve, porque a partir de la hora 21 me corre 1 día el calendario */
          // const fechaISO = d.toISOString().split("T")[0]; // toISOString -> convierte un objeto de fecha (d) a una cadena de fecha y hora en formato ISO 8601, separa esa cadena por la letra 'T' y luego toma el primer elemento, obteniendo así la fecha en formato YYYY-MM-DD. Ej: 2025-10-29T10:30:00.000Z, se dividiría en dos partes: ["2025-10-29", "10:30:00.000Z"].
          // [0]: Al agregar [0] al final, se accede al primer elemento de ese array. En el ejemplo anterior, esto devolvería solo la fecha: "2025-10-29".

          const fechaISO = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;


          const start = `${fechaISO}T${horaInicio}`;
          const horaFinEvento = `${fechaISO}T${horaFin}`; 

        //  console.log("Reservas cargadas desde backend:", reservas);


          const reservasHorario = reservas.filter(
            (r) =>
              Number(r.horario_id ?? r.horario?.horario_id) === Number(horario.horario_id) &&
              r.fecha.substring(0, 10) === fechaISO &&
              r.activo
          );

          // Cupo base: si el horario tiene cupoMaximo, usar ese. Si NO tiene, usar el cupo de la actividad.
          const cupoBase = 
            horario.cupoMaximo != null
              ? Number(horario.cupoMaximo)
              : Number(horario.actividad.cupoMaximo);

          // Aseguro un número válido
          const cuposDisponibles = Math.max(cupoBase - reservasHorario.length, 0);

          const yaReservado = reservas.some((r) => {
            // Definimos la fecha de la reserva extrayendo los primeros 10 caracteres (YYYY-MM-DD)
            const fechaReservaNorm = r.fecha.substring(0, 10);
          
            return (
              Number(r.cliente_id ?? r.cliente?.cliente_id) === Number(cliente_id) &&
              Number(r.horario_id ?? r.horario?.horario_id) === Number(horario.horario_id) &&
              fechaReservaNorm === fechaISO &&
              r.activo
            );
          });

          // verifico si el evento ya pasó
          const ahora = new Date();
          const fechaYHoraEvento = new Date(horaFinEvento);   // uso la hora de fin para considerar que el evento terminó
          
          const eventoPasado = fechaYHoraEvento <= ahora;     // TRUE si el evento ya pasó
                    
          const titulo = `Cupo: ${cuposDisponibles}  \n${profesor ? profesor.persona.nombre + " " + profesor.persona.apellido : ""}`;

          // asigno colores según el estado de las reservas
          // const colorEvento = yaReservado
          const colorEvento = eventoPasado
            ? "#7fa8d1ff"       // grisáceo : Si el evento ya pasó
            : yaReservado 
            ? "#5cb85c"       // verde si está reservado por el cliente logueado
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
                ? `${profesor.persona.nombre} ${profesor.persona.apellido}`
                : "Sin profesor",
              yaReservado,
              horaInicio,
              horaFin,
              eventoPasado,
              actividad_id: Number(horario.actividad.actividad_id),
              profesor_id: profesor
                ? Number(`${profesor.profesor_id}`)
                : null,
              reservas,           // borrarlo es para control
            },
          });
        }
      });
    });

    setEventos(eventosGenerados);
  }, [
    actividadSeleccionada, 
    reservas,
    horariosData,
    horasData,
    profesoresData
  ]);

  // Manejador de clics
  const manejarClick = (info) => {
  
    // 🚫 Si no es cliente → no permito interactuar
    if (!cliente_id || cliente_id === -1) {
      swalEstilo.fire({
        title: "Solo lectura",
        text: "Tu usuario no está habilitado para reservar.",
        imageUrl: error,
        confirmButtonText: "Cerrar",
        confirmButtonColor: "#d33",
        customClass: {
        confirmButton: "",   
      }
      });
      return;
    } 

    const evento = info.event.extendedProps;
    
    console.log(info.event.extendedProps)
    console.log('evento 1',evento)
    
    // bloqueo si si el evento ya pasó
    if (evento.eventoPasado) {
      swalEstilo.fire({
          title: "Turno pasado",
          text: "No es posible modificar reservas con fecha u hora anterior a la actual.",
          imageUrl: error,
          confirmButtonText: "Cerrar",
          confirmButtonColor: "#d33",
          customClass: {
            confirmButton: "", // elimino la clase
          },
      });
      return;
    }

    const {
      horario_id,
      fecha,
      yaReservado,
      cuposDisponibles,
      horaInicio,
      profesor,
      profesor_id,
      actividad_id ,
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
        .then(async (result) => {
          if (result.isConfirmed) {           
            /*
            // ---- DEBUG: inspeccionar objetos clave ----
            console.log(">>> DEBUG cancelar - evento.extendedProps:", info.event.extendedProps);
            console.log(">>> DEBUG reservas array (len):", reservas.length);
            console.log(">>> DEBUG reservas (primeros 10):", reservas.slice(0, 10));
            console.log(">>> DEBUG horario_id buscado:", horario_id);
            console.log(">>> DEBUG fecha buscada:", fecha);
            
            
            // Opcional: mostrar cada reserva resumida
            console.table(
              reservas.map(r => ({
                reserva_id: r.reserva_id,
                horario_id: r.horario_id ?? r.horario?.horario_id,
                cliente_id: r.cliente_id ?? r.cliente?.cliente_id ?? ,
                fecha: r.fecha,
                activo: r.activo
              }))
            );
            */

            // Busco la reserva a eliminar
            const reserva = reservas.find(
              (r) =>
                Number(
                  r.cliente_id ??
                  r.cliente?.cliente_id
                ) === Number(cliente_id) &&                
                Number(r.horario_id ?? r.horario?.horario_id) === Number(horario_id) &&
                r.fecha.substring(0, 10) === fecha &&
                r.activo
            );

            if (!reserva) {
              return swalEstilo.fire({
                title: "Error",
                text: "No se encontró la reserva.",
                icon: "error",
                confirmButtonColor: "#d33",
                confirmButtonText: "Cerrar",
                customClass: {
                  confirmButton: "",   
                }
              });
            }

            try {
              const url = `http://localhost:3000/reservas/${reserva.reserva_id}`;
              
              console.log("URL:", url);


              const response = await fetch(url, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
              });

              if (!response.ok) {
                throw new Error("Error al eliminar la reserva en el backend");
              }

              // Actualizar estado en el frontend
              setReservas((prev) => prev.filter(r => r.reserva_id !== reserva.reserva_id));

              swalEstilo.fire({
                title: "Reserva cancelada",
                icon: "success",
                confirmButtonColor: "#6edc8c",
                customClass: {
                  confirmButton: "btnAceptar",
                },
              });

            } catch (error) {
              console.error(error);
              swalEstilo.fire({
                 title: "Error",
                text: "No se pudo cancelar la reserva.",
                icon: "error",
                confirmButtonColor: "#d33",
                confirmButtonText: "Cerrar",
                customClass: {
                  confirmButton: "",   
                }
              });
            }            
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
    swalEstilo.fire({
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
    .then(async (result) => {
      // Verifico si el cliente ya tiene una reserva en ese horario
      const conflicto = reservas.find(
        (r) =>
          r.cliente.cliente_id === cliente_id &&
          r.fecha.substring(0, 10) === fecha &&
          r.activo &&
          r.horario.hora.horaInicio.substring(0, 5) === horaInicio
      );

      
      console.log("reservas", reservas)
      console.log(fecha)
      console.log(horaInicio)

        
      if (result.isConfirmed) {
        if (conflicto) {
          swalEstilo.fire({            
            title: "Conflicto de horario",
            imageUrl: error,
            html: `
              Ya tenés una reserva para ese día y hora.<br>
              No podés reservar más de una actividad al mismo tiempo.`,
            confirmButtonColor: "#d33",
            confirmButtonText: "Cerrar",
            customClass: {
              confirmButton: "",      // elimino la clase
            },
          });
          return;
        }
      
        const nuevaReserva = {
          actividad_id,          
          profesor_id,
          cliente_id,
          horario_id,
          fecha,
          activo: true,
        };

        try {
          const url = `http://localhost:3000/reservas`
    
          console.log("Enviando a backend:", nuevaReserva);
          console.log("URL:", url);
        
    
          const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevaReserva),
          });
    
          if (!response.ok) throw new Error("Error al guardar en la base de datos");
    
          const data = await response.json();   // recupero reserva_id real

          // guardo la reserva EXACTA que viene del backend
          setReservas((prev) => [...prev, data]);
          
          //setReservas((prev) => [...prev, nuevaReserva]);
          swalEstilo.fire({
            title: "¡Reserva confirmada!",
            text: "",
            icon: "success",
            imageUrl: chica_ok,
          });

        } catch (err) {
          console.error("Error al reservar", err);
          swalEstilo.fire({            
            title: "Error",
            html: `No se pudo generar la reserva.`,
            icon: "error",
            confirmButtonColor: "#d33",
            confirmButtonText: "Cerrar",
            customClass: {
              confirmButton: "",      // elimino la clase
            },
          });
        }
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
            initialDate={new Date()}    // centra el calendario en el día actual
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

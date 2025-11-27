import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import exitoImg from "../assets/img/exito.png";
import FormCampos from "./FormCampos";
import FormBotones from "./FormBotones";
import ComboProfesores from "./ComboProfesores";
import ComboActividades from "./ComboActividades";
import ComboHoras from "./ComboHoras";
import DiasSemana from "./DiasSemana";

import { useSearchParams } from "react-router-dom";

// configuro estilos para sweetalert
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

export default function HorarioForm({
  guardar,
  horarios = [],
  datoInicial = null,
}) {
  const [params] = useSearchParams();
  const modo = params.get("modo") || "agregar";

  const id = datoInicial?.horario_id || null;

  // Estados para los combos
  const [profesores, setProfesores] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [horas, setHoras] = useState([]);

  // Cargo los combos desde la base de datos
  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const [profRes, actRes, horaRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/profesores`).then((r) =>
            r.json()
          ),
          fetch(`${import.meta.env.VITE_API_URL}/actividades`).then((r) =>
            r.json()
          ),
          fetch(`${import.meta.env.VITE_API_URL}/horas`).then((r) => r.json()),
        ]);

        setProfesores((profRes || []).filter((p) => p.persona?.activo));

        const acts = (actRes || []).filter((a) => a.activa);
        setActividades(acts);

        setHoras((horaRes || []).filter((h) => h.activa));

        // si no hay actividad seleccionada, usar la primera activa por defecto (ordenada por nombre)
        if (!actividadID && acts.length > 0) {
          const actividadesOrdenadas = [...acts]
            .filter((a) => a.activa)
            .sort((a, b) => a.nombre.localeCompare(b.nombre));
          setActividadID(actividadesOrdenadas[0].actividad_id);
        }
      } catch (error) {
        console.error("Error cargando datos iniciales:", error);
      }
    };
    fetchDatos();
  }, []);

  // Estados del formulario
  const [profesorID, setProfesorID] = useState("");
  const [actividadID, setActividadID] = useState("");
  const [cupoMaximo, setCupoMaximo] = useState(datoInicial?.cupoMaximo || null);
  const [diasSeleccionados, setDiasSeleccionados] = useState([]);
  const [horaID, setHoraID] = useState("");

  // Estados de errores
  const [errores, setErrores] = useState({
    profesor: "",
    actividad: "",
    cupoMaximo: "",
    dias: "",
    hora: "",
  });

  // Si estoy en modo editar, cargo los datos del horario
  useEffect(() => {
    if (modo === "editar" && datoInicial) {
      /*
      console.log("datoInicial completo: ", datoInicial);
      console.log("dias: ", datoInicial.dias);
      */
      setProfesorID(
        datoInicial.profesor != null
          ? Number(datoInicial.profesor.profesor_id)
          : null
      );
      setActividadID(datoInicial.actividad?.actividad_id);
      setCupoMaximo(datoInicial.cupoMaximo || null);
      setHoraID(datoInicial.hora_id);

      if (actividades.length > 0) {
        const idActividad =
          datoInicial.actividad?.actividad_id || datoInicial.actividad_id;
        setActividadID(idActividad);
      }
      if (horas.length > 0)
        setHoraID(datoInicial.hora?.hora_id || datoInicial.hora_id);

      // Detecto el formato de los días guardados en la BD
      if (Array.isArray(datoInicial.dias)) {
        // Si ya viene como array
        setDiasSeleccionados(datoInicial.dias);
      } else if (typeof datoInicial.dias === "string") {
        try {
          // caso 1: viene como JSON -> ["lunes","miércoles"]
          if (datoInicial.dias.trim().startsWith("[")) {
            setDiasSeleccionados(JSON.parse(datoInicial.dias));
          }
          // caso 2: viene como texto separado por comas -> "lunes,martes,viernes"
          else {
            const diasArray = datoInicial.dias
              .split(",")
              .map((d) => d.trim().toLowerCase());
            setDiasSeleccionados(diasArray);
          }
        } catch (error) {
          console.warn("Error parseando días:", error);
          setDiasSeleccionados([]);
        }
      } else {
        setDiasSeleccionados([]);
      }
    }
  }, [modo, datoInicial, profesores, actividades, horas]);

  // Validación y guardado
  const validarGuardar = async (e) => {
    e.preventDefault();

    let nuevosErrores = { actividad: "", dias: "", hora: "" };
    let esValido = true;

    if (!actividadID) {
      nuevosErrores.actividad = "Por favor seleccione una actividad.";
      esValido = false;
    }

    // el cupo máximo es opcional, pero si se completa, validar el rango
    if (cupoMaximo && (cupoMaximo < 1 || cupoMaximo > 100)) {
      nuevosErrores.cupoMaximo = "El cupo debe estar entre 1 y 100.";
      esValido = false;
    }

    if (diasSeleccionados.length === 0) {
      nuevosErrores.dias = "Debe seleccionar al menos un día.";
      esValido = false;
    }

    if (!horaID) {
      nuevosErrores.hora = "Por favor seleccione una hora.";
      esValido = false;
    }

    // Evito duplicados (excepto cuando se está editando el mismo horario)

    // Si el profesor es null → no validar duplicados
    if (profesorID === null || profesorID === "" || profesorID === 0) {
      console.log("Profesor null: NO se valida duplicado.");
      // NO retorno nada, dejo seguir el flujo normal.
    } else {
      const yaExiste = horarios.some((h) => {
        let diasExistentes = [];

        if (Array.isArray(h.dias)) {
          //console.log("entró")
          diasExistentes = h.dias;
        } else if (typeof h.dias === "string") {
          try {
            //console.log("dias parsed ", JSON.parse(h.dias))
            const parsed = JSON.parse(h.dias);

            diasExistentes = Array.isArray(parsed)
              ? parsed
              : h.dias.split(",").map((d) => d.trim().toLowerCase());
          } catch {
            //console.log("catch")
            diasExistentes = h.dias
              .split(",")
              .map((d) => d.trim().toLowerCase());
          }
        }

        // Normalizar días
        const diasNormalizados = diasExistentes.map((d) =>
          String(d).toLowerCase()
        );

        const diasCoinciden = diasSeleccionados.some((d) =>
          diasNormalizados.includes(String(d).toLowerCase())
        );

        // ids del horario leído
        const profesorIdEnH = Number(
          h.profesor?.profesor_id || h.profesor_id || 0
        );

        const horaIdEnH = Number(h.hora?.hora_id || h.hora_id || 0);

        const esDuplicado =
          profesorIdEnH === Number(profesorID) &&
          horaIdEnH === Number(horaID) &&
          diasCoinciden &&
          Number(h.horario_id) !== Number(id);
        /*
      
        console.log("registro ", h);
        console.log("id horario ", id);
      */
        /*
        // Comparo todo
        const esDuplicado =        
          Number(h.profesor?.profesor_id || h.profesor_id || 0) === Number(profesorID || 0) &&
          //Number(h.profesor.profesor_id || 0) === Number(profesorID || 0) &&
          //Number(h.hora.hora_id) === Number(horaID) &&
          Number(h.hora?.hora_id || h.hora_id || 0) === Number(horaID) &&
          diasCoinciden &&
          Number(h.horario_id) !== Number(id);
  */
        /*
        console.log("Comparando registro:", {
          profesorEnH: Number(h.profesor?.profesor_id || h.profesor_id),
          profesorSeleccionado: Number(profesorID),
          horaEnH: Number(h.hora?.hora_id || h.hora_id),
          horaSeleccionada: Number(horaID),
          diasCoinciden,
          mismoID: Number(h.horario_id) === Number(id),
          esDuplicado
          });


        console.log(`Comparando con horario_id=${h.horario_id}:`, {
          profesor: Number(h.profesor?.profesor_id || h.profesor_id || 0)  === Number(profesorID),
          hora: h.hora.hora_id === Number(horaID),
          diasCoinciden,
          esDuplicado,
        });
*/
        return esDuplicado;
      });

      // console.log("ya existe: ", yaExiste);

      if (yaExiste) {
        swalEstilo.fire({
          icon: "error",
          title: "Horario duplicado",
          text: "Ya existe un horario con el mismo profesor, día y hora.",
          confirmButtonColor: "#d33",
          confirmButtonText: "Cerrar",
          customClass: "",
        });

        return; // cancela el guardado
      }
    }

    // Aplico los errores visuales si existen
    setErrores(nuevosErrores);

    // Si hay errores SALGO
    if (!esValido) return;
    /*
    console.log("Profesor: ", profesorID);
    console.log("Actividad: ", actividadID);
    console.log("Cupo: ", cupoMaximo);
    console.log("Días : ", diasSeleccionados);
    console.log("Hora: ", horaID);
*/
    // Si pasa todas las validaciones, continua el guardado
    const horarioData = {
      profesor_id: profesorID !== "" ? Number(profesorID) : null,
      actividad_id: Number(actividadID),
      //cupoMaximo: Number(cupoMaximo),
      cupoMaximo:
        cupoMaximo === null || cupoMaximo === "" ? null : Number(cupoMaximo), // si tiene null, que mande null, sino mandaba 0
      dias: diasSeleccionados.join(","), // convierte ["lunes","jueves"] → "lunes,jueves"
      hora_id: Number(horaID),
      activo: true,
    };

    try {
      const url =
        modo === "editar" && id
          ? `${import.meta.env.VITE_API_URL}/horarios/${id}`
          : `${import.meta.env.VITE_API_URL}/horarios`;

      const method = modo === "editar" ? "PUT" : "POST";
      /*
      console.log("Enviando a backend:", horarioData);
      console.log("URL:", url);
      console.log("Método:", method);
*/
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(horarioData),
      });

      if (!response.ok) throw new Error("Error al guardar en la base de datos");

      const mensaje =
        modo === "editar"
          ? "El horario ha sido actualizado."
          : "El horario ha sido creado.";

      swalEstilo
        .fire({
          title: "¡Operación Exitosa!",
          text: mensaje,
          imageUrl: exitoImg,
          imageAlt: "Éxito",
          icon: "success",
          confirmButtonText: "Volver",
          customClass: {
            confirmButton: "btnAceptar",
          },
          buttonsStyling: false,
        })
        .then(() => {
          limpiarFormulario();
          // Redirección según modo
          if (modo === "editar") {
            window.location.href = "/horario?modo=editar";
          } else {
            window.location.href = "/horario?modo=postAlta"; // para distinguirlo del consultar normal
          }
        });
    } catch (err) {
      console.error(err);
      swalEstilo.fire("Error", "No se pudo guardar el horario.", "error");
    }
  };

  function cancelar() {
    limpiarFormulario();
    if (modo === "agregar") {
      window.location.href = "/administrar";
    } else if (modo === "editar") {
      window.location.href = "/horario?modo=editar";
    } else {
      window.location.href = "/horario?modo=consultar";
    }
  }

  // Limpio campos
  function limpiarFormulario() {
    setProfesorID("");
    setActividadID("");
    setCupoMaximo(null);
    setDiasSeleccionados("");
    setHoraID("");

    setErrores({ actividad: "", dias: "", hora: "" });
  }

  // Limpia el mensaje de error al hacer foco o modificar el campo
  const limpiarError = (campo) => {
    setErrores((prev) => ({ ...prev, [campo]: "" })); // se actualiza así -> setErrores(prev => ({ ...prev, nombre: "" }));
  };

  return (
    <section className="seccionHorario">
      <form onSubmit={validarGuardar} className="formHorario">
        <ComboProfesores
          value={profesorID}
          onChange={(e) => {
            setProfesorID(e);
            limpiarError("profesor");
          }}
          opciones={profesores}
          onFocus={() => limpiarError("profesor")}
          className="inputHorario"
          label="Profesor"
        />

        <ComboActividades
          value={actividadID}
          onChange={(e) => {
            setActividadID(e);
            limpiarError("actividad");
          }}
          opciones={actividades}
          onFocus={() => limpiarError("actividad")}
          incluirTodos={false}
          className="inputHorario"
          label="Actividad *"
          error={errores.actividad}
        />

        <FormCampos
          label="Cupo Máximo"
          type="number"
          name="cupoMaximo"
          placeholder="10"
          value={cupoMaximo}
          onChange={(e) => {
            setCupoMaximo(e.target.value);
            limpiarError("cupoMaximo");
          }}
          onFocus={() => limpiarError("cupoMaximo")}
          className="inputActividad"
          error={errores.cupoMaximo}
        />

        <DiasSemana
          diasSeleccionados={diasSeleccionados}
          onChange={(e) => {
            setDiasSeleccionados(e);
            limpiarError("dias");
          }}
          onFocus={() => limpiarError("dias")}
          error={errores.dias}
        />

        <ComboHoras
          value={horaID}
          onChange={(e) => {
            setHoraID(e);
            limpiarError("hora");
          }}
          opciones={horas}
          onFocus={() => limpiarError("hora")}
          incluirTodos={false}
          className="inputHorario"
          label="Horario *"
          error={errores.hora}
        />

        <p className="advertencia">* Campos obligatorios</p>
      </form>

      <FormBotones
        boton1={{
          id: "agregar",
          label: modo === "editar" ? "GUARDAR" : "AGREGAR",
          className: "btnAceptar",
          onClick: validarGuardar,
        }}
        boton2={{
          id: "cancelar",
          label: "CANCELAR",
          className: "btnCancelar",
          onClick: cancelar,
        }}
        contenedorClass="contenedorBotones"
      />
    </section>
  );
}

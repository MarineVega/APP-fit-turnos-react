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
    imageWidth: 200,       // ancho en píxeles
    imageHeight: 200,      // alto en píxeles 
    background: '#bababa',
    confirmButtonColor: '#6edc8c',
    customClass: {
        confirmButton: 'btnAceptar',
        cancelButton: 'btnCancelar'
    }
});

export default function HorarioForm({ guardar, horarios = [], datoInicial = null }) {
    const [params] = useSearchParams();
    const modo = params.get("modo") || "agregar";    

    

    // Cuando no haya parámetro id en la URL, uso el que viene del objeto datoInicial (que el padre le pasa correctamente)
    //const id = parseInt(params.get("id")) || datoInicial?.id || null;

    const id = datoInicial?.horario_id || null;

    // Estados del formulario
    const [profesor, setProfesor] = useState(datoInicial?.profesor || null);
    const [actividad, setActividad] = useState(datoInicial?.actividad || "");
    const [cupoMaximo, setCupoMaximo] = useState(datoInicial?.cupoMaximo || null);
    //const [dias, setDias] = useState(datoInicial?.dias || "");
    const [hora, setHora] = useState(datoInicial?.hora || "");

    // Estados de errores
    const [errores, setErrores] = useState({
        profesor: "",
        actividad: "",
        dias: "",
        hora: "",
    });

    // Si estoy en modo editar, cargo los datos del horario
    useEffect(() => {        
        if (modo === "editar" && datoInicial) {
            setProfesor(datoInicial.profesor || null);
            setActividad(datoInicial.actividad);
            setCupoMaximo(datoInicial.cupoMaximo || null);
            setDias(datoInicial.dias);
            setHora(datoInicial.hora);    
            
            // 👇 Si en la BD viene como string JSON, lo convierto a array:    
            // entonces, cuando se abre el formulario en modo editar, los checkboxes se marcan automáticamente ✅.        
            if (typeof datoInicial.dias === "string") {
            try {
                setDiasSeleccionados(JSON.parse(datoInicial.dias));
            } catch {
                setDiasSeleccionados([]);
            }
            } else {
                setDiasSeleccionados(datoInicial.dias || []);
            }
        }
    }, [modo, datoInicial]);


    console.log("🟢 Modo:", modo);
    console.log("🟢 Dato inicial recibido:", datoInicial);
    console.log("🟢 ID actual:", id);

    // Validación y guardado
    const validarGuardar = (e) => {
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

        console.log("diasSeleccionados", diasSeleccionados);
        console.log("👉 Listado de Horas:", hora);
        console.log("👉 Horario a modificar:", id);

/*
        // Valido que no se ingrese un nombre de actividad existente (usando las actividades del estado)
        const nombreIngresado = nombre.trim().toLowerCase();            // normalizo el texto ingresado (quito espacios y lo paso a minúscula)        
        const nombreDuplicado = actividades.some((act) =>               // recorro todas las actividades y busco si hay otra con el mismo nombre
            act.nombre.trim().toLowerCase() === nombreIngresado &&
            Number(act.actividad_id) !== Number(id)   // permito mismo nombre solo si estoy editando esa misma actividad
                                            // 👈 realizo una omparación numérica
        );
*/

        console.log("🟢 ID actual:", id);
        console.log("🟢 Comparando contra horarios:", horarios.map(a => a.id));

        /*      código para mostrar que tiene actividades e ir comparando
        // 🔹 Validar nombre duplicado (usando las actividades del estado)
        const nombreIngresado = nombre.trim().toLowerCase();

        console.log("👉 Nombre ingresado:", nombreIngresado);
        console.log("👉 Lista de actividades actuales:", actividades);

        const nombreDuplicado = actividades.some((act) => {
            const nombreAct = act.nombre.trim().toLowerCase();
            const esDuplicado = nombreAct === nombreIngresado && act.id !== id//;

            console.log(`Comparando con "${act.nombre}" (id: ${act.id}) → duplicado: ${esDuplicado}`);

            return esDuplicado;
        });
        */

        
/*
        if (nombreDuplicado) {
            nuevosErrores.nombre = "Ya existe una actividad con ese nombre.";
            esValido = false;
        }
*/

        setErrores(nuevosErrores);

        // Si hay errores SALGO
        if (!esValido) return;

        // Si pasa todas las validaciones
        guardar({ 
            profesor: profesorID || null, 
            actividad: actividadID, 
            cupoMaximo, 
            //dias: diasSeleccionados,                          //  dias: ["lunes", "miércoles", "viernes"],
            dias: JSON.stringify(diasSeleccionados),            // "dias": "[\"lunes\",\"miércoles\",\"viernes\"]", --> para recibirlo en SQL como texto "["lunes","miércoles","viernes"]".
            hora: horaID 
        });

        const mensaje = 
            modo === "editar"
                ? 'El horario ha sido actualizado.'
                : 'El horario ha sido creado.';

        swalEstilo.fire({
            title: '¡Operación Exitosa!',
            text: mensaje ,
            imageUrl: exitoImg ,
            imageAlt: 'Éxito',
            icon: 'success',
            confirmButtonText: 'Volver',
            customClass: {
                confirmButton: 'btnAceptar' 
            },
            buttonsStyling: false
        }).then(() => {
            limpiarFormulario();
            // Redirección según modo
            if (modo === "editar") {
                window.location.href = "/horario?modo=editar";
            } else {
                window.location.href = "/horario?modo=postAlta";      // para distinguirlo del consultar normal
            }        
        });
    };


    function cancelar () {
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
        setProfesor("");
        setActividad("");
        setCupoMaximo(null);
        setDias("");
        setHora("");

        setErrores({ actividad: "", dias: "", hora: "" });    
    };

    

    // Limpia el mensaje de error al hacer foco o modificar el campo
    const limpiarError = (campo) => {
        setErrores((prev) => ({ ...prev, [campo]: "" }));           // se actualiza así -> setErrores(prev => ({ ...prev, nombre: "" }));
    };

    // Combo Profesores
    const [profesorID, setProfesorID] = useState("");
    const handleProfesor = (e) => {
        //e.preventDefault() --> evita que el formulario se recargue (comportamiento por defecto del navegador).
        e.preventDefault();
        console.log("Profesor seleccionado:", profesorID);
    };

    // Combo Actividades
    const [actividadID, setActividadID] = useState("");
    const handleActividad = (e) => {
        e.preventDefault();
        console.log("Actividad seleccionada:", actividadID);
    };

    const [diasSeleccionados, setDiasSeleccionados] = useState([]);

    // Combo Horas
    const [horaID, setHoraID] = useState("");
    const handleHora = (e) => {
        e.preventDefault();
        console.log("Hora seleccionada:", horaID);
    };

    return (
        <section className="seccionHorario">        
            <form onSubmit={validarGuardar} className="formHorario">
                
                <ComboProfesores 
                    value={profesorID} 
                    //onChange={setProfesorID}
                    onChange={(e) => {
                        setProfesorID(e);
                        limpiarError("profesor");
                    }}
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
                    onFocus={() => limpiarError("actividad")}
                   // onChange={setActividadID} 
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
                    //onChange={setDiasSeleccionados}
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
                    onFocus={() => limpiarError("hora")}
                    incluirTodos={false}
                    className="inputHorario"
                    label="Horario *"               
                    error={errores.hora}
                />

                <label className="advertencia">* Campos obligatorios</label>
            </form>

            <FormBotones                    
                boton1={{ id: "agregar", label: modo === "editar" ? "GUARDAR" : "AGREGAR", className: "btnAceptar", onClick: validarGuardar }}
                boton2={{ id: "cancelar", label: "CANCELAR", className: "btnCancelar", onClick: cancelar }}
                contenedorClass="contenedorBotones"
            />                
        </section>
    );
}
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

    //const id = datoInicial?.horario_id || null;
    const horario_id = datoInicial?.horario_id || null;

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
            setProfesorID(datoInicial.profesor_id || null);
            setActividadID(datoInicial.actividad_id);
            setCupoMaximo(datoInicial.cupoMaximo || null);            
            setHoraID(datoInicial.hora_id);    

            if (Array.isArray(datoInicial.dias_id)) {
                setDiasSeleccionados(datoInicial.dias_id);
            } else if (typeof datoInicial.dias_id === "string") {      // Si en la BD viene como string JSON, lo convierto a array; entonces, cuando se abre el formulario en modo editar, los checkboxes se marcan automáticamente ✅.        
            try {
                setDiasSeleccionados(JSON.parse(datoInicial.dias_id));
            } catch {
                setDiasSeleccionados([]);
            }
            } else {
                setDiasSeleccionados([]);
            }            
        }
    }, [modo, datoInicial]);

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

        // Evito duplicados (excepto cuando se está editando el mismo horario)
        const yaExiste = horarios.some((h) => {
            let diasExistentes = [];

            if (Array.isArray(h.dias_id)) {
                diasExistentes = h.dias_id;
                } else if (typeof h.dias_id === "string") {     // si los días vienen como string de la BD, los convierto a array
                try {
                    diasExistentes = JSON.parse(h.dias_id);
                } catch {
                    diasExistentes = [];
                }
            }
            
            // Chequeo si hay al menos un día en común          
            const diasCoinciden = diasSeleccionados.some((d) =>
                diasExistentes.includes(d)
            );

            // Comparo todo
            const esDuplicado =
                Number(h.actividad_id) === Number(actividadID) &&
                Number(h.profesor_id || 0) === Number(profesorID || 0) &&
                Number(h.hora_id) === Number(horaID) &&
                diasCoinciden &&
                Number(h.horario_id) !== Number(horario_id);    // excluyo el mismo si se edita                
           
             // debug opcional en consola
            console.log(
                `Comparando con horario_id=${h.horario_id}:`,
                { actividad: h.actividad_id === Number(actividadID),
                profesor: h.profesor_id === Number(profesorID),
                hora: h.hora_id === Number(horaID),
                diasCoinciden,
                esDuplicado
                }
            );            
            return esDuplicado
        });

        if (yaExiste) {
            swalEstilo.fire({
                icon: 'error',
                title: 'Horario duplicado',
                text: 'Ya existe un horario con la misma actividad, profesor y hora.',
                confirmButtonColor: '#d33',
                confirmButtonText: 'Cerrar',
                customClass: ''
            });
            return;             // cancela el guardado
        }
            
        // Aplico los errores visuales si existen
        setErrores(nuevosErrores);

        // Si hay errores SALGO
        if (!esValido) return;

        // Si pasa todas las validaciones, continua el guardado
        guardar({ 
            profesor: profesorID || null, 
            actividad: actividadID, 
            cupoMaximo, 
            //dias: diasSeleccionados,                          //  dias: ["lunes", "miércoles", "viernes"],
            dias: JSON.stringify(diasSeleccionados),            // "dias": "[\"lunes\",\"miércoles\",\"viernes\"]", --> para recibirlo en SQL como texto "["lunes","miércoles","viernes"]".
            hora: horaID 
        });

        console.log("Profesor: ", profesorID);
        console.log("Actividad: ", actividadID);
        console.log("Cupo: ", cupoMaximo);
        console.log("Días : ", diasSeleccionados);
        console.log("Hora: ", horaID);

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
        setProfesorID("");
        setActividadID("");
        setCupoMaximo(null);
        setDiasSeleccionados("");
        setHoraID("");

        setErrores({ actividad: "", dias: "", hora: "" });    
    };
    

    // Limpia el mensaje de error al hacer foco o modificar el campo
    const limpiarError = (campo) => {
        setErrores((prev) => ({ ...prev, [campo]: "" }));           // se actualiza así -> setErrores(prev => ({ ...prev, nombre: "" }));
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
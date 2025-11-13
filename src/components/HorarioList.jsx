import React, { useEffect, useState } from "react";
import FormBotones from "./FormBotones";

import Swal from "sweetalert2";
import reservasData from "../data/reservas.json";       // 👈 Importa las reservas


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


export default function HorarioList({ horarios = [], modo, onEditar }) {
    
    const [horariosBD, setHorariosBD] = useState([]);          // Levanta los datos de la BD
    
    useEffect(() => {
        const fetchHorarios = async () => {
        try {
            const response = await fetch("http://localhost:3000/horarios");     // BE
            const data = await response.json();
            setHorariosBD(data);
        } catch (error) {
            console.error("Error cargando horarios:", error);
        }
        };

        fetchHorarios();
    }, []);
    
    // Declaro el estado reservas
    const [reservas, setReservas] = useState([]);

    // Cargo las reservas (desde JSON por ahora)
    useEffect(() => { 
        setReservas(reservasData);
    }, []);
  
    // ✅ Verifico si el hoario tiene reservas activas
    const tieneReservasActivas = (horarioId) => {
        const resultado = reservas.some(
            (r) => Number(r.horario_id) === Number(horarioId) && r.activo === true
        );

        console.log(`¿El horario ${horarioId} tiene reservas activas? →`, resultado);

        return resultado;        
    };


    const formatearDias = (dias) => {
        if (!dias) return "";

        // Mapeo base: sin tildes -> devuelvo con tildes y capitalizadas
        const nombres = {
            lunes: "Lunes",
            martes: "Martes",
            miercoles: "Miércoles",
            jueves: "Jueves",
            viernes: "Viernes",
            sabado: "Sábado",
            //domingo: "Domingo",
        };

        return dias
            .split(',')
            .map(d => nombres[d.trim().toLowerCase()] || d) 
            .join(', ');
    };

    // ✅ Manejo de modificación con validación   
    const editarHorario = (horario) => {
        
        if (tieneReservasActivas(horario.horario_id)) {
        swalEstilo.fire({
            icon: "warning",
            title: "No se puede modificar",
            text: `El horario de ${horario.hora.horaInicio.slice(0, 5)} a  ${horario.hora.horaFin.slice(0, 5)} de ${horario.actividad.nombre} (${horario.profesor.nombre} ${horario.profesor.apellido}), tiene reservas activas.`,
            confirmButtonText: "Cerrar",
        });
        return;
        }

        if (onEditar) onEditar(horario);
    };

    // ✅ Manejo de eliminación con validación    
    const eliminarHorario = async (horario) => {
        console.log('horario.horario_id ', horario.horario_id )

        if (tieneReservasActivas(horario.horario_id )) {
            swalEstilo.fire({
                icon: "warning",
                title: "No se puede eliminar",
                text: `El horario de ${horario.hora.horaInicio.slice(0, 5)} a  ${horario.hora.horaFin.slice(0, 5)} de ${horario.actividad.nombre} (${horario.profesor.nombre} ${horario.profesor.apellido}), tiene reservas activas.`,
                confirmButtonText: "Cerrar",
            });
            return;
        }
            
       // swalEstilo.fire({
        const result = await swalEstilo.fire({
            title: "¿Eliminar horario?",
            text: `Esta acción eliminará el horario de ${horario.hora.horaInicio.slice(0, 5)} a  ${horario.hora.horaFin.slice(0, 5)} de ${horario.actividad.nombre} (${horario.profesor.nombre} ${horario.profesor.apellido}) permanentemente.`,            
            icon: "warning",
            showCancelButton: true,
            cancelButtonColor: '#6edc8c',                        
            customClass: {
                cancelButton: 'btnAceptar'
            },
            confirmButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });  //.then((result) => {

        if (result.isConfirmed) {
            try {
            // 🔥 Llamada al backend DELETE
                const response = await fetch(`http://localhost:3000/horarios/${horario.horario_id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error("Error al eliminar el horario");
                }

                // Actualizo la tabla local sin recargar
                setHorariosBD(prev =>
                    prev.filter(h => h.horario_id !== horario.horario_id)
                );

        
                swalEstilo.fire({
                    title: "Eliminado",
                    text: "El horario ha sido eliminado.",
                    icon: "success",
                    confirmButtonColor: "#6edc8c",
                    confirmButtonText: "Cerrar",
                });
            } catch (error) {
                console.error(error);
                    swalEstilo.fire("Error", "No se pudo eliminar el horario.", "error");
            }
        }
    };
    
    // Si el modo es "postAlta", lo trato como "consultar"
    const modoEfectivo = modo === "postAlta" ? "consultar" : modo;
    
    return (
        //<main className="mainHorario">
        <>
            <section id="listadoHorarios">
                <table id="tablaHorarios">
                    <thead>
                        <tr>
                        <th>Activ.</th>
                        <th>Prof.</th>
                        <th>Cupo Max.</th>
                        <th>Días</th>
                        <th>Hora</th>
                        
                        {modoEfectivo !== "consultar" && <th>Acciones</th>}
                        </tr>
                    </thead>

                    <tbody>
                        {horariosBD.length > 0 ? (                           
                            horariosBD.map((horario) => {                                
                                return (
                                    <tr key={horario.horario_id}>
                                        <td>{horario.actividad.nombre}</td>
                                        <td>{horario.profesor.nombre} {horario.profesor_apellido}</td>
                                        <td id="cupo">{horario.cupoMaximo ?? ""}</td>
                                        <td>{formatearDias(horario.dias)}</td>
                                        <td>{horario.hora?.horaInicio?.slice(0, 5)} a {horario.hora?.horaFin?.slice(0, 5)}</td>
                                                                                
                                        {modoEfectivo !== "consultar" && (
                                            <td>
                                                {modoEfectivo === "editar" && (
                                                    <button
                                                        className="btnTabla"
                                                        // Redirigir al formulario en modo editar                                                    
                                                        onClick={() => editarHorario(horario)} // ✅ paso por la validación
                                                        
                                                    >
                                                        <img    
                                                            src={
                                                                new URL("../assets/img/icono_editar.png", import.meta.url).href
                                                            }
                                                            alt="Editar"
                                                            width="30"
                                                        />
                                                    </button>
                                                )}

                                                {modoEfectivo === "eliminar" && (
                                                    <button
                                                        className="btnTabla"
                                                        onClick={() => eliminarHorario(horario)}    // ✅ paso por la validación
                                                    >
                                                        <img    
                                                            src={
                                                                new URL("../assets/img/icono_eliminar.png", import.meta.url).href
                                                            }
                                                            alt="Eliminar"
                                                            width="30"
                                                        />
                                                    </button>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                );
                            
                            })
                            ) : (
                            <tr>
                                <td colSpan={modoEfectivo !== "consultar" ? 5 : 4}>No hay horarios registrados</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>

            {modo === "postAlta" && (
                <FormBotones
                    boton1={{ id: "agregar", label: "AGREGAR", className: "btnAceptar", onClick: () => (window.location.href = "/horario?modo=agregar") }}
                    boton2={{ id: "cancelar", label: "VOLVER", className: "btnCancelar", onClick: () => (window.location.href = "/administrar") }}                        
                    contenedorClass="contenedorBotones"
                />
            )}
            
        </>
    );
}

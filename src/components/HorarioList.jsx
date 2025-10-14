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


    // ✅ Manejo de modificación con validación   
    const editarHorario = (horario) => {
        
        if (tieneReservasActivas(horario.horario_id)) {
        swalEstilo.fire({
            icon: "warning",
            title: "No se puede modificar",
            text: `El horario de ${horario.horaInicio} a  ${horario.horaFin} de ${horario.actividad_nombre} (${horario.profesor_nombre} ${horario.profesor_apellido}), tiene reservas activas.`,
            confirmButtonText: "Cerrar",
        });
        return;
        }

        if (onEditar) onEditar(horario);
    };

    // ✅ Manejo de eliminación con validación    
    const eliminarHorario = (horario) => {
        console.log('horario.horario_id ', horario.horario_id )

        if (tieneReservasActivas(horario.horario_id )) {
            swalEstilo.fire({
                icon: "warning",
                title: "No se puede eliminar",
                text: `El horario de ${horario.horaInicio} a  ${horario.horaFin} de ${horario.actividad_nombre} (${horario.profesor_nombre} ${horario.profesor_apellido}), tiene reservas activas.`,
                confirmButtonText: "Cerrar",
            });
            return;
        }
            
        swalEstilo.fire({
            title: "¿Eliminar horario?",
            text: `Esta acción eliminará el horario de ${horario.horaInicio} a  ${horario.horaFin} de ${horario.actividad_nombre} (${horario.profesor_nombre} ${horario.profesor_apellido}) permanentemente.`,            
            icon: "warning",
            showCancelButton: true,
            cancelButtonColor: '#6edc8c',                        
            customClass: {
                cancelButton: 'btnAceptar'
            },
            confirmButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Acá se agregan las instrucciones para eliminar el horario desde la base o el estado
            
                swalEstilo.fire({
                    title: "Eliminado",
                    text: "El horario ha sido eliminado.",
                    icon: "success",
                    confirmButtonColor: "#6edc8c",
                    confirmButtonText: "Cerrar",
                });
            }
        });
    };
    
    return (
        <main className="mainHorario">
            <section id="listadoHorarios">
                <table id="tablaHorarios">
                    <thead>
                        <tr>
                        <th>Activ.</th>
                        <th>Prof.</th>
                        <th>Cupo Max.</th>
                        <th>Días</th>
                        <th>Hora</th>
                        
                        {modo !== "consultar" && <th>Acciones</th>}
                        </tr>
                    </thead>

                    <tbody>
                        {horarios.length > 0 ? (                           
                            horarios.map((horario) => {                                
                                return (
                                    <tr key={horario.horario_id}>
                                        <td>{horario.actividad_nombre}</td>
                                        <td>{horario.profesor_nombre} {horario.profesor_apellido}</td>
                                        <td id="cupo">{horario.cupoMaximo ?? ""}</td>
                                        <td>{horario.dia}</td>
                                        <td>{horario.horaInicio} a {horario.horaFin}</td>
                                        
                                        {modo !== "consultar" && (
                                            <td>
                                                {modo === "editar" && (
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

                                                {modo === "eliminar" && (
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
                                <td colSpan={modo !== "consultar" ? 5 : 4}>No hay horarios registrados</td>
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
            
        </main>
    );
}

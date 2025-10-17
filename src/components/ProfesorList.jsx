import React, { useEffect, useState } from "react";
import FormBotones from "./FormBotones";
import Swal from "sweetalert2";
import reservasData from "../data/reservas.json";       // 👈 Importa las reservas
import horariosData from "../data/horarios.json"

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

export default function ProfesorList({ profesores = [], modo, onEditar }) {
    // Declaro el estado reservas
    const [reservas, setReservas] = useState([]);

    // Cargo las reservas (desde JSON por ahora)
    useEffect(() => { 
        setReservas(reservasData);
    }, []);

    /* Para cuando lo pase a backend
    useEffect(() => {
    fetch("http://localhost:3000/api/reservas")
        .then((res) => res.json())
        .then((data) => setReservas(data))
        .catch((err) => console.error("Error cargando reservas:", err));
    }, []);
    */

    const [horarios, setHorarios] = useState([]);

    // Cargo las reservas (desde JSON por ahora)
    useEffect(() => { 
        setHorarios(horariosData);
    }, []);

    // ✅ Verifico si el profesor tiene reservas activas
    const tieneReservasActivas = (profesorId) => {
        return reservas.some(
            (r) => Number(r.profesor_id) === Number(profesorId) && r.activo === true
        );        
    };

    const tieneHorariosAsignados = (profesorId) => {
        return horarios.some(
            (h) => Number(h.profesor_id) === Number(profesorId)
        );
    };


    // ✅ Manejo de modificación con validación   
    const editarProfesor = (profesor) => {
        if (tieneReservasActivas(profesor.profesor_id)) {
        swalEstilo.fire({
            icon: "warning",
            title: "No se puede modificar",
            text: `El profesor "${profesor.nombre} ${profesor.apellido}" tiene reservas activas.`,
            confirmButtonText: "Cerrar",
        });
        return;
        }

        if (onEditar) onEditar(profesor);
    };

    // ✅ Manejo de eliminación con validación    
    const eliminarProfesor = (profesor) => {
        console.log('profesor.profesor_id ', profesor.profesor_id)

        if (tieneReservasActivas(profesor.profesor_id)) {
            swalEstilo.fire({
                icon: "warning",
                title: "No se puede eliminar",
                text: `El profesor "${profesor.nombre} ${profesor.apellido}" tiene reservas activas.`,
                confirmButtonText: "Cerrar",
            });
            return;
        }

        if (tieneHorariosAsignados(profesor.profesor_id)) {
            swalEstilo.fire({
                icon: "warning",
                title: "No se puede eliminar",
                text: `El profesor "${profesor.nombre} ${profesor.apellido}" tiene horarios asignados.`,
                confirmButtonText: "Cerrar",
            });
            return;
        }       
            
        swalEstilo.fire({
            title: "¿Eliminar profesor?",
            text: `Esta acción eliminará al profesor "${profesor.nombre} ${profesor.apellido}" permanentemente.`,
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
                // Acá se agregan las instrucciones para eliminar la actividad desde la base o el estado
            
                swalEstilo.fire({
                    title: "Eliminado",
                    text: "El profesor ha sido eliminado.",
                    icon: "success",
                    confirmButtonColor: "#6edc8c",
                    confirmButtonText: "Cerrar",
                });
            }
        });
    };    

    // Si el modo es "postAlta", lo trato como "consultar"
    const modoEfectivo = modo === "postAlta" ? "consultar" : modo;
 
    console.log(profesores)
    return (
        <main className="mainProfesor">
            <section id="tablaProfesores">
                <table>
                    <thead>
                        <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Documento</th>
                        <th>Título</th>
                        <th>Activo</th>
                        {modoEfectivo !== "consultar" && <th>Acciones</th>}
                        </tr>
                    </thead>

                    <tbody>
                        {profesores.length > 0 ? (                           
                            profesores.map((profesor) => {
                                return (
                                    <tr key={profesor.profesor_id}>
                                        <td>{profesor.nombre}</td>
                                        <td>{profesor.apellido}</td>
                                        <td>{profesor.documento}</td>
                                        <td>{profesor.titulo}</td>
                                        <td id="activo" >{profesor.activo ? "Sí" : "No"}</td>
                                        
                                        {modoEfectivo !== "consultar" && (
                                            <td>
                                                {modoEfectivo === "editar" && (
                                                    <button
                                                        className="btnTabla"
                                                        // Redirigir al formulario en modo editar                                                       
                                                        onClick={() => editarProfesor(profesor)} // ✅ paso por la validación
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
                                                        onClick={() => eliminarProfesor(profesor)}    // ✅ paso por la validación
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
                                <td colSpan={modoEfectivo !== "consultar" ? 5 : 4}>No hay profesores registrados</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>

            {modo === "postAlta" && (
                <FormBotones
                    boton1={{ id: "agregar", label: "AGREGAR", className: "btnAceptar", onClick: () => (window.location.href = "/profesor?modo=agregar") }}
                    boton2={{ id: "cancelar", label: "VOLVER", className: "btnCancelar", onClick: () => (window.location.href = "/administrar") }}                        
                    contenedorClass="contenedorBotones"
                />
            )}
            
        </main>
    );
}

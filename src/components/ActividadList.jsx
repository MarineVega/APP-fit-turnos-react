import React, { useEffect, useState } from "react";
import ActividadRow from "./ActividadRow";

import Swal from "sweetalert2";

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


//import actividadesData from "../data/actividades.json";     // 👈 importa el JSON local (provisorio hasta que levante los datos de la BD)

export default function ActividadList({ actividades = [], modo, onEditar }) {
    // Cargo la imagen desde src/assets/img dinámicamente
    const obtenerRutaImagen = (nombreArchivo) => {
        try {
        return new URL(`../assets/img/${nombreArchivo}`, import.meta.url).href;
            /* ¿Qué hace la línea anterior?
            Si la imagen viene del formulario (File): usa URL.createObjectURL como antes.
            Si es un nombre de archivo (como "yoga.png"): 
            new URL('../assets/img/yoga.png', import.meta.url).href genera la URL final procesada por Vite.
            Esto permite usar imágenes que están dentro de src/assets/img sin moverlas a public. */
        } catch (error) {
        console.warn(`No se encontró la imagen: ${nombreArchivo}`);
        return null;
        }
    };

    // const [actividades, setActividades] = useState([]);       // Cuando levante los datos de la BD
    /*
    useEffect(() => {
        const fetchActividades = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/actividades"); // el backend
            const data = await response.json();
            setActividades(data);
        } catch (error) {
            console.error("Error cargando actividades:", error);
        }
        };

        fetchActividades();
    }, []);
    */
/*
    useEffect(() => {        
        setActividades(actividadesData);        // Carga inicial de los datos mockeados
    }, []);
*/

    console.log("Actividades recibidas:", actividades);
    console.log("Modo:", modo);
      
    // Función para eliminar una actividad
    const eliminarActividad = (actividad) => {
        swalEstilo.fire({
            title: "¿Eliminar actividad?",
            text: `Esta acción eliminará la actividad "${actividad.nombre}" permanentemente.`,
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
                    title: "Eliminada",
                    text: "La actividad ha sido eliminada.",
                    icon: "success",
                    confirmButtonColor: "#6edc8c",
                    confirmButtonText: "Cerrar",
                });
            }
        });
    };

    return (
        <main className="mainActividad">
            <section id="tablaActividades">
                <table>
                    <thead>
                        <tr>
                        <th>Nombre</th>
                        <th>Detalle</th>
                        <th>Cupo Max.</th>
                        <th>Imagen</th>
                        {modo !== "consultar" && <th>Acciones</th>}
                        </tr>
                    </thead>

                    <tbody>
                        {actividades.length > 0 ? (                           
                            actividades.map((actividad) => {
                                const imagenSrc =
                                    actividad.imagen instanceof File
                                        ? URL.createObjectURL(actividad.imagen)
                                        : obtenerRutaImagen(actividad.imagen);

                                return (
                                    <tr key={actividad.id}>
                                        <td>{actividad.nombre}</td>
                                        <td>{actividad.descripcion}</td>
                                        <td id="cupo">{actividad.cupoMaximo}</td>
                                        <td id="imagen">
                                            {imagenSrc ? (
                                                <img
                                                src={imagenSrc}
                                                alt={actividad.nombre}
                                                width="50"
                                                />
                                            ) : (
                                                "Sin imagen"
                                            )}
                                            

                                        </td>
                                        
                                        {modo !== "consultar" && (
                                            <td>
                                                {modo === "editar" && (
                                                    <button
                                                        className="btnTabla"
                                                        // Redirigir al formulario en modo editar
                                                        onClick={() => onEditar && onEditar(actividad)}
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
                                                        onClick={() => eliminarActividad(actividad)}
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
                                <td colSpan={modo !== "consultar" ? 5 : 4}>No hay actividades</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>
        </main>
    );
}

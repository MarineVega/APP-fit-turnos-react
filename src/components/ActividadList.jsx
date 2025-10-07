import React, { useEffect, useState } from "react";
import ActividadRow from "./ActividadRow";

//import actividadesData from "../data/actividades.json";     // 👈 importa el JSON local (provisorio hasta que levante los datos de la BD)

export default function ActividadList({ actividades = [], modo }) {
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
                        actividades.map((actividad) => (
                            <tr key={actividad.id}>
                            <td>{actividad.nombre}</td>
                            <td>{actividad.descripcion}</td>
                            <td id="cupo">{actividad.cupoMaximo}</td>
                            <td id="imagen">
                                {actividad.imagen ? 
                                (   <img
                                    src={
                                        actividad.imagen instanceof File
                                        ? URL.createObjectURL(actividad.imagen)         
                                        //: `/src/assets/img/${actividad.imagen}`
                                        : new URL(`../assets/img/${actividad.imagen}`, import.meta.url).href
                                        /* ¿Qué hace la línea anterior?
                                        Si la imagen viene del formulario (File): usa URL.createObjectURL como antes.
                                        Si es un nombre de archivo (como "yoga.png"): 
                                        new URL('../assets/img/yoga.png', import.meta.url).href genera la URL final procesada por Vite.
                                        Esto permite usar imágenes que están dentro de src/assets/img sin moverlas a public/.
                                        */
                                    }
                                    alt={actividad.nombre}
                                    width="50"                                    
                                    />
                                ) : ("Sin imagen")
                                }
                            </td>

                            {modo !== "consultar" && <td>Acciones</td>}
                            </tr>
                        ))
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

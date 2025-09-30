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
{/*                     
                    {actividades.length > 0 ? (
                        actividades.map((act, index) => (                     
                            <ActividadRow
                            key={index}
                            actividad={act}
                            index={index}
                            modo={modo}
                            setActividades={setActividades}
                            />
                    ))
                    ) : (
                    <tr>
                        <td colSpan={modo !== "consultar" ? 5 : 4}>
                        No hay actividades registradas.
                        </td>
                    </tr>
                    )} */}

                    {actividades.length > 0 ? (
                        actividades.map((actividad) => (
                            <tr key={actividad.id}>
                            <td>{actividad.nombre}</td>
                            <td>{actividad.descripcion}</td>
                            <td>{actividad.cupoMaximo}</td>
                            <td>
{/*                                 
                                {actividad.imagen ? (
                                <img
                                    src={URL.createObjectURL(actividad.imagen)}
                                    alt={actividad.nombre}
                                    width="80"
                                />
                                ) : (
                                "Sin imagen"
                                )} */}

                                {/* Si act.imagen es un File (cuando recién la cargás desde el formulario) → usa createObjectURL.
                                Si es un string (cuando la leés del JSON o la base de datos) → úsalo directamente como src.
                                Si no hay nada → muestra "Sin imagen". */}
                                <td>
                                    {actividad.imagen instanceof File
                                        ? <img src={URL.createObjectURL(actividad.imagen)} alt={actividad.nombre} width="50" />
                                        : actividad.imagen
                                        ? <img src={actividad.imagen} alt={actividad.nombre} width="50" />
                                        : "Sin imagen"}
                                </td>



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

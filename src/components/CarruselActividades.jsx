import React, { useState, useEffect } from "react";
import actividadesData from "../data/actividades.json";

/* Reemplaza el <div id="carruselActividades">.
Muestra las actividades de a 3, con desplazamiento circular.
Notifica al padre qué actividad está seleccionada.
*/

export default function CarruselActividades({ seleccion, onSeleccion }) {
    // 1. TODOS los HOOKS deben ir primero
    const [actividades, setActividades] = useState([]);         // Hook 1
    const [indiceInicio, setIndiceInicio] = useState(0);        // Hook 2
    const visible = 3;      // cantidad de actividades visibles por vez

    // 2. Hook de carga de datos
    // Cargo actividades activas
    useEffect (() => {                  // Hook 3
        const activas = actividadesData.filter((a) => a.activa);
        setActividades(activas);
    }, []);

    // 3. Hook de selección 
    // Lo movemos aquí porque tiene que ejecutarse en CADA render para que React lo registre.
    // Aunque use variables que aún no se han calculado, el Hook debe estar arriba.
    // Nota: Declararemos 'actividadesVisibles' e 'indiceSeleccionada' como 'let'
    // o moveremos el código que lo usa dentro del useEffect, como se hace a continuación:

    // NOTA IMPORTANTE: Para que el segundo useEffect siempre se ejecute, 
    // y dado que depende de datos calculados, lo mejor es **mover la lógica de cálculo
    // *justo antes* del useEffect** y solo si es estrictamente necesario, pero en este caso,
    // dado que las variables **no son estado** (`actividadesVisibles` y `indiceSeleccionada`), 
    // su cálculo debe hacerse *antes* del return.

    // Calculamos las variables que necesita el 4to Hook para que siempre se ejecute
    const actividadesVisibles = Array.from({ length: visible }, (_,i) =>
        // Ojo: Si actividades.length es 0, esto falla. Por eso es vital el return condicional.
        // PERO, la única forma de que no falle y el Hook se registre es hacer el cálculo defensivamente
        actividades.length > 0 
            ? actividades[(indiceInicio + i) % actividades.length]
            : null // Proteger el cálculo inicial
    );

   
   
    // Índice de la tarjeta destacada (la del medio)
    const indiceSeleccionada = Math.floor(visible / 2);
    
    // 4. Hook de selección (¡MOVIDO Y PROTEGIDO!)
    // Este es el Hook 4 que React no estaba viendo en el primer render
    // Para  saber cuál está seleccionada
    useEffect(() => {
        // Verificación doble para asegurar que el elemento existe
        if (onSeleccion && actividadesVisibles[indiceSeleccionada] && actividadesVisibles[indiceSeleccionada] !== null) {
            onSeleccion(actividadesVisibles[indiceSeleccionada]);
        }
    }, [indiceInicio, onSeleccion]);
    
    // Simplifiqué dependencias. `actividadesVisibles` y `indiceSeleccionada` 
    // no deberían ser dependencias porque se calculan en cada render.

    // 5. RETURN CONDICIONAL (El punto de quiebre): 
    // TODOS los Hooks se llamaron *antes*. Ahora es seguro hacer un return.
    if (actividades.length === 0) {
        return <p className="mensaje-vacio"> No hay actividades disponibles. </p>
    };

    // 6. Lógica que SÓLO se ejecuta si hay datos (actividades.length > 0)
    
    // Las funciones de avance/retroceso ya no necesitan ir después del cálculo,
    // pero pueden quedarse aquí para mayor claridad.
    const avanzar = () => {
        // Ahora es seguro porque sabemos que actividades.length > 0
        setIndiceInicio((prev) => (prev + 1) % actividades.length);
    };

    const retroceder = () => {
        // Ahora es seguro porque sabemos que actividades.length > 0
        setIndiceInicio((prev) => 
            prev === 0 ? actividades.length - 1 : prev - 1 
        );
    };
    
    //console.log("Actividad seleccionada: ", indiceSeleccionada)

    return (
        <>
            <div className="contenedor-actividades">
                <button className="flecha-carrusel" onClick={retroceder}>
                    &#10094;
                </button>

                <div className="carrusel-actividades">
                    {actividadesVisibles.map((actividad, index) => {
                        const imagenSrc = new URL(`../assets/img/${actividad.imagen}`, import.meta.url).href;
                        const esSeleccionada = index === indiceSeleccionada;

                        return (
                            <div
                            key={`${actividad.actividad_id}-${index}`}       // clave única
                            className={`actividad-card ${
                                esSeleccionada ? "seleccionada" : ""
                            }`}                      
                            onClick={() => onSeleccion && onSeleccion(actividad)}
                            >
                            <img
                                src={imagenSrc}
                                alt={actividad.nombre}
                                className="imagenActividad"
                            />
                            <p className="nombreActividad">{actividad.nombre}</p>
                            </div>
                        );
                    })}
                </div>

                <button className="flecha-carrusel" onClick={avanzar}>
                    &#10095;
                </button>
            </div>
        </>
    )

}

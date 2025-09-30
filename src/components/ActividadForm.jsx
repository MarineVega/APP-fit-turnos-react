import React, { useState } from "react";
import FormCampos from "./FormCampos";
//import { Form } from "react-router-dom";
import FormBotones from "./FormBotones";

//export default function ActividadForm({ onSave, initialData }) {
export default function ActividadForm({ guardar, datoInicial }) {
   
    // Estados del formulario
    const [nombre, setNombre] = useState(datoInicial?.nombre || "");
    const [descripcion, setDescripcion] = useState(datoInicial?.descripcion || "");
    const [cupoMaximo, setCupoMaximo] = useState(datoInicial?.cupoMaximo || "");
    const [imagen, setImagen] = useState(datoInicial?.imagen || null);

    //const handleSubmit = (e) => {
    const chequearGuardar = (e) => {
        e.preventDefault();

        let esValido = true;

        if (nombre.value === "") {
            mostrarMensajeError("nombreError", "Por favor ingrese el nombre.");
            esValido = false;
        }

        if (descripcion.value === "") {
            mostrarMensajeError("descripcionError", "Por favor ingrese una descripción.");
           // esValido = false;
        }

        if ((cupoMaximo.value === "") || (cupoMaximo.value < 1) || (cupoMaximo.value > 100)) {
            mostrarMensajeError("cupoMaximoError", "El cupo debe estar entre 1 y 100.");
            //esValido = false;
        }

        //if (!nombre || !descripcion || !cupoMaximo) return alert("Faltan campos obligatorios");

        guardar({ nombre, descripcion, cupoMaximo, imagen });
    };

    // const cancelar = () => {    
    //     if (modo === "agregar") {
    //         window.location.href = "../pages/administrar.html";
    //     } else if (modo === "editar") {
    //         window.location.href = "./actividad.html?modo=editar";
    //     } else {
    //         window.location.href = "./actividad.html?modo=consultar";
    //     }
    // });

    // Limpio campos
    function limpiarFormulario() {
        setNombre("");
        
        // document.getElementById("nombre").value = "";
        // document.getElementById("descripcion").value = "";
        // document.getElementById("cupoMaximo").value = "";

        // document.getElementById("nombreError").textContent = "";
        // document.getElementById("descripcionError").textContent = "";
        // document.getElementById("cupoMaximoError").textContent = "";
    }

    // const cancelarGuardar () = {
    //     limpiarFormulario
    // }


    return (
        <section className="seccionActividad">        
            <form onSubmit={chequearGuardar} className="formActividad">
                <FormCampos
                    label="Nombre *"
                    name="nombre"
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="inputActividad"
                    //{! esValido? (error="Por favor ingrese el nombre.") : true}
                />

                <FormCampos
                    label="Descripción *"
                    name="descripcion"
                    placeholder="Descripción"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="inputActividad"
                />

                <FormCampos
                    label="Cupo Máximo *"
                    type="number"
                    name="cupoMaximo"
                    placeholder="10"
                    value={cupoMaximo}
                    onChange={(e) => setCupoMaximo(e.target.value)}
                    className="inputActividad"
                />
                
                <FormCampos
                    label="Imagen"
                    type="file"
                    name="imagen"
                    isFile={true}           // 👈 indicamos que es un input file
                    preview={true}          // 👈 mostramos vista previa
                    value={cupoMaximo}
                    onChange={(e) => setImagen(e.target.files[0])}
                    className="inputActividad"
                    warning={"Coloque la imagen en la carpeta <b>src/assets/img</b> antes de seleccionarla."}
                />
                
                <label className="advertencia">* Campos obligatorios</label>                
            </form>

            <FormBotones                    
                boton1={{ id: "agregar", label: "AGREGAR", className: "btnAceptar", onClick: chequearGuardar }}
                boton2={{ id: "cancelar", label: "CANCELAR", className: "btnCancelar", onClick: chequearGuardar }}
                contenedorClass="contenedorBotones"
            />                
        </section>
    );
}


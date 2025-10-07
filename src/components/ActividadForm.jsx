import React, { useState } from "react";
import Swal from "sweetalert2";
import exitoImg from "../assets/img/exito.png"
import FormCampos from "./FormCampos";
import FormBotones from "./FormBotones";

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

export default function ActividadForm({ guardar, datoInicial }) {
    // Estados del formulario
    const [nombre, setNombre] = useState(datoInicial?.nombre || "");
    const [descripcion, setDescripcion] = useState(datoInicial?.descripcion || "");
    const [cupoMaximo, setCupoMaximo] = useState(datoInicial?.cupoMaximo || "");
    const [imagen, setImagen] = useState(datoInicial?.imagen || null);

    // Estados de errores
    const [errores, setErrores] = useState({
        nombre: "",
        descripcion: "",
        cupoMaximo: "",
    });

    const validarGuardar = (e) => {
        e.preventDefault();

        let nuevosErrores = { nombre: "", descripcion: "", cupoMaximo: "" };
        let esValido = true;

        if (!nombre.trim()) {
            nuevosErrores.nombre = "Por favor ingrese el nombre.";
            esValido = false;
        }

        if (!descripcion.trim()) {
            nuevosErrores.descripcion = "Por favor ingrese una descripción.";
            esValido = false;
        }

        if (!cupoMaximo || cupoMaximo < 1 || cupoMaximo > 100) {
            nuevosErrores.cupoMaximo = "El cupo debe estar entre 1 y 100.";
            esValido = false;
        }

        setErrores(nuevosErrores);

        // Si hay errores SALGO
        if (!esValido) return;

        guardar({ nombre, descripcion, cupoMaximo, imagen });

        swalEstilo.fire({
            title: '¡Operación Exitosa!',
            text: 'La actividad ha sido creada.',
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
            window.location.href = "/actividad?modo=consultar";
        
        /*
        then((result) => {
            if (result.isConfirmed) {
                if (modo === "editar") {
                    window.location.href = './actividad.html?modo=editar';
                } else {
                    window.location.href = './actividad.html?modo=consultar';
                }
            }
                */
        });

      //  limpiarFormulario();      
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

    function cancelar () {
        limpiarFormulario();
        window.location.href = "/actividad?modo=consultar";
    }

    // Limpio campos
    function limpiarFormulario() {
        setNombre("");
        setDescripcion("");
        setCupoMaximo("");
        setImagen(null);
        setErrores({ nombre: "", descripcion: "", cupoMaximo: "" });
    }

    // Limpia el mensaje de error al hacer foco o modificar el campo
    const limpiarError = (campo) => {
        setErrores((prev) => ({ ...prev, [campo]: "" }));           // se actualiza así -> setErrores(prev => ({ ...prev, nombre: "" }));
    };


    return (
        <section className="seccionActividad">        
            <form onSubmit={validarGuardar} className="formActividad">
                <FormCampos
                    label="Nombre *"
                    name="nombre"
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) => {
                        setNombre(e.target.value);
                        limpiarError("nombre");
                    }}
                    onFocus={() => limpiarError("nombre")}
                    className="inputActividad"
                    error={errores.nombre}
                />

                <FormCampos
                    label="Descripción *"
                    name="descripcion"
                    placeholder="Descripción"
                    value={descripcion}
                    onChange={(e) => {
                        setDescripcion(e.target.value);
                        limpiarError("descripcion");
                    }}
                    onFocus={() => limpiarError("descripcion")}
                    className="inputActividad"
                    error={errores.descripcion}
                />

                <FormCampos
                    label="Cupo Máximo *"
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
                
                <FormCampos
                    label="Imagen"
                    type="file"
                    name="imagen"
                    isFile={true}           // 👈 indicamos que es un input file
                    preview={true}          // 👈 mostramos vista previa
                    value={imagen}
                   // onChange={(e) => setImagen(e.target.files[0])}
                    onChange={(e) => {
                        const archivo = e.target.files[0];
                        if (archivo) {
                            // guardamos solo el nombre del archivo, no el objeto File; ej: "yoga.png"
                            setImagen(archivo.name);        //sería lo que voy a mostrar luego desde /assets/img/yoga.png
                        }
                    }}
                    className="inputActividad"
                    warning={"Coloque la imagen en la carpeta <b>src/assets/img</b> antes de seleccionarla."}
                />
                
                <label className="advertencia">* Campos obligatorios</label>                
            </form>

            <FormBotones                    
                boton1={{ id: "agregar", label: "AGREGAR", className: "btnAceptar", onClick: validarGuardar }}
                boton2={{ id: "cancelar", label: "CANCELAR", className: "btnCancelar", onClick: cancelar }}
                contenedorClass="contenedorBotones"
            />                
        </section>
    );
}


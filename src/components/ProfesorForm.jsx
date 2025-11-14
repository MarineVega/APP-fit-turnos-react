import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import exitoImg from "../assets/img/exito.png";
import FormCampos from "./FormCampos";
import FormBotones from "./FormBotones";
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

export default function ProfesorForm({ guardar, profesores = [], datoInicial = null}) {  
    const [params] = useSearchParams();
    const modo = params.get("modo") || "agregar";
    
    const profesor_id = datoInicial?.profesor_id || null;
    
    // Estados del formulario
    const [nombre, setNombre] = useState(datoInicial?.nombre || "");
    const [apellido, setApellido] = useState(datoInicial?.apellido || "");
    const [documento, setDocumento] = useState(datoInicial?.documento || "");
    const [titulo, setTitulo] = useState(datoInicial?.titulo || "");

    // Estados de errores
    const [errores, setErrores] = useState({
        nombre: "",
        apellido: "",
        documento: "",
        titulo: "",
    });

    // Si estoy en modo editar, cargo los datos del profesor
    useEffect(() =>{
        if (modo === "editar" && datoInicial) {
            setNombre(datoInicial.nombre);
            setApellido(datoInicial.apellido);
            setDocumento(datoInicial.documento);
            setTitulo(datoInicial.titulo);
        }
    }, [modo, datoInicial]);      

    // Valido el campo documento
    const validarDocumento = (valor) => {
        // Solo permite números, sin puntos, comas ni guiones
        const soloNumeros = /^[0-9]+$/.test(valor);
        if (!soloNumeros) return "El documento solo debe contener números (sin puntos ni guiones).";

        // Debe tener 8 o 11 dígitos
        if (!(valor.length === 8 || valor.length === 11)) {
            return "El documento debe tener 8 dígitos (DNI) o 11 dígitos (CUIL/CUIT).";
        }

        return "";      // válido
    };

    // Validación y guardado
    const validarGuardar = (e) => {
        e.preventDefault();

        let nuevosErrores = { nombre: "", apellido: "", documento: "", titulo: "" };
        let esValido = true;

        if (!nombre.trim()) {
            nuevosErrores.nombre = "Por favor ingrese el nombre.";
            esValido = false;
        }

        if (!apellido.trim()) {
            nuevosErrores.apellido = "Por favor ingrese el apellido.";
            esValido = false;
        }

        if (!documento.trim()) {
            nuevosErrores.documento = "Por favor ingrese el documento.";
            esValido = false;
        } else {
            const errorDoc = validarDocumento(documento.trim());
            if (errorDoc) {
                nuevosErrores.documento = errorDoc;
                esValido = false;
            }
        }

        // Verifico si ya existe otro profesor con el mismo documento
        const documentoDuplicado = profesores.some(
            (prof) =>
                prof.documento === documento.trim() &&
                Number(prof.profesor_id) !== Number(profesor_id)
        );

        if (documentoDuplicado) {
            nuevosErrores.documento = "Ya existe un profesor con ese documento.";
            esValido = false;
        }

       
        if (!titulo.trim()) {
            nuevosErrores.titulo = "Por favor ingrese el título habilitante.";
            esValido = false;
        }

        setErrores(nuevosErrores);

        // Si hay errores SALGO
        if (!esValido) return;

        guardar({ nombre, apellido, documento, titulo });

        console.log("Nombre: ", nombre);
        console.log("Apellido: ", apellido);
        console.log("Documento: ", documento);
        console.log("Título: ", titulo);

        const mensaje = 
            modo === "editar"
                ? 'El profesor ha sido actualizado.'
                : 'El profesor ha sido creado.';

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
                window.location.href = "/profesor?modo=editar";
            } else {
                window.location.href = "/profesor?modo=postAlta";      // para distinguirlo del consultar normal
            }        
        });
    };

    function cancelar () {
        limpiarFormulario();
        if (modo === "agregar") {
            window.location.href = "/administrar";
         } else if (modo === "editar") {
            window.location.href = "/profesor?modo=editar";
        } else {
            window.location.href = "/profesor?modo=consultar";
        }        
    }

    // Limpio campos
    function limpiarFormulario() {
        setNombre("");
        setApellido("");
        setDocumento("");
        setTitulo("");
        setErrores({ nombre: "", apellido: "", documento: "", titulo: "" });
    }

    // Limpia el mensaje de error al hacer foco o modificar el campo
    const limpiarError = (campo) => {
        setErrores((prev) => ({ ...prev, [campo]: "" }));           // se actualiza así -> setErrores(prev => ({ ...prev, nombre: "" }));
    };


    return (
        <section className="seccionProfesor">        
            <form onSubmit={validarGuardar} className="formProfesor">
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
                    className="inputProfesor"
                    error={errores.nombre}
                />

                <FormCampos
                    label="Apellido *"
                    name="apellido"
                    placeholder="Apellido"
                    value={apellido}
                    onChange={(e) => {
                        setApellido(e.target.value);
                        limpiarError("apellido");
                    }}
                    onFocus={() => limpiarError("apellido")}
                    className="inputProfesor"
                    error={errores.apellido}
                />
                <FormCampos
                    label="DNI/CUIT/CUIL *"
                    name="documento"
                    placeholder="Ingrese solo números"
                    value={documento}
                    onChange={(e) => {
                        setDocumento(e.target.value);
                        limpiarError("documento");
                    }}
                    onFocus={() => limpiarError("documento")}
                    className="inputProfesor"
                    error={errores.documento}
                />

                <FormCampos
                    label="Título habilitante *"
                    name="titulo"
                    placeholder="Título"
                    value={titulo}
                    onChange={(e) => {
                        setTitulo(e.target.value);
                        limpiarError("titulo");
                    }}
                    onFocus={() => limpiarError("titulo")}
                    className="inputProfesor"
                    error={errores.titulo}
                />
                
                <p className="advertencia">* Campos obligatorios</p>                
            </form>

            <FormBotones                    
                boton1={{ id: "agregar", label: modo === "editar" ? "GUARDAR" : "AGREGAR", className: "btnAceptar", onClick: validarGuardar }}
                boton2={{ id: "cancelar", label: "CANCELAR", className: "btnCancelar", onClick: cancelar }}
                contenedorClass="contenedorBotones"
            />                
        </section>
    );

}


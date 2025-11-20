import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import exitoImg from "../assets/img/exito.png";
import FormCampos from "./FormCampos";
import FormBotones from "./FormBotones";
import { useSearchParams } from "react-router-dom";

// configuro estilos para sweetalert
const swalEstilo = Swal.mixin({
    imageWidth: 200,
    imageHeight: 200,
    background: '#bababa',
    confirmButtonColor: '#6edc8c',
    customClass: {
        confirmButton: 'btnAceptar',
        cancelButton: 'btnCancelar'
    }
});

export default function ProfesorForm({ guardar, profesores = [], datoInicial = null }) {
    const [params] = useSearchParams();
    const modo = params.get("modo") || "agregar";
    
    const profesor_id = datoInicial?.profesor_id || null;

    // Estados del formulario (acceso ajustado para el backend)
    const [nombre, setNombre] = useState(datoInicial?.persona?.nombre || "");
    const [apellido, setApellido] = useState(datoInicial?.persona?.apellido || "");
    const [documento, setDocumento] = useState(datoInicial?.persona?.documento || "");
    const [titulo, setTitulo] = useState(datoInicial?.titulo || "");
    const [activo, setActivo] = useState(datoInicial?.persona?.activo ?? true); // Nuevo campo

    const [errores, setErrores] = useState({
        nombre: "",
        apellido: "",
        documento: "",
        titulo: "",
    });

    // Si estoy en modo editar, cargo los datos del profesor
    useEffect(() => {
        if (modo === "editar" && datoInicial) {
            setNombre(datoInicial.persona?.nombre || "");
            setApellido(datoInicial.persona?.apellido || "");
            setDocumento(datoInicial.persona?.documento || "");
            setTitulo(datoInicial.titulo);
            setActivo(datoInicial.persona?.activo ?? true);
        }
    }, [modo, datoInicial]);

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
            const soloNumeros = /^[0-9]+$/.test(documento);
            if (!soloNumeros) {
                nuevosErrores.documento = "El documento solo debe contener números.";
                esValido = false;
            }
        }

        if (!titulo.trim()) {
            nuevosErrores.titulo = "Por favor ingrese el título habilitante.";
            esValido = false;
        }

        setErrores(nuevosErrores);
        if (!esValido) return;

        //  incluye activo, título y datos de persona
        guardar({ nombre, apellido, documento, titulo, activo });

        const mensaje =
            modo === "editar"
                ? 'El profesor ha sido actualizado.'
                : 'El profesor ha sido creado.';

        swalEstilo.fire({
            title: '¡Operación Exitosa!',
            text: mensaje,
            imageUrl: exitoImg,
            imageAlt: 'Éxito',
            icon: 'success',
            confirmButtonText: 'Volver',
            customClass: { confirmButton: 'btnAceptar' },
            buttonsStyling: false
        }).then(() => {
            if (modo === "editar") {
                window.location.href = "/profesor?modo=editar";
            } else {
                window.location.href = "/profesor?modo=postAlta";
            }
        });
    };

    return (
        <section className="seccionProfesor">
            <form onSubmit={validarGuardar} className="formProfesor">
                <FormCampos
                    label="Nombre *"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    error={errores.nombre}
                />
                <FormCampos
                    label="Apellido *"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    error={errores.apellido}
                />
                <FormCampos
                    label="Documento *"
                    value={documento}
                    onChange={(e) => setDocumento(e.target.value)}
                    error={errores.documento}
                />
                <FormCampos
                    label="Título habilitante *"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    error={errores.titulo}
                />

                {/* Checkbox Activo */}
                <div className="form-check">
                    <label>
                        <input
                            type="checkbox"
                            checked={activo}
                            onChange={(e) => setActivo(e.target.checked)}
                        />
                        Activo
                    </label>
                </div>

                <p className="advertencia">* Campos obligatorios</p>
            </form>

            <FormBotones
                boton1={{ label: modo === "editar" ? "GUARDAR" : "AGREGAR", onClick: validarGuardar }}
                boton2={{ label: "CANCELAR", onClick: () => window.location.href = "/profesor" }}
            />
        </section>
    );
}

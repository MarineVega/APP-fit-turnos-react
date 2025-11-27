import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import exitoImg from "../assets/img/exito.png";
import FormCampos from "./FormCampos";
import FormBotones from "./FormBotones";
import { useSearchParams } from "react-router-dom";

// configuro estilos para sweetalert
const swalEstilo = Swal.mixin({
  imageWidth: 200, // ancho en píxeles
  imageHeight: 200, // alto en píxeles
  background: "#bababa",
  confirmButtonColor: "#6edc8c",
  customClass: {
    confirmButton: "btnAceptar",
    cancelButton: "btnCancelar",
  },
});

//export default function ActividadForm({ guardar, datoInicial }) {
export default function ActividadForm({
  guardar,
  actividades = [],
  datoInicial = null,
}) {
  const [params] = useSearchParams();
  const modo = params.get("modo") || "agregar";
  //const id = parseInt(params.get("id"));

  // Cuando no haya parámetro id en la URL, uso el que viene del objeto datoInicial (que el padre le pasa correctamente)
  //const id = parseInt(params.get("id")) || datoInicial?.id || null;

  const id = datoInicial?.actividad_id || null;

  // Estados del formulario
  const [nombre, setNombre] = useState(datoInicial?.nombre || "");
  const [descripcion, setDescripcion] = useState(
    datoInicial?.descripcion || ""
  );
  const [cupoMaximo, setCupoMaximo] = useState(datoInicial?.cupoMaximo || "");
  const [imagen, setImagen] = useState(datoInicial?.imagen || null);
  const [preview, setPreview] = useState(null); // para manejar la previsualización de las imágenes

  // Estados de errores
  const [errores, setErrores] = useState({
    nombre: "",
    descripcion: "",
    cupoMaximo: "",
  });

  // Si estoy en modo editar, cargo los datos de la actividad
  useEffect(() => {
    if (modo === "editar" && datoInicial) {
      setNombre(datoInicial.nombre);
      setDescripcion(datoInicial.descripcion);
      setCupoMaximo(datoInicial.cupoMaximo);
      setImagen(datoInicial.imagen || null);
      setPreview(null); // limpio cualquier preview anterior
    }
  }, [modo, datoInicial]); //[modo, id, actividades]);

  // Validación y guardado
  const validarGuardar = async (e) => {
    e.preventDefault();

    let nuevosErrores = { nombre: "", descripcion: "", cupoMaximo: "" };
    let esValido = true;
    /*
        if (!nombre.trim()) {
            nuevosErrores.nombre = "Por favor ingrese el nombre.";
            esValido = false;
        }
*/
    if (nombre.trim().length < 3 || nombre.trim().length > 50) {
      nuevosErrores.nombre = "El nombre debe tener entre 3 y 50 caracteres.";
      esValido = false;
    }
    /*
        if (!descripcion.trim()) {
            nuevosErrores.descripcion = "Por favor ingrese una descripción.";
            esValido = false;
        }
*/
    if (descripcion.trim().length < 5 || descripcion.trim().length > 100) {
      nuevosErrores.descripcion =
        "La descripción debe tener entre 5 y 100 caracteres.";
      esValido = false;
    }

    if (!cupoMaximo || cupoMaximo < 1 || cupoMaximo > 100) {
      nuevosErrores.cupoMaximo = "El cupo debe estar entre 1 y 100.";
      esValido = false;
    }

    // Valido que no se ingrese un nombre de actividad existente (usando las actividades del estado)
    const nombreIngresado = nombre.trim().toLowerCase(); // normalizo el texto ingresado (quito espacios y lo paso a minúscula)
    const nombreDuplicado = actividades.some(
      (
        act // recorro todas las actividades y busco si hay otra con el mismo nombre
      ) =>
        act.nombre.trim().toLowerCase() === nombreIngresado &&
        Number(act.actividad_id) !== Number(id) // permito mismo nombre solo si estoy editando esa misma actividad
      // 👈 realizo una omparación numérica
    );

    if (nombreDuplicado) {
      nuevosErrores.nombre = "Ya existe una actividad con ese nombre.";
      esValido = false;
    }

    setErrores(nuevosErrores);

    // Si hay errores SALGO
    if (!esValido) return;

    //guardar({ nombre, descripcion, cupoMaximo, imagen });
    const actividadData = {
      nombre,
      descripcion,
      cupoMaximo: Number(cupoMaximo),
      imagen,
      activa: true,
    };

    try {
      const url =
        modo === "editar" && id
          ? `${import.meta.env.VITE_API_URL}/actividades/${id}`
          : `${import.meta.env.VITE_API_URL}/actividades`;

      const method = modo === "editar" ? "PUT" : "POST";
      /*
            console.log("Enviando a backend:", actividadData);
            console.log("URL:", url);
            console.log("Método:", method);
            */

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(actividadData),
      });

      if (!response.ok) throw new Error("Error al guardar en la base de datos");

      const mensaje =
        modo === "editar"
          ? "La actividad ha sido actualizada."
          : "La actividad ha sido creada.";

      swalEstilo
        .fire({
          title: "¡Operación Exitosa!",
          text: mensaje,
          imageUrl: exitoImg,
          imageAlt: "Éxito",
          icon: "success",
          confirmButtonText: "Volver",
          customClass: {
            confirmButton: "btnAceptar",
          },
          buttonsStyling: false,
        })
        .then(() => {
          limpiarFormulario();
          // Redirección según modo
          if (modo === "editar") {
            window.location.href = "/actividad?modo=editar";
          } else {
            window.location.href = "/actividad?modo=postAlta"; // para distinguirlo del consultar normal
          }
        });
    } catch (err) {
      console.error(err);
      swalEstilo.fire("Error", "No se pudo guardar la actividad.", "error");
    }
  };

  function cancelar() {
    limpiarFormulario();
    if (modo === "agregar") {
      window.location.href = "/administrar";
    } else if (modo === "editar") {
      window.location.href = "/actividad?modo=editar";
    } else {
      window.location.href = "/actividad?modo=consultar";
    }
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
    setErrores((prev) => ({ ...prev, [campo]: "" })); // se actualiza así -> setErrores(prev => ({ ...prev, nombre: "" }));
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
          isFile={true} // 👈 indicamos que es un input file
          preview={true} // 👈 mostramos vista previa
          value={imagen}
          onChange={(e) => {
            const archivo = e.target.files[0];
            if (archivo) {
              setImagen(archivo.name); // guardo el nombre del archivo
              const previewUrl = URL.createObjectURL(archivo);
              setPreview(previewUrl); // seteo la vista previa temporal
            }
          }}
          className="inputActividad"
          warning={
            "Coloque la imagen en la carpeta <b>src/assets/img</b> antes de seleccionarla."
          }
          imagenActual={imagen} // 👈 agregamos esta nueva prop
          previewUrl={preview} // 👈 y esta también
        />
        <label className="advertencia">* Campos obligatorios</label>
      </form>

      <FormBotones
        boton1={{
          id: "agregar",
          label: modo === "editar" ? "GUARDAR" : "AGREGAR",
          className: "btnAceptar",
          onClick: validarGuardar,
        }}
        boton2={{
          id: "cancelar",
          label: "CANCELAR",
          className: "btnCancelar",
          onClick: cancelar,
        }}
        contenedorClass="contenedorBotones"
      />
    </section>
  );
}

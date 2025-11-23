import React from "react";

const FormBotones = ({
    boton1 = { id: "boton1", label: "AGREGAR", className: "btnAceptar", onClick: () => {} },
    boton2 = { id: "boton2", label: "CANCELAR", className: "btnACancelar", onClick: () => {} },
    contenedorClass = "contenedorBotones"
}) => {
    return (
        <div className={contenedorClass}>
            {/* BOTÓN 1 = SUBMIT */}
            <button
                id={boton1.id}
                className={boton1.className}
                onClick={boton1.onClick}
                type={boton1.type || "submit"}
            >
                {boton1.label}
            </button>

            {/* BOTÓN 2 = BUTTON (NO SUBMIT) */}
            <button
                id={boton2.id}
                className={boton2.className}
                onClick={boton2.onClick}
                type={boton2.type || "button"}
            >
                {boton2.label}
            </button>
        </div>
    );
};

export default FormBotones;

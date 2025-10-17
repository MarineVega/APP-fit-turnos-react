import React from "react";

const FormBotones = ({
    boton1 = { id: "boton1", label: "AGREGAR", className: "btnAceptar", onClick: () => {} },
    boton2 = { id: "boton2", label: "CANCELAR", className: "btnACancelar", onClick: () => {} },
    contenedorClass = "contenedorBotones"
}) => {
    return (
        <div className={contenedorClass}>
            <button id={boton1.id} className={boton1.className} onClick={boton1.onClick}>
                {boton1.label}
            </button>

            <button id={boton2.id} className={boton2.className} onClick={boton2.onClick}>
                {boton2.label}
            </button>
        </div>
    );
};

export default FormBotones;
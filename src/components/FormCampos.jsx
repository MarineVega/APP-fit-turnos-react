import React, { useState} from "react";

const FormCampos = ({               // desestructuro las props
    label,
    type = "text",                  // si no se pasa, por defecto es "text"
    placeholder,
    value,
    onChange,
    onFocus,
    className = "",
    error,
    name,
    isTextArea = false,
    isFile = false ,                // prop para indicar que es un input file
    preview = false,                // mostrar vista previa de imagen
    warning,                        // prop para advertencias
    id,
    imagenActual,   // 👈 imagen actual que viene del form
    previewUrl      // 👈 vista previa si el usuario cambió el archivo
}) => {
    const inputId = id || name;
    const [filePreview, setFilePreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFilePreview(URL.createObjectURL(file));
        }
        onChange && onChange(e);    // llamamos al onChange si lo pasaron
    };

    return (
        <div>
            {/* <label>{label}</label> */}
            <label htmlFor={inputId} name={name}>{label}</label>

            {isFile ? (
            <>
            <input
                id={inputId}
                type="file"
                name={name}
                className={className}
                onChange={handleFileChange}
                onFocus={onFocus}
            />
        {/*             
            {preview && filePreview && (
                <img src={filePreview} alt="Vista previa" width="100" />
            )} */}

            {/* ✅ muestra la imagen correspondiente */}
            {isFile && preview && (
            <div className="previewImagen" style={{ marginTop: "8px" }}>
                {previewUrl ? (
                <img
                    src={previewUrl}
                    alt="Nueva imagen"
                    width="120"
                    style={{ borderRadius: "8px" }}
                />
                ) : imagenActual ? (
                <img
                    src={new URL(`../assets/img/${imagenActual}`, import.meta.url).href}
                    alt="Imagen actual"
                    width="120"
                    style={{ borderRadius: "8px" }}
                />
                ) : filePreview ? (
                <img
                    src={filePreview}
                    alt="Vista previa temporal"
                    width="120"
                    style={{ borderRadius: "8px" }}
                />
                ) : null}
            </div>
            )}
        
            </>
        ) : isTextArea ? (
                <textarea
                    className={className}
                    placeholder={placeholder}
                    value={value ?? ""}
                    onChange={onChange}
                    onFocus={onFocus}
                    name={name}
                />
            ) : (
                <input
                    type={type}
                    className={className}
                    placeholder={placeholder}
                    value={value ?? ""}
                    onChange={onChange}                    
                    onFocus={onFocus}
                    name={name}
                />
            )}
            {error && <div className="mensaje-error">{error}</div>}

            {warning && (
                <label className="advertencia" dangerouslySetInnerHTML={{ __html: warning }} />
            )}

        </div>
    )
};

export default FormCampos;
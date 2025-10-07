import React, { useState} from "react";

const FormCampos = ({               // desestructuro las props
    label,
    type = "text",                  // si no se pasa, por defecto es "text"
    placeholder,
    value,
    onChange,
    onFocus,
    className="",
    error,
    name,
    isTextArea = false,
    isFile = false ,                // prop para indicar que es un input file
    preview = false,                // mostrar vista previa de imagen
    warning,                        // prop para advertencias
    id,
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
            <label htmlFor={inputId}>{label}</label>

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
            {preview && filePreview && (
                <img src={filePreview} alt="Vista previa" width="100" />
            )}
            </>
        ) : isTextArea ? (
                <textarea
                    className={className}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onFocus={onFocus}
                    name={name}
                />
            ) : (
                <input
                    type={type}
                    className={className}
                    placeholder={placeholder}
                    value={value}
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
import { useNavigate } from "react-router-dom";
import exito from "../assets/img/exito.png";

export default function CuentaVerificada() {
  const navigate = useNavigate();

  return (
    <div className="formCuenta" style={{ textAlign: "center", paddingBottom: "50px" }}>
      
      {/* Título */}
      <h2
        style={{
            fontSize: "22px",
            fontWeight: "700",
            marginTop: "10px",
            marginBottom: "20px",
            width: "100%",         // hace que el elemento ocupe todo el ancho
            textAlign: "center",   // centra el texto adentro
        }}
        >
        Cuenta Verificada
        </h2>

      {/* Imagen más grande */}
      <img
        src={exito}
        alt="Cuenta verificada"
        style={{
          width: "180px",
          margin: "0 auto 25px auto",
          display: "block",
        }}
      />

      {/* Texto en negrita */}
      <p
        style={{
          fontSize: "16px",
          marginBottom: "25px",
          maxWidth: "260px",
          margin: "0 auto 30px auto",
          fontWeight: "600",
          lineHeight: "1.4",
        }}
      >
        ¡Tu cuenta fue verificada con éxito! Ya podés iniciar sesión.
      </p>

      {/* Botón más chico y centrado */}
      <button
        className="btnCuentaLogin"
        onClick={() => navigate("/cuenta")}
        style={{
          width: "15%",
          margin: "0 auto 40px auto",
          padding: "10px 0",
          fontSize: "15px",
          display: "block",
        }}
      >
        Iniciar Sesión
      </button>
    </div>
  );
}

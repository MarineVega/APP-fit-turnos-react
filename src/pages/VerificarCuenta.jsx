import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function VerificarCuenta() {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function verificar() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/verify/${token}`
        );

        if (!res.ok) throw new Error("Token inválido o expirado");

        // Si fue OK, redirige a la pantalla visual
        navigate("/verificada");
      } catch (error) {
        alert("El enlace de verificación expiró o es inválido.");
        navigate("/cuenta");
      }
    }

    verificar();
  }, [token, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>Verificando cuenta...</h2>
      <p>Por favor, esperá unos segundos.</p>
    </div>
  );
}

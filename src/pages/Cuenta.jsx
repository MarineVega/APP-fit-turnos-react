import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import LoginForm from "../components/LoginForm";
import RegistrarForm from "../components/RegistrarForm";
import RecuperarForm from "../components/RecuperarForm";
import RecuperarStep2 from "../components/RecuperarStep2";
import RecuperarStep3 from "../components/RecuperarStep3";
import ImagenLateral from "../components/ImagenLateral";

export default function Cuenta() {
  const [form, setForm] = useState("login");
  const [searchParams] = useSearchParams();

  // Arranca en registro si viene ?form=crear
  useEffect(() => {
    if (searchParams.get("form") === "crear") {
      setForm("registrar");
    }
  }, [searchParams]);

  const handleSwitch = (next) => {
    setForm(next);
  };

  return (
    <main className="mainCuenta">
      {/* Imágenes laterales parametrizables */}
      <ImagenLateral
        
        altIzq="Imagen lateral izquierda"
        altDer="Imagen lateral derecha"
      />

      <section className="seccionCuenta">
        {form === "login" && <LoginForm onSwitch={handleSwitch} />}
        {form === "registrar" && <RegistrarForm onSwitch={handleSwitch} />}
        {form === "recuperar1" && <RecuperarForm onSwitch={handleSwitch} />}
        {form === "recuperar2" && <RecuperarStep2 onSwitch={handleSwitch} />}
        {form === "recuperar3" && <RecuperarStep3 onSwitch={handleSwitch} />}
      </section>
    </main>
  );
}

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import LoginForm from "../components/LoginForm";
import RegistrarForm from "../components/RegistrarForm";
import RecuperarForm from "../components/RecuperarForm";
import RecuperarStep2 from "../components/RecuperarStep2";
import RecuperarStep3 from "../components/RecuperarStep3";
import ImagenLateral from "../components/ImagenLateral";

import imgCuentaIzq from "../assets/img/cuenta2.png";
import imgCuentaDer from "../assets/img/cuenta1.png";

export default function Cuenta() {
  const [form, setForm] = useState("login");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("form") === "crear") setForm("registrar");
  }, [searchParams]);

  const handleSwitch = (next) => setForm(next);

  return (
    <main className="mainCuenta">
      <ImagenLateral
        imgIzquierda={imgCuentaIzq}
        imgDerecha={imgCuentaDer}
        altIzq="Cuenta izquierda"
        altDer="Cuenta derecha"
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

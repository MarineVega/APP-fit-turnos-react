import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import RecoverForm from "../components/RecoverForm";
import RecoverStep2 from "../components/RecoverStep2";
import RecoverStep3 from "../components/RecoverStep3";

export default function Cuenta() {
  const [form, setForm] = useState("login");
  const [searchParams] = useSearchParams();

  // Lee ?form=crear para arrancar en el registro
  useEffect(() => {
    if (searchParams.get("form") === "crear") {
      setForm("register");
    }
  }, [searchParams]);

  const handleSwitch = (next) => {
    setForm(next);
  };

  return (
    <div className="cuentaContainer">
      {form === "login" && <LoginForm onSwitch={handleSwitch} />}
      {form === "register" && <RegisterForm onSwitch={handleSwitch} />}
      {form === "recover1" && <RecoverForm onSwitch={handleSwitch} />}
      {form === "recover2" && <RecoverStep2 onSwitch={handleSwitch} />}
      {form === "recover3" && <RecoverStep3 onSwitch={handleSwitch} />}
    </div>
  );
}

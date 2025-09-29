import { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import RecoverForm from "../components/RecoverForm";
import RecoverStep2 from "../components/RecoverStep2";
import RecoverStep3 from "../components/RecoverStep3";

export default function Cuenta() {
  const [mode, setMode] = useState("login"); 
  const renderForm = () => {
    switch (mode) {
      case "login": return <LoginForm onSwitch={setMode} />;
      case "register": return <RegisterForm onSwitch={setMode} />;
      case "recover1": return <RecoverForm onSwitch={setMode} />;
      case "recover2": return <RecoverStep2 onSwitch={setMode} />;
      case "recover3": return <RecoverStep3 onSwitch={setMode} />;
      default: return <LoginForm onSwitch={setMode} />;
    }
  };

  return (
    <main className="mainCuenta">
      <div className="tituloConFlecha">
        <span>{mode === "login" ? "Iniciar Sesión" : "Cuenta"}</span>
      </div>
      {renderForm()}
    </main>
  );
}


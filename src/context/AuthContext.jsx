import React, { createContext, useContext } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const login = async (email, password) => {
    // Simulación de login
    if (email === "admin@fit.com" && password === "1234") {
      return { ok: true, user: { name: "Admin" }, token: "fake-token-123" };
    } else {
      return { ok: false, msg: "Usuario o contraseña incorrecta" };
    }
  };

  return <AuthContext.Provider value={{ login }}>{children}</AuthContext.Provider>;
};
export default AuthContext;
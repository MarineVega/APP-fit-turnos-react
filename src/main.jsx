import React from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles/style.css";

/*
Ese error ocurre cuando usás un <Link> de react-router-dom fuera de un <BrowserRouter>.
Es decir, React Router necesita un contexto de enrutador y como no existe todavía, explota.

Solución:
En tu main.jsx (que Vite genera por defecto), asegurate de envolver la App en un BrowserRouter.
*/

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

/*
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
*/
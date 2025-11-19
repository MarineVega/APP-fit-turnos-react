import React, { useEffect} from "react";

import Card from "../components/Card";
import "../styles/style.css";
// 🖼️ Imágenes
import soga from "../assets/img/soga.png";
import estocada from "../assets/img/estocada.png";
import reloj from "../assets/img/reloj.png";
import abdominales from "../assets/img/abdominales.png";
import publicidad from "../assets/img/publicidad.png";
import TituloConFlecha from "../components/TituloConFlecha";


export default function Administrar() {
  
  // Restauro scroll al volver
  useEffect(() => {
    const scrollY = sessionStorage.getItem("scrollY_admin");
    if (scrollY) {
      window.scrollTo({ top: parseInt(scrollY, 10), behavior: "smooth" });
      sessionStorage.removeItem("scrollY_admin");     // limpio para evitar que quede
    }
  }, []);

  const secciones = [
   
    {
      titulo: "Usuarios",
      tipo: "acciones",
      imagen: soga,
      base: "/usuario",
      acciones: [
        { texto: "Agregar", modo: "agregar", icono: "➕" },
        { texto: "Modificar", modo: "editar", icono: "📝" },
        { texto: "Eliminar", modo: "eliminar", icono: "🗑️" },
        { texto: "Consultar", modo: "consultar", icono: "💬" },
      ],
      
    },
    {
      titulo: "Actividades",
      tipo: "acciones",
      imagen: estocada,
      base: "/actividad",
      acciones: [
        { texto: "Agregar", modo: "agregar", icono: "➕" },
        { texto: "Modificar", modo: "editar", icono: "📝" },
        { texto: "Eliminar", modo: "eliminar", icono: "🗑️" },
        { texto: "Consultar", modo: "consultar", icono: "💬" },
      ],
    },
    {
      titulo: "Horarios",
      tipo: "acciones",
      imagen: reloj,
      base: "/horario",
      acciones: [
        { texto: "Agregar", modo: "agregar", icono: "➕" },
        { texto: "Modificar", modo: "editar", icono: "📝"  },
        { texto: "Eliminar", modo: "eliminar", icono: "🗑️"  },
        { texto: "Consultar", modo: "consultar", icono: "💬" },
      ],
    },
    {
      titulo: "Profesores",
      tipo: "acciones",
      imagen: abdominales,
      base: "/profesor",
      acciones: [
        { texto: "Agregar", modo: "agregar", icono: "➕" },
        { texto: "Modificar", modo: "editar", icono: "📝" },
        { texto: "Eliminar", modo: "eliminar", icono: "🗑️" },
        { texto: "Consultar", modo: "consultar", icono: "💬" },
      ],
    },
    {
      titulo: "Publicidad",
      tipo: "info",
      imagen: publicidad,
      contenido: <p>PROXIMAMENTE podrá promocionar sus productos, servicios o sponsor.</p>,
    },
  ];

  return (
    
    <main className="mainAdministrar">
      <TituloConFlecha>Administrar</TituloConFlecha>

      {secciones.map((sec, i) => (
        <Card key={i} {...sec} />
      ))}
    </main>
  );
}

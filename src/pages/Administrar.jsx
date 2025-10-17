import React from "react";
import "../styles/style.css";
import Card from "../components/Card";

// 🖼️ Imágenes
import soga from "../assets/img/soga.png";
import estocada from "../assets/img/estocada.png";
import reloj from "../assets/img/reloj.png";
import abdominales from "../assets/img/abdominales.png";
import publicidad from "../assets/img/publicidad.png";
import medusaLogo from "../assets/img/Logo_Medusa.jpg";

export default function Administrar() {
  const secciones = [
    {
      titulo: "Datos Empresa",
      tipo: "info",
      imagen: soga,
      contenido: (
        <ul id="Datos">
          <li>
            <img src={medusaLogo} alt="Logo Medusa" id="Medusa" /> Nombre de la
            empresa: Medusa Software S.R.L.
          </li>
          <li>📍 Dirección: Av. del Deporte 1234, Buenos Aires, Argentina</li>
          <li>📞 Teléfono: +54 11 3987-4567</li>
          <li>✉️ Email de contacto: soporte@fitturnos.com</li>
          <li>🌐 Sitio web: www.fitturnos.com</li>
          <li>📸 Instagram: @fitturnos</li>
          <li>📘 Facebook: facebook.com/fitturnos</li>
        </ul>
      ),
    },
    {
      titulo: "Actividades",
      tipo: "acciones",
      imagen: estocada,
      base: "/actividad",
      acciones: [
        { texto: "Agregar", modo: "agregar", icono: "➕", base: "/Actividad" },
        { texto: "Modificar", modo: "editar", icono: "📝", base: "/Actividad" },
        { texto: "Eliminar", modo: "eliminar", icono: "🗑️", base: "/Actividad" },
        { texto: "Consultar", modo: "consultar", icono: "💬", base: "/Actividad" },
      ],
    },
    {
      titulo: "Horarios",
      tipo: "acciones",
      imagen: reloj,
      base: "/horario",
      acciones: [
        { texto: "Agregar", modo: "agregar", icono: "➕", base: "/Horario" },
        { texto: "Modificar", modo: "editar", icono: "📝" , base: "/Horario" },
        { texto: "Eliminar", modo: "eliminar", icono: "🗑️" , base: "/Horario" },
        { texto: "Consultar", modo: "consultar", icono: "💬" , base: "/Horario" },
      ],
    },
    {
      titulo: "Profesores",
      tipo: "acciones",
      imagen: abdominales,
      base: "/profesores",
      acciones: [
        { texto: "Agregar", modo: "agregar", icono: "➕", base: "/Profesor" },
        { texto: "Modificar", modo: "editar", icono: "📝", base: "/Profesor" },
        { texto: "Eliminar", modo: "eliminar", icono: "🗑️", base: "/Profesor" },
        { texto: "Consultar", modo: "consultar", icono: "💬", base: "/Profesor" },
      ],
    },
    {
      titulo: "Publicidad",
      tipo: "info",
      imagen: publicidad,
      contenido: <p>Aquí puede promocionar sus productos, servicios o sponsor.</p>,
    },
  ];

  return (
    <main className="mainAdministrar">
      {secciones.map((sec, i) => (
        <Card key={i} {...sec} />
      ))}
    </main>
  );
}

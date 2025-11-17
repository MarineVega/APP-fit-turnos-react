/**
 * Archivo de configuración centralizada para la URL base de la API.
 *
 * 💡 Por qué usamos API_BASE_URL:
 * - Para evitar escribir varias veces la URL del backend ("http://localhost:3000")
 * - Si mañana cambia la URL (por ejemplo, a una dirección en producción),
 *   solo necesitamos cambiarla aquí, sin tocar el resto del código.
 * - Ayuda a mantener el código más limpio, fácil de mantener y escalable.
 *
 * 👌 Cómo usarlo:
 * 1. Importá API_BASE_URL donde tengas un fetch o llamada a la API:
 *      import { API_BASE_URL } from "../utils/apiConfig";
 *
 * 2. Usalo así:
 *      fetch(`${API_BASE_URL}/profesores`)
 *
 * 🛠 Cuando subas el proyecto a producción:
 * - Solo cambiá el valor de API_BASE_URL a tu nueva URL (por ej. un servidor o dominio).
 */
export const API_BASE_URL = "http://localhost:3000"; // Cambiar si el backend usa otro puerto o está en otro entorno

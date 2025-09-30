// src/services/api.js
import emailjs from "emailjs-com";

// Simulación de registro de usuario
export async function registerUser({ nombre, email, password, esAdmin }) {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        const existe = usuarios.some(
          (u) => u.email === email || u.nombre === nombre
        );

        if (existe) {
          reject(new Error("Ya existe un usuario con ese nombre o email"));
        } else {
          const nuevoUsuario = { nombre, email, password, esAdmin };
          usuarios.push(nuevoUsuario);
          localStorage.setItem("usuarios", JSON.stringify(usuarios));

          // ✅ Enviar mail de bienvenida con EmailJS
          await emailjs.send(
            "service_xxx",       // tu Service ID
            "template_bienvenida", // tu Template ID
            { to_name: nombre, to_email: email },
            "publicKey_xxx"      // tu Public Key
          );

          resolve(nuevoUsuario);
        }
      } catch (err) {
        reject(new Error("Error en el registro"));
      }
    }, 500);
  });
}

// Simulación de login
export async function loginUser({ email, password }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
      const usuario = usuarios.find((u) => u.email === email);

      if (!usuario) {
        reject(new Error("La cuenta no existe"));
      } else if (usuario.password !== password) {
        reject(new Error("Contraseña incorrecta"));
      } else {
        resolve(usuario);
      }
    }, 500);
  });
}

// ✅ Enviar código de recuperación con EmailJS
export async function sendRecoveryCode(email, code) {
  try {
    await emailjs.send(
      "service_xxx",        // tu Service ID
      "template_codigo",    // tu Template ID
      { to_email: email, code },
      "publicKey_xxx"       // tu Public Key
    );
    return true;
  } catch (err) {
    throw new Error("No se pudo enviar el código");
  }
}

// ✅ Actualizar contraseña en localStorage
export async function updatePassword(email, newPassword) {
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const usuarioIndex = usuarios.findIndex((u) => u.email === email);

  if (usuarioIndex === -1) throw new Error("Usuario no encontrado");

  usuarios[usuarioIndex].password = newPassword;
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  return true;
}

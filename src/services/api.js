// src/services/api.js

// Simulación de registro de usuario
export async function registerUser({ nombre, email, password, esAdmin }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Validación simple
      const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
      const existe = usuarios.some((u) => u.email === email || u.nombre === nombre);

      if (existe) {
        reject(new Error("Ya existe un usuario con ese nombre o email"));
      } else {
        const nuevoUsuario = { nombre, email, password, esAdmin };
        usuarios.push(nuevoUsuario);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        resolve(nuevoUsuario);
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

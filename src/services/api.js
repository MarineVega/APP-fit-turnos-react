const API_URL = "http://localhost:3000"; // tu backend NestJS

// === REGISTRO DE USUARIO ===
export async function registerUser({ nombre, apellido, email, password, tipoPersona_id }) {
  try {
    const response = await fetch(`${API_URL}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuario: email, // o podés usar nombre si querés
        email,
        password,
        activo: true,
        persona: {
          nombre,
          apellido,
          tipoPersona_id,
          activo: true
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error en el registro: ${error}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Error al registrar usuario:", err);
    throw err;
  }
}

// === LOGIN ===
export async function loginUser({ email, password }) {
  try {
    const response = await fetch(`${API_URL}/usuarios`);
    const usuarios = await response.json();

    const usuario = usuarios.find(
      (u) => u.email === email && u.password === password
    );

    if (!usuario) throw new Error("Credenciales inválidas");
    return usuario;
  } catch (err) {
    console.error("Error al iniciar sesión:", err);
    throw err;
  }
}

// === RECUPERAR CONTRASEÑA (pendiente en backend) ===
export async function sendRecoveryCode(email, code) {
  console.warn("Función pendiente de implementar en backend");
  return true;
}

// === ACTUALIZAR CONTRASEÑA ===
export async function updatePassword(email, newPassword) {
  try {
    const response = await fetch(`${API_URL}/usuarios`);
    const usuarios = await response.json();
    const usuario = usuarios.find((u) => u.email === email);

    if (!usuario) throw new Error("Usuario no encontrado");

    const res = await fetch(`${API_URL}/usuarios/${usuario.usuario_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPassword })
    });

    if (!res.ok) throw new Error("No se pudo actualizar la contraseña");
    return true;
  } catch (err) {
    console.error("Error al actualizar contraseña:", err);
    throw err;
  }
}

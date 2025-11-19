const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// --------------------------------------------
// Headers con token
// --------------------------------------------
function getAuthHeaders(contentType = true) {
  const headers = {};
  if (contentType) headers["Content-Type"] = "application/json";

  const token = localStorage.getItem("token");
  if (token) headers["Authorization"] = `Bearer ${token}`;

  return headers;
}

// --------------------------------------------
// REGISTRO
// --------------------------------------------
export async function registerUser({
  nombre,
  apellido,
  email,
  password,
  tipoPersona_id,
}) {
  try {
    const response = await fetch(`${API_URL}/usuarios`, {
      method: "POST",
      headers: getAuthHeaders(true),
      body: JSON.stringify({
        usuario: email,
        email,
        password,
        activo: true,
        persona: {
          nombre,
          apellido,
          tipoPersona_id,
          activo: true,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error en el registro: ${error}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Error al registrar usuario: ${error.message}`);
  }
}

// --------------------------------------------
// LOGIN REAL → SOLO /auth/login
// --------------------------------------------
export async function loginUser({ email, password }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Credenciales inválidas");
  }

  return await res.json(); // { access_token, usuario }
}

// --------------------------------------------
// ENVIAR CÓDIGO DE RECUPERACIÓN
// --------------------------------------------
export async function sendRecoveryCode(email, codigo) {
  const res = await fetch(`${API_URL}/auth/send-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, codigo }),
  });

  if (!res.ok) throw new Error("No se pudo enviar el código");

  return await res.json();
}

// --------------------------------------------
// CAMBIAR CONTRASEÑA (sin login)
// --------------------------------------------
export async function updatePassword(email, newPassword) {
  const res = await fetch(`${API_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: newPassword }),
  });

  if (!res.ok) throw new Error("No se pudo actualizar la contraseña");

  return true;
}

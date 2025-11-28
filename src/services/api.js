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
// REGISTRO (FIX: endpoint correcto /auth/register)
// --------------------------------------------
export async function registerUser({
  nombre,
  apellido,
  email,
  password,
  tipoPersona_id,
}) {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: getAuthHeaders(true),
      body: JSON.stringify({
        nombre,
        apellido,
        email,
        password,
        tipoPersona_id,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error en el registro: ${error}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      error.message === "Failed to fetch"
        ? "No se pudo conectar con el servidor"
        : `Error al registrar usuario: ${error.message}`
    );
  }
}

// --------------------------------------------
// LOGIN
// --------------------------------------------
export async function loginUser({ email, password }) {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Error en el login");
    }

    return await res.json();
  } catch (err) {
    if (err.message === "Failed to fetch")
      throw new Error("No se pudo conectar con el servidor");

    throw err;
  }
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

// --------------------------------------------
// REENVIAR EMAIL DE VERIFICACIÓN
// --------------------------------------------
export async function resendVerificationEmail(email) {
  const res = await fetch(`${API_URL}/auth/resend-verification`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Error enviando verificación");
  }

  return await res.json();
}

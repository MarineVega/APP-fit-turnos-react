const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"; // usa VITE_API_URL si está definida

function getAuthHeaders(contentType = true) {
  const headers = {};
  if (contentType) headers["Content-Type"] = "application/json";
  try {
    const token = localStorage.getItem("token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  } catch (e) {
    // entorno sin localStorage (tests), ignorar
  }
  return headers;
}

// === REGISTRO DE USUARIO ===
export async function registerUser({ nombre, apellido, email, password, tipoPersona_id }) {
  try {
    const response = await fetch(`${API_URL}/usuarios`, {
      method: "POST",
      headers: getAuthHeaders(true),
      body: JSON.stringify({
        usuario: email, // o nombre si querés
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
// === LOGIN ===
export async function loginUser({ email, password }) {
  try {
    // 1) Intentamos autenticar contra el endpoint de auth (si existe) y obtener token
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        // Esperamos algo como { access_token, usuario } o un objeto usuario
        const data = await res.json();
        return data;
      }

      // Si recibimos 404 (endpoint no expuesto) o 401/400, caemos al respaldo
      if (res.status !== 404) {
        // Para errores distintos de 404 dejamos que el caller decida, pero
        // convertimos 401/400 en excepción para que se use el fallback local si aplica.
        const text = await res.text();
        throw new Error(text || `Error en login: ${res.status}`);
      }
    } catch (err) {
      // Si el fetch falló por red o el endpoint no existe, seguimos con el respaldo GET /usuarios
      console.warn("Login vía /auth/login no disponible o falló:", err.message || err);
    }

    // 2) Respaldo: obtener lista de usuarios y validar localmente (útil para desarrollo)
    const response = await fetch(`${API_URL}/usuarios`);
    if (!response.ok) throw new Error("No se pudo obtener usuarios del backend");
    let usuarios = await response.json();

    // El backend podría devolver un array directo o un objeto con propiedad 'usuarios'
    if (Array.isArray(usuarios)) {
      // Es un array directo
    } else if (usuarios && Array.isArray(usuarios.usuarios)) {
      // Es un objeto con propiedad 'usuarios' (ej: { usuarios: [...] })
      usuarios = usuarios.usuarios;
    } else {
      throw new Error("Formato de respuesta inesperado del backend");
    }

    const usuario = usuarios.find((u) => u.email === email && u.password === password);

    if (!usuario) throw new Error("Credenciales inválidas");
    
    // Asegurar que devolvemos estructura con nombre/usuario en nivel superior
    // Si el usuario tiene estructura anidada con persona, enriquecemos el objeto
    return {
      ...usuario,
      nombre: usuario.nombre || usuario.persona?.nombre || usuario.usuario,
      usuario: usuario.usuario || usuario.email,
    };
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

const jwt = require("jsonwebtoken");

const USUARIO_SEGURO = process.env.LOGIN_USUARIO || "cfp_admin";
const PASSWORD_SEGURO = process.env.LOGIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ message: "Método no permitido" }) };
  }

  if (!PASSWORD_SEGURO || !JWT_SECRET) {
    return { statusCode: 500, body: JSON.stringify({ message: "Variables de entorno del servidor no configuradas." }) };
  }

  try {
    const { usuario, password } = JSON.parse(event.body);

    if (!usuario || !password) {
      return { statusCode: 400, body: JSON.stringify({ message: "Usuario y contraseña son requeridos." }) };
    }

    if (usuario === USUARIO_SEGURO && password === PASSWORD_SEGURO) {
      // --- Creación del Token JWT ---
      const token = jwt.sign(
        { user: usuario, scope: "admin" }, // Payload del token
        JWT_SECRET,
        { expiresIn: "8h" } // El token expira en 8 horas
      );

      // --- Creación de la Cookie Segura ---
      const cookie = `cfp_token=${token}; HttpOnly; Path=/; Secure; SameSite=None; Max-Age=28800`; // 8 horas

      return {
        statusCode: 200,
        headers: {
          ...headers,
          "Set-Cookie": cookie,
        },
        body: JSON.stringify({ success: true, message: "Acceso concedido" }),
      };

    } else {
      // Credenciales incorrectas
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ success: false, message: "Usuario o contraseña incorrectos" }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Error interno del servidor", error: error.message }),
    };
  }
};
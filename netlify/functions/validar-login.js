// netlify/functions/validar-login.js

// Las credenciales deben almacenarse de forma segura
// en las variables de entorno de Netlify (Configuración -> Build & deploy -> Environment)
// NO las dejes aquí directamente, aunque por ahora es mejor que en el frontend.
const USUARIO_SEGURO = process.env.LOGIN_USUARIO || "cfp_admin";
const PASSWORD_SEGURO = process.env.LOGIN_PASSWORD || "copiassublimaciondtf2024*";

// Define un manejador de peticiones para Netlify
exports.handler = async (event, context) => {
  // Solo acepta peticiones POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Método no permitido" }),
    };
  }

  // Parsear el cuerpo de la petición (JSON enviado desde el formulario)
  const { usuario, password } = JSON.parse(event.body);

  // 1. Verificar que los datos no estén vacíos
  if (!usuario || !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Faltan usuario o contraseña" }),
    };
  }

  // 2. Realizar la verificación de las credenciales
  if (usuario === USUARIO_SEGURO && password === PASSWORD_SEGURO) {
    // Login exitoso
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Acceso concedido" }),
    };
  } else {
    // Login fallido
    return {
      statusCode: 401, // Código 401: No autorizado
      body: JSON.stringify({
        success: false,
        error: "Usuario o contraseña incorrectos",
      }),
    };
  }
};

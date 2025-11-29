const { verifyAuth } = require("./_utils");
const { appendRow } = require("./_google-sheets");

exports.handler = async (event, context) => {
  // Manejo de la solicitud pre-vuelo CORS
  const headers = {
    "Access-Control-Allow-Origin": "*", // O usar process.env.ORIGIN para mayor seguridad
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  // 1. Verificar la autenticación del usuario
  const auth = verifyAuth(event);
  if (!auth.ok) {
    return {
      statusCode: auth.statusCode,
      body: JSON.stringify({ message: auth.message }),
    };
  }

  try {
    // 2. Obtener los datos del cuerpo de la solicitud
    const data = JSON.parse(event.body || "{}");

    // 3. Validar los campos requeridos
    if (!data.nombre || !data.telefono) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error:
            "Faltan campos requeridos: 'nombre' y 'telefono' son obligatorios.",
        }),
      };
    }

    // 4. Generar los campos automáticos
    const id = `CLIENTE-${Date.now()}`;
    const createdAt = new Date().toISOString();

    // 5. Construir la fila en el orden correcto para la hoja "clientes"
    // Estructura: id, nombre, telefono, email, createdAt
    const rowData = [
      id,
      data.nombre,
      data.telefono,
      data.email || "", // El email es opcional
      createdAt,
    ];

    // 6. Añadir la fila a la hoja de cálculo
    const sheetName = "clientes";
    await appendRow(sheetName, rowData);

    // 7. Responder con éxito
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: "Cliente registrado exitosamente.",
        cliente: { id, ...data },
      }),
    };
  } catch (error) {
    // Manejo de errores
    console.error("❌ Error en registrar-cliente.js:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: "Error interno del servidor: " + error.message,
      }),
    };
  }
};

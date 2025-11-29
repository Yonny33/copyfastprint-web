const { verifyAuth, handleOptions } = require("./_utils");
const { appendRow } = require("./_google-sheets");

exports.handler = async (event) => {
  // Manejar OPTIONS request para CORS
  if (event.httpMethod === "OPTIONS") {
    return handleOptions();
  }

  // Solo permitir POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, message: "Método no permitido" }),
    };
  }

  // Verificar la autenticación del usuario
  const auth = verifyAuth(event);
  if (!auth.ok) {
    return {
      statusCode: auth.statusCode,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: false, message: auth.message }),
    };
  }

  try {
    const data = JSON.parse(event.body || "{}");

    // 1. Validar los campos que vienen del formulario de gastos.html
    if (!data.fecha || !data.monto || !data.categoria || !data.descripcion) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message:
            "Faltan campos requeridos. Asegúrate de enviar fecha, monto, categoría y descripción.",
        }),
      };
    }

    // 2. Generar un ID único y la fecha de creación
    const id = `GTO-${Date.now()}`;
    const createdAt = new Date().toISOString();

    // 3. Crear la fila de datos en el orden esperado por la hoja de Google Sheets.
    // Asumimos un orden lógico. Si los datos aparecen en las columnas incorrectas, solo hay que reordenar esta lista.
    const newRow = [
      data.fecha,
      data.categoria,
      data.descripcion,
      data.proveedor || "", // Opcional, puede estar vacío
      data.monto,
      data.metodoPago || "", // Requerido en el form, pero añadimos fallback
      id, // ID único para referencia futura
      createdAt, // Fecha de registro
    ];

    // 4. Usar el helper para añadir la fila a la hoja de cálculo correcta
    const sheetName = process.env.EXPENSES_SHEET_NAME || "gastos";
    await appendRow(sheetName, newRow);

    // 5. Devolver una respuesta de éxito
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        message: "Gasto registrado exitosamente!",
      }),
    };
  } catch (err) {
    console.error("Error en registrar-gasto.js:", err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: false,
        message: "Error interno del servidor.",
        error: err.message,
      }),
    };
  }
};

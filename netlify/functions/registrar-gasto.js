// netlify/functions/registrar-gasto.js

exports.handler = async function (event, context) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Método no permitido" }),
    };
  }

  try {
    const data = JSON.parse(event.body);

    // Validaciones
    const requiredFields = [
      "categoria",
      "descripcion",
      "monto",
      "fecha",
      "metodoPago",
    ];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: `Faltan campos: ${missingFields.join(", ")}`,
        }),
      };
    }

    const monto = parseFloat(data.monto);
    if (isNaN(monto) || monto <= 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: "El monto debe ser un número positivo",
        }),
      };
    }

    // Preparar datos para guardar
    const gasto = {
      id: `GASTO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      fechaRegistro: new Date().toISOString(),
      categoria: data.categoria,
      descripcion: data.descripcion,
      monto: monto.toFixed(2),
      fecha: data.fecha,
      metodoPago: data.metodoPago,
      proveedor: data.proveedor || null,
      recurrente: data.recurrente === "si",
      divisa: "VES",
      usuario: data.usuario || "admin",
    };

    console.log("💸 Gasto registrado:", gasto);

    // AQUÍ: Guardar en base de datos (Airtable, Google Sheets, etc.)
    // await guardarEnBaseDatos(gasto);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: "Gasto registrado exitosamente",
        gastoId: gasto.id,
      }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: "Error interno del servidor",
        details: error.message,
      }),
    };
  }
};

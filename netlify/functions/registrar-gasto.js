const { verifyAuth } = require("./_utils");
const { appendRow } = require("./_google-sheets");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": process.env.ORIGIN || "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "POST,OPTIONS",
      },
      body: "",
    };
  }

  const auth = verifyAuth(event);
  if (!auth.ok) {
    return {
      statusCode: auth.statusCode,
      body: JSON.stringify({ message: auth.message }),
    };
  }

  try {
    const payload = JSON.parse(event.body || "{}");

    // Validación de campos clave
    if (!payload.concepto || !payload.monto_total) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message:
            "Faltan campos requeridos: concepto y monto_total son obligatorios.",
        }),
      };
    }

    const montoTotal = Number(payload.monto_total);
    if (isNaN(montoTotal) || montoTotal <= 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "El campo monto_total debe ser un número positivo.",
        }),
      };
    }

    const id = `GASTO-${Date.now()}`;
    const now = new Date();

    // Se arma la fila en el orden correcto de la hoja 'gastos'
    const row = [
      payload.fecha || now.toISOString().split("T")[0], // 1. fecha
      id, // 2. id
      payload.rif || "", // 3. rif
      payload.razon_social || "", // 4. razon_social
      payload.concepto, // 5. concepto
      payload.cantidad || "", // 6. cantidad
      payload.descripcion || "", // 7. descripcion
      payload.precio_unitario || "", // 8. precio_unitario
      montoTotal, // 9. monto_total
      payload.iva_fiscal || "", // 10. iva_fiscal
      now.toISOString(), // 11. createdAt
    ];

    const sheet = process.env.EXPENSES_SHEET_NAME || "gastos";
    await appendRow(sheet, row);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Gasto registrado exitosamente",
        data: { id },
      }),
    };
  } catch (err) {
    console.error("Error en registrar-gasto.js:", err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Error interno del servidor",
        error: err.message,
      }),
    };
  }
};

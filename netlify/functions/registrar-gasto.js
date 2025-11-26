// ...existing code...
const { verifyAuth } = require("./_utils");
const { appendRow } = require("./_google-sheets");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": process.env.ORIGIN || "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST,OPTIONS",
        "Access-Control-Allow-Credentials": "true",
      },
      body: "",
    };
  }

  const auth = verifyAuth(event);
  if (!auth.ok) {
    return {
      statusCode: auth.statusCode,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: auth.message }),
    };
  }

  try {
    const payload = JSON.parse(event.body || "{}");
    if (!payload.descripcion || payload.monto == null) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Campos requeridos faltantes" }),
      };
    }

    const monto = Number(payload.monto);
    if (isNaN(monto) || monto <= 0) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Monto inválido" }),
      };
    }

    const sheet = process.env.EXPENSES_SHEET_NAME || "gastos";
    const id = `GASTO-${Date.now()}`;
    const row = [
      id,
      payload.descripcion,
      monto,
      payload.categoria || "",
      new Date().toISOString(),
    ];

    await appendRow(sheet, row);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Gasto registrado",
        data: { id, descripcion: payload.descripcion, monto },
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Error interno" }),
    };
  }
};
// ...existing code...
